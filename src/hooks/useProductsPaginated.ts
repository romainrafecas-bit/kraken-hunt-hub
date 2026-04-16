import { useState, useEffect, useCallback } from "react";
import { externalSupabase as supabase } from "@/integrations/supabase/external-client";
import type { Product } from "@/data/products";
import { mapToProduct, type SupabaseProduct } from "./useProducts";

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
}

// Map client sort keys to DB columns
const sortKeyToColumn: Record<string, string> = {
  name: "title",
  brand: "brand",
  price: "price",
  rating: "rating",
  sellers: "sellers_count",
  lastSeen: "added_date", // last_seen is text dd/mm/yyyy — added_date used as sort proxy
  recurrences: "recurrences",
};

export function useProductsPaginated(filters: Filters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("products")
        .select("*", { count: "exact" });

      // Category filter
      if (filters.category !== "Tous") {
        query = query.eq("category", filters.category);
      }

      // Search
      if (filters.searchQuery) {
        query = query.or(`title.ilike.%${filters.searchQuery}%,brand.ilike.%${filters.searchQuery}%`);
      }

      // Stock filter
      if (filters.stockFilter === "in_stock") {
        query = query.or("price.gt.0,price.is.null").eq("in_stock", true);
      } else if (filters.stockFilter === "out_of_stock") {
        query = query.or("price.eq.-1,in_stock.eq.false");
      }

      // Date filter — dates stored as text dd/mm/yyyy, use text matching
      if (filters.datePreset === "2026") {
        query = query.like("added_date", "%/2026");
      } else if (filters.datePreset !== "all") {
        const cutoffs: Record<string, number> = {
          "24h": 1, "7d": 7, "30d": 30, "3m": 90, "6m": 180,
        };
        const days = cutoffs[filters.datePreset];
        if (days) {
          const cutoff = new Date();
          cutoff.setDate(cutoff.getDate() - days);
          const yyyy = cutoff.getFullYear();
          query = query.like("added_date", `%/${yyyy}`);
        }
      }

      // Excluded brands
      if (filters.excludedBrands.size > 0) {
        // Supabase doesn't have a "not in" directly for text, use .not().in()
        const excluded = [...filters.excludedBrands];
        query = query.not("brand", "in", `(${excluded.map(b => `"${b}"`).join(",")})`);
      }

      // Sort
      const column = sortKeyToColumn[filters.sortKey] || "last_seen";
      query = query.order(column, { ascending: filters.sortDir === "asc" });

      // Pagination
      const from = filters.page * filters.pageSize;
      const to = from + filters.pageSize - 1;
      query = query.range(from, to);

      const { data, error: err, count } = await query;

      if (err) {
        setError(err.message);
        setProducts([]);
        setTotalCount(0);
      } else {
        setProducts((data || []).map((p: any, i: number) => mapToProduct(p, from + i)));
        setTotalCount(count || 0);
        setError(null);
      }
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [
    filters.category,
    filters.searchQuery,
    filters.stockFilter,
    filters.datePreset,
    filters.sortKey,
    filters.sortDir,
    filters.page,
    filters.pageSize,
    // Convert Set to string for dependency comparison
    [...filters.excludedBrands].sort().join(","),
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, totalCount, loading, error, refetch: fetchProducts };
}
