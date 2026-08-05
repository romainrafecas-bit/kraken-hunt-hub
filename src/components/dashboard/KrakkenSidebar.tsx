import { Gauge, Boxes, Calculator, Bookmark, CircleUserRound, LogOut, Crown, Flame, LifeBuoy, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import krakkenLogo from "@/assets/krakken-logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";

const navItems = [
  { icon: Flame, label: "Pour toi", to: "/pour-toi" },
  { icon: Gauge, label: "Dashboard", to: "/dashboard" },
  { icon: Boxes, label: "Produits", to: "/produits" },
  { icon: Bookmark, label: "Favoris", to: "/favoris" },
  { icon: Calculator, label: "Calculateur", to: "/calculateur" },
  { icon: CircleUserRound, label: "Profil", to: "/profil" },
  { icon: Crown, label: "Abonnement", to: "/abonnement" },
  { icon: LifeBuoy, label: "FAQ", to: "/faq" },
];

const KrakkenNav = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { isTrialing, isActive, daysLeft } = useSubscription();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "group relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 whitespace-nowrap",
      isActive
        ? "text-primary font-semibold"
        : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent/50",
    );

  const renderIcon = (Icon: typeof Gauge, isActive: boolean) => (
    <span
      className={cn(
        "w-7 h-7 rounded-[0.6rem] flex items-center justify-center flex-shrink-0 transition-all duration-300",
        !isActive && "group-hover:scale-[1.06]",
      )}
      style={
        isActive
          ? {
              background: "linear-gradient(145deg, hsl(174 72% 46% / 0.22), hsl(262 52% 58% / 0.16))",
              border: "1px solid hsl(174 72% 56% / 0.35)",
              boxShadow: "0 0 14px -3px hsl(174 72% 46% / 0.5), inset 0 1px 0 hsl(185 80% 70% / 0.18)",
            }
          : {
              background: "linear-gradient(145deg, hsl(225 26% 12% / 0.9), hsl(228 38% 8% / 0.9))",
              border: "1px solid hsl(225 20% 18%)",
            }
      }
    >
      <Icon
        className={cn("w-[15px] h-[15px] transition-colors duration-300", isActive ? "text-primary" : "group-hover:text-primary/80")}
        strokeWidth={2.1}
        style={isActive ? { filter: "drop-shadow(0 0 5px hsl(174 72% 46% / 0.55))" } : {}}
      />
    </span>
  );

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-16 bg-sidebar/85 backdrop-blur-xl border-b border-sidebar-border"
      style={{ boxShadow: "0 6px 32px -18px hsl(228 50% 2% / 0.9)" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{ background: "radial-gradient(ellipse at 12% 120%, hsl(174 72% 46% / 0.1), transparent 60%)" }}
      />

      <div className="relative h-full px-3 lg:px-5 flex items-center gap-4">
        {/* Logo */}
        <NavLink to="/pour-toi" className="flex items-center gap-2.5 flex-shrink-0">
          <span
            className="w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden"
            style={{
              background: "linear-gradient(145deg, hsl(228 42% 7%), hsl(225 35% 5%))",
              border: "1px solid hsl(174 72% 46% / 0.22)",
              boxShadow: "0 0 20px -4px hsl(174 72% 46% / 0.3), inset 0 0 12px hsl(174 72% 46% / 0.06)",
            }}
          >
            <img
              src={krakkenLogo}
              alt="Krakken"
              className="w-9 h-9 object-contain"
              style={{ filter: "drop-shadow(0 0 6px hsl(174 72% 46% / 0.45))" }}
            />
          </span>
          <span className="hidden sm:block leading-none">
            <span className="kraken-title text-base tracking-wide block">KRAKKEN</span>
            <span className="text-[0.5rem] text-muted-foreground font-medium uppercase tracking-[0.22em]">
              Chasseur des abysses
            </span>
          </span>
        </NavLink>

        <div className="tentacle-line-v h-8 hidden lg:block" />

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5 flex-1 min-w-0 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => (
            <NavLink key={item.label} to={item.to} end={item.to === "/dashboard"} className={linkClass}>
              {({ isActive }) => (
                <>
                  {renderIcon(item.icon, isActive)}
                  <span className="text-[13px] hidden xl:block">{item.label}</span>
                  {isActive && (
                    <span
                      className="absolute left-3 right-3 -bottom-[9px] h-[2px] rounded-full"
                      style={{
                        background: "linear-gradient(90deg, hsl(174 72% 56%), hsl(262 52% 58%))",
                        boxShadow: "0 0 10px hsl(174 72% 46% / 0.6)",
                      }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex-1 lg:hidden" />

        {/* Status + actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isTrialing && daysLeft !== null && (
            <button
              onClick={() => navigate("/abonnement")}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-left transition-all hover:border-primary/40"
              style={{
                background: "linear-gradient(135deg, hsl(225 32% 8% / 0.9), hsl(225 28% 10% / 0.6))",
                border: "1px solid hsl(174 72% 46% / 0.2)",
              }}
              title="Gérer mon abonnement"
            >
              <span className="text-[11px] text-foreground font-semibold">Essai</span>
              <span className="text-[11px] text-primary font-mono">{daysLeft} j</span>
            </button>
          )}
          {isActive && (
            <span
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{
                background: "linear-gradient(135deg, hsl(225 32% 8% / 0.9), hsl(225 28% 10% / 0.6))",
                border: "1px solid hsl(174 72% 46% / 0.15)",
              }}
            >
              <Crown className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] text-foreground font-semibold">Pro</span>
            </span>
          )}
          <button
            onClick={handleSignOut}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
            style={{ border: "1px solid hsl(225 20% 16%)" }}
            title="Se déconnecter"
          >
            <LogOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-foreground"
            style={{ border: "1px solid hsl(225 20% 16%)" }}
            title="Menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="lg:hidden bg-sidebar/95 backdrop-blur-xl border-b border-sidebar-border px-3 py-3 grid grid-cols-2 gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === "/dashboard"}
              onClick={() => setMobileOpen(false)}
              className={linkClass}
            >
              {({ isActive }) => (
                <>
                  {renderIcon(item.icon, isActive)}
                  <span className="text-[13px]">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
};

export default KrakkenNav;
