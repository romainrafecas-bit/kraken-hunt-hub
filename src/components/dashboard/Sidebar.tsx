import { LayoutDashboard, Search, TrendingUp, Package, Settings, BarChart3, Anchor } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Search, label: "Scanner", active: false },
  { icon: TrendingUp, label: "Tendances", active: false },
  { icon: Package, label: "Produits", active: false },
  { icon: BarChart3, label: "Analytics", active: false },
  { icon: Settings, label: "Paramètres", active: false },
];

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <aside className="w-20 lg:w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="p-4 lg:p-6 flex items-center gap-3 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center glow-border">
          <Anchor className="w-5 h-5 text-primary" />
        </div>
        <div className="hidden lg:block">
          <h1 className="font-display text-lg font-bold text-foreground tracking-wider">KRAKKEN</h1>
          <p className="text-xs text-muted-foreground">Product Hunter</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 lg:px-3 space-y-1">
        {navItems.map((item, i) => (
          <button
            key={item.label}
            onClick={() => setActiveIndex(i)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group",
              i === activeIndex
                ? "bg-primary/10 text-primary glow-border"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            <item.icon className={cn("w-5 h-5 flex-shrink-0", i === activeIndex && "drop-shadow-[0_0_6px_hsl(var(--primary)/0.6)]")} />
            <span className="hidden lg:block text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="hidden lg:flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-display text-primary">K</span>
          </div>
          <div>
            <p className="text-xs font-medium text-foreground">Krakken Pro</p>
            <p className="text-xs text-muted-foreground">12,450 scans</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
