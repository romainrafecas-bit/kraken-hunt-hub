import { LayoutDashboard, Package, BarChart3, Settings, Filter, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import krakkenLogo from "@/assets/krakken-logo.png";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/" },
  { icon: Package, label: "Produits", to: "/produits" },
  { icon: BarChart3, label: "Analytics", to: "/analytics" },
  { icon: Filter, label: "Filtres avancés", to: "/filtres" },
  { icon: Settings, label: "Paramètres", to: "/parametres" },
];

const KrakkenSidebar = () => {
  return (
    <aside className="w-16 xl:w-56 h-screen bg-sidebar backdrop-blur-xl border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="p-3 xl:p-4 flex items-center gap-3 border-b border-sidebar-border h-16">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden" style={{
          background: 'linear-gradient(135deg, hsl(222 45% 8%), hsl(222 35% 6%))',
          border: '1px solid hsl(185 80% 42% / 0.2)',
          boxShadow: '0 0 12px -2px hsl(185 80% 42% / 0.2)'
        }}>
          <img src={krakkenLogo} alt="Krakken" className="w-9 h-9 object-contain" />
        </div>
        <div className="hidden xl:block">
          <h1 className="font-display text-base font-extrabold text-primary tracking-wide glow-text-subtle">KRAKKEN</h1>
          <p className="text-[0.6rem] text-muted-foreground font-medium uppercase tracking-widest">Chasseur de produits</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 xl:px-3 space-y-1 mt-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "text-primary font-semibold"
                  : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <>
                    <div className="absolute inset-0 rounded-xl bg-primary/8 border border-primary/15" style={{
                      boxShadow: '0 0 12px -4px hsl(185 80% 42% / 0.15)'
                    }} />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" style={{
                      boxShadow: '0 0 8px hsl(185 80% 42% / 0.5)'
                    }} />
                  </>
                )}
                <item.icon className={cn("w-[18px] h-[18px] flex-shrink-0 relative z-10", isActive && "text-primary")} />
                <span className="hidden xl:block text-[13px] relative z-10">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Status */}
      <div className="p-3 xl:p-4 border-t border-sidebar-border">
        <div className="hidden xl:flex items-center gap-2 glass-panel-glow p-3 rounded-xl">
          <Waves className="w-4 h-4 text-primary flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[11px] text-foreground font-semibold">10 scannés</p>
            <p className="text-[10px] text-primary font-mono">8 en ligne</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow glow-dot ml-auto flex-shrink-0" />
        </div>
        <div className="xl:hidden flex justify-center">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow glow-dot" />
        </div>
      </div>
    </aside>
  );
};

export default KrakkenSidebar;
