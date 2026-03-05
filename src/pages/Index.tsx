import KrakkenSidebar from "@/components/dashboard/KrakkenSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/data/products";
import { useState } from "react";
import krakkenLogo from "@/assets/krakken-logo.png";

/* ── data ── */
const dailyData = [
  { day: "Lun", v: 3 }, { day: "Mar", v: 5 }, { day: "Mer", v: 7 },
  { day: "Jeu", v: 4 }, { day: "Ven", v: 9 }, { day: "Sam", v: 6 }, { day: "Dim", v: 10 },
];
const maxDaily = Math.max(...dailyData.map(d => d.v));

const catIcons: Record<string, string> = {
  "Électroménager": "⚡", "TV & Son": "🔊", "Smartphones": "📱",
  "Gaming": "🎮", "Informatique": "💻", "Jouets": "🧸",
  "Mode": "👟", "Maison": "🏠", "Beauté": "✨",
};

const catHues = [
  "174 72% 46%", "262 52% 58%", "188 78% 52%", "38 92% 56%",
  "162 68% 44%", "348 72% 56%", "310 55% 50%", "200 65% 55%", "38 72% 50%",
];

const catStats = Object.entries(
  products.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = { sales: 0, count: 0 };
    acc[p.category].sales += p.recurrences;
    acc[p.category].count += 1;
    return acc;
  }, {} as Record<string, { sales: number; count: number }>)
).map(([name, d]) => ({ name, ...d })).sort((a, b) => b.sales - a.sales);
const catTotal = catStats.reduce((s, c) => s + c.sales, 0);

const topProducts = [...products].sort((a, b) => b.score - a.score).slice(0, 6);

