import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProductsStatsPayload {
  totalProducts: number;
  totalBrands: number;
  totalRecurrences: number;
  dailyAdded: Record<string, number>;
  categoryStats: { name: string; count: number; recurrences: number }[];
  categories: string[];
  brands: string[];
  latestProducts: any[];
  lastUpdate: string | null;
  updatedAt?: string;
}

async function fetchProductsStats(): Promise<ProductsStatsPayload> {
  const { data, error } = await supabase.functions.invoke("products-stats", {
    body: {},
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data as ProductsStatsPayload;
}

/**
 * Single source of truth for aggregated catalog stats (dashboard + filter lists).
 * Computed and cached server-side, so the browser downloads a few KB instead of
 * paginating through the whole products table.
 */
export function useProductsStats() {
  const query = useQuery({
    queryKey: ["products-stats"],
    queryFn: fetchProductsStats,
    staleTime: 30 * 60 * 1000, // 30 min
    gcTime: 6 * 60 * 60 * 1000, // 6 h
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return {
    stats: query.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ? (query.error as Error).message : null,
    refetch: query.refetch,
  };
}
