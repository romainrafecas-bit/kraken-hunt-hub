import { motion } from "framer-motion";
import krakenImage from "@/assets/kraken-hero.jpg";

const HeroBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative rounded-xl overflow-hidden h-48 glow-border"
    >
      <img
        src={krakenImage}
        alt="Krakken deep ocean"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      <div className="relative z-10 h-full flex flex-col justify-center p-6">
        <h2 className="font-display text-2xl font-bold text-foreground glow-text tracking-wide">
          Bienvenue, Chasseur
        </h2>
        <p className="text-sm text-secondary-foreground mt-2 max-w-md">
          Le Krakken parcourt les abysses de Cdiscount. <span className="text-primary font-medium">3 nouvelles opportunités</span> détectées dans les profondeurs.
        </p>
        <div className="flex gap-3 mt-4">
          <button className="px-4 py-2 bg-primary text-primary-foreground font-display text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors tracking-wide">
            LANCER UN SCAN
          </button>
          <button className="px-4 py-2 bg-secondary text-secondary-foreground font-display text-xs font-semibold rounded-lg hover:bg-secondary/80 transition-colors tracking-wide border border-border/50">
            VOIR LES ALERTES
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroBanner;
