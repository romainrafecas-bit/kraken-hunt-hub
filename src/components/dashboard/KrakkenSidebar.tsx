import { LayoutDashboard, Package, BarChart3, Settings, Anchor, Filter, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import krakenHero from "@/assets/kraken-hero.jpg";

const navItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", to: "/" },
  { icon: Package, label: "Produits", to: "/produits" },
  { icon: BarChart3, label: "Analytics", to: "/analytics" },
  { icon: Filter, label: "Filtres avancés", to: "/filtres" },
  { icon: Settings, label: "Paramètres", to: "/parametres" },
];

const KrakkenSidebar = () => {
  return (
    <aside className="w-16 xl:w-56 h-screen bg-sidebar backdrop-blur-xl border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="p-3 xl:p-5 flex items-center gap-3 border-b border-sidebar-border h-16">
        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0 relative">
          <span className="text-xl">🐙</span>
        </div>
        <div className="hidden xl:block">
          <h1 className="font-display text-base font-extrabold text-foreground tracking-wide">Krakken</h1>
          <p className="text-[0.65rem] text-muted-foreground font-medium">Product Hunter</p>
        </div>
      </div>

      {/* Ocean visual */}
      <div className="hidden xl:block mx-3 mt-4 rounded-xl overflow-hidden border border-border/30 relative h-20">
        <img src={krakenHero} alt="" className="w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-sidebar via-sidebar/80 to-transparent" />
        <div className="absolute bottom-2.5 left-3">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-xs text-muted-foreground font-medium">54,892 produits scannés</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 xl:px-3 space-y-1 mt-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "bg-primary/12 text-primary font-semibold"
                  : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                )}
                <item.icon className={cn("w-[18px] h-[18px] flex-shrink-0", isActive && "text-primary")} />
                <span className="hidden xl:block text-[13px]">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 xl:p-4 border-t border-sidebar-border">
        <div className="hidden xl:block">
          <p className="text-xs text-muted-foreground mb-1">Dernière analyse</p>
          <p className="text-xs text-secondary-foreground font-mono">28 fév. 2026 · 14:32</p>
          <div className="mt-2 flex items-center gap-2">
            <Waves className="w-3 h-3 text-primary/50" />
            <span className="text-[11px] text-muted-foreground">Scan complet terminé</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default KrakkenSidebar;
