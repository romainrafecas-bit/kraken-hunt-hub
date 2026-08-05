import { motion, useReducedMotion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  index: number;
}

const cardAccents = [
  "174 72% 52%",
  "162 68% 50%",
  "262 62% 68%",
  "38 92% 62%",
];

const StatCard = ({ label, value, sub, icon: Icon, index }: StatCardProps) => {
  const accent = cardAccents[index % cardAccents.length];
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel surface-interactive relative overflow-hidden"
    >
      <div className="relative flex items-start gap-3 p-4">
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
          style={{ background: `hsl(${accent} / 0.12)` }}
        >
          <Icon className="h-[18px] w-[18px]" style={{ color: `hsl(${accent})` }} strokeWidth={1.9} />
        </div>
        <div className="min-w-0">
          <p className="soft-label mb-1">{label}</p>
          <p className="num text-xl font-black leading-tight" style={{ color: `hsl(${accent})` }}>
            {value}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-4 right-4 h-px"
        style={{ background: `linear-gradient(90deg, transparent, hsl(${accent} / 0.45), transparent)` }}
      />
    </motion.div>
  );
};

export default StatCard;
