import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertTriangle, Clock, X, RotateCcw, Loader2 } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { getStripeEnvironment } from "@/lib/stripe";
import { toast } from "sonner";

type Variant = "danger" | "warning" | "info";

const styles: Record<Variant, { bg: string; border: string; fg: string; icon: string }> = {
  danger: {
    bg: "hsl(var(--destructive) / 0.08)",
    border: "hsl(var(--destructive) / 0.4)",
    fg: "hsl(var(--destructive))",
    icon: "hsl(var(--destructive))",
  },
  warning: {
    bg: "hsl(38 92% 56% / 0.08)",
    border: "hsl(38 92% 56% / 0.35)",
    fg: "hsl(38 92% 70%)",
    icon: "hsl(38 92% 60%)",
  },
  info: {
    bg: "hsl(174 72% 46% / 0.08)",
    border: "hsl(174 72% 46% / 0.3)",
    fg: "hsl(174 72% 60%)",
    icon: "hsl(174 72% 50%)",
  },
};

const SubscriptionBanner = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { status, daysLeft, currentPeriodEnd, cancelAtPeriodEnd, isTrialing } = useSubscription();
  const [dismissed, setDismissed] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(sessionStorage.getItem("krk_banner_dismissed") || "{}");
    } catch {
      return {};
    }
  });
  const [portalLoading, setPortalLoading] = useState(false);

  // Don't show on /abonnement (the page itself handles it)
  if (location.pathname === "/abonnement") return null;

  const dismiss = (key: string) => {
    const next = { ...dismissed, [key]: true };
    setDismissed(next);
    sessionStorage.setItem("krk_banner_dismissed", JSON.stringify(next));
  };

  const openPortal = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-portal-session", {
        body: {
          returnUrl: `${window.location.origin}${location.pathname}`,
          environment: getStripeEnvironment(),
        },
      });
      if (error || !data?.url) throw new Error(error?.message || "Portail indisponible");
      window.open(data.url, "_blank");
    } catch (e: any) {
      toast.error(e.message || "Impossible d'ouvrir le portail");
    } finally {
      setPortalLoading(false);
    }
  };

  // Determine which banner to show (priority: past_due > trial J-3 > cancel scheduled)
  let variant: Variant | null = null;
  let key = "";
  let message = "";
  let action: { label: string; onClick: () => void; loading?: boolean } | null = null;
  let dismissible = true;

  if (status === "past_due") {
    variant = "danger";
    key = "past_due";
    message = "Ton dernier paiement a échoué. Mets à jour ta carte pour conserver ton accès.";
    action = { label: "Mettre à jour", onClick: openPortal, loading: portalLoading };
    dismissible = false;
  } else if (isTrialing && daysLeft !== null && daysLeft <= 3) {
    variant = "warning";
    key = `trial_${daysLeft}`;
    message =
      daysLeft <= 0
        ? "Ton essai gratuit se termine aujourd'hui. Active ton abonnement pour continuer."
        : `Ton essai gratuit se termine dans ${daysLeft} jour${daysLeft > 1 ? "s" : ""}. Active ton abonnement pour continuer.`;
    action = { label: "Activer", onClick: () => navigate("/abonnement") };
  } else if (cancelAtPeriodEnd && currentPeriodEnd) {
    variant = "info";
    key = `cancel_${currentPeriodEnd.toISOString().slice(0, 10)}`;
    message = `Ton abonnement sera annulé le ${currentPeriodEnd.toLocaleDateString("fr-FR")}. Tu peux le réactiver quand tu veux.`;
    action = { label: "Réactiver", onClick: openPortal, loading: portalLoading };
  }

  if (!variant || dismissed[key]) return null;

  const s = styles[variant];
  const Icon = variant === "danger" ? AlertTriangle : variant === "warning" ? Clock : RotateCcw;

  return (
    <div
      className="rounded-xl px-4 py-3 flex items-center gap-3 shadow-2xl backdrop-blur-xl"
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        boxShadow: "0 12px 40px -8px hsl(230 50% 1% / 0.6)",
      }}
      role="alert"
    >
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color: s.icon }} />
      <p className="text-xs flex-1" style={{ color: s.fg }}>
        {message}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          disabled={action.loading}
          className="text-[11px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition-all hover:brightness-110 disabled:opacity-50 flex items-center gap-1.5"
          style={{
            background: s.icon,
            color: "hsl(230 50% 3%)",
          }}
        >
          {action.loading && <Loader2 className="w-3 h-3 animate-spin" />}
          {action.label}
        </button>
      )}
      {dismissible && (
        <button
          onClick={() => dismiss(key)}
          className="opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
          aria-label="Fermer"
        >
          <X className="w-3.5 h-3.5" style={{ color: s.fg }} />
        </button>
      )}
    </div>
  );
};

export default SubscriptionBanner;
