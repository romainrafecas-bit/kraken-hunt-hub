import { motion } from "framer-motion";
import { products } from "@/data/products";

const catIcons: Record<string, string> = {
  "Électroménager": "⚡",
  "TV & Son": "🔊",
  "Smartphones": "📱",
  "Gaming": "🎮",
  "Informatique": "💻",
  "Jouets": "🧸",
  "Mode": "👟",
  "Maison": "🏠",
  "Beauté": "✨",
  "Sport": "🏋️",
  "Auto": "🚗",
};

const catColors = [
  { bar: "hsl(174, 72%, 46%)", glow: "hsl(174 72% 46% / 0.35)", bg: "hsl(174 72% 46% / 0.08)", border: "hsl(174 72% 46% / 0.15)" },
  { bar: "hsl(262, 52%, 58%)", glow: "hsl(262 52% 58% / 0.35)", bg: "hsl(262 52% 58% / 0.08)", border: "hsl(262 52% 58% / 0.15)" },
  { bar: "hsl(188, 78%, 52%)", glow: "hsl(188 78% 52% / 0.35)", bg: "hsl(188 78% 52% / 0.08)", border: "hsl(188 78% 52% / 0.15)" },
  { bar: "hsl(38, 92%, 56%)", glow: "hsl(38 92% 56% / 0.35)", bg: "hsl(38 92% 56% / 0.08)", border: "hsl(38 92% 56% / 0.15)" },
  { bar: "hsl(162, 68%, 44%)", glow: "hsl(162 68% 44% / 0.35)", bg: "hsl(162 68% 44% / 0.08)", border: "hsl(162 68% 44% / 0.15)" },
  { bar: "hsl(348, 72%, 56%)", glow: "hsl(348 72% 56% / 0.35)", bg: "hsl(348 72% 56% / 0.08)", border: "hsl(348 72% 56% / 0.15)" },
  { bar: "hsl(310, 55%, 50%)", glow: "hsl(310 55% 50% / 0.35)", bg: "hsl(310 55% 50% / 0.08)", border: "hsl(310 55% 50% / 0.15)" },
  { bar: "hsl(200, 65%, 55%)", glow: "hsl(200 65% 55% / 0.35)", bg: "hsl(200 65% 55% / 0.08)", border: "hsl(200 65% 55% / 0.15)" },
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
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px tentacle-line" />
      <div className="absolute -bottom-20 -right-20 w-60 h-60 pointer-events-none" style={{
        background: 'radial-gradient(circle, hsl(188 78% 52% / 0.04), transparent 60%)',
      }} />
      <div className="absolute -top-10 -left-10 w-40 h-40 pointer-events-none" style={{
        background: 'radial-gradient(circle, hsl(174 72% 46% / 0.03), transparent 60%)',
      }} />

      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
          <span style={{ filter: 'drop-shadow(0 0 4px hsl(188 78% 52% / 0.4))' }}>🌊</span>
          Zones de chasse
        </h3>
        <span className="bio-badge bio-cyan text-[10px]">{sorted.length} zones</span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {sorted.map((cat, i) => {
          const pct = Math.round((cat.sales / total) * 100);
          const c = catColors[i % catColors.length];
          const icon = catIcons[cat.name] || "📦";

          return (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
              className="relative p-3 rounded-xl cursor-pointer group transition-all duration-300"
              style={{
                background: c.bg,
                border: `1px solid ${c.border}`,
              }}
              whileHover={{
                scale: 1.02,
                borderColor: c.bar,
                boxShadow: `0 0 20px -4px ${c.glow}`,
              }}
            >
              {/* Inner glow on hover */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
                background: `radial-gradient(ellipse at 50% 0%, ${c.glow.replace('0.35', '0.08')}, transparent 70%)`,
              }} />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm" style={{ filter: `drop-shadow(0 0 3px ${c.glow})` }}>{icon}</span>
                    <span className="text-xs font-bold truncate" style={{ color: c.bar }}>{cat.name}</span>
                  </div>
                  <span className="text-[10px] font-mono font-black" style={{
                    color: c.bar,
                    textShadow: `0 0 8px ${c.glow}`,
                  }}>{pct}%</span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: 'hsl(225 18% 10%)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.05, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: c.bar,
                      boxShadow: `0 0 10px ${c.glow}`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">{cat.count} produit{cat.count > 1 ? "s" : ""}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{cat.sales.toLocaleString("fr-FR")} ventes</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CategoryBreakdown;
