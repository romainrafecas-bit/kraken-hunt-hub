// Aggregates the (very large) external products catalog server-side and caches
// the result, so the dashboard/filters load instantly instead of downloading
// ~100k+ rows in the browser.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

const EXTERNAL_URL = "https://yfzpohbfliyfibuajkwr.supabase.co";
const EXTERNAL_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmenBvaGJmbGl5ZmlidWFqa3dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NjI4OTMsImV4cCI6MjA4OTMzODg5M30.e1Y8930-GFgrHBEdMYmgX112a8k2VpY79JfJhTYNS5I";

const PAGE = 1000;
const CONCURRENCY = 8;
const TTL_MS = 3 * 60 * 60 * 1000; // 3h

type Row = {
  added_date: string | null;
  category: string | null;
  brand: string | null;
  recurrences: number | null;
};

async function extFetch(path: string, extraHeaders: Record<string, string> = {}) {
  const res = await fetch(`${EXTERNAL_URL}/rest/v1/${path}`, {
    headers: {
      apikey: EXTERNAL_ANON_KEY,
      Authorization: `Bearer ${EXTERNAL_ANON_KEY}`,
      ...extraHeaders,
    },
  });
  if (!res.ok) throw new Error(`external ${path} -> ${res.status} ${await res.text()}`);
  return res;
}

async function totalCount(): Promise<number> {
  const res = await extFetch("products?select=url&limit=1", { Prefer: "count=exact" });
  await res.text();
  const range = res.headers.get("content-range") ?? "";
  return parseInt(range.split("/")[1] ?? "0", 10) || 0;
}

function normalizeDate(raw: string): string | null {
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const fr = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (fr) return `${fr[3]}-${fr[2]}-${fr[1]}`;
  const d = new Date(raw);
  if (!isNaN(d.getTime())) {
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(
      d.getUTCDate(),
    ).padStart(2, "0")}`;
  }
  return null;
}

async function computeStats() {
  const count = await totalCount();
  const pages = Math.max(1, Math.ceil(count / PAGE));

  const dailyAdded: Record<string, number> = {};
  const catMap: Record<string, { count: number; recurrences: number }> = {};
  const brandSet = new Set<string>();
  let totalRecurrences = 0;

  const consume = (rows: Row[]) => {
    for (const r of rows) {
      if (r.added_date) {
        const key = normalizeDate(r.added_date);
        if (key) dailyAdded[key] = (dailyAdded[key] || 0) + 1;
      }
      const cat = (r.category ?? "").trim() || "Autre";
      if (!catMap[cat]) catMap[cat] = { count: 0, recurrences: 0 };
      catMap[cat].count++;
      catMap[cat].recurrences += r.recurrences || 0;
      const brand = (r.brand ?? "").trim();
      if (brand) brandSet.add(brand);
      totalRecurrences += r.recurrences || 0;
    }
  };

  let next = 0;
  const worker = async () => {
    while (true) {
      const page = next++;
      if (page >= pages) return;
      const offset = page * PAGE;
      const res = await extFetch(
        `products?select=added_date,category,brand,recurrences&order=url.asc&offset=${offset}&limit=${PAGE}`,
      );
      consume((await res.json()) as Row[]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, pages) }, worker));

  const categoryStats = Object.entries(catMap)
    .map(([name, d]) => ({ name, count: d.count, recurrences: d.recurrences }))
    .sort(
      (a, b) =>
        b.recurrences - a.recurrences || b.count - a.count || a.name.localeCompare(b.name),
    );

  const latestRes = await extFetch(
    "products?select=*&order=last_seen.desc.nullslast&limit=8",
  );
  const latestProducts = await latestRes.json();

  const lastUpdRes = await extFetch(
    "products?select=added_date&order=added_date.desc.nullslast&limit=1",
  );
  const lastUpdRows = await lastUpdRes.json();

  return {
    totalProducts: count,
    totalBrands: brandSet.size,
    totalRecurrences,
    dailyAdded,
    categoryStats,
    categories: categoryStats.map((c) => c.name).sort((a, b) => a.localeCompare(b)),
    brands: [...brandSet].sort((a, b) => a.localeCompare(b)),
    latestProducts,
    lastUpdate: lastUpdRows?.[0]?.added_date ?? null,
    computedAt: new Date().toISOString(),
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const url = new URL(req.url);
    let force = url.searchParams.get("force") === "1";
    if (!force && req.method === "POST") {
      try {
        const body = await req.json();
        force = body?.force === true;
      } catch {
        /* no body */
      }
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    const { data: cached } = await admin
      .from("products_stats_cache")
      .select("payload, updated_at")
      .eq("id", 1)
      .maybeSingle();

    const fresh =
      cached?.updated_at && Date.now() - new Date(cached.updated_at).getTime() < TTL_MS;

    if (cached && fresh && !force) {
      return json({ ...cached.payload, cached: true, updatedAt: cached.updated_at });
    }

    // Stale-while-revalidate: never make a user wait for the full aggregation.
    if (cached && !force) {
      const refresh = (async () => {
        try {
          const payload = await computeStats();
          await admin
            .from("products_stats_cache")
            .upsert({ id: 1, payload, updated_at: new Date().toISOString() });
        } catch (e) {
          console.error("background refresh failed:", e);
        }
      })();
      // @ts-ignore EdgeRuntime is available in Supabase edge functions
      if (typeof EdgeRuntime !== "undefined") EdgeRuntime.waitUntil(refresh);
      return json({ ...cached.payload, cached: true, stale: true, updatedAt: cached.updated_at });
    }


    let payload: Record<string, unknown>;
    try {
      payload = await computeStats();
    } catch (e) {
      console.error("computeStats failed:", e);
      // Serve stale data rather than breaking the dashboard.
      if (cached) {
        return json({ ...cached.payload, cached: true, stale: true, updatedAt: cached.updated_at });
      }
      return json({ error: e instanceof Error ? e.message : "aggregation failed" }, 500);
    }

    const updatedAt = new Date().toISOString();
    const { error: upsertError } = await admin
      .from("products_stats_cache")
      .upsert({ id: 1, payload, updated_at: updatedAt });
    if (upsertError) console.error("cache upsert failed:", upsertError);

    return json({ ...payload, cached: false, updatedAt });
  } catch (e) {
    console.error("products-stats error:", e);
    return json({ error: e instanceof Error ? e.message : "unknown error" }, 500);
  }
});
