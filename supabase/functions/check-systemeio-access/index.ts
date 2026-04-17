import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEMEIO_BASE = "https://api.systeme.io/api";

// Bypass list — these emails are always allowed (owner/admin accounts)
const OWNER_EMAILS = ["romain.rafecas@gmail.com"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ allowed: false, error: "Email requis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const apiKey = Deno.env.get("SYSTEMEIO_API_KEY");
    const requiredTagId = Deno.env.get("SYSTEMEIO_STUDENT_TAG_ID");

    if (!apiKey || !requiredTagId) {
      console.error("Missing SYSTEMEIO_API_KEY or SYSTEMEIO_STUDENT_TAG_ID");
      return new Response(
        JSON.stringify({ allowed: false, error: "Configuration serveur manquante" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Lookup contact by email on systeme.io
    const lookupRes = await fetch(
      `${SYSTEMEIO_BASE}/contacts?email=${encodeURIComponent(normalizedEmail)}`,
      { headers: { "X-API-Key": apiKey, Accept: "application/json" } },
    );

    if (!lookupRes.ok) {
      const text = await lookupRes.text();
      console.error("systeme.io lookup failed", lookupRes.status, text);
      return new Response(
        JSON.stringify({ allowed: false, error: "Vérification impossible" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const lookupJson = await lookupRes.json();
    const contacts = lookupJson?.items ?? lookupJson?.data ?? [];
    const contact = Array.isArray(contacts)
      ? contacts.find(
          (c: any) =>
            (c.email ?? "").toLowerCase() === normalizedEmail,
        )
      : null;

    if (!contact) {
      return new Response(
        JSON.stringify({ allowed: false, reason: "not_found" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const tags: any[] = contact.tags ?? [];
    const hasTag = tags.some(
      (t: any) =>
        String(t.id ?? t.tag_id ?? "") === String(requiredTagId) ||
        String(t.name ?? "") === String(requiredTagId),
    );

    if (!hasTag) {
      return new Response(
        JSON.stringify({ allowed: false, reason: "no_tag" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Add to allowed_emails for traceability
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    await supabase
      .from("allowed_emails")
      .upsert({
        email: normalizedEmail,
        systemeio_contact_id: String(contact.id ?? ""),
        synced_at: new Date().toISOString(),
      });

    return new Response(JSON.stringify({ allowed: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("check-systemeio-access error", err);
    return new Response(
      JSON.stringify({ allowed: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
