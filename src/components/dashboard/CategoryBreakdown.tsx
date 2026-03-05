import { motion } from "framer-motion";
import { products } from "@/data/products";

const catColors = [
  { bar: "hsl(174, 72%, 46%)", glow: "hsl(174 72% 46% / 0.3)" },
  { bar: "hsl(262, 52%, 58%)", glow: "hsl(262 52% 58% / 0.3)" },
  { bar: "hsl(188, 78%, 52%)", glow: "hsl(188 78% 52% / 0.3)" },
  { bar: "hsl(38, 92%, 56%)", glow: "hsl(38 92% 56% / 0.3)" },
  { bar: "hsl(162, 68%, 44%)", glow: "hsl(162 68% 44% / 0.3)" },
  { bar: "hsl(348, 72%, 56%)", glow: "hsl(348 72% 56% / 0.3)" },
  { bar: "hsl(310, 55%, 50%)", glow: "hsl(310 55% 50% / 0.3)" },
  { bar: "hsl(200, 65%, 55%)", glow: "hsl(200 65% 55% / 0.3)" },
];

const CategoryBreakdown = () => {
  const catStats = products.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = { sales: 0, count: 0 };
    acc[p.category].sales += p.recurrences;
    acc[p.category].count += 1;
    return acc;
  }, {} as Record<string, { sales: number; count: number }>);

  const sorted = Object.entries(catStats)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.sales - a.sales);

  const total = sorted.reduce((s, c) => s + c.sales, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="glass-panel-glow p-5 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px tentacle-line" />
      <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
        <span style={{ filter: 'drop-shadow(0 0 4px hsl(188 78% 52% / 0.4))' }}>🌊</span>
        Zones de chasse
      </h3>
      <div className="space-y-3">
        {sorted.map((cat, i) => {
          const pct = Math.round((cat.sales / total) * 100);
          const c = catColors[i % catColors.length];
          return (
            <div key={cat.name} className="flex items-center gap-3 group">
              <div className="w-24 text-xs truncate font-medium transition-colors" style={{
                color: c.bar,
              }}>{cat.name}</div>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'hsl(225 18% 10%)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7, delay: 0.4 + i * 0.04 }}
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: c.bar,
                    boxShadow: `0 0 8px ${c.glow}`
                  }}
                />
              </div>
              <span className="text-xs font-mono font-bold w-8 text-right" style={{
                color: c.bar,
                textShadow: `0 0 6px ${c.glow}`,
              }}>{pct}%</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CategoryBreakdown;
