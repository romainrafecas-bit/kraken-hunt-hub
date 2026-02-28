import { Search, ShoppingCart, Eye, TrendingUp, Zap, Target } from "lucide-react";
import KrakkenSidebar from "@/components/dashboard/KrakkenSidebar";
import StatCard from "@/components/dashboard/StatCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProductAnalysis from "@/components/dashboard/ProductAnalysis";
import TopBrands from "@/components/dashboard/TopBrands";
import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown";

const stats = [
  { label: "PRODUITS SCANNÉS", value: "54,892", sub: "+3,241 depuis hier", icon: Search },
  { label: "BEST-SELLERS", value: "1,247", sub: "Score > 80", icon: ShoppingCart },
  { label: "RÉDUCTIONS MOY.", value: "-27%", sub: "Sur top 100", icon: Target },
  { label: "SCORE MAX", value: "98", sub: "Galaxy S24 Ultra", icon: Zap },
  { label: "VENTES TOTALES", value: "112K", sub: "Top 25 produits", icon: TrendingUp },
  { label: "MARQUES ACTIVES", value: "847", sub: "12 catégories", icon: Eye },
];

const Index = () => {
  return (
    <div className="min-h-screen abyss-gradient">
      <KrakkenSidebar />
      <main className="pl-16 xl:pl-56 p-4 lg:p-6 space-y-5">
        <DashboardHeader />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} {...stat} index={i} />
          ))}
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
          <div className="xl:col-span-3">
            <ProductAnalysis />
          </div>
          <div className="space-y-5">
            <TopBrands />
            <CategoryBreakdown />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
