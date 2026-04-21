import KrakkenSidebar from "@/components/dashboard/KrakkenSidebar";
import { motion } from "framer-motion";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { mapToProduct } from "@/hooks/useProducts";
import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import krakkenLogo from "@/assets/krakken-logo.png";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/dashboard/EmptyState";

const catHues = [
  "174 72% 46%", "262 52% 58%", "188 78% 52%", "38 92% 56%",
  "162 68% 44%", "348 72% 56%", "310 55% 50%", "200 65% 55%", "38 72% 50%",
  "174 72% 46%", "262 52% 58%", "188 78% 52%", "38 92% 56%",
  "162 68% 44%", "348 72% 56%", "310 55% 50%", "200 65% 55%", "38 72% 50%",
];
const categoryDisplayNames: Record<string, string> = {
  "telephonie": "Téléphonie", "photo-numerique": "Photo Numérique", "informatique": "Informatique",
  "tv-son": "TV & Son", "electromenager": "Électroménager", "gaming": "Gaming", "maison": "Maison",
  "jouets": "Jouets", "sport": "Sport", "mode": "Mode", "beaute": "Beauté", "auto": "Auto",
  "bagages": "Bagages", "juniors": "Juniors", "image-son": "Image & Son", "high-tech": "High-Tech",
  "bricolage": "Bricolage", "jardin": "Jardin", "animalerie": "Animalerie", "epicerie": "Épicerie",
  "bebe": "Bébé", "loisirs": "Loisirs", "bijoux": "Bijoux & Montres", "literie": "Literie",
  "bureau": "Bureau", "vin": "Vin & Spiritueux", "le-sport": "Le Sport", "le-jardin": "Le Jardin",
};

