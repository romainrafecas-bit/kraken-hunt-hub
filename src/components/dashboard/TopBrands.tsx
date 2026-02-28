import { motion } from "framer-motion";
import { products } from "@/data/products";

const TopBrands = () => {
  const brandStats = products.reduce((acc, p) => {
    if (!acc[p.brand]) acc[p.brand] = { sales: 0, count: 0, avgScore: 0 };
    acc[p.brand].sales += p.sales;
    acc[p.brand].count += 1;
    acc[p.brand].avgScore += p.score;
    return acc;
  }, {} as Record<string, { sales: number; count: number; avgScore: number }>);

  const sorted = Object.entries(brandStats)
    .map(([name, data]) => ({ name, sales: data.sales, count: data.count, avgScore: Math.round(data.avgScore / data.count) }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 8);

  const maxSales = sorted[0]?.sales || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="glass-panel rounded-md p-4"
    >
      <h3 className="font-display text-xs font-bold tracking-[0.2em] text-foreground mb-4">TOP MARQUES</h3>
      <div className="space-y-3">
        {sorted.map((brand, i) => (
          <div key={brand.name} className="group">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-mono text-secondary-foreground group-hover:text-foreground transition-colors">{brand.name}</span>
              <span className="font-mono text-muted-foreground">{brand.sales.toLocaleString()}</span>
            </div>
            <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(brand.sales / maxSales) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.06 }}
                className="h-full rounded-full bg-gradient-to-r from-primary/80 to-accent/60"
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TopBrands;
