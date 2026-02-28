import { motion } from "framer-motion";
import { Activity, Waves } from "lucide-react";

const ScannerStatus = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-sm font-semibold tracking-wide text-foreground">STATUT DU SCANNER</h3>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
          <span className="text-xs text-accent font-medium">En ligne</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="w-4 h-4 text-primary" />
            <span>Pages scannées / h</span>
          </div>
          <span className="text-sm font-display font-bold text-foreground">4,280</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Waves className="w-4 h-4 text-primary" />
            <span>Profondeur actuelle</span>
          </div>
          <span className="text-sm font-display font-bold text-foreground">Niveau 7</span>
        </div>

        {/* Progress visual */}
        <div className="mt-4 p-3 rounded-lg bg-secondary/50">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-muted-foreground">Scan en cours</span>
            <span className="text-primary font-medium">67%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "67%" }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">~2,340 produits restants à analyser</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ScannerStatus;
