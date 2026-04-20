import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface MarginCalcRow {
  id: string;
  label: string;
  inputs: Record<string, unknown>;
  results: Record<string, unknown>;
  created_at: string;
}

export const useMarginCalculations = () => {
  const { user } = useAuth();
  const [calculations, setCalculations] = useState<MarginCalcRow[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("margin_calculations")
      .select("id,label,inputs,results,created_at")
      .order("created_at", { ascending: false })
      .limit(10);
    if (!error && data) {
      setCalculations(data as unknown as MarginCalcRow[]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback(
    async (label: string, inputs: Record<string, unknown>, results: Record<string, unknown>) => {
      if (!user) return { error: new Error("Not authenticated") };
      const { error } = await supabase.from("margin_calculations").insert({
        user_id: user.id,
        label: label.trim() || "Sans titre",
        inputs,
        results,
      });
      if (!error) await refresh();
      return { error };
    },
    [user, refresh]
  );

  const remove = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("margin_calculations").delete().eq("id", id);
      if (!error) await refresh();
      return { error };
    },
    [refresh]
  );

  return { calculations, loading, save, remove, refresh };
};
