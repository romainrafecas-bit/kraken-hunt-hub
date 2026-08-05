import { Gauge, Boxes, Calculator, Bookmark, CircleUserRound, LogOut, Crown, Sparkles, LifeBuoy, Menu, X, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import krakkenLogo from "@/assets/krakken-logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { icon: Sparkles, label: "Pour toi", to: "/pour-toi" },
  { icon: Gauge, label: "Dashboard", to: "/dashboard" },
  { icon: Boxes, label: "Produits", to: "/produits" },
  { icon: Bookmark, label: "Favoris", to: "/favoris" },
  { icon: Calculator, label: "Calculateur", to: "/calculateur" },
];

const accountItems = [
  { icon: CircleUserRound, label: "Profil", to: "/profil" },
  { icon: Crown, label: "Abonnement", to: "/abonnement" },
  { icon: LifeBuoy, label: "Aide & FAQ", to: "/faq" },
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
      "group relative flex h-16 items-center gap-2 px-3 text-sm transition-colors whitespace-nowrap",
      isActive
        ? "text-foreground font-semibold"
        : "text-sidebar-foreground hover:text-foreground",
    );

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-16 bg-sidebar/95 backdrop-blur-xl border-b border-sidebar-border"
    >
      <div className="h-full max-w-[1440px] mx-auto px-4 lg:px-8 flex items-center gap-6">
        {/* Logo */}
        <NavLink to="/pour-toi" className="flex items-center gap-2.5 flex-shrink-0">
          <span className="w-8 h-8 flex items-center justify-center overflow-hidden">
            <img
              src={krakkenLogo}
              alt="Krakken"
              className="w-8 h-8 object-contain"
            />
          </span>
          <span className="hidden sm:block leading-none">
            <span className="font-display text-[15px] font-black text-foreground block">KRAKKEN</span>
          </span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 min-w-0">
          {navItems.map((item) => (
            <NavLink key={item.label} to={item.to} end={item.to === "/dashboard"} className={linkClass}>
              {({ isActive }) => (
                <>
                  <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-sidebar-foreground")} strokeWidth={1.8} />
                  <span>{item.label}</span>
                  {isActive && (
                    <span
                      className="absolute left-3 right-3 bottom-0 h-0.5 bg-primary"
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
            <Button
              variant="ghost"
              onClick={() => navigate("/abonnement")}
              className="hidden md:flex h-8 items-center gap-2 border border-border px-3 text-left"
              title="Gérer mon abonnement"
            >
              <span className="text-xs text-foreground font-semibold">Essai</span>
              <span className="text-xs text-primary font-mono">{daysLeft} j</span>
            </Button>
          )}
          {isActive && (
            <span
              className="hidden md:flex items-center gap-1.5 border border-border px-2.5 py-1.5 rounded-md"
            >
              <Crown className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-foreground font-semibold">Pro</span>
            </span>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden lg:inline-flex h-9 w-9" title="Compte et réglages">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {accountItems.map((item) => (
                <DropdownMenuItem key={item.to} onSelect={() => navigate(item.to)} className="gap-2.5">
                  <item.icon className="w-4 h-4 text-muted-foreground" /> {item.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleSignOut} className="gap-2.5 text-destructive focus:text-destructive">
                <LogOut className="w-4 h-4" /> Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden h-9 w-9"
            title="Menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="lg:hidden bg-sidebar border-b border-sidebar-border px-4 py-3 grid grid-cols-2 gap-1">
          {[...navItems, ...accountItems].map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === "/dashboard"}
              onClick={() => setMobileOpen(false)}
              className={linkClass}
            >
              {({ isActive }) => (
                <>
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
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
