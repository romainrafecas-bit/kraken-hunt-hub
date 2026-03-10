import KrakkenSidebar from "@/components/dashboard/KrakkenSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/data/products";
import { useState, useMemo, useRef } from "react";
import krakkenLogo from "@/assets/krakken-logo.png";

/* ── data ── */
const dailyData = [
  { day: "Lun", v: 3 }, { day: "Mar", v: 5 }, { day: "Mer", v: 7 },
  { day: "Jeu", v: 4 }, { day: "Ven", v: 9 }, { day: "Sam", v: 6 }, { day: "Dim", v: 10 },
];
const maxDaily = Math.max(...dailyData.map(d => d.v));



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

        {/* ═══ TOP BAR — with Kraken + stats ═══ */}
        <div className="px-6 lg:px-10 pt-8 pb-2 relative z-10">
          <div className="flex items-center justify-between">
            {/* Left: logo + title + badges */}
            <div className="flex items-center gap-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex-shrink-0"
              >
                <img src={krakkenLogo} alt="Krakken" className="w-14 h-14"
                  style={{ filter: 'drop-shadow(0 0 12px hsl(174 72% 46% / 0.3))' }} />
              </motion.div>

              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="text-xl lg:text-2xl font-display font-black leading-tight tracking-tight"
                >
                  <span className="kraken-title">Tableau de bord</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-[11px] font-display text-muted-foreground/50 mt-0.5"
                >
                  Analyse des profondeurs de <span style={{ color: 'hsl(162 68% 52%)' }} className="font-bold">Cdiscount</span>
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2 mt-2"
                >
                  {[
                    { label: `${products.length} produits`, hue: '174 72% 46%' },
                    { label: `${catStats.length} catégories`, hue: '262 52% 58%' },
                    { label: `${new Set(products.map(p => p.brand)).size} marques`, hue: '188 78% 52%' },
                  ].map((tag) => (
                    <span key={tag.label} className="text-[10px] font-display font-bold px-2.5 py-1 rounded-full"
                      style={{
                        color: `hsl(${tag.hue})`,
                        background: `hsl(${tag.hue} / 0.1)`,
                        border: `1px solid hsl(${tag.hue} / 0.2)`,
                      }}>
                      {tag.label}
                    </span>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Right: cumulative stats panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="hidden md:flex items-stretch gap-px rounded-xl overflow-hidden"
              style={{ border: '1px solid hsl(225 20% 12%)' }}
            >
              <div className="px-5 py-3 text-center" style={{ background: 'hsl(225 25% 7%)' }}>
                <p className="text-[8px] font-display uppercase tracking-[0.2em] text-muted-foreground/35 mb-1">Traqués</p>
                <p className="text-xl font-display font-black tabular-nums" style={{
                  color: 'hsl(174 72% 56%)',
                  textShadow: '0 0 16px hsl(174 72% 46% / 0.3)',
                }}>
                  {products.reduce((s, p) => s + p.recurrences, 0).toLocaleString("fr-FR")}
                </p>
              </div>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{
                backgroundColor: 'hsl(162 68% 44%)',
                boxShadow: '0 0 8px hsl(162 68% 44% / 0.6)',
                animation: 'bioluminescence 2s ease-in-out infinite',
              }} />
            </motion.div>
          </div>
        </div>

        {/* ═══ DAILY ACTIVITY — smooth area curve ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="px-6 lg:px-10 mt-10 relative z-10"
        >
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-[9px] font-display uppercase tracking-[0.3em] text-muted-foreground/70 mb-1">
                Ce mois-ci
              </p>
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-display font-black tabular-nums" style={{
                  color: 'hsl(174 72% 56%)',
                  textShadow: '0 0 30px hsl(174 72% 46% / 0.4)',
                }}>
                  {dailyData.reduce((s, d) => s + d.v, 0)}
                </p>
                <p className="text-[10px] font-display text-muted-foreground/70">produits scannés</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-display font-bold" style={{ color: 'hsl(162 68% 52%)' }}>
                +{Math.round(((dailyData[6].v - dailyData[0].v) / dailyData[0].v) * 100)}%
              </span>
              <span className="text-[9px] font-display text-muted-foreground/60">vs lun.</span>
            </div>
          </div>

          {/* SVG smooth curve */}
          {(() => {
            const W = 700, H = 140, padX = 30, padY = 24;
            const chartW = W - padX * 2;
            const chartH = H - padY * 2;
            const pts = dailyData.map((d, i) => ({
              x: padX + (i / (dailyData.length - 1)) * chartW,
              y: padY + chartH - (d.v / maxDaily) * chartH,
            }));

            // Catmull-Rom → cubic bezier smooth path
            let path = `M ${pts[0].x} ${pts[0].y}`;
            for (let i = 0; i < pts.length - 1; i++) {
              const p0 = pts[Math.max(0, i - 1)];
              const p1 = pts[i];
              const p2 = pts[i + 1];
              const p3 = pts[Math.min(pts.length - 1, i + 2)];
              const cp1x = p1.x + (p2.x - p0.x) / 5;
              const cp1y = p1.y + (p2.y - p0.y) / 5;
              const cp2x = p2.x - (p3.x - p1.x) / 5;
              const cp2y = p2.y - (p3.y - p1.y) / 5;
              path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
            }
            const areaPath = path + ` L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`;

            return (
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
                <defs>
                  <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(174 72% 50%)" stopOpacity="0.25" />
                    <stop offset="50%" stopColor="hsl(188 78% 52%)" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="hsl(228 42% 5%)" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(162 68% 50%)" />
                    <stop offset="40%" stopColor="hsl(174 72% 55%)" />
                    <stop offset="70%" stopColor="hsl(188 78% 58%)" />
                    <stop offset="100%" stopColor="hsl(262 52% 65%)" />
                  </linearGradient>
                  <filter id="lineGlow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Horizontal grid lines */}
                {[0.25, 0.5, 0.75].map((frac) => {
                  const y = padY + chartH - frac * chartH;
                  return (
                    <line key={frac} x1={padX} y1={y} x2={W - padX} y2={y}
                      stroke="hsl(225 18% 14%)" strokeWidth="0.5" strokeDasharray="4 4" />
                  );
                })}

                {/* Area fill */}
                <motion.path
                  d={areaPath}
                  fill="url(#areaFill)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />

                {/* Glow line (behind) */}
                <motion.path
                  d={path}
                  fill="none"
                  stroke="hsl(174 72% 50%)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.15"
                  filter="url(#lineGlow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Main line */}
                <motion.path
                  d={path}
                  fill="none"
                  stroke="url(#lineStroke)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Dots + labels */}
                {pts.map((pt, i) => {
                  const isToday = i === dailyData.length - 1;
                  return (
                    <g key={i}>
                      <motion.circle
                        cx={pt.x} cy={pt.y} r={isToday ? 5.5 : 3.5}
                        fill={isToday ? "hsl(174 72% 55%)" : "hsl(225 25% 10%)"}
                        stroke={isToday ? "hsl(174 72% 40%)" : "hsl(188 60% 45%)"}
                        strokeWidth={isToday ? 2.5 : 1.5}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.07, type: "spring", stiffness: 300 }}
                        style={{ filter: isToday ? 'drop-shadow(0 0 8px hsl(174 72% 50% / 0.6))' : 'none' }}
                      />
                      {isToday && (
                        <circle cx={pt.x} cy={pt.y} r="10" fill="none"
                          stroke="hsl(174 72% 50%)" strokeWidth="0.8" opacity="0.3">
                          <animate attributeName="r" values="8;16;8" dur="2.5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.3;0;0.3" dur="2.5s" repeatCount="indefinite" />
                        </circle>
                      )}
                      <text x={pt.x} y={pt.y - 10} textAnchor="middle"
                        className="text-[10px] font-display font-bold"
                        fill={isToday ? "hsl(174 72% 60%)" : "hsl(210 10% 50%)"}>
                        {dailyData[i].v}
                      </text>
                      <text x={pt.x} y={H - 4} textAnchor="middle"
                        className="text-[9px] font-display font-semibold"
                        fill={isToday ? "hsl(174 72% 55%)" : "hsl(210 10% 42%)"}>
                        {dailyData[i].day}
                      </text>
                    </g>
                  );
                })}
              </svg>
            );
          })()}
        </motion.div>

        {/* ═══ DIVIDER ═══ */}
        <div className="px-6 lg:px-10 my-8">
          <div className="tentacle-line" />
        </div>

        {/* ═══ CATEGORIES — donut + legend ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="px-6 lg:px-10 relative z-10"
        >
          <p className="text-[10px] font-display uppercase tracking-[0.25em] text-muted-foreground/70 font-bold mb-8">
            Répartition par zone
          </p>

          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Donut chart */}
            <div className="relative w-48 h-48 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {(() => {
                  let cumulative = 0;
                  const radius = 38;
                  const circumference = 2 * Math.PI * radius;

                  return catStats.map((cat, i) => {
                    const pct = cat.sales / catTotal;
                    const offset = cumulative * circumference;
                    cumulative += pct;
                    const hue = catHues[i % catHues.length];
                    const isHovered = hoveredCat === cat.name;

                    return (
                      <motion.circle
                        key={cat.name}
                        cx="50" cy="50" r={radius}
                        fill="none"
                        stroke={`hsl(${hue})`}
                        strokeWidth={isHovered ? 10 : 7}
                        strokeDasharray={`${pct * circumference} ${circumference}`}
                        strokeDashoffset={-offset}
                        strokeLinecap="round"
                        className="cursor-pointer transition-all duration-300"
                        style={{
                          filter: isHovered ? `drop-shadow(0 0 6px hsl(${hue} / 0.5))` : 'none',
                          opacity: hoveredCat && !isHovered ? 0.3 : 1,
                        }}
                        onMouseEnter={() => setHoveredCat(cat.name)}
                        onMouseLeave={() => setHoveredCat(null)}
                        initial={{ strokeDasharray: `0 ${circumference}` }}
                        animate={{ strokeDasharray: `${pct * circumference} ${circumference}` }}
                        transition={{ delay: 0.5 + i * 0.06, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      />
                    );
                  });
                })()}
              </svg>
              {/* Center label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-display font-black text-foreground">
                  {catStats.length}
                </span>
                <span className="text-[9px] font-display text-muted-foreground/60 uppercase tracking-wider">
                  zones
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-2 w-full">
              {catStats.map((cat, i) => {
                const pct = Math.round((cat.sales / catTotal) * 100);
                const hue = catHues[i % catHues.length];
                const isHovered = hoveredCat === cat.name;

                return (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 + i * 0.04 }}
                    onMouseEnter={() => setHoveredCat(cat.name)}
                    onMouseLeave={() => setHoveredCat(null)}
                    className="flex items-center gap-3 py-1.5 cursor-pointer group"
                    style={{ opacity: hoveredCat && !isHovered ? 0.4 : 1, transition: 'opacity 0.2s' }}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform duration-200 group-hover:scale-125"
                      style={{
                        backgroundColor: `hsl(${hue})`,
                        boxShadow: isHovered ? `0 0 8px hsl(${hue} / 0.5)` : 'none',
                      }}
                    />
                    <span className="text-[11px] font-display font-semibold truncate flex-1 transition-colors duration-200"
                      style={{ color: isHovered ? `hsl(${hue})` : 'hsl(210 10% 55%)' }}>
                      {cat.name}
                    </span>
                    <span className="text-[11px] font-display font-black tabular-nums"
                      style={{
                        color: `hsl(${hue})`,
                        textShadow: isHovered ? `0 0 10px hsl(${hue} / 0.4)` : 'none',
                      }}>
                      {pct}%
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ═══ DIVIDER ═══ */}
        <div className="px-6 lg:px-10 my-8">
          <div className="tentacle-line" />
        </div>

        {/* ═══ TOP PRODUCTS ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="px-6 lg:px-10 pb-16 relative z-10"
        >
          <p className="text-[9px] font-display uppercase tracking-[0.3em] text-muted-foreground/40 mb-8">
            Meilleures prises
          </p>

          <div className="space-y-2">
            {topProducts.map((p, i) => {
              const isHovered = hoveredProduct === p.id;
              const scoreColor = p.score >= 90
                ? "162 72% 52%"
                : p.score >= 80
                ? "174 72% 56%"
                : "210 10% 50%";
              const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);

              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={() => setHoveredProduct(p.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  className="group cursor-pointer relative flex items-center gap-4 p-3 rounded-xl transition-all duration-300"
                  style={{
                    background: isHovered ? 'hsl(225 25% 8%)' : 'transparent',
                    border: `1px solid ${isHovered ? `hsl(${scoreColor} / 0.15)` : 'transparent'}`,
                  }}
                >
                  {/* Rank */}
                  <span className="text-lg font-display font-black w-7 text-center tabular-nums flex-shrink-0"
                    style={{
                      color: i === 0 ? 'hsl(38 92% 56%)' : i < 3 ? `hsl(${scoreColor})` : 'hsl(210 10% 22%)',
                      textShadow: i === 0 ? '0 0 14px hsl(38 92% 56% / 0.4)' : 'none',
                    }}>
                    {i + 1}
                  </span>

                  {/* Image */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={p.image} alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      style={{ filter: 'brightness(0.8) saturate(0.9)' }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-display font-bold text-foreground/85 group-hover:text-foreground transition-colors truncate">
                      {p.name}
                    </p>
                    <p className="text-[10px] font-display text-muted-foreground/40 mt-0.5">
                      {p.brand} · {p.category}
                    </p>
                  </div>

                  {/* Price + discount */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-display font-black text-foreground tabular-nums">
                      {p.price}<span className="text-[10px] text-muted-foreground/50">€</span>
                    </p>
                    {discount > 0 && (
                      <span className="text-[10px] font-display font-bold" style={{ color: 'hsl(162 68% 50%)' }}>
                        -{discount}%
                      </span>
                    )}
                  </div>

                  {/* Recurrences */}
                  <div className="text-right flex-shrink-0 w-20">
                    <p className="text-sm font-display font-black tabular-nums" style={{ color: `hsl(${scoreColor})` }}>
                      {p.recurrences.toLocaleString("fr-FR")}
                    </p>
                    <p className="text-[9px] font-display text-muted-foreground/30">récurrences</p>
                  </div>

                  {/* Score pill */}
                  <span className="text-[11px] font-display font-black tabular-nums px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{
                      background: `hsl(${scoreColor} / 0.1)`,
                      color: `hsl(${scoreColor})`,
                      border: `1px solid hsl(${scoreColor} / 0.15)`,
                      textShadow: isHovered ? `0 0 8px hsl(${scoreColor} / 0.4)` : 'none',
                    }}>
                    {p.score}
                  </span>
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
