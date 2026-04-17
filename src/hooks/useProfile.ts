import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Profile {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
}

export const useProfile = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const update = useMutation({
    mutationFn: async (patch: Partial<Pick<Profile, "display_name" | "avatar_url">>) => {
      if (!user) throw new Error("Non connecté");
      const { error } = await supabase
        .from("profiles")
        .update(patch)
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile", user?.id] });
      toast.success("Profil mis à jour");
    },
    onError: (e: any) => toast.error(e.message ?? "Erreur"),
  });

  const uploadAvatar = useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error("Non connecté");
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/avatar.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const url = `${data.publicUrl}?t=${Date.now()}`;
      const { error } = await supabase.from("profiles").update({ avatar_url: url }).eq("user_id", user.id);
      if (error) throw error;
      return url;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile", user?.id] });
      toast.success("Avatar mis à jour");
    },
    onError: (e: any) => toast.error(e.message ?? "Upload échoué"),
  });

  return {
    profile,
    isLoading,
    updateProfile: (patch: Partial<Pick<Profile, "display_name" | "avatar_url">>) => update.mutate(patch),
    uploadAvatar: (file: File) => uploadAvatar.mutate(file),
    uploadingAvatar: uploadAvatar.isPending,
  };
};
