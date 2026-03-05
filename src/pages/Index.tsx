import KrakkenSidebar from "@/components/dashboard/KrakkenSidebar";
import { motion } from "framer-motion";
import { products } from "@/data/products";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

/* ── data ── */
const chartData = [
  { d: "19", v: 3 }, { d: "20", v: 4 }, { d: "21", v: 5 }, { d: "22", v: 5 },
  { d: "23", v: 7 }, { d: "24", v: 7 }, { d: "25", v: 8 }, { d: "26", v: 9 },
  { d: "27", v: 9 }, { d: "28", v: 9 }, { d: "01", v: 9 }, { d: "02", v: 10 },
  { d: "03", v: 10 }, { d: "04", v: 10 }, { d: "05", v: 10 },
];

const catIcons: Record<string, string> = {
  "Électroménager": "⚡", "TV & Son": "🔊", "Smartphones": "📱",
  "Gaming": "🎮", "Informatique": "💻", "Jouets": "🧸",
  "Mode": "👟", "Maison": "🏠", "Beauté": "✨",
};

const catPalette = [
  "174 72% 46%", "262 52% 58%", "188 78% 52%", "38 92% 56%",
  "162 68% 44%", "348 72% 56%", "310 55% 50%", "200 65% 55%",
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

const topProducts = [...products].sort((a, b) => b.score - a.score).slice(0, 8);

/* ── tooltip ── */
const ChartTip = ({ active, payload, label }: any) => {
  if (!active || !payload?.[0]) return null;
  return (
    <div className="px-3 py-2 rounded-lg" style={{
      background: 'hsl(225 32% 6% / 0.95)',
      border: '1px solid hsl(174 72% 46% / 0.15)',
      backdropFilter: 'blur(12px)',
    }}>
      <span className="text-[11px] text-muted-foreground">Jour {label}</span>
      <p className="text-sm font-black font-mono" style={{ color: 'hsl(174 72% 56%)' }}>
        {payload[0].value} produits
      </p>
    </div>
  );
};

/* ── component ── */
const Index = () => {
  return (
    <div className="min-h-screen abyss-gradient">
      <KrakkenSidebar />
      <main className="pl-16 xl:pl-56 min-h-screen">

        {/* ═══ HERO STRIP ═══ */}
        <div className="px-5 pt-5 pb-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-end justify-between"
          >
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-1">
                Tableau de bord
              </p>
              <h1 className="font-display text-3xl font-black tracking-tight text-foreground">
                Vos <span className="kraken-title">profondeurs</span>
              </h1>
            </div>
            <div className="flex items-center gap-6 pb-1">
              {[
                { n: products.length.toString(), l: "traqués" },
                { n: catStats.length.toString(), l: "catégories" },
                { n: products.filter(p => p.sellers > 0).length.toString(), l: "en surface" },
              ].map((s, i) => (
                <div key={i} className="text-right">
                  <p className="font-display text-xl font-black" style={{
                    color: `hsl(${catPalette[i]})`,
                    textShadow: `0 0 14px hsl(${catPalette[i]} / 0.4)`,
                  }}>{s.n}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.l}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <div className="tentacle-line mt-4" />
        </div>

        {/* ═══ MAIN GRID — 3 columns ═══ */}
        <div className="grid grid-cols-12 gap-0 min-h-[calc(100vh-100px)]">

          {/* ── LEFT: Chart (full height, dominant) ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="col-span-12 lg:col-span-5 p-5 relative"
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Activité de traque
                </p>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md" style={{
                  background: 'hsl(174 72% 46% / 0.08)',
                  color: 'hsl(174 72% 56%)',
                  border: '1px solid hsl(174 72% 46% / 0.15)',
                }}>15j</span>
              </div>

              {/* Big number */}
              <div className="mb-4">
                <p className="font-display text-6xl font-black leading-none" style={{
                  color: 'hsl(174 72% 56%)',
                  textShadow: '0 0 40px hsl(174 72% 46% / 0.3), 0 0 80px hsl(174 72% 46% / 0.1)',
                }}>
                  {products.length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  produits détectés ce mois
                </p>
              </div>

              {/* Chart */}
              <div className="flex-1 min-h-[200px] relative">
                <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{
                  background: 'hsl(225 32% 6% / 0.4)',
                  border: '1px solid hsl(225 20% 12% / 0.5)',
                }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 10 }}>
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(174, 72%, 46%)" stopOpacity={0.3} />
                          <stop offset="60%" stopColor="hsl(262, 52%, 58%)" stopOpacity={0.05} />
                          <stop offset="100%" stopColor="hsl(228, 42%, 5%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="d" tick={{ fontSize: 10, fill: "hsl(210, 10%, 28%)" }} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTip />} />
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke="hsl(174, 72%, 50%)"
                        fill="url(#areaGrad)"
                        strokeWidth={2}
                        style={{ filter: 'drop-shadow(0 0 8px hsl(174 72% 46% / 0.5))' }}
                        dot={false}
                        activeDot={{
                          r: 4,
                          fill: 'hsl(174 72% 56%)',
                          stroke: 'hsl(228 42% 5%)',
                          strokeWidth: 2,
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Micro stats under chart */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { v: "+7", l: "nouveaux", c: "162 68% 44%" },
                  { v: "2", l: "ruptures", c: "348 72% 56%" },
                  { v: "96", l: "score max", c: "38 92% 56%" },
                ].map((s, i) => (
                  <div key={i} className="text-center py-3 rounded-xl" style={{
                    background: `hsl(${s.c} / 0.05)`,
                    border: `1px solid hsl(${s.c} / 0.1)`,
                  }}>
                    <p className="font-display text-lg font-black" style={{
                      color: `hsl(${s.c})`,
                      textShadow: `0 0 10px hsl(${s.c} / 0.3)`,
                    }}>{s.v}</p>
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Vertical separator */}
            <div className="hidden lg:block absolute top-8 bottom-8 right-0 tentacle-line-v" />
          </motion.div>

          {/* ── CENTER: Categories (vertical bars visual) ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="col-span-12 lg:col-span-3 p-5 relative"
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-5">
              Répartition catégories
            </p>

            {/* Vertical bar visualization */}
            <div className="flex items-end gap-[6px] h-[180px] mb-5">
              {catStats.map((cat, i) => {
                const pct = (cat.sales / catTotal) * 100;
                const hue = catPalette[i % catPalette.length];
                return (
                  <motion.div
                    key={cat.name}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(pct * 3.5, 8)}%` }}
                    transition={{ delay: 0.3 + i * 0.06, duration: 0.6, ease: "easeOut" }}
                    className="flex-1 rounded-t-lg cursor-pointer group relative"
                    style={{
                      background: `linear-gradient(180deg, hsl(${hue}), hsl(${hue} / 0.3))`,
                      boxShadow: `0 0 16px -4px hsl(${hue} / 0.4)`,
                    }}
                  >
                    {/* Hover tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      <span className="text-[10px] font-bold px-2 py-1 rounded" style={{
                        background: 'hsl(225 32% 6% / 0.95)',
                        color: `hsl(${hue})`,
                        border: `1px solid hsl(${hue} / 0.2)`,
                      }}>{Math.round(pct)}%</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Category list */}
            <div className="space-y-1.5">
              {catStats.map((cat, i) => {
                const hue = catPalette[i % catPalette.length];
                const icon = catIcons[cat.name] || "📦";
                const pct = Math.round((cat.sales / catTotal) * 100);
                return (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.04 }}
                    className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg cursor-pointer group hover:bg-card/40 transition-colors"
                  >
                    <span className="text-xs">{icon}</span>
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{
                      background: `hsl(${hue})`,
                      boxShadow: `0 0 6px hsl(${hue} / 0.5)`,
                    }} />
                    <span className="text-[11px] text-foreground/80 flex-1 truncate group-hover:text-foreground transition-colors">
                      {cat.name}
                    </span>
                    <span className="text-[10px] font-mono font-bold" style={{
                      color: `hsl(${hue})`,
                    }}>{pct}%</span>
                    <span className="text-[9px] text-muted-foreground font-mono">
                      {cat.count}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Vertical separator */}
            <div className="hidden lg:block absolute top-8 bottom-8 right-0 tentacle-line-v" />
          </motion.div>

          {/* ── RIGHT: Top Products ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="col-span-12 lg:col-span-4 p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Top produits
              </p>
              <span className="text-[10px] font-mono text-muted-foreground">
                par score
              </span>
            </div>

            <div className="space-y-1">
              {topProducts.map((p, i) => {
                const isTop3 = i < 3;
                const rankHues = [
                  "38 92% 56%", "174 72% 46%", "262 52% 58%",
                ];
                const hue = isTop3 ? rankHues[i] : "210 10% 30%";

                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.05 }}
                    className="flex items-center gap-3 p-2.5 rounded-xl group cursor-pointer transition-all duration-200"
                    whileHover={{
                      backgroundColor: 'hsl(225 32% 8% / 0.6)',
                    }}
                  >
                    {/* Rank */}
                    <div className="w-6 flex-shrink-0 text-center">
                      {isTop3 ? (
                        <span className="text-sm font-black font-display" style={{
                          color: `hsl(${hue})`,
                          textShadow: `0 0 12px hsl(${hue} / 0.5)`,
                        }}>{i + 1}</span>
                      ) : (
                        <span className="text-xs font-mono text-muted-foreground">{i + 1}</span>
                      )}
                    </div>

                    {/* Image */}
                    <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 relative" style={{
                      border: isTop3 ? `1px solid hsl(${hue} / 0.2)` : '1px solid hsl(225 20% 12%)',
                      boxShadow: isTop3 ? `0 0 12px -4px hsl(${hue} / 0.3)` : 'none',
                    }}>
                      <img src={p.image} alt="" className="w-full h-full object-cover" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-foreground/90 truncate group-hover:text-foreground transition-colors">
                        {p.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground">{p.brand}</span>
                        <span className="text-[9px] text-muted-foreground/60">•</span>
                        <span className="text-[10px] text-muted-foreground">{p.category}</span>
                      </div>
                    </div>

                    {/* Score + Price */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-[10px] font-bold font-mono" style={{
                          color: p.score >= 90 ? 'hsl(162 72% 52%)' : p.score >= 80 ? 'hsl(174 72% 56%)' : 'hsl(210 10% 45%)',
                          textShadow: p.score >= 90 ? '0 0 8px hsl(162 68% 44% / 0.4)' : 'none',
                        }}>{p.score}</p>
                      </div>
                      <p className="text-[12px] font-black font-mono text-foreground">
                        {p.price}€
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Score legend */}
            <div className="mt-5 flex items-center gap-4 px-2">
              {[
                { label: "90+", c: "162 72% 52%" },
                { label: "80+", c: "174 72% 56%" },
                { label: "<80", c: "210 10% 45%" },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{
                    background: `hsl(${s.c})`,
                    boxShadow: `0 0 4px hsl(${s.c} / 0.4)`,
                  }} />
                  <span className="text-[9px] text-muted-foreground font-mono">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Index;
