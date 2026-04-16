import { motion } from "framer-motion";
import { Anchor } from "lucide-react";

interface EmptyStateProps {
  message?: string;
  sub?: string;
}

const EmptyState = ({ 
  message = "Aucun produit pour le moment", 
  sub = "Lance une analyse depuis Krakken pour remplir tes filets 🐙" 
}: EmptyStateProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-panel-glow p-12 flex flex-col items-center justify-center text-center"
  >
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
      style={{ background: 'hsl(174 72% 46% / 0.08)', border: '1px solid hsl(174 72% 46% / 0.15)' }}>
      <Anchor className="w-7 h-7" style={{ color: 'hsl(174 72% 46%)', opacity: 0.5 }} />
    </div>
    <p className="font-display font-bold text-foreground/80 text-lg mb-1">{message}</p>
    <p className="text-sm text-muted-foreground max-w-sm">{sub}</p>
  </motion.div>
);

export default EmptyState;
