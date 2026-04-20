import { useEffect, useState } from "react";
import KrakkenSidebar from "@/components/dashboard/KrakkenSidebar";
import { motion } from "framer-motion";
import { Check, Shield, ArrowLeft, Loader2, Settings, AlertTriangle, Crown, CalendarClock } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { supabase } from "@/integrations/supabase/client";
import { getStripeEnvironment } from "@/lib/stripe";
import { toast } from "sonner";

const PRO_PRICE_ID = "krakken_pro_monthly";

const proFeatures = [
  "Produits illimités",
  "Favoris illimités & collections",
  "Calculateur de marge marketplace",
  "Support prioritaire",
];

const Abonnement = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { loading, daysLeft, hasAccess, isActive, isTrialing, cancelAtPeriodEnd, currentPeriodEnd, refetch } =
    useSubscription();
  const [showCheckout, setShowCheckout] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  // Detect successful return from Stripe
  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      toast.success("Bienvenue dans l'équipage Pro 🎉");
      searchParams.delete("session_id");
      setSearchParams(searchParams, { replace: true });
      setShowCheckout(false);
      // Give the webhook a moment, then refresh
      setTimeout(() => refetch(), 1500);
    }
  }, [searchParams, setSearchParams, refetch]);

  const openPortal = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-portal-session", {
        body: {
          returnUrl: `${window.location.origin}/abonnement`,
          environment: getStripeEnvironment(),
        },
      });
      if (error || !data?.url) throw new Error(error?.message || "Portail indisponible");
      window.open(data.url, "_blank");
    } catch (e: any) {
      toast.error(e.message || "Impossible d'ouvrir le portail de gestion");
    } finally {
      setPortalLoading(false);
    }
  };

  const trialBlocked = !hasAccess;
  const heading = trialBlocked
    ? "Ton essai est terminé"
    : isActive
    ? "Ton abonnement Pro"
    : isTrialing
    ? "Période d'essai en cours"
    : "Gérer mon abonnement";

  const subtitle = trialBlocked
    ? "Pour continuer à chasser, active ton abonnement Pro."
    : isActive
    ? cancelAtPeriodEnd && currentPeriodEnd
      ? `Annulation programmée le ${currentPeriodEnd.toLocaleDateString("fr-FR")}.`
      : "Merci pour ton soutien — accès complet activé."
    : isTrialing && daysLeft !== null
    ? `Il te reste ${daysLeft} jour${daysLeft > 1 ? "s" : ""} d'essai gratuit.`
    : "Choisis le plan adapté à ta chasse.";

  return (
    <div className="min-h-screen abyss-gradient">
      <PaymentTestModeBanner />
      <KrakkenSidebar />
      <main className="pl-16 xl:pl-56 p-4 lg:p-6 space-y-5 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
        >
          {hasAccess && (
            <button
              onClick={() => navigate("/profil")}
              className="glass-panel w-9 h-9 rounded-xl flex items-center justify-center hover:border-primary/30 transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          <div>
            <h1 className="kraken-title text-xl">{heading}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          </div>
        </motion.div>

        {trialBlocked && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel p-4 flex items-start gap-3 border border-destructive/30"
            style={{ background: "hsl(var(--destructive) / 0.06)" }}
          >
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-foreground font-semibold font-display">Accès suspendu</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Ton essai gratuit de 14 jours est arrivé à expiration. Active l'abonnement Pro pour retrouver l'accès complet.
              </p>
            </div>
          </motion.div>
        )}

        {/* Inline checkout */}
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel-glow p-4 lg:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-base font-bold text-foreground">Paiement sécurisé</h2>
              <button
                onClick={() => setShowCheckout(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Annuler
              </button>
            </div>
            <StripeEmbeddedCheckout
              priceId={PRO_PRICE_ID}
              returnUrl={`${window.location.origin}/abonnement?session_id={CHECKOUT_SESSION_ID}`}
            />
          </motion.div>
        )}

        {/* Action card — hide while checkout is open or while loading */}
        {!showCheckout && !loading && (
          <>
            {isActive ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="glass-panel-glow p-5 lg:p-6 space-y-4"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Crown className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-foreground">Krakken Pro</p>
                      <p className="text-xs text-muted-foreground">9,90 € / mois</p>
                    </div>
                  </div>
                  {cancelAtPeriodEnd ? (
                    <span className="text-[11px] px-2 py-1 rounded-md bg-destructive/10 text-destructive font-semibold">
                      Annulation programmée
                    </span>
                  ) : (
                    <span className="text-[11px] px-2 py-1 rounded-md bg-primary/10 text-primary font-semibold">
                      Actif
                    </span>
                  )}
                </div>

                {currentPeriodEnd && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarClock className="w-4 h-4" />
                    {cancelAtPeriodEnd
                      ? `Accès jusqu'au ${currentPeriodEnd.toLocaleDateString("fr-FR")}`
                      : `Prochain renouvellement le ${currentPeriodEnd.toLocaleDateString("fr-FR")}`}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    onClick={openPortal}
                    disabled={portalLoading}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    {portalLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Settings className="w-4 h-4" />
                    )}
                    Gérer mon abonnement
                  </button>
                  {!cancelAtPeriodEnd && (
                    <button
                      onClick={openPortal}
                      disabled={portalLoading}
                      className="px-4 py-2.5 rounded-xl glass-panel text-sm text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-all disabled:opacity-50"
                    >
                      Annuler mon abonnement
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  La gestion (carte, factures, annulation) s'ouvre dans un nouvel onglet via notre portail sécurisé.
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="glass-panel-glow p-5 lg:p-6 space-y-4"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Crown className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-foreground">Krakken Pro</p>
                      <p className="text-xs text-muted-foreground">9,90 € / mois — sans engagement</p>
                    </div>
                  </div>
                </div>

                <ul className="space-y-1.5">
                  {proFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setShowCheckout(true)}
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  Activer mon abonnement
                </button>
              </motion.div>
            )}
          </>
        )}

        {/* Reassurance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="glass-panel p-4 flex items-start gap-3"
        >
          <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-semibold font-display">Annulation à tout moment</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Pas d'engagement. Tu peux résilier ton abonnement Pro quand tu le souhaites depuis le portail de gestion,
              sans frais supplémentaires.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Abonnement;
