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

        {/* Pro plan card removed - user requested */}

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
