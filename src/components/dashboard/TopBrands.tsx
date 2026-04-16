import { motion } from "framer-motion";
import { Product } from "@/data/products";
import { Skeleton } from "@/components/ui/skeleton";

interface TopBrandsProps {
  products: Product[];
  loading?: boolean;
}

const TopBrands = ({ products, loading }: TopBrandsProps) => {
  if (loading) {
    return (
      <div className="glass-panel-glow p-5 space-y-3">
        <Skeleton className="h-5 w-32" />
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
      </div>
    );
  }

  const brandStats = products.reduce((acc, p) => {
    if (!acc[p.brand]) acc[p.brand] = { recurrences: 0, count: 0 };
    acc[p.brand].recurrences += p.recurrences;
    acc[p.brand].count += 1;
    return acc;
  }, {} as Record<string, { recurrences: number; count: number }>);

  const sorted = Object.entries(brandStats)
    .map(([name, data]) => ({ name, sales: data.recurrences }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 8);

  const maxSales = sorted[0]?.sales || 1;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="glass-panel-glow p-5">
      <h3 className="font-display text-sm font-bold text-foreground mb-4">🏆 Top marques</h3>
      <div className="space-y-3">
        {sorted.map((brand, i) => (
          <div key={brand.name} className="group">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-secondary-foreground font-medium group-hover:text-foreground transition-colors">{brand.name}</span>
              <span className="text-muted-foreground font-mono text-[11px]">{brand.sales.toLocaleString()}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted/40 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(brand.sales / maxSales) * 100}%` }}
                transition={{ duration: 0.7, delay: 0.35 + i * 0.05 }} className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, hsl(174, 90%, 45%), hsl(199, 85%, 50%))`, boxShadow: '0 0 8px hsl(174 90% 45% / 0.3)' }} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TopBrands;
