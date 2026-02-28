import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "up" | "down" | "neutral";
  icon: LucideIcon;
  delay?: number;
}

const StatsCard = ({ title, value, change, changeType, icon: Icon, delay = 0 }: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card rounded-xl p-5 stat-glow group hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span
          className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            changeType === "up" && "bg-accent/10 text-accent",
            changeType === "down" && "bg-destructive/10 text-destructive",
            changeType === "neutral" && "bg-muted text-muted-foreground"
          )}
        >
          {change}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className="text-2xl font-display font-bold text-foreground glow-text">{value}</p>
    </motion.div>
  );
};

export default StatsCard;
