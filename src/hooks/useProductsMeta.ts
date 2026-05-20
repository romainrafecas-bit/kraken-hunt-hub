import { useQuery } from "@tanstack/react-query";
import { externalSupabase as supabase } from "@/integrations/supabase/external-client";

interface MetaResult {
  categories: string[];
  brands: string[];
}

async function fetchProductsMeta(): Promise<MetaResult> {
  const PAGE = 1000;
  const cats = new Set<string>();
  const brands = new Set<string>();
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from("products")
      .select("category, brand")
      .range(from, from + PAGE - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    data.forEach((r: any) => {
      if (r.category) cats.add(r.category);
      if (r.brand) brands.add(r.brand);
    });
    if (data.length < PAGE) break;
    from += PAGE;
  }
  return {
    categories: ["Tous", ...[...cats].sort()],
    brands: ["Toutes", ...[...brands].sort()],
  };
}

export function useProductsMeta() {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["products-meta"],
    queryFn: fetchProductsMeta,
    staleTime: 10 * 60 * 1000, // 10 min
    gcTime: 60 * 60 * 1000, // 1 h
    refetchOnWindowFocus: false,
  });

  return {
    categories: data?.categories ?? ["Tous"],
    brands: data?.brands ?? ["Toutes"],
    isLoading,
    isFetching,
    error: error ? (error as Error).message : null,
    refetch,
  };
}