function formatCat(slug: string): string {
  if (categoryDisplayNames[slug]) return categoryDisplayNames[slug];
  if (categoryDisplayNames[slug.toLowerCase()]) return categoryDisplayNames[slug.toLowerCase()];
  return slug.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

const Index = () => {
  const { totalProducts, totalBrands, totalRecurrences, cumulativeData, categoryStats, latestProducts, lastUpdate, loading } = useDashboardStats();

  const lastUpdateLabel = useMemo(
    () => new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
    []
  );

  const lastUpdateRelative = "aujourd'hui";
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  const catStats = useMemo(() => 
    categoryStats.map(c => ({ name: formatCat(c.name), slug: c.name, sales: c.recurrences, count: c.count })),
    [categoryStats]
  );
  const catTotal = catStats.reduce((s, c) => s + c.sales, 0) || 1;

  const topProducts = useMemo(() => 
    latestProducts.map((p: any, i: number) => mapToProduct(p, i)),
    [latestProducts]
  );

  if (loading) {
    return (
      <div className="min-h-screen abyss-gradient overflow-hidden">
        <KrakkenSidebar />
        <main className="pl-16 xl:pl-56 min-h-screen p-6 space-y-6">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-52 w-full rounded-2xl" />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
          </div>
        </main>
      </div>
    );
  }

  if (totalProducts === 0) {
    return (
      <div className="min-h-screen abyss-gradient overflow-hidden">
        <KrakkenSidebar />
        <main className="pl-16 xl:pl-56 min-h-screen p-6">
          <EmptyState />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen abyss-gradient overflow-hidden">
      <KrakkenSidebar />
      <main className="pl-16 xl:pl-56 min-h-screen relative">
        <div className="fixed inset-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse 600px 400px at 70% 30%, hsl(174 72% 46% / 0.03), transparent),
            radial-gradient(ellipse 500px 500px at 30% 70%, hsl(262 52% 58% / 0.025), transparent)`,
        }} />

        {/* TOP BAR */}
        <div className="px-6 lg:px-10 pt-8 pb-2 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="relative flex-shrink-0">
                <img src={krakkenLogo} alt="Krakken" className="w-14 h-14" style={{ filter: 'drop-shadow(0 0 12px hsl(174 72% 46% / 0.3))' }} />
              </motion.div>
              <div>
                <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="text-xl lg:text-2xl font-display font-black leading-tight tracking-tight">
                  <span className="kraken-title">Tableau de bord</span>
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-[11px] font-display text-foreground/60 mt-0.5">
                  Analyse des profondeurs de <span style={{ color: 'hsl(162 68% 52%)' }} className="font-bold">Cdiscount</span>
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-2 mt-2">
                  {[
                    { label: `${totalProducts.toLocaleString("fr-FR")} produits`, hue: '174 72% 46%' },
                    { label: `${catStats.length} catégories`, hue: '262 52% 58%' },
                    { label: `${totalBrands} marques`, hue: '188 78% 52%' },
                  ].map((tag) => (
                    <span key={tag.label} className="text-[10px] font-display font-bold px-2.5 py-1 rounded-full"
                      style={{ color: `hsl(${tag.hue})`, background: `hsl(${tag.hue} / 0.1)`, border: `1px solid hsl(${tag.hue} / 0.2)` }}>
                      {tag.label}
                    </span>
                  ))}
                </motion.div>
              </div>
            </div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="hidden md:flex items-center gap-3 rounded-xl px-5 py-3 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, hsl(225 25% 7%), hsl(225 28% 9%))',
                border: '1px solid hsl(174 72% 46% / 0.18)',
                boxShadow: '0 0 24px -8px hsl(174 72% 46% / 0.25), inset 0 1px 0 hsl(174 72% 46% / 0.08)',
              }}>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{
                backgroundColor: 'hsl(162 68% 44%)', boxShadow: '0 0 10px hsl(162 68% 44% / 0.7)', animation: 'bioluminescence 2s ease-in-out infinite',
              }} />
              <div className="text-left">
                <p className="text-[8px] font-display uppercase tracking-[0.2em] text-foreground/50 mb-0.5">Dernière mise à jour</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-base font-display font-black tabular-nums" style={{ color: 'hsl(174 72% 56%)', textShadow: '0 0 14px hsl(174 72% 46% / 0.35)' }}>
                    {lastUpdateLabel}
                  </p>
                  {lastUpdateRelative && (
                    <span className="text-[9px] font-display font-bold" style={{ color: 'hsl(162 68% 52%)' }}>
                      {lastUpdateRelative}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* DAILY ACTIVITY */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="px-6 lg:px-10 mt-10 relative z-10">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-[9px] font-display uppercase tracking-[0.3em] text-foreground/60 mb-1">Évolution</p>
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-display font-black tabular-nums" style={{ color: 'hsl(174 72% 56%)', textShadow: '0 0 30px hsl(174 72% 46% / 0.4)' }}>
                  {totalProducts.toLocaleString("fr-FR")}
                </p>
                <p className="text-[10px] font-display text-foreground/55">produits scannés</p>
              </div>
            </div>
            {cumulativeData.length >= 2 && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-display font-bold" style={{ color: 'hsl(162 68% 52%)' }}>
                  +{cumulativeData[cumulativeData.length - 1].added}
                </span>
                <span className="text-[9px] font-display text-foreground/50">dernier jour</span>
              </div>
            )}
          </div>
          <div className="w-full h-52 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cumulativeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(174, 72%, 46%)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(174, 72%, 46%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 20%, 14%)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'hsl(210, 14%, 65%)', fontSize: 11, fontWeight: 600, fontFamily: 'DM Sans' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(210, 14%, 55%)', fontSize: 10, fontFamily: 'DM Sans' }} domain={[0, 'auto']} />
                <Tooltip
                  formatter={(value: number, name: string) => [value.toLocaleString("fr-FR"), "Total produits"]}
                  contentStyle={{ background: 'hsl(225, 32%, 8%)', border: '1px solid hsl(174, 72%, 46%, 0.2)', borderRadius: '12px', boxShadow: '0 8px 32px hsl(228, 50%, 2%, 0.6)', color: 'hsl(185, 20%, 88%)', fontSize: 12, fontFamily: 'DM Sans' }}
                  labelStyle={{ color: 'hsl(174, 72%, 56%)', fontWeight: 700 }} cursor={{ stroke: 'hsl(174, 72%, 46%, 0.2)', strokeWidth: 1 }} />
                <Area type="natural" dataKey="v" name="Total" stroke="hsl(174, 72%, 56%)" strokeWidth={2.5} fill="url(#chartGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: 'hsl(174, 72%, 60%)', stroke: 'hsl(174, 72%, 70%)', strokeWidth: 2, style: { filter: 'drop-shadow(0 0 6px hsl(174, 72%, 46%, 0.6))' } as any }}
                  animationDuration={1200} animationEasing="ease-out" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="px-6 lg:px-10 my-8"><div className="tentacle-line" /></div>

        {/* CATEGORIES */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="px-6 lg:px-10 relative z-10">
          <p className="text-[10px] font-display uppercase tracking-[0.25em] text-foreground/55 font-bold mb-8">Répartition par catégorie</p>
          <div className="flex flex-col lg:flex-row items-center gap-10">
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
                      <motion.circle key={cat.name} cx="50" cy="50" r={radius} fill="none" stroke={`hsl(${hue})`}
                        strokeWidth={isHovered ? 10 : 7} strokeDasharray={`${pct * circumference} ${circumference}`}
                        strokeDashoffset={-offset} strokeLinecap="round" className="cursor-pointer transition-all duration-300"
                        style={{ filter: isHovered ? `drop-shadow(0 0 6px hsl(${hue} / 0.5))` : 'none', opacity: hoveredCat && !isHovered ? 0.3 : 1 }}
                        onMouseEnter={() => setHoveredCat(cat.name)} onMouseLeave={() => setHoveredCat(null)}
                        initial={{ strokeDasharray: `0 ${circumference}` }} animate={{ strokeDasharray: `${pct * circumference} ${circumference}` }}
                        transition={{ delay: 0.5 + i * 0.06, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} />
                    );
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-display font-black text-foreground">{catStats.length}</span>
                <span className="text-[9px] font-display text-foreground/50 uppercase tracking-wider">catégories</span>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-2 w-full">
              {catStats.map((cat, i) => {
                const pct = Math.round((cat.sales / catTotal) * 100);
                const hue = catHues[i % catHues.length];
                const isHovered = hoveredCat === cat.name;
                return (
                  <motion.div key={cat.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 + i * 0.04 }}
                    onMouseEnter={() => setHoveredCat(cat.name)} onMouseLeave={() => setHoveredCat(null)}
                    className="flex items-center gap-3 py-1.5 cursor-pointer group"
                    style={{ opacity: hoveredCat && !isHovered ? 0.4 : 1, transition: 'opacity 0.2s' }}>
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform duration-200 group-hover:scale-125"
                      style={{ backgroundColor: `hsl(${hue})`, boxShadow: isHovered ? `0 0 8px hsl(${hue} / 0.5)` : 'none' }} />
                    <span className="text-[11px] font-display font-semibold truncate flex-1 transition-colors duration-200"
                      style={{ color: isHovered ? `hsl(${hue})` : 'hsl(210 14% 75%)' }}>{cat.name}</span>
                    <span className="text-[11px] font-display font-black tabular-nums"
                      style={{ color: `hsl(${hue})`, textShadow: isHovered ? `0 0 10px hsl(${hue} / 0.4)` : 'none' }}>{pct}%</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <div className="px-6 lg:px-10 my-8"><div className="tentacle-line" /></div>

        {/* DERNIÈRES PRISES */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="px-6 lg:px-10 pb-16 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <p className="text-[10px] font-display uppercase tracking-[0.25em] text-foreground/55 font-bold">Dernières prises</p>
            <span className="text-[9px] font-display uppercase tracking-[0.2em] text-foreground/40">Top {topProducts.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {topProducts.map((p, i) => {
              const isHovered = hoveredProduct === p.id;
              const isTop = i < 3;
              // Palette océan cohérente : teal dominant, accents cyan pour le top 3
              const accentHue = isTop ? "188 80% 58%" : "174 72% 52%";
              const glowHue = isTop ? "188 80% 58%" : "174 72% 46%";
              return (
                <motion.a
                  key={p.id}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 + i * 0.04 }}
                  onMouseEnter={() => setHoveredProduct(p.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  className="group relative flex items-center gap-3 p-3 rounded-2xl no-underline overflow-hidden transition-all duration-300"
                  style={{
                    background: isHovered
                      ? `linear-gradient(135deg, hsl(220 40% 9%), hsl(200 45% 11%))`
                      : `linear-gradient(135deg, hsl(225 32% 7%), hsl(220 36% 8%))`,
                    border: `1px solid hsl(${glowHue} / ${isHovered ? 0.4 : 0.15})`,
                    boxShadow: isHovered
                      ? `0 10px 32px -12px hsl(${glowHue} / 0.45), inset 0 1px 0 hsl(${glowHue} / 0.12), 0 0 0 1px hsl(${glowHue} / 0.08)`
                      : `0 4px 16px -6px hsl(220 60% 2% / 0.7), inset 0 1px 0 hsl(${glowHue} / 0.06)`,
                    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                  }}
                >
                  {/* Vague bioluminescente au survol */}
                  <div className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(ellipse 280px 140px at 0% 50%, hsl(${glowHue} / 0.12), transparent 70%)`,
                      opacity: isHovered ? 1 : 0,
                    }} />

                  {/* Liseré gauche lumineux */}
                  <div className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full transition-all duration-300"
                    style={{
                      background: `linear-gradient(180deg, transparent, hsl(${glowHue} / ${isHovered ? 0.8 : 0.4}), transparent)`,
                      boxShadow: isHovered ? `0 0 8px hsl(${glowHue} / 0.6)` : 'none',
                    }} />

                  {/* Rank badge */}
                  <div className="relative flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{
                      background: isTop
                        ? `linear-gradient(135deg, hsl(${glowHue} / 0.22), hsl(174 72% 46% / 0.08))`
                        : `linear-gradient(135deg, hsl(225 28% 11%), hsl(220 30% 9%))`,
                      border: `1px solid hsl(${glowHue} / ${isTop ? 0.4 : 0.15})`,
                      boxShadow: isTop ? `0 0 16px -4px hsl(${glowHue} / 0.5), inset 0 1px 0 hsl(${glowHue} / 0.2)` : 'none',
                    }}>
                    <span className="text-sm font-display font-black tabular-nums"
                      style={{
                        color: isTop ? `hsl(${glowHue})` : 'hsl(195 14% 55%)',
                        textShadow: isTop ? `0 0 12px hsl(${glowHue} / 0.6)` : 'none',
                      }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Product image */}
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0"
                    style={{
                      border: `1px solid hsl(${glowHue} / 0.25)`,
                      boxShadow: `0 4px 14px -2px hsl(220 60% 2% / 0.7), 0 0 0 1px hsl(225 28% 7%), inset 0 0 0 1px hsl(${glowHue} / 0.05)`,
                    }}>
                    <img src={p.image} alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy" />
                    {/* Overlay océan subtil */}
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background: `linear-gradient(180deg, transparent 60%, hsl(220 60% 4% / 0.4))` }} />
                  </div>

                  {/* Title + meta */}
                  <div className="flex-1 min-w-0 relative">
                    <p className="text-[13px] font-display font-bold text-foreground/95 truncate leading-tight">{p.name}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[9px] font-display font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
                        style={{
                          color: `hsl(${glowHue})`,
                          background: `hsl(${glowHue} / 0.1)`,
                          border: `1px solid hsl(${glowHue} / 0.2)`,
                        }}>
                        {p.brand}
                      </span>
                      <span className="text-[9px] font-display text-foreground/40">·</span>
                      <span className="text-[9px] font-display text-foreground/55 truncate">{formatCat(p.category)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="w-1 h-1 rounded-full" style={{ background: `hsl(${glowHue} / 0.6)`, boxShadow: `0 0 4px hsl(${glowHue} / 0.5)` }} />
                      <span className="text-[10px] font-display text-foreground/55 tabular-nums">Vu le {p.lastSeen}</span>
                    </div>
                  </div>

                  {/* Price block */}
                  <div className="text-right flex-shrink-0 relative pr-1">
                    {p.price === -1 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold"
                        style={{
                          color: 'hsl(348 75% 68%)',
                          background: 'hsl(348 72% 56% / 0.12)',
                          border: '1px solid hsl(348 72% 56% / 0.25)',
                        }}>Rupture</span>
                    ) : (
                      <p className="text-base font-display font-black tabular-nums leading-none"
                        style={{
                          color: `hsl(${glowHue})`,
                          textShadow: `0 0 14px hsl(${glowHue} / 0.45)`,
                        }}>
                        {p.price}<span className="text-[10px] text-foreground/55 font-bold ml-0.5">€</span>
                      </p>
                    )}
                  </div>
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        <motion.img src={krakkenLogo} alt="" className="fixed bottom-6 right-6 w-12 h-12 opacity-[0.04] pointer-events-none select-none"
          animate={{ y: [0, -4, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
      </main>
    </div>
  );
};

export default Index;
