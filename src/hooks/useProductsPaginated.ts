import { useQuery } from "@tanstack/react-query";
import { externalSupabase as supabase } from "@/integrations/supabase/external-client";
import type { Product } from "@/data/products";
import { mapToProduct } from "./useProducts";
import { applyProductsFilters, type ProductsQueryFilters } from "./productsQuery";

interface Filters extends ProductsQueryFilters {
  sortKey: string;
  sortDir: "asc" | "desc";
  page: number;
  pageSize: number;
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
  let query: any = supabase.from("products").select("*", { count: "exact" });
  query = applyProductsFilters(query, filters);

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
