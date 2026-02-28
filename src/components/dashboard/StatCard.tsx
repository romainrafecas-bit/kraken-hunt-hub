import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  index: number;
  accentColor?: string;
}

const StatCard = ({ label, value, sub, icon: Icon, index, accentColor }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.06 }}
    className="glass-panel rounded-md p-4 group hover:border-primary/20 transition-all duration-500 relative overflow-hidden"
  >
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    <div className="flex items-start justify-between">
      <div>
        <p className="cryptic-mono text-muted-foreground mb-2" style={{ fontSize: '0.6rem' }}>{label}</p>
        <p className="text-xl font-display font-bold text-foreground glow-text-subtle">{value}</p>
        <p className="text-xs text-muted-foreground mt-1 font-mono">{sub}</p>
      </div>
      <div className={cn(
        "w-8 h-8 rounded flex items-center justify-center transition-all duration-300",
        "bg-primary/5 group-hover:bg-primary/10"
      )}>
        <Icon className="w-4 h-4 text-primary/70 group-hover:text-primary transition-colors" />
      </div>
    </div>
  </motion.div>
);

export default StatCard;
