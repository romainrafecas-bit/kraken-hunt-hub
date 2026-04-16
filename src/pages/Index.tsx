import KrakkenSidebar from "@/components/dashboard/KrakkenSidebar";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/useProducts";
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
  const { products, loading } = useProducts();
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  // Build cumulative chart data from added_date
  const cumulativeData = useMemo(() => {
    const dateCountMap: Record<string, number> = {};
    products.forEach(p => {
      if (!p.addedDate) return;
      // Parse added_date (could be ISO or dd/mm/yyyy)
      let date: Date | null = null;
      const ddmmyyyy = p.addedDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      if (ddmmyyyy) {
        date = new Date(Number(ddmmyyyy[3]), Number(ddmmyyyy[2]) - 1, Number(ddmmyyyy[1]));
      } else {
        date = new Date(p.addedDate);
        if (isNaN(date.getTime())) date = null;
      }
      if (!date) return;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      dateCountMap[key] = (dateCountMap[key] || 0) + 1;
    });
    const sortedDays = Object.keys(dateCountMap).sort();
    let cumul = 0;
    return sortedDays.map(day => {
      cumul += dateCountMap[day];
      const d = new Date(day);
      const label = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
      return { day: label, v: cumul, added: dateCountMap[day] };
    });
  }, [products]);

  const catStats = Object.entries(
    products.reduce((acc, p) => {
      if (!acc[p.category]) acc[p.category] = { sales: 0, count: 0 };
      acc[p.category].sales += p.recurrences;
      acc[p.category].count += 1;
      return acc;
    }, {} as Record<string, { sales: number; count: number }>)
  ).map(([name, d]) => ({ name: formatCat(name), slug: name, ...d })).sort((a, b) => b.sales - a.sales);
  const catTotal = catStats.reduce((s, c) => s + c.sales, 0) || 1;

  const topProducts = [...products].slice(0, 8);

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

  if (products.length === 0) {
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
                    { label: `${products.length} produits`, hue: '174 72% 46%' },
                    { label: `${catStats.length} catégories`, hue: '262 52% 58%' },
                    { label: `${new Set(products.map(p => p.brand)).size} marques`, hue: '188 78% 52%' },
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
              className="hidden md:flex items-stretch gap-px rounded-xl overflow-hidden" style={{ border: '1px solid hsl(225 20% 12%)' }}>
              <div className="px-5 py-3 text-center" style={{ background: 'hsl(225 25% 7%)' }}>
                <p className="text-[8px] font-display uppercase tracking-[0.2em] text-foreground/50 mb-1">Traqués</p>
                <p className="text-xl font-display font-black tabular-nums" style={{ color: 'hsl(174 72% 56%)', textShadow: '0 0 16px hsl(174 72% 46% / 0.3)' }}>
                  {products.reduce((s, p) => s + p.recurrences, 0).toLocaleString("fr-FR")}
                </p>
              </div>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{
                backgroundColor: 'hsl(162 68% 44%)', boxShadow: '0 0 8px hsl(162 68% 44% / 0.6)', animation: 'bioluminescence 2s ease-in-out infinite',
              }} />
            </motion.div>
          </div>
        </div>

        {/* DAILY ACTIVITY */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="px-6 lg:px-10 mt-10 relative z-10">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-[9px] font-display uppercase tracking-[0.3em] text-foreground/60 mb-1">Ce mois-ci</p>
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-display font-black tabular-nums" style={{ color: 'hsl(174 72% 56%)', textShadow: '0 0 30px hsl(174 72% 46% / 0.4)' }}>
                  {dailyData.reduce((s, d) => s + d.v, 0)}
                </p>
                <p className="text-[10px] font-display text-foreground/55">produits scannés</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-display font-bold" style={{ color: 'hsl(162 68% 52%)' }}>
                +{Math.round(((dailyData[6].v - dailyData[0].v) / dailyData[0].v) * 100)}%
              </span>
              <span className="text-[9px] font-display text-foreground/50">vs lun.</span>
            </div>
          </div>
          <div className="w-full h-52 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(174, 72%, 46%)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(174, 72%, 46%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 20%, 14%)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'hsl(210, 14%, 65%)', fontSize: 11, fontWeight: 600, fontFamily: 'DM Sans' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(210, 14%, 55%)', fontSize: 10, fontFamily: 'DM Sans' }} domain={[0, 'auto']} />
                <Tooltip contentStyle={{ background: 'hsl(225, 32%, 8%)', border: '1px solid hsl(174, 72%, 46%, 0.2)', borderRadius: '12px', boxShadow: '0 8px 32px hsl(228, 50%, 2%, 0.6)', color: 'hsl(185, 20%, 88%)', fontSize: 12, fontFamily: 'DM Sans' }}
                  labelStyle={{ color: 'hsl(174, 72%, 56%)', fontWeight: 700 }} cursor={{ stroke: 'hsl(174, 72%, 46%, 0.2)', strokeWidth: 1 }} />
                <Area type="monotone" dataKey="v" stroke="hsl(174, 72%, 56%)" strokeWidth={2.5} fill="url(#chartGrad)"
                  dot={{ r: 4, fill: 'hsl(174, 72%, 56%)', stroke: 'hsl(225, 25%, 10%)', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: 'hsl(174, 72%, 60%)', stroke: 'hsl(174, 72%, 70%)', strokeWidth: 2, style: { filter: 'drop-shadow(0 0 6px hsl(174, 72%, 46%, 0.6))' } as any }}
                  animationDuration={1200} animationEasing="ease-out" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="px-6 lg:px-10 my-8"><div className="tentacle-line" /></div>

        {/* CATEGORIES */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="px-6 lg:px-10 relative z-10">
          <p className="text-[10px] font-display uppercase tracking-[0.25em] text-foreground/55 font-bold mb-8">Répartition par zone</p>
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
                <span className="text-[9px] font-display text-foreground/50 uppercase tracking-wider">zones</span>
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
          <p className="text-[10px] font-display uppercase tracking-[0.25em] text-foreground/55 font-bold mb-8">Dernières prises</p>
          <div className="space-y-2">
            {topProducts.map((p, i) => {
              const isHovered = hoveredProduct === p.id;
              const ratingColor = p.rating >= 4.5 ? "162 72% 52%" : p.rating >= 3.5 ? "174 72% 56%" : p.rating >= 2.5 ? "38 92% 56%" : "210 10% 50%";
              const stars = p.rating > 0 ? p.rating.toFixed(1) : "—";
              return (
                <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={() => setHoveredProduct(p.id)} onMouseLeave={() => setHoveredProduct(null)}
                  className="group cursor-pointer relative flex items-center gap-4 p-3 rounded-xl transition-all duration-300"
                  style={{ background: isHovered ? 'hsl(225 25% 8%)' : 'transparent', border: `1px solid ${isHovered ? `hsl(${ratingColor} / 0.15)` : 'transparent'}` }}>
                  <span className="text-lg font-display font-black w-7 text-center tabular-nums flex-shrink-0"
                    style={{ color: i === 0 ? 'hsl(38 92% 56%)' : i < 3 ? `hsl(${ratingColor})` : 'hsl(210 14% 50%)', textShadow: i === 0 ? '0 0 14px hsl(38 92% 56% / 0.4)' : 'none' }}>
                    {i + 1}
                  </span>
                  <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" style={{ filter: 'brightness(0.85) saturate(0.9)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-display font-bold text-foreground group-hover:text-foreground transition-colors truncate">{p.name}</p>
                    <p className="text-[10px] font-display text-foreground/50 mt-0.5">{p.brand} · {formatCat(p.category)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-display font-black text-foreground tabular-nums">{p.price}<span className="text-[10px] text-foreground/50">€</span></p>
                    <p className="text-[9px] font-display text-foreground/45">{p.lastSeen}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-base" style={{ color: `hsl(${ratingColor})` }}>★</span>
                    <span className="text-sm font-display font-black tabular-nums" style={{ color: `hsl(${ratingColor})`, textShadow: isHovered ? `0 0 8px hsl(${ratingColor} / 0.4)` : 'none' }}>
                      {stars}
                    </span>
                  </div>
                </motion.div>
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
