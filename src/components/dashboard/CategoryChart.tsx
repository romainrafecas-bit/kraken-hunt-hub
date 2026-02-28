import { motion } from "framer-motion";

const categories = [
  { name: "Smartphones", percentage: 32, count: "4,102" },
  { name: "Maison", percentage: 24, count: "3,078" },
  { name: "Gaming", percentage: 18, count: "2,306" },
  { name: "Audio", percentage: 14, count: "1,793" },
  { name: "Cuisine", percentage: 12, count: "1,537" },
];

const CategoryChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card rounded-xl p-5"
    >
      <h3 className="font-display text-sm font-semibold tracking-wide text-foreground mb-4">CATÉGORIES</h3>

      <div className="space-y-3">
        {categories.map((cat, i) => (
          <div key={cat.name} className="group">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-secondary-foreground group-hover:text-foreground transition-colors">{cat.name}</span>
              <span className="text-xs text-muted-foreground">{cat.count}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${cat.percentage}%` }}
                transition={{ duration: 1, delay: 0.6 + i * 0.1, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CategoryChart;
