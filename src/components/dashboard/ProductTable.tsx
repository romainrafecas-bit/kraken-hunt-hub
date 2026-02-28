import { motion } from "framer-motion";
import { ExternalLink, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const products = [
  { rank: 1, name: "Samsung Galaxy S24 Ultra 256Go", category: "Smartphones", price: "899€", sales: "12,847", trend: "up" as const, score: 98 },
  { rank: 2, name: "Dyson V15 Detect Absolute", category: "Aspirateurs", price: "549€", sales: "9,234", trend: "up" as const, score: 95 },
  { rank: 3, name: "PlayStation 5 Slim Digital", category: "Gaming", price: "399€", sales: "8,102", trend: "down" as const, score: 92 },
  { rank: 4, name: "Apple AirPods Pro 2", category: "Audio", price: "229€", sales: "7,891", trend: "up" as const, score: 90 },
  { rank: 5, name: "Ninja Foodi MAX 9-en-1", category: "Cuisine", price: "179€", sales: "6,543", trend: "neutral" as const, score: 87 },
  { rank: 6, name: "LEGO Technic Ferrari Daytona", category: "Jouets", price: "349€", sales: "5,210", trend: "up" as const, score: 85 },
  { rank: 7, name: "iRobot Roomba j7+", category: "Maison", price: "599€", sales: "4,890", trend: "down" as const, score: 82 },
];

const TrendIcon = ({ trend }: { trend: "up" | "down" | "neutral" }) => {
  if (trend === "up") return <TrendingUp className="w-4 h-4 text-accent" />;
  if (trend === "down") return <TrendingDown className="w-4 h-4 text-destructive" />;
  return <Minus className="w-4 h-4 text-muted-foreground" />;
};

const ProductTable = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card rounded-xl overflow-hidden"
    >
      <div className="p-5 border-b border-border/50 flex items-center justify-between">
        <div>
          <h3 className="font-display text-sm font-semibold tracking-wide text-foreground">TOP PRODUITS CHASSÉS</h3>
          <p className="text-xs text-muted-foreground mt-1">Mis à jour il y a 3 minutes</p>
        </div>
        <button className="text-xs text-primary hover:text-primary/80 transition-colors font-medium flex items-center gap-1">
          Voir tout <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">#</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Produit</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Catégorie</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Prix</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Ventes</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Trend</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Score</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => (
              <motion.tr
                key={product.rank}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="border-b border-border/20 hover:bg-secondary/30 transition-colors cursor-pointer group"
              >
                <td className="px-5 py-4">
                  <span className={cn(
                    "font-display text-sm font-bold",
                    product.rank <= 3 ? "text-primary glow-text" : "text-muted-foreground"
                  )}>
                    {String(product.rank).padStart(2, '0')}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-foreground group-hover:text-primary transition-colors">{product.name}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">{product.category}</span>
                </td>
                <td className="px-5 py-4 text-sm font-medium text-foreground">{product.price}</td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{product.sales}</td>
                <td className="px-5 py-4"><TrendIcon trend={product.trend} /></td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${product.score}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-primary">{product.score}</span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ProductTable;
