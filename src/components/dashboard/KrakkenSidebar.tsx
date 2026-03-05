import { LayoutDashboard, Package, BarChart3, Settings, Filter, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

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
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 relative" style={{
          background: 'linear-gradient(135deg, hsl(174 90% 45% / 0.2), hsl(199 85% 50% / 0.1))',
          border: '1px solid hsl(174 90% 45% / 0.3)',
          boxShadow: '0 0 15px -3px hsl(174 90% 45% / 0.3)'
        }}>
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
            <path d="M12 2C8 2 4 6 4 10c0 2 1 4 2 5.5C7 17 8.5 19 10 20.5c.7.7 1.3 1 2 1.5.7-.5 1.3-.8 2-1.5 1.5-1.5 3-3.5 4-5C19 14 20 12 20 10c0-4-4-8-8-8z" 
              fill="hsl(174, 90%, 45%)" fillOpacity="0.15" stroke="hsl(174, 90%, 45%)" strokeWidth="1.5"/>
            <circle cx="9" cy="9" r="1.5" fill="hsl(174, 90%, 50%)"/>
            <circle cx="15" cy="9" r="1.5" fill="hsl(174, 90%, 50%)"/>
            <path d="M7 14c0 0 2-2 5-2s5 2 5 2" stroke="hsl(174, 90%, 45%)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <path d="M4 12c-1 1-2 3-1.5 5" stroke="hsl(174, 90%, 45%)" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
            <path d="M20 12c1 1 2 3 1.5 5" stroke="hsl(174, 90%, 45%)" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
            <path d="M5 15c-1.5 0.5-2.5 2-2 4" stroke="hsl(174, 90%, 45%)" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
            <path d="M19 15c1.5 0.5 2.5 2 2 4" stroke="hsl(174, 90%, 45%)" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
          </svg>
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
                    <div className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/20" style={{
                      boxShadow: '0 0 12px -4px hsl(174 90% 45% / 0.2)'
                    }} />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" style={{
                      boxShadow: '0 0 8px hsl(174 90% 45% / 0.5)'
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
