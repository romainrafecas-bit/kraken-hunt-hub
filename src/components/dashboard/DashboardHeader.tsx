import { motion } from "framer-motion";
import abyssBg from "@/assets/abyss-bg.jpg";
import krakkenLogo from "@/assets/krakken-logo.png";

const DashboardHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative rounded-2xl overflow-hidden h-36 glass-panel-glow"
    >
      <img src={abyssBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-card via-card/90 to-card/30" />

      <div className="relative z-10 h-full flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <img src={krakkenLogo} alt="Krakken" className="w-16 h-16 object-contain opacity-80 hidden md:block" style={{
            filter: 'drop-shadow(0 0 12px hsl(185 80% 42% / 0.3))'
          }} />
          <div>
            <h2 className="font-display text-xl font-extrabold text-foreground mb-1">
              Tableau de bord
            </h2>
            <p className="text-sm text-secondary-foreground">
              Analyse des meilleures ventes <span className="text-primary font-semibold">Cdiscount</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              54 892 produits · 12 catégories · 847 marques
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-5">
          <div className="glass-panel-glow px-4 py-2 flex items-center gap-3">
            <div className="text-right">
              <p className="text-[0.6rem] text-muted-foreground uppercase tracking-wider">Scannés</p>
              <p className="font-display text-sm font-bold text-primary glow-text-subtle">10</p>
            </div>
            <div className="w-px h-8 bg-border/40" />
            <div className="text-right">
              <p className="text-[0.6rem] text-muted-foreground uppercase tracking-wider">En ligne</p>
              <p className="font-display text-sm font-bold text-primary glow-text-subtle">8</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow glow-dot" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
