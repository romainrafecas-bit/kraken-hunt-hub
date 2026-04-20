import { LayoutDashboard, Package, Calculator, Anchor, User, Heart, LogOut, Crown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink, useNavigate } from "react-router-dom";
import krakkenLogo from "@/assets/krakken-logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: Package, label: "Produits", to: "/produits" },
  { icon: Heart, label: "Favoris", to: "/favoris" },
  { icon: User, label: "Mon profil", to: "/profil" },
  { icon: Crown, label: "Abonnement", to: "/abonnement" },
  { icon: Calculator, label: "Calculateur", to: "/calculateur" },
];

const KrakkenSidebar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { isTrialing, isActive, daysLeft } = useSubscription();
  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };
  return (
    <aside className="w-16 xl:w-56 h-screen bg-sidebar backdrop-blur-xl border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-50 overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-40 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at 50% 100%, hsl(174 72% 46% / 0.12), transparent 70%)',
          }}
        />
        <div className="absolute top-20 -left-4 w-32 h-64 opacity-10"
          style={{
            background: 'radial-gradient(ellipse, hsl(262 52% 58% / 0.3), transparent 70%)',
          }}
        />
      </div>

      {/* Logo */}
      <div className="relative p-3 xl:p-4 flex items-center gap-3 border-b border-sidebar-border h-16">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden relative" style={{
          background: 'linear-gradient(145deg, hsl(228 42% 7%), hsl(225 35% 5%))',
          border: '1px solid hsl(174 72% 46% / 0.2)',
          boxShadow: '0 0 20px -4px hsl(174 72% 46% / 0.25), inset 0 0 12px hsl(174 72% 46% / 0.05)'
        }}>
          <img src={krakkenLogo} alt="Krakken" className="w-9 h-9 object-contain" style={{
            filter: 'drop-shadow(0 0 6px hsl(174 72% 46% / 0.4))'
          }} />
        </div>
        <div className="hidden xl:block">
          <h1 className="kraken-title text-base tracking-wide">KRAKKEN</h1>
          <p className="text-[0.55rem] text-muted-foreground font-medium uppercase tracking-[0.2em]">Chasseur des abysses</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 xl:px-3 space-y-1 mt-1 relative z-10">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === "/dashboard"}
            className={({ isActive }) =>
              cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative",
                isActive
                  ? "text-primary font-semibold"
                  : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent/60"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <>
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <div className="absolute inset-0 bg-primary/[0.07]" />
                      <div className="absolute inset-0" style={{
                        background: 'linear-gradient(90deg, hsl(174 72% 46% / 0.12), transparent)',
                      }} />
                    </div>
                    <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full" style={{
                      background: 'linear-gradient(180deg, hsl(174 72% 56%), hsl(262 52% 58%))',
                      boxShadow: '0 0 10px hsl(174 72% 46% / 0.5), 0 0 20px hsl(174 72% 46% / 0.2)'
                    }} />
                  </>
                )}
                <item.icon className={cn(
                  "w-[18px] h-[18px] flex-shrink-0 relative z-10 transition-all duration-300",
                  isActive ? "text-primary" : "group-hover:text-primary/70"
                )} style={isActive ? { filter: 'drop-shadow(0 0 4px hsl(174 72% 46% / 0.4))' } : {}} />
                <span className="hidden xl:block text-[13px] relative z-10">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Tentacle divider */}
      <div className="mx-4 tentacle-line" />

      {/* Status */}
      <div className="p-3 xl:p-4 relative z-10">
        {isTrialing && daysLeft !== null && (
          <button
            onClick={() => navigate("/abonnement")}
            className="hidden xl:flex w-full items-center gap-2 p-3 rounded-xl relative overflow-hidden text-left hover:border-primary/40 transition-all"
            style={{
              background: 'linear-gradient(135deg, hsl(225 32% 8% / 0.9), hsl(225 28% 10% / 0.6))',
              border: '1px solid hsl(174 72% 46% / 0.2)',
              boxShadow: '0 0 20px -8px hsl(174 72% 46% / 0.15)'
            }}
            title="Gérer mon abonnement"
          >
            <Sparkles className="w-4 h-4 text-primary flex-shrink-0" style={{
              filter: 'drop-shadow(0 0 4px hsl(174 72% 46% / 0.4))'
            }} />
            <div className="min-w-0">
              <p className="text-[11px] text-foreground font-semibold">Essai gratuit</p>
              <p className="text-[10px] text-primary/80 font-mono">
                {daysLeft} j restant{daysLeft > 1 ? 's' : ''}
              </p>
            </div>
          </button>
        )}
        {isActive && (
          <div className="hidden xl:flex items-center gap-2 p-3 rounded-xl relative overflow-hidden" style={{
            background: 'linear-gradient(135deg, hsl(225 32% 8% / 0.9), hsl(225 28% 10% / 0.6))',
            border: '1px solid hsl(174 72% 46% / 0.15)',
          }}>
            <Crown className="w-4 h-4 text-primary flex-shrink-0" style={{
              filter: 'drop-shadow(0 0 4px hsl(174 72% 46% / 0.4))'
            }} />
            <div className="min-w-0">
              <p className="text-[11px] text-foreground font-semibold">Krakken Pro</p>
              <p className="text-[10px] text-primary/70 font-mono">Actif</p>
            </div>
          </div>
        )}
        <div className="xl:hidden flex justify-center">
          <span className="w-2 h-2 rounded-full bg-primary" style={{
            animation: 'bioluminescence 3s ease-in-out infinite',
            boxShadow: '0 0 8px 2px hsl(174 72% 46% / 0.5)'
          }} />
        </div>
        <button
          onClick={handleSignOut}
          className="mt-2 w-full flex items-center justify-center xl:justify-start gap-2 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all hover:bg-destructive/10"
          style={{ color: 'hsl(var(--muted-foreground))' }}
          title="Se déconnecter"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden xl:inline">Se déconnecter</span>
        </button>
      </div>
    </aside>
  );
};

export default KrakkenSidebar;
