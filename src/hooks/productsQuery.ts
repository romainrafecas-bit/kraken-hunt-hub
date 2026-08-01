import { externalSupabase as supabase } from "@/integrations/supabase/external-client";

export interface ProductsQueryFilters {
  category: string;
  excludedBrands: Set<string>;
  searchQuery: string;
  stockFilter: "all" | "in_stock" | "out_of_stock";
  datePreset: string;
  priceMin?: number | null;
  priceMax?: number | null;
  sellersMin?: number | null;
  sellersMax?: number | null;
}

/** Formate une date en YYYY-MM-DD (sans fuseau horaire). */
function toDateOnly(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/**
 * Applies all "where" clauses shared between the paginated list query and
 * the "select all matching" query. Does NOT add ordering or range/limit.
 */
export function applyProductsFilters<Q extends ReturnType<typeof supabase.from> | any>(
  query: Q,
  filters: ProductsQueryFilters,
): Q {
  let q: any = query;

  if (filters.category !== "Tous") {
    q = q.eq("category", filters.category);
  }
  if (filters.searchQuery) {
    q = q.or(`title.ilike.%${filters.searchQuery}%,brand.ilike.%${filters.searchQuery}%`);
  }
  if (filters.stockFilter === "in_stock") {
    q = q.or("price.gt.0,price.is.null").eq("in_stock", true);
  } else if (filters.stockFilter === "out_of_stock") {
    q = q.or("price.eq.-1,in_stock.eq.false");
  }

  // `last_seen` est une colonne DATE : on compare avec des dates nues (YYYY-MM-DD)
  // pour éviter tout décalage de fuseau horaire côté serveur.
  if (filters.datePreset === "2026") {
    q = q.gte("last_seen", "2026-01-01").lt("last_seen", "2027-01-01");
  } else if (filters.datePreset === "2025") {
    q = q.gte("last_seen", "2025-01-01").lt("last_seen", "2026-01-01");
  } else if (filters.datePreset.startsWith("month-")) {
    const [, y, m] = filters.datePreset.split("-");
    const year = parseInt(y, 10);
    const month = parseInt(m, 10);
    if (!isNaN(year) && !isNaN(month)) {
      const start = toDateOnly(year, month, 1);
      const end = month === 12 ? toDateOnly(year + 1, 1, 1) : toDateOnly(year, month + 1, 1);
      q = q.gte("last_seen", start).lt("last_seen", end);
    }
  } else if (filters.datePreset !== "all") {
    const cutoffs: Record<string, number> = { "24h": 1, "7d": 7, "30d": 30, "3m": 90, "6m": 180 };
    const days = cutoffs[filters.datePreset];
    if (days) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      q = q.gte("last_seen", toDateOnly(cutoff.getFullYear(), cutoff.getMonth() + 1, cutoff.getDate()));
    }
  }


  if (filters.excludedBrands.size > 0) {
    const excluded = [...filters.excludedBrands];
    q = q.not("brand", "in", `(${excluded.map((b) => `"${b}"`).join(",")})`);
  }

  if (filters.priceMin != null && !Number.isNaN(filters.priceMin)) q = q.gte("price", filters.priceMin);
  if (filters.priceMax != null && !Number.isNaN(filters.priceMax)) q = q.lte("price", filters.priceMax);
  if (filters.sellersMin != null && !Number.isNaN(filters.sellersMin)) q = q.gte("sellers_count", filters.sellersMin);
  if (filters.sellersMax != null && !Number.isNaN(filters.sellersMax)) q = q.lte("sellers_count", filters.sellersMax);

  return q;
}

export const SELECT_ALL_CAP = 5000;

/**
 * Fetches all product URLs that match the given filters, paginated server-side
 * by chunks of 1000. Capped at SELECT_ALL_CAP to avoid runaway selections.
 */
export async function fetchAllMatchingUrls(filters: ProductsQueryFilters): Promise<string[]> {
  const urls: string[] = [];
  const chunkSize = 1000;
  let from = 0;
  while (from < SELECT_ALL_CAP) {
    const to = Math.min(from + chunkSize - 1, SELECT_ALL_CAP - 1);
    let q: any = supabase.from("products").select("url");
    q = applyProductsFilters(q, filters);
    q = q.order("url", { ascending: true });
    q = q.range(from, to);

    const { data, error } = await q;
    if (error) throw error;
    const batch = (data || []).map((r: any) => r.url).filter(Boolean);
    urls.push(...batch);
    if (batch.length < chunkSize) break;
    from += chunkSize;
  }
  return urls;
}
