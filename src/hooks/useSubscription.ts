import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

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

type Listener = () => void;
const realtimeRegistry = new Map<string, { channel: any; listeners: Set<Listener> }>();

function subscribeToSubscription(userId: string, listener: Listener) {
  let entry = realtimeRegistry.get(userId);
  if (!entry) {
    const listeners = new Set<Listener>();
    const channel = supabase
      .channel(`subscription-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "subscriptions",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          realtimeRegistry.get(userId)?.listeners.forEach((l) => l());
        },
      )
      .subscribe();
    entry = { channel, listeners };
    realtimeRegistry.set(userId, entry);
  }
  entry.listeners.add(listener);
}

function unsubscribeFromSubscription(userId: string, listener: Listener) {
  const entry = realtimeRegistry.get(userId);
  if (!entry) return;
  entry.listeners.delete(listener);
  if (entry.listeners.size === 0) {
    supabase.removeChannel(entry.channel);
    realtimeRegistry.delete(userId);
  }
}

/**
 * Shared subscription state. Backed by React Query so every component that calls
 * this hook reuses one single request instead of hitting the API each time.
 */
export const useSubscription = (): SubscriptionState => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id ?? null;

  const { data: row, isLoading } = useQuery({
    queryKey: ["subscription", userId],
    enabled: !!userId,
    staleTime: 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const refetch = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["subscription", userId] });
  }, [queryClient, userId]);

  // Realtime updates keep the shared cache fresh (Stripe webhooks, trial end, …).
  // One single channel is shared by every consumer of this hook (ref-counted),
  // since Supabase rejects duplicate channel names.
  useEffect(() => {
    if (!userId) return;
    const listener = () => {
      queryClient.invalidateQueries({ queryKey: ["subscription", userId] });
    };
    subscribeToSubscription(userId, listener);
    return () => unsubscribeFromSubscription(userId, listener);
  }, [userId, queryClient]);

  const { hasAccess, daysLeft } = computeAccess(row);

  return {
    loading: !!userId && isLoading,
    status: (row?.status as SubStatus) ?? null,
    trialEndsAt: row?.trial_ends_at ? new Date(row.trial_ends_at) : null,
    currentPeriodEnd: row?.current_period_end ? new Date(row.current_period_end) : null,
    cancelAtPeriodEnd: !!row?.cancel_at_period_end,
    hasAccess,
    daysLeft,
    isTrialing: row?.status === "trialing",
    isActive: row?.status === "active",
    refetch,
  };
};
