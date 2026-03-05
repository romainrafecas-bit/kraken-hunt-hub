import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
    className="glass-panel p-4 group hover:border-primary/25 transition-all duration-300"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="soft-label mb-2">{label}</p>
        <p className="text-xl font-display font-extrabold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{sub}</p>
      </div>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary/8 group-hover:bg-primary/15 transition-colors">
        <Icon className="w-4 h-4 text-primary/70 group-hover:text-primary transition-colors" />
      </div>
    </div>
  </motion.div>
);

export default StatCard;
