import KrakkenSidebar from "@/components/dashboard/KrakkenSidebar";
import { motion } from "framer-motion";
import { products } from "@/data/products";
import { useState } from "react";

/* ── data ── */
const dailyData = [
  { day: "LU", v: 3 }, { day: "MA", v: 5 }, { day: "ME", v: 7 },
  { day: "JE", v: 4 }, { day: "VE", v: 9 }, { day: "SA", v: 6 }, { day: "DI", v: 10 },
];
const maxDaily = Math.max(...dailyData.map(d => d.v));
const totalWeek = dailyData.reduce((s, d) => s + d.v, 0);

const catStats = Object.entries(
  products.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = { sales: 0, count: 0 };
    acc[p.category].sales += p.recurrences;
    acc[p.category].count += 1;
    return acc;
  }, {} as Record<string, { sales: number; count: number }>)
).map(([name, d]) => ({ name, ...d })).sort((a, b) => b.sales - a.sales);
const catTotal = catStats.reduce((s, c) => s + c.sales, 0);

const topProducts = [...products].sort((a, b) => b.score - a.score).slice(0, 8);

const Index = () => {
  const [activeProduct, setActiveProduct] = useState<number | null>(null);

  return (
    <div className="min-h-screen abyss-gradient overflow-hidden">
      <KrakkenSidebar />
      <main className="pl-16 xl:pl-56 min-h-screen relative">

        {/* ═══ Noise texture overlay ═══ */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.015] mix-blend-overlay"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E")' }} />

        {/* ═══ HEADER — raw, typographic ═══ */}
        <div className="px-6 lg:px-12 pt-10 pb-0 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="flex items-baseline gap-4 mb-1">
              <span className="text-[10px] font-mono tracking-[0.5em] text-muted-foreground/30 uppercase">
                tableau de bord
              </span>
              <div className="flex-1 h-px" style={{ background: 'hsl(225 20% 10%)' }} />
              <span className="text-[10px] font-mono text-muted-foreground/20">
                05/03/26
              </span>
            </div>

            {/* Giant number as design element */}
            <div className="relative mt-4">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-end gap-6"
              >
                <span className="text-[clamp(5rem,12vw,10rem)] font-mono font-black leading-[0.85] tracking-tighter"
                  style={{
                    color: 'hsl(174 72% 46%)',
                    textShadow: '0 0 80px hsl(174 72% 46% / 0.15)',
                  }}>
                  {totalWeek}
                </span>
                <div className="pb-4">
                  <p className="text-sm font-mono font-bold text-foreground/70 leading-tight">
                    produits
                  </p>
                  <p className="text-sm font-mono text-foreground/70 leading-tight">
                    traqués cette semaine
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-mono font-black" style={{ color: 'hsl(162 68% 50%)' }}>
                      +{Math.round(((dailyData[6].v - dailyData[0].v) / dailyData[0].v) * 100)}%
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground/30">vs semaine dern.</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ═══ SPARK LINE — minimal, inline ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="px-6 lg:px-12 mt-8 relative z-10"
        >
          <div className="flex items-end gap-[3px] h-24">
            {dailyData.map((d, i) => {
              const h = (d.v / maxDaily) * 100;
              const isMax = d.v === maxDaily;
              const isToday = i === dailyData.length - 1;
              return (
                <motion.div
                  key={d.day}
                  className="flex-1 flex flex-col items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                >
                  <span className="text-[10px] font-mono font-black tabular-nums" style={{
                    color: isToday ? 'hsl(174 72% 56%)' : isMax ? 'hsl(262 52% 65%)' : 'hsl(210 10% 30%)',
                  }}>{d.v}</span>
                  <motion.div
                    className="w-full rounded-sm relative overflow-hidden"
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.5 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      background: isToday
                        ? 'linear-gradient(180deg, hsl(174 72% 50%), hsl(174 72% 30%))'
                        : isMax
                        ? 'linear-gradient(180deg, hsl(262 52% 55%), hsl(262 52% 35%))'
                        : 'hsl(225 18% 11%)',
                      boxShadow: isToday
                        ? '0 0 20px hsl(174 72% 46% / 0.3)'
                        : isMax
                        ? '0 0 20px hsl(262 52% 58% / 0.2)'
                        : 'none',
                    }}
                  >
                    {(isToday || isMax) && (
                      <div className="absolute inset-0 opacity-30" style={{
                        background: `linear-gradient(180deg, transparent 60%, ${isToday ? 'hsl(174 90% 70%)' : 'hsl(262 70% 70%)'})`,
                      }} />
                    )}
                  </motion.div>
                  <span className="text-[8px] font-mono tracking-widest uppercase" style={{
                    color: isToday ? 'hsl(174 72% 50%)' : 'hsl(210 10% 22%)',
                  }}>{d.day}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ═══ CATEGORIES — treemap-style blocks ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="px-6 lg:px-12 mt-14 relative z-10"
        >
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-[10px] font-mono tracking-[0.5em] text-muted-foreground/30 uppercase">
              territoires
            </span>
            <div className="flex-1 h-px" style={{ background: 'hsl(225 20% 10%)' }} />
          </div>

          {/* Treemap grid — asymmetric, data-driven sizing */}
          <div className="grid grid-cols-12 gap-1 auto-rows-[60px]">
            {catStats.map((cat, i) => {
              const pct = Math.round((cat.sales / catTotal) * 100);
              // First 3 categories get more space
              const colSpan = i === 0 ? 5 : i === 1 ? 4 : i === 2 ? 3 : pct > 8 ? 4 : 3;
              const rowSpan = i < 2 ? 2 : 1;
              const hues = [
                "174 72% 46%", "262 52% 58%", "188 78% 52%", "38 92% 56%",
                "162 68% 44%", "348 72% 56%", "310 55% 50%", "200 65% 55%", "38 72% 50%",
              ];
              const hue = hues[i % hues.length];

              return (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.55 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  className="relative rounded-lg overflow-hidden cursor-pointer group"
                  style={{
                    gridColumn: `span ${colSpan}`,
                    gridRow: `span ${rowSpan}`,
                    background: `hsl(${hue} / 0.06)`,
                    border: `1px solid hsl(${hue} / 0.1)`,
                  }}
                >
                  {/* Hover fill */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
                    style={{
                      background: `linear-gradient(135deg, hsl(${hue} / 0.12), hsl(${hue} / 0.04))`,
                      boxShadow: `inset 0 0 40px hsl(${hue} / 0.05)`,
                    }} />

                  {/* Content */}
                  <div className="relative z-10 h-full p-3 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider transition-colors duration-300"
                        style={{ color: `hsl(${hue} / 0.7)` }}>
                        {cat.name}
                      </span>
                      <span className="text-[22px] font-mono font-black leading-none transition-all duration-300 group-hover:scale-110"
                        style={{
                          color: `hsl(${hue})`,
                          textShadow: `0 0 20px hsl(${hue} / 0.3)`,
                        }}>
                        {pct}
                      </span>
                    </div>
                    {rowSpan > 1 && (
                      <div className="flex items-end justify-between">
                        <span className="text-[9px] font-mono text-muted-foreground/30">
                          {cat.count} réf.
                        </span>
                        <span className="text-[9px] font-mono text-muted-foreground/30">
                          {cat.sales.toLocaleString("fr-FR")} v.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Corner accent */}
                  <div className="absolute bottom-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 100% 100%, hsl(${hue} / 0.2), transparent 70%)`,
                    }} />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ═══ TOP PRODUCTS — dense data table ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="px-6 lg:px-12 mt-14 pb-20 relative z-10"
        >
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-[10px] font-mono tracking-[0.5em] text-muted-foreground/30 uppercase">
              prises majeures
            </span>
            <div className="flex-1 h-px" style={{ background: 'hsl(225 20% 10%)' }} />
            <span className="text-[10px] font-mono text-muted-foreground/20">
              {topProducts.length} résultats
            </span>
          </div>

          {/* Table-like product list */}
          <div className="space-y-px">
            {/* Header */}
            <div className="grid grid-cols-[2rem_1fr_5rem_4rem_5rem_3rem] lg:grid-cols-[2rem_1fr_6rem_5rem_6rem_4rem] gap-3 px-4 py-2">
              <span className="text-[8px] font-mono uppercase tracking-widest text-muted-foreground/20">#</span>
              <span className="text-[8px] font-mono uppercase tracking-widest text-muted-foreground/20">Produit</span>
              <span className="text-[8px] font-mono uppercase tracking-widest text-muted-foreground/20 text-right">Prix</span>
              <span className="text-[8px] font-mono uppercase tracking-widest text-muted-foreground/20 text-right">Sellers</span>
              <span className="text-[8px] font-mono uppercase tracking-widest text-muted-foreground/20 text-right">Vélocité</span>
              <span className="text-[8px] font-mono uppercase tracking-widest text-muted-foreground/20 text-right">Score</span>
            </div>

            {topProducts.map((p, i) => {
              const isActive = activeProduct === p.id;
              const scoreColor = p.score >= 90 ? "162 68% 50%" : p.score >= 80 ? "174 72% 50%" : "210 10% 45%";

              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.75 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setActiveProduct(isActive ? null : p.id)}
                  className="group cursor-pointer relative"
                >
                  <div
                    className="grid grid-cols-[2rem_1fr_5rem_4rem_5rem_3rem] lg:grid-cols-[2rem_1fr_6rem_5rem_6rem_4rem] gap-3 px-4 py-3 rounded-lg transition-all duration-200"
                    style={{
                      background: isActive ? 'hsl(225 22% 8%)' : 'transparent',
                      borderLeft: isActive ? `2px solid hsl(${scoreColor})` : '2px solid transparent',
                    }}
                  >
                    {/* Rank */}
                    <span className="text-sm font-mono font-black tabular-nums" style={{
                      color: i === 0 ? 'hsl(38 92% 56%)' : i < 3 ? 'hsl(174 72% 50%)' : 'hsl(210 10% 25%)',
                      textShadow: i === 0 ? '0 0 12px hsl(38 92% 56% / 0.4)' : 'none',
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    {/* Product info */}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground/80 group-hover:text-foreground transition-colors truncate leading-tight">
                        {p.name}
                      </p>
                      <p className="text-[9px] font-mono text-muted-foreground/30 uppercase tracking-wider mt-0.5">
                        {p.brand} / {p.category}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <span className="text-xs font-mono font-black text-foreground/80 tabular-nums">
                        {p.price}€
                      </span>
                      {p.originalPrice > p.price && (
                        <p className="text-[9px] font-mono text-muted-foreground/25 line-through tabular-nums">
                          {p.originalPrice}€
                        </p>
                      )}
                    </div>

                    {/* Sellers */}
                    <span className="text-xs font-mono text-muted-foreground/50 text-right tabular-nums self-center">
                      {p.sellers}
                    </span>

                    {/* Velocity */}
                    <span className="text-xs font-mono font-bold text-right tabular-nums self-center" style={{
                      color: `hsl(${scoreColor} / 0.8)`,
                    }}>
                      {p.recurrences.toLocaleString("fr-FR")}
                    </span>

                    {/* Score */}
                    <div className="flex items-center justify-end self-center">
                      <span className="text-xs font-mono font-black tabular-nums px-1.5 py-0.5 rounded" style={{
                        color: `hsl(${scoreColor})`,
                        background: `hsl(${scoreColor} / 0.1)`,
                        textShadow: `0 0 8px hsl(${scoreColor} / 0.3)`,
                      }}>
                        {p.score}
                      </span>
                    </div>
                  </div>

                  {/* Expanded detail on click */}
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-1 ml-8 flex items-center gap-6">
                        <img src={p.image} alt={p.name}
                          className="w-14 h-14 rounded-md object-cover"
                          style={{ filter: 'brightness(0.8) saturate(0.9)' }} />
                        <div className="flex gap-8">
                          <div>
                            <p className="text-[8px] font-mono text-muted-foreground/25 uppercase tracking-widest">Marge pot.</p>
                            <p className="text-sm font-mono font-black" style={{ color: 'hsl(162 68% 50%)' }}>
                              {Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-[8px] font-mono text-muted-foreground/25 uppercase tracking-widest">Rating</p>
                            <p className="text-sm font-mono font-black text-foreground/70">
                              {p.rating}/5
                            </p>
                          </div>
                          <div>
                            <p className="text-[8px] font-mono text-muted-foreground/25 uppercase tracking-widest">Économie</p>
                            <p className="text-sm font-mono font-black" style={{ color: 'hsl(38 92% 56%)' }}>
                              -{p.originalPrice - p.price}€
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Hover line */}
                  <div className="absolute bottom-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'hsl(225 20% 12%)' }} />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

      </main>
    </div>
  );
};

export default Index;
