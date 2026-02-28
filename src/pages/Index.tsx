import { Search, ShoppingCart, Eye, TrendingUp } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import StatsCard from "@/components/dashboard/StatsCard";
import ProductTable from "@/components/dashboard/ProductTable";
import ScannerStatus from "@/components/dashboard/ScannerStatus";
import HeroBanner from "@/components/dashboard/HeroBanner";
import CategoryChart from "@/components/dashboard/CategoryChart";

const stats = [
  { title: "Produits scannés", value: "54,892", change: "+12.5%", changeType: "up" as const, icon: Search },
  { title: "Best-sellers détectés", value: "1,247", change: "+8.3%", changeType: "up" as const, icon: ShoppingCart },
  { title: "Vues aujourd'hui", value: "8,934", change: "+23.1%", changeType: "up" as const, icon: Eye },
  { title: "Score moyen", value: "87.4", change: "-2.1%", changeType: "down" as const, icon: TrendingUp },
];

const Index = () => {
  return (
    <div className="min-h-screen ocean-gradient">
      <Sidebar />
      <main className="pl-20 lg:pl-64 p-6 lg:p-8">
        <HeroBanner />

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {stats.map((stat, i) => (
            <StatsCard key={stat.title} {...stat} delay={0.1 + i * 0.08} />
          ))}
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
          <div className="xl:col-span-2">
            <ProductTable />
          </div>
          <div className="space-y-6">
            <ScannerStatus />
            <CategoryChart />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
