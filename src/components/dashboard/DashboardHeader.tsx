import { motion } from "framer-motion";
import abyssBg from "@/assets/abyss-bg.jpg";

const DashboardHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative rounded-2xl overflow-hidden h-36 glass-panel"
    >
      <img src={abyssBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-r from-card via-card/90 to-card/50" />

      <div className="relative z-10 h-full flex items-center justify-between px-6">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <h2 className="font-display text-2xl font-extrabold text-foreground">
              🐙 Krakken
            </h2>
            <span className="text-[0.65rem] font-medium text-primary px-2 py-0.5 bg-primary/10 rounded-full border border-primary/15">
              v2.4
            </span>
          </div>
          <p className="text-sm text-secondary-foreground">
            Analyse des meilleures ventes <span className="text-primary font-semibold">Cdiscount</span> terminée
          </p>
          <p className="text-xs text-muted-foreground mt-1.5">
            54 892 produits · 12 catégories · 847 marques
          </p>
        </div>

        <div className="hidden md:flex items-center gap-5">
          <div className="text-right">
            <p className="text-[0.65rem] text-muted-foreground mb-1">Statut</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-glow" />
              <span className="text-xs font-semibold text-emerald-400">Complet</span>
            </div>
          </div>
          <div className="w-px h-10 bg-border/40" />
          <div className="text-right">
            <p className="text-[0.65rem] text-muted-foreground mb-1">Profondeur</p>
            <p className="font-display text-sm font-bold text-primary">Niveau 9</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
