import { useQuery } from "@tanstack/react-query";
import { externalSupabase as supabase } from "@/integrations/supabase/external-client";
import type { Product } from "@/data/products";
import { mapToProduct } from "./useProducts";

interface Filters {
  category: string;
  excludedBrands: Set<string>;
  searchQuery: string;
  stockFilter: "all" | "in_stock" | "out_of_stock";
  datePreset: string;
  sortKey: string;
  sortDir: "asc" | "desc";
  page: number;
  pageSize: number;
  priceMin?: number | null;
  priceMax?: number | null;
  sellersMin?: number | null;
  sellersMax?: number | null;
}

const sortKeyToColumn: Record<string, string> = {
  name: "title",
  brand: "brand",
  price: "price",
  rating: "rating",
  sellers: "sellers_count",
  lastSeen: "last_seen",
  recurrences: "recurrences",
};

async function fetchProductsPage(filters: Filters): Promise<{ products: Product[]; totalCount: number }> {
  let query = supabase.from("products").select("*", { count: "exact" });

  if (filters.category !== "Tous") {
    query = query.eq("category", filters.category);
  }
  if (filters.searchQuery) {
    query = query.or(`title.ilike.%${filters.searchQuery}%,brand.ilike.%${filters.searchQuery}%`);
  }
  if (filters.stockFilter === "in_stock") {
    query = query.or("price.gt.0,price.is.null").eq("in_stock", true);
  } else if (filters.stockFilter === "out_of_stock") {
    query = query.or("price.eq.-1,in_stock.eq.false");
  }

  if (filters.datePreset === "2026") {
    query = query.gte("last_seen", "2026-01-01T00:00:00Z").lt("last_seen", "2027-01-01T00:00:00Z");
  } else if (filters.datePreset === "2025") {
    query = query.gte("last_seen", "2025-01-01T00:00:00Z").lt("last_seen", "2026-01-01T00:00:00Z");
  } else if (filters.datePreset.startsWith("month-")) {
    const [, y, m] = filters.datePreset.split("-");
    const year = parseInt(y, 10);
    const month = parseInt(m, 10);
    if (!isNaN(year) && !isNaN(month)) {
      const start = new Date(Date.UTC(year, month - 1, 1)).toISOString();
      const end = new Date(Date.UTC(month === 12 ? year + 1 : year, month === 12 ? 0 : month, 1)).toISOString();
      query = query.gte("last_seen", start).lt("last_seen", end);
    }
  } else if (filters.datePreset !== "all") {
    const cutoffs: Record<string, number> = { "24h": 1, "7d": 7, "30d": 30, "3m": 90, "6m": 180 };
    const days = cutoffs[filters.datePreset];
    if (days) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      query = query.gte("last_seen", cutoff.toISOString());
    }
  }

  if (filters.excludedBrands.size > 0) {
    const excluded = [...filters.excludedBrands];
    query = query.not("brand", "in", `(${excluded.map(b => `"${b}"`).join(",")})`);
  }

  if (filters.priceMin != null && !Number.isNaN(filters.priceMin)) query = query.gte("price", filters.priceMin);
  if (filters.priceMax != null && !Number.isNaN(filters.priceMax)) query = query.lte("price", filters.priceMax);
  if (filters.sellersMin != null && !Number.isNaN(filters.sellersMin)) query = query.gte("sellers_count", filters.sellersMin);
  if (filters.sellersMax != null && !Number.isNaN(filters.sellersMax)) query = query.lte("sellers_count", filters.sellersMax);

  const column = sortKeyToColumn[filters.sortKey] || "last_seen";
  query = query.order(column, { ascending: filters.sortDir === "asc", nullsFirst: false });
  if (column !== "last_seen") {
    query = query.order("last_seen", { ascending: false, nullsFirst: false });
  }

  const from = filters.page * filters.pageSize;
  const to = from + filters.pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    products: (data || []).map((p: any, i: number) => mapToProduct(p, from + i)),
    totalCount: count || 0,
  };
}

export function useProductsPaginated(filters: Filters) {
  const queryKey = [
    "products-paginated",
    filters.category,
    filters.searchQuery,
    filters.stockFilter,
    filters.datePreset,
    filters.sortKey,
    filters.sortDir,
    filters.page,
    filters.pageSize,
    [...filters.excludedBrands].sort().join(","),
    filters.priceMin,
    filters.priceMax,
    filters.sellersMin,
    filters.sellersMax,
  ];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => fetchProductsPage(filters),
    placeholderData: (prev) => prev,
  });

  return {
    products: data?.products || [],
    totalCount: data?.totalCount || 0,
    loading: isLoading,
    error: error ? (error as Error).message : null,
    refetch,
  };
}
