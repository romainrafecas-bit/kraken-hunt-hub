import { useQuery } from "@tanstack/react-query";
import { externalSupabase as supabase } from "@/integrations/supabase/external-client";
import type { Product } from "@/data/products";

export interface SupabaseProduct {
  url: string;
  title: string;
  brand: string | null;
  category: string | null;
  price: number | null;
  image_url: string | null;
  rating: number | null;
  review_count: number | null;
  sellers_count: number | null;
  in_stock: boolean | null;
  recurrences: number | null;
  dates_seen: string[] | null;
  last_seen: string | null;
  added_date: string | null;
  enriched: boolean | null;
  updated_at: string | null;
}

function parseDate(dateStr: string): Date | null {
  const iso = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    const result = new Date(Date.UTC(+iso[1], +iso[2] - 1, +iso[3]));
    if (result.getUTCDate() !== +iso[3] || result.getUTCMonth() !== +iso[2] - 1) return null;
    return result;
  }
  const dmy = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (dmy) {
    let yearNum = parseInt(dmy[3]);
    if (yearNum < 100) yearNum += 2000;
    const dayNum = parseInt(dmy[1]);
    const monthNum = parseInt(dmy[2]);
    if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) return null;
    const result = new Date(Date.UTC(yearNum, monthNum - 1, dayNum));
    if (result.getUTCDate() !== dayNum || result.getUTCMonth() !== monthNum - 1) return null;
    return result;
  }
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d;
  return null;
}

function formatLastSeen(lastSeen: string | null): string {
  if (!lastSeen) return "Inconnu";
  const date = parseDate(lastSeen);
  if (!date) return "Inconnu";
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

export function mapToProduct(p: SupabaseProduct, index: number): Product {
  const sellers = (p.sellers_count === 0 || p.sellers_count === null)
    ? (p.in_stock === false ? 0 : 1)
    : p.sellers_count;

  const rawPrice = Number(p.price);
  const isOutOfStock = rawPrice === -1 || p.in_stock === false;

  return {
    id: index + 1,
    name: p.title,
    brand: p.brand || "Inconnu",
    category: p.category || "Autre",
    price: isOutOfStock ? -1 : (rawPrice || 0),
    originalPrice: 0,
    recurrences: p.recurrences || 0,
    lastSeen: formatLastSeen(p.last_seen),
    rating: Number(p.rating) || 0,
    score: Math.min(100, Math.round((Number(p.rating) || 0) * 20)),
    sellers,
    image: p.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop",
    url: p.url,
    addedDate: p.added_date || undefined,
  };
}

async function fetchAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("last_seen", { ascending: false });
  if (error) throw error;
  return (data || []).map((p: any, i: number) => mapToProduct(p, i));
}

export function useProducts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products-all"],
    queryFn: fetchAllProducts,
  });

  return {
    products: data || [],
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}
