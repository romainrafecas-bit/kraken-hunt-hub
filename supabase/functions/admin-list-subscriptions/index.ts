import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const OWNER_EMAILS = ["romain.rafecas@gmail.com", "bouska1@outlook.fr"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Validate caller
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authErr } = await userClient.auth.getUser();
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!OWNER_EMAILS.includes((user.email ?? "").toLowerCase())) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Service-role client to read everything
    const admin = createClient(supabaseUrl, serviceKey);

    const { data: subs, error: subsErr } = await admin
      .from("subscriptions")
      .select(
        "user_id, status, trial_ends_at, current_period_end, cancel_at_period_end, stripe_subscription_id, created_at",
      )
      .order("created_at", { ascending: false });
    if (subsErr) throw subsErr;

    // Fetch users page by page
    const usersById = new Map<string, { email: string | null; created_at: string }>();
    let page = 1;
    while (true) {
      const { data, error } = await admin.auth.admin.listUsers({
        page,
        perPage: 200,
      });
      if (error) throw error;
      for (const u of data.users) {
        usersById.set(u.id, { email: u.email ?? null, created_at: u.created_at });
      }
      if (data.users.length < 200) break;
      page += 1;
      if (page > 50) break;
    }

    const now = Date.now();
    const rows = (subs ?? []).map((s) => {
      const u = usersById.get(s.user_id);
      const trialEnd = s.trial_ends_at ? new Date(s.trial_ends_at).getTime() : null;
      const periodEnd = s.current_period_end
        ? new Date(s.current_period_end).getTime()
        : null;

      let computedStatus: string = s.status;
      let hasAccess = false;
      let referenceEnd: number | null = null;

      if (s.status === "trialing" && trialEnd) {
        referenceEnd = trialEnd;
        if (trialEnd > now) {
          hasAccess = true;
        } else {
          computedStatus = "trial_expired";
        }
      } else if (
        (s.status === "active" || s.status === "past_due") &&
        (!periodEnd || periodEnd > now)
      ) {
        hasAccess = true;
        referenceEnd = periodEnd;
      } else if (s.status === "canceled" && periodEnd && periodEnd > now) {
        hasAccess = true;
        referenceEnd = periodEnd;
      } else if (periodEnd) {
        referenceEnd = periodEnd;
      }

      const daysLeft =
        referenceEnd !== null
          ? Math.ceil((referenceEnd - now) / 86400000)
          : null;

      return {
        user_id: s.user_id,
        email: u?.email ?? "(inconnu)",
        signed_up_at: u?.created_at ?? null,
        raw_status: s.status,
        computed_status: computedStatus,
        has_access: hasAccess,
        trial_ends_at: s.trial_ends_at,
        current_period_end: s.current_period_end,
        cancel_at_period_end: s.cancel_at_period_end,
        days_left: daysLeft,
        is_paying: !!s.stripe_subscription_id,
      };
    });

    return new Response(
      JSON.stringify({
        total: rows.length,
        active: rows.filter((r) => r.has_access).length,
        expired: rows.filter((r) => !r.has_access).length,
        paying: rows.filter((r) => r.is_paying).length,
        rows,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("admin-list-subscriptions error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
