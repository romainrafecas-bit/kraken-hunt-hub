import KrakkenSidebar from "@/components/dashboard/KrakkenSidebar";
import { motion } from "framer-motion";
import { Crown, Check, Zap, Shield, Star, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Essai gratuit",
    price: "0€",
    period: "pendant 14 jours",
    badge: "bio-violet" as const,
    features: [
      "Accès complet pendant 14 jours",
      "Produits illimités",
      "Toutes les fonctionnalités Pro",
      "Sans engagement",
    ],
    cta: "Période d'essai en cours",
    subtitle: "Votre essai expire dans 11 jours",
    disabled: true,
    highlighted: false,
  },
  {
    name: "Pro",
    price: "9,90€",
    originalPrice: "39,90€",
    period: "/mois",
    badge: "bio-teal" as const,
    tag: "Offre formation",
    features: [
      "Produits illimités",
      "Alertes prix & rupture en temps réel",
      "Collections illimitées",
      "Export Excel",
      "Données historiques complètes",
      "Score de récurrence avancé",
      "Support prioritaire",
    ],
    cta: "S'abonner au Pro",
    subtitle: "Obligatoire après la période d'essai",
    disabled: false,
    highlighted: true,
  },
];

const Abonnement = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen abyss-gradient">
      <KrakkenSidebar />
      <main className="pl-16 xl:pl-56 p-4 lg:p-6 space-y-5 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <button
            onClick={() => navigate("/profil")}
            className="glass-panel w-9 h-9 rounded-xl flex items-center justify-center hover:border-primary/30 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <div>
            <h1 className="kraken-title text-xl">Gérer mon abonnement</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Choisissez le plan adapté à votre chasse
            </p>
          </div>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              className={`glass-panel-glow p-5 relative overflow-hidden flex flex-col ${
                plan.highlighted ? "ring-1 ring-primary/30" : ""
              }`}
            >
              {plan.highlighted && (
                <div
                  className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at 100% 0%, hsl(var(--primary) / 0.08), transparent 60%)",
                  }}
                />
              )}

              {plan.tag && (
                <div className="absolute top-3 right-3">
                  <span className="bio-badge bio-teal text-[10px]">
                    <Zap className="w-3 h-3 mr-1" />
                    {plan.tag}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: plan.highlighted
                      ? "hsl(var(--primary) / 0.12)"
                      : "hsl(var(--secondary))",
                    border: plan.highlighted
                      ? "1px solid hsl(var(--primary) / 0.2)"
                      : "1px solid hsl(var(--border))",
                  }}
                >
                  {plan.highlighted ? (
                    <Crown className="w-4 h-4 text-primary" />
                  ) : (
                    <Star className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h2 className="font-display text-base font-bold text-foreground">
                    {plan.name}
                  </h2>
                  <span className={`bio-badge ${plan.badge} text-[10px]`}>
                    {plan.name}
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-5">
                <span className="text-3xl font-bold text-foreground font-display">
                  {plan.price}
                </span>
                {plan.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {plan.originalPrice}
                  </span>
                )}
                <span className="text-sm text-muted-foreground">
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        plan.highlighted ? "text-primary" : "text-muted-foreground/50"
                      }`}
                    />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <button
                disabled={plan.disabled}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:opacity-90 shadow-lg"
                    : "glass-panel text-muted-foreground cursor-default"
                }`}
                style={
                  plan.highlighted
                    ? {
                        boxShadow:
                          "0 0 24px -4px hsl(var(--primary) / 0.4)",
                      }
                    : {}
                }
              >
                {plan.cta}
              </button>
              {plan.subtitle && (
                <p className="text-[11px] text-muted-foreground text-center mt-2">{plan.subtitle}</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Info */}
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
              Pas d'engagement. Vous pouvez résilier votre abonnement Pro
              quand vous le souhaitez, sans frais supplémentaires.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Abonnement;
