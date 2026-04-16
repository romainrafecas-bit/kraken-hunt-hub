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

function formatLastSeen(lastSeen: string | null): string {
  if (!lastSeen) return "Inconnu";
  const diff = Date.now() - new Date(lastSeen).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Il y a ${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days}j`;
}

export function mapToProduct(p: SupabaseProduct, index: number): Product {
  return {
    id: index + 1,
    name: p.title,
    brand: p.brand || "Inconnu",
    category: p.category || "Autre",
    price: Number(p.price) || 0,
    originalPrice: Math.round((Number(p.price) || 0) * 1.3),
    recurrences: p.recurrences || 0,
    lastSeen: formatLastSeen(p.last_seen),
    rating: Number(p.rating) || 0,
    score: Math.min(100, Math.round((Number(p.rating) || 0) * 20)),
    sellers: p.sellers_count || 0,
    image: p.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop",
    url: p.url,
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
