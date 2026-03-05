import { Search, ShoppingCart, Eye, TrendingUp, Zap, Target } from "lucide-react";
import KrakkenSidebar from "@/components/dashboard/KrakkenSidebar";
import StatCard from "@/components/dashboard/StatCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TopBrands from "@/components/dashboard/TopBrands";
import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown";
import { motion } from "framer-motion";
import { products } from "@/data/products";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const stats = [
  { label: "TOTAL PRODUITS", value: "10", sub: "Dernière analyse", icon: Search },
  { label: "EN STOCK", value: "8", sub: "Disponibles", icon: ShoppingCart },
  { label: "EN RUPTURE", value: "2", sub: "À surveiller", icon: Target },
  { label: "SCORE MOYEN", value: "9.5", sub: "Sur 10", icon: Zap },
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
    <div className="bg-card/95 backdrop-blur-xl border border-primary/20 rounded-xl px-3 py-2 shadow-xl">
      <p className="text-xs font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs text-muted-foreground">
          {p.name}: <span className="text-primary font-mono font-semibold">{p.value}</span>
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
          className="glass-panel-glow p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
              📈 Croissance des scans
            </h3>
            <span className="text-xs text-muted-foreground font-mono">15 jours</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(174, 90%, 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(174, 90%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(215, 12%, 45%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215, 12%, 45%)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="scans"
                stroke="hsl(174, 90%, 45%)"
                fill="url(#scanGrad)"
                strokeWidth={2.5}
                style={{ filter: 'drop-shadow(0 0 4px hsl(174 90% 45% / 0.4))' }}
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
            className="glass-panel-glow p-5"
          >
            <h3 className="font-display text-sm font-bold text-foreground mb-4">👁️ Top 5 — Les plus traqués</h3>
            <div className="space-y-1">
              {topProducts.map((p, i) => {
                const discount = Math.round((1 - p.price / p.originalPrice) * 100);
                return (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/[0.04] transition-colors group cursor-pointer">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      i < 3 ? 'bg-primary/15 text-primary' : 'bg-muted/40 text-muted-foreground'
                    }`} style={i < 3 ? { boxShadow: '0 0 8px hsl(174 90% 45% / 0.15)' } : {}}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground/90 group-hover:text-primary transition-colors truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{p.brand}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs font-semibold text-primary">⚡ {p.score}</span>
                      <span className={`text-sm font-bold font-mono ${p.sales > 5000 ? 'text-foreground' : 'text-coral'}`}>
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
