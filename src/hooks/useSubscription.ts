import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type SubStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "unpaid"
  | "paused"
  | "expired";

export interface SubscriptionState {
  loading: boolean;
  status: SubStatus | null;
  trialEndsAt: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  hasAccess: boolean;
  daysLeft: number | null; // days left of trial OR until period end (if canceled)
  isTrialing: boolean;
  isActive: boolean;
  refetch: () => Promise<void>;
}

const computeAccess = (row: any): { hasAccess: boolean; daysLeft: number | null } => {
  if (!row) return { hasAccess: false, daysLeft: null };
  const now = Date.now();
  const trialEnd = row.trial_ends_at ? new Date(row.trial_ends_at).getTime() : null;
  const periodEnd = row.current_period_end ? new Date(row.current_period_end).getTime() : null;

  if (row.status === "trialing" && trialEnd && trialEnd > now) {
    const days = Math.max(0, Math.ceil((trialEnd - now) / 86400000));
    return { hasAccess: true, daysLeft: days };
  }
  if (
    (row.status === "active" || row.status === "past_due") &&
    (!periodEnd || periodEnd > now)
  ) {
    const days = periodEnd ? Math.max(0, Math.ceil((periodEnd - now) / 86400000)) : null;
    return { hasAccess: true, daysLeft: days };
  }
  if (row.status === "canceled" && periodEnd && periodEnd > now) {
    const days = Math.max(0, Math.ceil((periodEnd - now) / 86400000));
    return { hasAccess: true, daysLeft: days };
  }
  return { hasAccess: false, daysLeft: null };
};

export const useSubscription = (): SubscriptionState => {
  const { user } = useAuth();
  const [row, setRow] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchSub = useCallback(async () => {
    if (!user) {
      setRow(null);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) console.error("useSubscription error:", error);
    setRow(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    setLoading(true);
    fetchSub();
  }, [fetchSub]);

  // Realtime updates — build channel only when user.id changes; avoid re-subscribing on fetchSub identity changes
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel(`sub-${user.id}-${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "subscriptions",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchSub();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const { hasAccess, daysLeft } = computeAccess(row);

  return {
    loading,
    status: (row?.status as SubStatus) ?? null,
    trialEndsAt: row?.trial_ends_at ? new Date(row.trial_ends_at) : null,
    currentPeriodEnd: row?.current_period_end ? new Date(row.current_period_end) : null,
    cancelAtPeriodEnd: !!row?.cancel_at_period_end,
    hasAccess,
    daysLeft,
    isTrialing: row?.status === "trialing",
    isActive: row?.status === "active",
    refetch: fetchSub,
  };
};
