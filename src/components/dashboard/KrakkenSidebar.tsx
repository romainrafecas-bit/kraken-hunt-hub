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
      "group relative flex h-16 items-center gap-2 px-3 text-sm font-medium whitespace-nowrap transition-colors duration-200",
      isActive
        ? "text-foreground font-semibold"
        : "text-sidebar-foreground hover:text-foreground",
    );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-sidebar-border bg-sidebar/90 backdrop-blur-xl">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2 focus:text-sm focus:text-foreground"
      >
        Aller au contenu
      </a>
      <div className="mx-auto flex h-full max-w-[1440px] items-center gap-6 px-4 lg:px-8">
        {/* Logo */}
        <NavLink
          to="/pour-toi"
          aria-label="Krakken — accueil"
          className="flex flex-shrink-0 items-center gap-2.5 rounded-md transition-opacity hover:opacity-80"
        >
          <span className="flex h-8 w-8 items-center justify-center overflow-hidden">
            <img
              src={krakkenLogo}
              alt=""
              className="w-8 h-8 object-contain"
            />
          </span>
          <span className="hidden sm:block leading-none">
            <span className="block font-display text-[15px] font-black tracking-tight text-foreground">KRAKKEN</span>
          </span>
        </NavLink>


        {/* Desktop nav */}
        <nav aria-label="Navigation principale" className="hidden min-w-0 flex-1 items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === "/dashboard"}
              className={linkClass}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    aria-hidden="true"
                    className={cn(
                      "h-4 w-4 transition-colors duration-200",
                      isActive ? "text-primary" : "text-sidebar-foreground group-hover:text-primary",
                    )}
                    strokeWidth={1.9}
                  />
                  <span>{item.label}</span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute bottom-0 left-3 right-3 h-0.5 origin-left bg-primary transition-transform duration-200",
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100 group-hover:bg-primary/40",
                    )}
                  />
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
              <Button variant="ghost" size="icon" className="hidden h-10 w-10 lg:inline-flex" title="Compte et réglages" aria-label="Compte et réglages">
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
            className="h-11 w-11 lg:hidden"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          aria-label="Navigation principale"
          className="grid gap-0.5 border-b border-sidebar-border bg-sidebar px-3 py-2 shadow-[var(--elev-3)] lg:hidden"
        >
          {[...navItems, ...accountItems].map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === "/dashboard"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex h-12 items-center gap-3 rounded-md px-3 text-sm transition-colors",
                  isActive
                    ? "bg-secondary font-semibold text-foreground"
                    : "text-sidebar-foreground hover:bg-secondary/60 hover:text-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    aria-hidden="true"
                    className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")}
                    strokeWidth={1.9}
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={handleSignOut}
            className="flex h-12 items-center gap-3 rounded-md px-3 text-sm text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" /> Se déconnecter
          </button>
        </nav>
      )}

    </header>
  );
};

export default KrakkenNav;
