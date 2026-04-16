import { useState, useEffect } from "react";
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
  // Handle dd/mm/yyyy format
  const ddmmyyyy = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (ddmmyyyy) {
    return new Date(Number(ddmmyyyy[3]), Number(ddmmyyyy[2]) - 1, Number(ddmmyyyy[1]));
  }
  // Fallback to ISO/standard parsing
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

function formatLastSeen(lastSeen: string | null): string {
  if (!lastSeen) return "Inconnu";
  const date = parseDate(lastSeen);
  if (!date) return "Inconnu";
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
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

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data, error: err } = await supabase
        .from("products")
        .select("*")
        .order("last_seen", { ascending: false });

      if (err) {
        setError(err.message);
        setProducts([]);
      } else {
        setProducts((data || []).map((p: any, i: number) => mapToProduct(p, i)));
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return { products, loading, error };
}
