import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  index: number;
}

const cardAccents = [
  { color: "174 72% 46%", label: "teal" },
  { color: "162 68% 44%", label: "emerald" },
  { color: "262 52% 58%", label: "violet" },
  { color: "38 92% 56%", label: "amber" },
];

const StatCard = ({ label, value, sub, icon: Icon, index }: StatCardProps) => {
  const accent = cardAccents[index % cardAccents.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="glass-panel relative overflow-hidden group cursor-pointer"
      style={{
        borderColor: `hsl(${accent.color} / 0.12)`,
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
      whileHover={{
        borderColor: `hsl(${accent.color} / 0.3)`,
      }}
    >
      {/* Accent glow background */}
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle, hsl(${accent.color} / 0.1), transparent 70%)`,
        }}
      />

      <div className="relative p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
          style={{
            background: `hsl(${accent.color} / 0.1)`,
            boxShadow: `0 0 12px -4px hsl(${accent.color} / 0.2)`,
          }}
        >
          <Icon className="w-[18px] h-[18px]" style={{
            color: `hsl(${accent.color})`,
            filter: `drop-shadow(0 0 4px hsl(${accent.color} / 0.3))`,
          }} />
        </div>
        <div>
          <p className="soft-label mb-1">{label}</p>
          <p className="text-xl font-display font-black" style={{
            color: `hsl(${accent.color})`,
            textShadow: `0 0 16px hsl(${accent.color} / 0.35)`,
          }}>{value}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-4 right-4 h-px opacity-40"
        style={{
          background: `linear-gradient(90deg, transparent, hsl(${accent.color} / 0.5), transparent)`,
        }}
      />
    </motion.div>
  );
};

export default StatCard;
