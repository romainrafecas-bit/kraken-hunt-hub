import { useQuery } from "@tanstack/react-query";
import { externalSupabase as supabase } from "@/integrations/supabase/external-client";
import { mapToProduct } from "./useProducts";
import type { Product } from "@/data/products";
import type { UserPreferences } from "./useUserPreferences";

const SELECT_COLS =
  "url, title, brand, category, price, image_url, sellers_count, in_stock, recurrences, last_seen, added_date";

function applyPrefs(query: any, prefs: UserPreferences) {
  let q = query;
  if (prefs.categories.length > 0) q = q.in("category", prefs.categories);
  if (prefs.inStockOnly) q = q.eq("in_stock", true).gt("price", 0);
  if (prefs.budgetMin != null) q = q.gte("price", prefs.budgetMin);
  if (prefs.budgetMax != null) q = q.lte("price", prefs.budgetMax);
  return q;
}

async function fetchRecommended(prefs: UserPreferences) {
  // À la une : les prises les plus récurrentes qui collent au profil
  let topQuery: any = supabase.from("products").select(SELECT_COLS);
  topQuery = applyPrefs(topQuery, prefs)
    .order("recurrences", { ascending: false, nullsFirst: false })
    .order("url", { ascending: true })
    .limit(12);

  // Fraîches captures : repérées récemment, avec au moins une récurrence
  let freshQuery: any = supabase.from("products").select(SELECT_COLS);
  freshQuery = applyPrefs(freshQuery, prefs)
    .gt("recurrences", 0)
    .order("last_seen", { ascending: false, nullsFirst: false })
    .order("recurrences", { ascending: false, nullsFirst: false })
    .order("url", { ascending: true })
    .limit(8);

  const [top, fresh] = await Promise.all([topQuery, freshQuery]);
  if (top.error) throw top.error;
  if (fresh.error) throw fresh.error;

  const featured: Product[] = (top.data || []).map((p: any, i: number) => mapToProduct(p, i));
  const featuredUrls = new Set(featured.map((p) => p.url));
  const recent: Product[] = (fresh.data || [])
    .map((p: any, i: number) => mapToProduct(p, i))
    .filter((p) => !featuredUrls.has(p.url))
    .slice(0, 6);

  return { featured, recent };
}

export function useRecommendedProducts(prefs: UserPreferences) {
  const query = useQuery({
    queryKey: [
      "recommended-products",
      prefs.budgetMin,
      prefs.budgetMax,
      prefs.inStockOnly,
      [...prefs.categories].sort().join(","),
    ],
    queryFn: () => fetchRecommended(prefs),
    staleTime: 10 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  return {
    featured: query.data?.featured ?? [],
    recent: query.data?.recent ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ? (query.error as Error).message : null,
  };
}
