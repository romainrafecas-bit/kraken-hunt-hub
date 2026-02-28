import { motion } from "framer-motion";
import { products } from "@/data/products";

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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="glass-panel rounded-md p-4"
    >
      <h3 className="font-display text-xs font-bold tracking-[0.2em] text-foreground mb-4">CATÉGORIES</h3>
      <div className="space-y-2.5">
        {sorted.map((cat, i) => {
          const pct = Math.round((cat.sales / total) * 100);
          return (
            <div key={cat.name} className="flex items-center gap-3 group">
              <div className="w-20 text-xs font-mono text-secondary-foreground truncate group-hover:text-foreground transition-colors">{cat.name}</div>
              <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: 0.5 + i * 0.05 }}
                  className="h-full rounded-full bg-primary/60"
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
