import { useState } from "react";
import KrakkenSidebar from "@/components/dashboard/KrakkenSidebar";
import { motion } from "framer-motion";
import { Crown, Check, Zap, Shield, ArrowLeft, Loader2, Settings, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  "Recherche par image (Google Lens)",
  "Analytics & top marques",
  "Support prioritaire",
];

const Abonnement = () => {
  const navigate = useNavigate();
  const { loading, status, daysLeft, hasAccess, isActive, isTrialing, cancelAtPeriodEnd, currentPeriodEnd } = useSubscription();
  const [showCheckout, setShowCheckout] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

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

  const trialBlocked = !hasAccess; // user landed here forced
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
              <p className="text-sm text-foreground font-semibold font-display">
                Accès suspendu
              </p>
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

        {/* Pro plan card */}
        {!showCheckout && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="glass-panel-glow p-5 relative overflow-hidden ring-1 ring-primary/30"
          >
            <div
              className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 100% 0%, hsl(var(--primary) / 0.08), transparent 60%)",
              }}
            />

            <div className="absolute top-3 right-3 z-10">
              <span className="bio-badge bio-teal text-[10px] inline-flex items-center gap-1 whitespace-nowrap">
                <Zap className="w-3 h-3" />
                Sans engagement
              </span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: "hsl(var(--primary) / 0.12)",
                  border: "1px solid hsl(var(--primary) / 0.2)",
                }}
              >
                <Crown className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold text-foreground">Krakken Pro</h2>
                <span className="bio-badge bio-teal text-[10px]">Mensuel</span>
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-5">
              <span className="text-3xl font-bold text-foreground font-display">9,90€</span>
              <span className="text-sm text-muted-foreground">/mois</span>
            </div>

            <ul className="space-y-2.5 mb-6">
              {proFeatures.map((feat) => (
                <li key={feat} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            {loading ? (
              <button
                disabled
                className="w-full py-2.5 rounded-xl text-sm font-semibold bg-secondary text-muted-foreground flex items-center justify-center gap-2"
              >
                <Loader2 className="w-4 h-4 animate-spin" /> Chargement…
              </button>
            ) : isActive ? (
              <button
                onClick={openPortal}
                disabled={portalLoading}
                className="w-full py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ boxShadow: "0 0 24px -4px hsl(var(--primary) / 0.4)" }}
              >
                {portalLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <><Settings className="w-4 h-4" /> Gérer mon abonnement</>
                )}
              </button>
            ) : (
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-lg"
                style={{ boxShadow: "0 0 24px -4px hsl(var(--primary) / 0.4)" }}
              >
                {isTrialing ? "Passer au Pro maintenant" : "S'abonner au Pro"}
              </button>
            )}

            {isTrialing && daysLeft !== null && (
              <p className="text-[11px] text-muted-foreground text-center mt-2">
                Ton essai gratuit se termine dans {daysLeft} jour{daysLeft > 1 ? "s" : ""}.
              </p>
            )}
            {status === "canceled" && currentPeriodEnd && currentPeriodEnd.getTime() > Date.now() && (
              <p className="text-[11px] text-muted-foreground text-center mt-2">
                Accès jusqu'au {currentPeriodEnd.toLocaleDateString("fr-FR")}.
              </p>
            )}
          </motion.div>
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
            <p className="text-sm text-foreground font-semibold font-display">
              Annulation à tout moment
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Pas d'engagement. Tu peux résilier ton abonnement Pro quand tu le souhaites
              depuis le portail de gestion, sans frais supplémentaires.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Abonnement;
