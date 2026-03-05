import KrakkenSidebar from "@/components/dashboard/KrakkenSidebar";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, ShoppingCart, Star, ArrowUp, ArrowDown } from "lucide-react";
import { products, categories } from "@/data/products";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area } from "recharts";

const categoryData = categories.filter(c => c !== "Tous").map(cat => {
  const catProducts = products.filter(p => p.category === cat);
  return {
    name: cat.length > 10 ? cat.slice(0, 10) + "…" : cat,
    fullName: cat,
    ventes: catProducts.reduce((s, p) => s + p.sales, 0),
    produits: catProducts.length,
    avgScore: catProducts.length ? Math.round(catProducts.reduce((s, p) => s + p.score, 0) / catProducts.length) : 0,
    avgPrice: catProducts.length ? Math.round(catProducts.reduce((s, p) => s + p.price, 0) / catProducts.length) : 0,
  };
}).sort((a, b) => b.ventes - a.ventes);

const priceRanges = [
  { range: "0-100€", count: products.filter(p => p.price <= 100).length },
  { range: "100-300€", count: products.filter(p => p.price > 100 && p.price <= 300).length },
  { range: "300-500€", count: products.filter(p => p.price > 300 && p.price <= 500).length },
  { range: "500-1000€", count: products.filter(p => p.price > 500 && p.price <= 1000).length },
  { range: "1000€+", count: products.filter(p => p.price > 1000).length },
];

const trendData = [
  { jour: "Lun", ventes: 8200, score: 82 },
  { jour: "Mar", ventes: 9100, score: 84 },
  { jour: "Mer", ventes: 7800, score: 79 },
  { jour: "Jeu", ventes: 10500, score: 88 },
  { jour: "Ven", ventes: 12300, score: 91 },
  { jour: "Sam", ventes: 15800, score: 94 },
  { jour: "Dim", ventes: 11200, score: 86 },
];

const radarData = categoryData.slice(0, 6).map(c => ({
  category: c.name,
  score: c.avgScore,
  volume: Math.min(100, Math.round(c.ventes / 200)),
}));

const COLORS = [
  "hsl(180, 100%, 40%)",
  "hsl(160, 100%, 35%)",
  "hsl(200, 60%, 40%)",
  "hsl(45, 100%, 50%)",
  "hsl(280, 60%, 50%)",
  "hsl(0, 60%, 45%)",
  "hsl(120, 50%, 40%)",
  "hsl(30, 80%, 50%)",
];

const topProducts = [...products].sort((a, b) => b.score - a.score).slice(0, 5);
const upTrending = products.filter(p => p.trend === "up").length;
const downTrending = products.filter(p => p.trend === "down").length;
const avgDiscount = Math.round(products.reduce((s, p) => s + (1 - p.price / p.originalPrice) * 100, 0) / products.length);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-card/95 backdrop-blur-xl border border-border/40 rounded-md px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs text-muted-foreground">
          {p.name}: <span className="text-primary font-mono">{p.value?.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

const Analytics = () => {
  return (
    <div className="min-h-screen abyss-gradient">
      <KrakkenSidebar />
      <main className="pl-16 xl:pl-56 p-4 lg:p-6 space-y-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-panel rounded-md p-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold tracking-wide text-foreground">Analytics</h1>
                <p className="text-sm text-muted-foreground">Vue d'ensemble des performances de marché</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-1 text-accent">
                  <ArrowUp className="w-3 h-3" />
                  <span className="text-sm font-mono font-bold">{upTrending}</span>
                </div>
                <p className="text-xs text-muted-foreground">En hausse</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 text-destructive">
                  <ArrowDown className="w-3 h-3" />
                  <span className="text-sm font-mono font-bold">{downTrending}</span>
                </div>
                <p className="text-xs text-muted-foreground">En baisse</p>
              </div>
              <div className="text-center">
                <span className="text-sm font-mono font-bold text-primary">-{avgDiscount}%</span>
                <p className="text-xs text-muted-foreground">Réduction moy.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Sales trend */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-md p-5"
          >
            <h3 className="font-display text-sm font-semibold tracking-wide text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Tendance des ventes
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(180, 100%, 40%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(180, 100%, 40%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="jour" tick={{ fontSize: 11, fill: "hsl(210, 15%, 35%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(210, 15%, 35%)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="ventes" stroke="hsl(180, 100%, 40%)" fill="url(#salesGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-panel rounded-md p-5"
          >
            <h3 className="font-display text-sm font-semibold tracking-wide text-foreground mb-4 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-primary" />
              Ventes par catégorie
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData.slice(0, 8)}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(210, 15%, 35%)" }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(210, 15%, 35%)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="ventes" radius={[4, 4, 0, 0]}>
                  {categoryData.slice(0, 8).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Price distribution */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-md p-5"
          >
            <h3 className="font-display text-sm font-semibold tracking-wide text-foreground mb-4">
              Distribution des prix
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={priceRanges} dataKey="count" nameKey="range" cx="50%" cy="50%" outerRadius={80} innerRadius={40} strokeWidth={0}>
                  {priceRanges.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.8} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              {priceRanges.map((r, i) => (
                <div key={r.range} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-xs text-muted-foreground">{r.range} ({r.count})</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Radar chart */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-panel rounded-md p-5"
          >
            <h3 className="font-display text-sm font-semibold tracking-wide text-foreground mb-4">
              Score par catégorie
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(220, 25%, 10%)" />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 10, fill: "hsl(210, 15%, 35%)" }} />
                <PolarRadiusAxis tick={{ fontSize: 9, fill: "hsl(210, 15%, 35%)" }} axisLine={false} />
                <Radar name="Score" dataKey="score" stroke="hsl(180, 100%, 40%)" fill="hsl(180, 100%, 40%)" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Volume" dataKey="volume" stroke="hsl(160, 100%, 35%)" fill="hsl(160, 100%, 35%)" fillOpacity={0.1} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Top 5 products */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel rounded-md p-5"
        >
          <h3 className="font-display text-sm font-semibold tracking-wide text-foreground mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-kraken-eye" />
            Top 5 produits par score
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {topProducts.map((p, i) => (
              <div key={p.id} className="bg-secondary/30 border border-border/20 rounded-md p-4 hover:border-primary/20 transition-all group">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-display text-lg font-bold text-primary/60">#{i + 1}</span>
                  <div className="w-8 h-1 rounded-full bg-muted overflow-hidden flex-1">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${p.score}%` }} />
                  </div>
                  <span className="font-mono text-xs font-bold text-primary">{p.score}</span>
                </div>
                <p className="text-sm text-foreground/90 font-medium group-hover:text-primary transition-colors leading-tight">{p.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{p.brand}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="font-mono text-sm font-bold text-foreground">{p.price}€</span>
                  <span className="text-xs text-muted-foreground">{p.sales.toLocaleString()} ventes</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Analytics;