const Index = () => {
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  return (
    <div className="min-h-screen abyss-gradient overflow-hidden">
      <KrakkenSidebar />
      <main className="pl-16 xl:pl-56 min-h-screen relative">

        {/* ═══ Ambient background glow ═══ */}
        <div className="fixed inset-0 pointer-events-none" style={{
          background: `
            radial-gradient(ellipse 600px 400px at 70% 30%, hsl(174 72% 46% / 0.03), transparent),
            radial-gradient(ellipse 500px 500px at 30% 70%, hsl(262 52% 58% / 0.025), transparent)
          `,
        }} />

        {/* ═══ TOP BAR — minimal ═══ */}
        <div className="px-6 lg:px-10 pt-8 pb-2 relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] font-mono uppercase tracking-[0.4em] text-muted-foreground/60 mb-3"
              >
                05.03.2026 — session active
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-[clamp(2.5rem,5vw,4.5rem)] font-display font-black leading-[0.9] tracking-tight"
              >
                <span className="text-foreground">Vos</span>
                <br />
                <span className="kraken-title">profondeurs</span>
              </motion.h1>
            </div>

            {/* Live indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2 mt-2"
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{
                backgroundColor: 'hsl(162 68% 44%)',
                boxShadow: '0 0 8px hsl(162 68% 44% / 0.6)',
                animation: 'bioluminescence 2s ease-in-out infinite',
              }} />
              <span className="text-[10px] font-mono text-muted-foreground/50">LIVE</span>
            </motion.div>
          </div>
        </div>

        {/* ═══ DAILY ACTIVITY — horizontal rhythm bars ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="px-6 lg:px-10 mt-10 relative z-10"
        >
          <div className="flex items-end gap-1 lg:gap-2">
            <div className="mr-4 pb-2">
              <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-muted-foreground/40 mb-1">
                Cette semaine
              </p>
              <p className="text-3xl font-display font-black tabular-nums" style={{
                color: 'hsl(174 72% 56%)',
                textShadow: '0 0 30px hsl(174 72% 46% / 0.4)',
              }}>
                {dailyData.reduce((s, d) => s + d.v, 0)}
              </p>
              <p className="text-[10px] text-muted-foreground/50 mt-0.5">produits scannés</p>
            </div>

            {dailyData.map((d, i) => {
              const h = (d.v / maxDaily) * 120;
              const isToday = i === dailyData.length - 1;
              return (
                <motion.div
                  key={d.day}
                  className="flex-1 flex flex-col items-center gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="text-[10px] font-mono font-bold tabular-nums" style={{
                    color: isToday ? 'hsl(174 72% 56%)' : 'hsl(210 10% 30%)',
                  }}>{d.v}</span>
                  <motion.div
                    className="w-full rounded-t-md relative overflow-hidden cursor-pointer group"
                    style={{
                      height: `${h}px`,
                      background: isToday
                        ? 'linear-gradient(180deg, hsl(174 72% 50%), hsl(174 72% 30%))'
                        : 'linear-gradient(180deg, hsl(225 20% 18%), hsl(225 20% 10%))',
                      boxShadow: isToday ? '0 0 24px -4px hsl(174 72% 46% / 0.4)' : 'none',
                    }}
                    whileHover={{ 
                      filter: 'brightness(1.3)',
                      boxShadow: '0 0 20px -4px hsl(174 72% 46% / 0.3)',
                    }}
                  >
                    {isToday && (
                      <div className="absolute inset-0" style={{
                        background: 'linear-gradient(180deg, hsl(174 72% 70% / 0.2), transparent)',
                      }} />
                    )}
                  </motion.div>
                  <span className="text-[9px] font-mono uppercase" style={{
                    color: isToday ? 'hsl(174 72% 56%)' : 'hsl(210 10% 25%)',
                  }}>{d.day}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ═══ DIVIDER ═══ */}
        <div className="px-6 lg:px-10 my-8">
          <div className="tentacle-line" />
        </div>

        {/* ═══ CATEGORIES — stacked horizontal bars ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="px-6 lg:px-10 relative z-10"
        >
          <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-muted-foreground/40 mb-6">
            Répartition par zone
          </p>

          <div className="space-y-[3px]">
            {catStats.map((cat, i) => {
              const pct = Math.round((cat.sales / catTotal) * 100);
              const hue = catHues[i % catHues.length];
              const icon = catIcons[cat.name] || "📦";
              const isHovered = hoveredCat === cat.name;

              return (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={() => setHoveredCat(cat.name)}
                  onMouseLeave={() => setHoveredCat(null)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  {/* Label */}
                  <div className="w-32 flex-shrink-0 flex items-center gap-2 overflow-hidden">
                    <span className="text-xs">{icon}</span>
                    <span className="text-[11px] font-medium truncate transition-colors duration-200" style={{
                      color: isHovered ? `hsl(${hue})` : 'hsl(210 10% 45%)',
                    }}>{cat.name}</span>
                  </div>

                  {/* Bar */}
                  <div className="flex-1 h-7 rounded-sm overflow-hidden relative" style={{
                    background: 'hsl(225 20% 7%)',
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.5 + i * 0.04, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-sm relative overflow-hidden"
                      style={{
                        background: `linear-gradient(90deg, hsl(${hue} / 0.6), hsl(${hue} / 0.25))`,
                        boxShadow: isHovered ? `0 0 20px -4px hsl(${hue} / 0.4)` : 'none',
                        transition: 'box-shadow 0.3s',
                      }}
                    >
                      {/* Shimmer on hover */}
                      {isHovered && (
                        <motion.div
                          className="absolute inset-0"
                          initial={{ x: '-100%' }}
                          animate={{ x: '200%' }}
                          transition={{ duration: 1, ease: "easeInOut" }}
                          style={{
                            background: `linear-gradient(90deg, transparent, hsl(${hue} / 0.3), transparent)`,
                            width: '50%',
                          }}
                        />
                      )}
                    </motion.div>
                  </div>

                  {/* Values */}
                  <div className="w-20 flex-shrink-0 flex items-center justify-end gap-3">
                    <span className="text-[11px] font-mono font-black tabular-nums" style={{
                      color: `hsl(${hue})`,
                      textShadow: isHovered ? `0 0 10px hsl(${hue} / 0.5)` : 'none',
                      transition: 'text-shadow 0.3s',
                    }}>{pct}%</span>
                    <span className="text-[9px] font-mono text-muted-foreground/40 tabular-nums w-6 text-right">
                      {cat.count}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ═══ DIVIDER ═══ */}
        <div className="px-6 lg:px-10 my-8">
          <div className="tentacle-line" />
        </div>

        {/* ═══ TOP PRODUCTS — editorial cards ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="px-6 lg:px-10 pb-16 relative z-10"
        >
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-muted-foreground/40 mb-2">
                Meilleures prises
              </p>
              <p className="text-xl font-display font-black text-foreground">
                Top produits
              </p>
            </div>
            <p className="text-[10px] font-mono text-muted-foreground/40">
              triés par score de vélocité
            </p>
          </div>

          {/* Product grid — 2 rows of 3, editorial style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topProducts.map((p, i) => {
              const isHovered = hoveredProduct === p.id;
              const scoreColor = p.score >= 90
                ? "162 72% 52%"
                : p.score >= 80
                ? "174 72% 56%"
                : "210 10% 50%";
              const isFirst = i === 0;

              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={() => setHoveredProduct(p.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  className="group cursor-pointer relative"
                >
                  <motion.div
                    className="relative rounded-2xl overflow-hidden"
                    style={{
                      background: 'hsl(225 25% 7%)',
                      border: isHovered
                        ? `1px solid hsl(${scoreColor} / 0.3)`
                        : '1px solid hsl(225 20% 10%)',
                      boxShadow: isHovered
                        ? `0 8px 40px -12px hsl(${scoreColor} / 0.2), 0 0 0 1px hsl(${scoreColor} / 0.1)`
                        : '0 2px 20px -8px hsl(228 50% 2% / 0.5)',
                      transition: 'border-color 0.3s, box-shadow 0.3s',
                    }}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Image band */}
                    <div className="h-28 relative overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        style={{ filter: 'brightness(0.7) saturate(0.8)' }}
                      />
                      <div className="absolute inset-0" style={{
                        background: 'linear-gradient(180deg, transparent 30%, hsl(225 25% 7%) 100%)',
                      }} />

                      {/* Rank badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black font-display" style={{
                          background: isFirst ? 'hsl(38 92% 56%)' : 'hsl(225 20% 12% / 0.8)',
                          color: isFirst ? 'hsl(228 42% 5%)' : 'hsl(210 10% 50%)',
                          boxShadow: isFirst ? '0 0 16px hsl(38 92% 56% / 0.4)' : 'none',
                          backdropFilter: 'blur(8px)',
                        }}>
                          {i + 1}
                        </span>
                      </div>

                      {/* Score — top right */}
                      <div className="absolute top-3 right-3">
                        <span className="text-xs font-black font-mono px-2 py-0.5 rounded-md" style={{
                          background: `hsl(${scoreColor} / 0.15)`,
                          color: `hsl(${scoreColor})`,
                          textShadow: `0 0 10px hsl(${scoreColor} / 0.4)`,
                          backdropFilter: 'blur(8px)',
                          border: `1px solid hsl(${scoreColor} / 0.2)`,
                        }}>
                          {p.score}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 pt-2">
                      <p className="text-[10px] text-muted-foreground/50 font-mono uppercase tracking-wider mb-1">
                        {p.brand} — {p.category}
                      </p>
                      <p className="text-sm font-semibold text-foreground/90 leading-tight group-hover:text-foreground transition-colors line-clamp-2 min-h-[2.5rem]">
                        {p.name}
                      </p>

                      <div className="flex items-end justify-between mt-3 pt-3" style={{
                        borderTop: '1px solid hsl(225 20% 10%)',
                      }}>
                        <div>
                          <p className="text-[9px] text-muted-foreground/40 uppercase tracking-wider">Prix</p>
                          <p className="text-lg font-black font-mono text-foreground leading-none mt-0.5">
                            {p.price}<span className="text-xs text-muted-foreground">€</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-muted-foreground/40 uppercase tracking-wider">Vendeurs</p>
                          <p className="text-sm font-bold font-mono text-muted-foreground leading-none mt-0.5">
                            {p.sellers}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-muted-foreground/40 uppercase tracking-wider">Vélocité</p>
                          <p className="text-sm font-bold font-mono leading-none mt-0.5" style={{
                            color: `hsl(${scoreColor})`,
                          }}>
                            {p.recurrences.toLocaleString("fr-FR")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ═══ Floating Kraken watermark ═══ */}
        <motion.img
          src={krakkenLogo}
          alt=""
          className="fixed bottom-6 right-6 w-12 h-12 opacity-[0.04] pointer-events-none select-none"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </main>
    </div>
  );
};

export default Index;
