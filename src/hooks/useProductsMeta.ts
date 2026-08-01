import { useProductsStats } from "./useProductsStats";

export function useProductsMeta() {
  const { stats, isLoading, isFetching, error, refetch } = useProductsStats();

  return {
    categories: ["Tous", ...(stats?.categories ?? [])],
    brands: ["Toutes", ...(stats?.brands ?? [])],
    isLoading,
    isFetching,
    error,
    refetch,
  };
}
