import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  index: number;
}

const StatCard = ({ label, value, sub, icon: Icon, index }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay: index * 0.05 }}
    className="glass-panel-glow p-4 group hover:border-primary/30 transition-all duration-300"
  >
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 group-hover:bg-primary/15 transition-colors" style={{
        boxShadow: '0 0 10px -4px hsl(174 90% 45% / 0.15)'
      }}>
        <Icon className="w-[18px] h-[18px] text-primary" />
      </div>
      <div>
        <p className="soft-label mb-1">{label}</p>
        <p className="text-xl font-display font-extrabold text-primary glow-text-subtle">{value}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
      </div>
    </div>
  </motion.div>
);

export default StatCard;
