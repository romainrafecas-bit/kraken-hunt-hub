import { LayoutDashboard, Package, BarChart3, Settings, Anchor, Skull, Filter } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import krakenHero from "@/assets/kraken-hero.jpg";

const navItems = [
  { icon: LayoutDashboard, label: "Tableau de bord" },
  { icon: Package, label: "Produits" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Filter, label: "Filtres avancés" },
  { icon: Settings, label: "Paramètres" },
];

const KrakkenSidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <aside className="w-16 xl:w-56 h-screen bg-card/30 backdrop-blur-xl border-r border-border/30 flex flex-col fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="p-3 xl:p-5 flex items-center gap-3 border-b border-border/20 h-16">
        <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center glow-border flex-shrink-0 overflow-hidden relative">
          <Skull className="w-5 h-5 text-primary relative z-10" />
          <div className="absolute inset-0 bg-primary/5 animate-pulse-glow" />
        </div>
        <div className="hidden xl:block">
          <h1 className="font-display text-sm font-bold text-foreground tracking-[0.3em] glow-text-subtle">KRAKKEN</h1>
          <p className="cryptic-mono text-muted-foreground" style={{ fontSize: '0.6rem', letterSpacing: '0.15em' }}>DEPTH ANALYSIS</p>
        </div>
      </div>

      {/* Kraken image */}
      <div className="hidden xl:block mx-3 mt-4 rounded-md overflow-hidden border border-border/20 relative h-24">
        <img src={krakenHero} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        <div className="absolute bottom-2 left-3">
          <p className="cryptic-mono text-primary" style={{ fontSize: '0.55rem' }}>SIGNAL ACTIF</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow glow-dot" />
            <span className="text-xs text-muted-foreground">54,892 produits</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 xl:px-3 space-y-0.5 mt-2">
        {navItems.map((item, i) => (
          <button
            key={item.label}
            onClick={() => setActiveIndex(i)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-300 group relative",
              i === activeIndex
                ? "bg-primary/8 text-primary"
                : "text-muted-foreground hover:text-secondary-foreground hover:bg-secondary/40"
            )}
          >
            {i === activeIndex && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r glow-border" />
            )}
            <item.icon className={cn("w-4 h-4 flex-shrink-0", i === activeIndex && "drop-shadow-[0_0_8px_hsl(var(--primary)/0.8)]")} />
            <span className="hidden xl:block text-xs font-medium tracking-wide">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 xl:p-4 border-t border-border/20">
        <div className="hidden xl:block">
          <div className="flex items-center justify-between mb-2">
            <span className="cryptic-mono text-muted-foreground" style={{ fontSize: '0.55rem' }}>DERNIÈRE ANALYSE</span>
          </div>
          <p className="text-xs text-secondary-foreground font-mono">28.02.2026 — 14:32</p>
          <div className="mt-2 flex items-center gap-2">
            <Anchor className="w-3 h-3 text-primary/50" />
            <span className="text-xs text-muted-foreground">Profondeur max atteinte</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default KrakkenSidebar;
