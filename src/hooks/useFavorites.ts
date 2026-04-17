import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type Collection = "À sourcer" | "Test" | "Validé" | "Abandonné";

export interface FavoriteWithProduct {
  id: string;
  product_url: string;
  collection: string | null;
  note: string | null;
  created_at: string | null;
  product?: {
    title: string;
    image_url: string | null;
    price: number | null;
    brand: string | null;
    category: string | null;
  } | null;
}

export const useFavorites = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["favorites", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<FavoriteWithProduct[]> => {
      const { data, error } = await supabase
        .from("favorites")
        .select(`
          id, product_url, collection, note, created_at,
          product:products!favorites_product_url_fkey ( title, image_url, price, brand, category )
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as any;
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
      const { error } = await supabase.from("favorites").insert({
        user_id: user.id,
        product_url: url,
        collection,
      });
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
    removeFavorite: (id: string) => remove.mutate(id),
  };
};
