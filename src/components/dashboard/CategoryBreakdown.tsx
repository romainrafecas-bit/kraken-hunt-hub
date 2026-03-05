import { motion } from "framer-motion";
import { products } from "@/data/products";

const catColors = [
  "hsl(174, 90%, 45%)",
  "hsl(199, 85%, 50%)",
  "hsl(16, 85%, 58%)",
  "hsl(38, 95%, 55%)",
  "hsl(160, 80%, 45%)",
  "hsl(280, 50%, 55%)",
  "hsl(340, 60%, 55%)",
  "hsl(120, 50%, 45%)",
];

const CategoryBreakdown = () => {
  const catStats = products.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = { sales: 0, count: 0 };
    acc[p.category].sales += p.sales;
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
      className="glass-panel-glow p-5"
    >
      <h3 className="font-display text-sm font-bold text-foreground mb-4">📦 Par catégorie</h3>
      <div className="space-y-3">
        {sorted.map((cat, i) => {
          const pct = Math.round((cat.sales / total) * 100);
          return (
            <div key={cat.name} className="flex items-center gap-3 group">
              <div className="w-24 text-xs text-secondary-foreground truncate group-hover:text-foreground transition-colors font-medium">{cat.name}</div>
              <div className="flex-1 h-2 rounded-full bg-muted/40 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7, delay: 0.4 + i * 0.04 }}
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: catColors[i % catColors.length],
                    boxShadow: `0 0 6px ${catColors[i % catColors.length]}40`
                  }}
                />
              </div>
              <span className="text-xs font-mono text-muted-foreground w-8 text-right">{pct}%</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CategoryBreakdown;
