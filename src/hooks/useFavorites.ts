import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { externalSupabase } from "@/integrations/supabase/external-client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type Collection = "À sourcer" | "En cours de test" | "Validé" | "Abandonné";
export const COLLECTIONS: Collection[] = ["À sourcer", "En cours de test", "Validé", "Abandonné"];

export interface FavoriteProduct {
  title: string;
  image_url: string | null;
  price: number | null;
  brand: string | null;
  category: string | null;
  url: string;
}

export interface FavoriteRow {
  id: string;
  product_url: string;
  collection: string | null;
  note: string | null;
  created_at: string | null;
  product: FavoriteProduct | null;
}

export const useFavorites = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["favorites", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<FavoriteRow[]> => {
      const { data: favs, error } = await supabase
        .from("favorites")
        .select("id, product_url, collection, note, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (!favs || favs.length === 0) return [];

      const urls = favs.map((f) => f.product_url);
      const { data: prods } = await externalSupabase
        .from("products")
        .select("url, title, image_url, price, brand, category")
        .in("url", urls);

      const map = new Map((prods ?? []).map((p: any) => [p.url, p]));
      return favs.map((f) => ({
        ...f,
        product: (map.get(f.product_url) as FavoriteProduct) ?? null,
      }));
    },
  });

  const favoriteUrls = new Set(favorites.map((f) => f.product_url));
  const isFavorite = (url: string) => favoriteUrls.has(url);

  const toggle = useMutation({
    mutationFn: async ({ url, collection = "À sourcer" }: { url: string; collection?: Collection }) => {
      if (!user) throw new Error("Non connecté");
      const existing = favorites.find((f) => f.product_url === url);
      if (existing) {
        const { error } = await supabase.from("favorites").delete().eq("id", existing.id);
        if (error) throw error;
        return { added: false };
      }
      const { error } = await supabase
        .from("favorites")
        .insert({ user_id: user.id, product_url: url, collection });
      if (error) throw error;
      return { added: true };
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["favorites", user?.id] });
      toast.success(res.added ? "Ajouté aux favoris" : "Retiré des favoris");
    },
    onError: (e: any) => toast.error(e.message ?? "Erreur"),
  });

  const updateCollection = useMutation({
    mutationFn: async ({ id, collection }: { id: string; collection: Collection }) => {
      const { error } = await supabase.from("favorites").update({ collection }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites", user?.id] }),
  });

  const updateNote = useMutation({
    mutationFn: async ({ id, note }: { id: string; note: string }) => {
      const { error } = await supabase.from("favorites").update({ note }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites", user?.id] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("favorites").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["favorites", user?.id] });
      toast.success("Favori supprimé");
    },
  });

  return {
    favorites,
    isLoading,
    isFavorite,
    toggleFavorite: (url: string, collection?: Collection) => toggle.mutate({ url, collection }),
    updateCollection: (id: string, collection: Collection) => updateCollection.mutate({ id, collection }),
    updateNote: (id: string, note: string) => updateNote.mutate({ id, note }),
    removeFavorite: (id: string) => remove.mutate(id),
  };
};
