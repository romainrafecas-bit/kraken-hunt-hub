import { Search, ShoppingCart, Eye, TrendingUp, Zap, Target } from "lucide-react";
import KrakkenSidebar from "@/components/dashboard/KrakkenSidebar";
import StatCard from "@/components/dashboard/StatCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TopBrands from "@/components/dashboard/TopBrands";
import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown";
import { motion } from "framer-motion";
import { products } from "@/data/products";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const bestDiscount = Math.max(...products.map(p => Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)));

const stats = [
  { label: "PRODUITS TRAQUÉS", value: "10", sub: "Dernière plongée", icon: Search },
  { label: "EN SURFACE", value: "8", sub: "Disponibles", icon: ShoppingCart },
  { label: "DANS L'ABÎME", value: "2", sub: "À surveiller", icon: Target },
  { label: "MEILLEURE PRISE", value: `-${bestDiscount}%`, sub: "Réduction max", icon: TrendingUp },
];

const chartData = [
  { date: "19 fév.", scans: 3 },
  { date: "20 fév.", scans: 4 },
  { date: "21 fév.", scans: 5 },
  { date: "22 fév.", scans: 5 },
  { date: "23 fév.", scans: 7 },
  { date: "24 fév.", scans: 7 },
  { date: "25 fév.", scans: 8 },
  { date: "26 fév.", scans: 9 },
  { date: "27 fév.", scans: 9 },
  { date: "28 fév.", scans: 9 },
  { date: "01 mars", scans: 9 },
  { date: "02 mars", scans: 10 },
  { date: "03 mars", scans: 10 },
  { date: "04 mars", scans: 10 },
  { date: "05 mars", scans: 10 },
];

const topProducts = [...products].sort((a, b) => b.score - a.score).slice(0, 5);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-xl px-3 py-2 shadow-xl" style={{
      background: 'hsl(225 32% 8% / 0.95)',
      border: '1px solid hsl(174 72% 46% / 0.2)',
      boxShadow: '0 0 20px -4px hsl(174 72% 46% / 0.15)',
      backdropFilter: 'blur(16px)',
    }}>
      <p className="text-xs font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs text-muted-foreground">
          {p.name}: <span className="font-mono font-bold" style={{ color: 'hsl(174 72% 56%)', textShadow: '0 0 6px hsl(174 72% 46% / 0.3)' }}>{p.value}</span>
        </p>
      ))}
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen abyss-gradient">
      <KrakkenSidebar />
      <main className="pl-16 xl:pl-56 p-4 lg:p-6 space-y-5">
        <DashboardHeader />

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} {...stat} index={i} />
          ))}
        </div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel-glow p-5 relative overflow-hidden"
        >
          {/* Decorative */}
          <div className="absolute top-0 left-0 right-0 h-px tentacle-line" />
          <div className="absolute bottom-0 right-0 w-40 h-40 pointer-events-none" style={{
            background: 'radial-gradient(circle at 100% 100%, hsl(174 72% 46% / 0.04), transparent 60%)',
          }} />

          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
              <span style={{ filter: 'drop-shadow(0 0 4px hsl(174 72% 46% / 0.4))' }}>🔱</span>
              Progression de la traque
            </h3>
            <span className="bio-badge bio-violet text-[10px]">15 jours</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(174, 72%, 46%)" stopOpacity={0.25} />
                  <stop offset="50%" stopColor="hsl(262, 52%, 58%)" stopOpacity={0.08} />
                  <stop offset="95%" stopColor="hsl(228, 42%, 5%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(210, 10%, 35%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(210, 10%, 35%)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="scans"
                stroke="hsl(174, 72%, 50%)"
                fill="url(#scanGrad)"
                strokeWidth={2.5}
                style={{ filter: 'drop-shadow(0 0 6px hsl(174 72% 46% / 0.4))' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bottom section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <CategoryBreakdown />
          
          {/* Top 5 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass-panel-glow p-5 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-px tentacle-line" />
            <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <span style={{ filter: 'drop-shadow(0 0 4px hsl(262 52% 58% / 0.4))' }}>👁️</span>
              Top 5 — Les plus traqués
            </h3>
            <div className="space-y-1">
              {topProducts.map((p, i) => {
                const rankColors = [
                  { color: 'hsl(38 92% 60%)', bg: 'hsl(38 92% 56% / 0.12)', shadow: 'hsl(38 92% 56% / 0.2)' },
                  { color: 'hsl(174 72% 56%)', bg: 'hsl(174 72% 46% / 0.12)', shadow: 'hsl(174 72% 46% / 0.15)' },
                  { color: 'hsl(262 72% 72%)', bg: 'hsl(262 52% 58% / 0.12)', shadow: 'hsl(262 52% 58% / 0.15)' },
                  { color: 'hsl(210 10% 45%)', bg: 'hsl(210 10% 40% / 0.1)', shadow: 'transparent' },
                  { color: 'hsl(210 10% 40%)', bg: 'hsl(210 10% 35% / 0.08)', shadow: 'transparent' },
                ];
                const rc = rankColors[i];
                return (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/[0.04] transition-all duration-200 group cursor-pointer">
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black"
                      style={{
                        backgroundColor: rc.bg,
                        color: rc.color,
                        boxShadow: `0 0 10px ${rc.shadow}`,
                        textShadow: `0 0 6px ${rc.shadow}`,
                      }}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground/90 group-hover:text-primary transition-colors truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{p.brand}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs font-bold" style={{
                        color: 'hsl(162 72% 52%)',
                        textShadow: '0 0 6px hsl(162 68% 44% / 0.3)',
                      }}>⚡ {p.score}</span>
                      <span className="text-sm font-black font-mono text-foreground">
                        {p.price}€
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Index;
