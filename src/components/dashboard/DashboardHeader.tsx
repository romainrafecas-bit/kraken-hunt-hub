import { motion } from "framer-motion";
import abyssBg from "@/assets/abyss-bg.jpg";

const DashboardHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative rounded-md overflow-hidden h-36 glass-panel"
    >
      <img src={abyssBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
      
      {/* Scan line effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-scan-line" />
      </div>

      <div className="relative z-10 h-full flex items-center justify-between px-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="font-display text-lg font-bold tracking-[0.25em] text-foreground glow-text">KRAKKEN</h2>
            <span className="cryptic-mono text-primary/60 px-2 py-0.5 border border-primary/10 rounded" style={{ fontSize: '0.5rem' }}>v2.4.1</span>
          </div>
          <p className="text-sm text-secondary-foreground font-mono">
            Analyse des profondeurs <span className="text-primary">Cdiscount</span> terminée
          </p>
          <p className="cryptic-mono text-muted-foreground mt-2" style={{ fontSize: '0.55rem' }}>
            54,892 PRODUITS ANALYSÉS · 12 CATÉGORIES · 847 MARQUES
          </p>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="text-right">
            <p className="cryptic-mono text-muted-foreground" style={{ fontSize: '0.5rem' }}>STATUT</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow glow-dot" />
              <span className="text-xs font-mono text-accent">ANALYSE COMPLÈTE</span>
            </div>
          </div>
          <div className="w-px h-10 bg-border/30" />
          <div className="text-right">
            <p className="cryptic-mono text-muted-foreground" style={{ fontSize: '0.5rem' }}>PROFONDEUR</p>
            <p className="font-display text-sm font-bold text-primary glow-text-subtle mt-1">NIVEAU 9</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
