import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Compass, Target, Heart, CheckCircle2, Package, Flame, ArrowRight,
  Calculator, Sparkles, TrendingUp, HelpCircle,
} from "lucide-react";
import KrakkenSidebar from "@/components/dashboard/KrakkenSidebar";
import SubscriptionBanner from "@/components/SubscriptionBanner";
import BentoTile from "@/components/game/BentoTile";
import HunterCard from "@/components/game/HunterCard";
import DailyMissions from "@/components/game/DailyMissions";
import PepiteCard from "@/components/game/PepiteCard";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useHunterProgress } from "@/hooks/useHunterProgress";
import { useFavorites } from "@/hooks/useFavorites";
import { mapToProduct } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

const categoryLabels: Record<string, string> = {
  telephonie: "Téléphonie", "photo-numerique": "Photo", informatique: "Informatique",
  "tv-son": "TV & Son", electromenager: "Électroménager", gaming: "Gaming", maison: "Maison",
  jouets: "Jouets", sport: "Sport", mode: "Mode", beaute: "Beauté", auto: "Auto",
  bagages: "Bagages", juniors: "Juniors", "high-tech": "High-Tech", bricolage: "Bricolage",
  jardin: "Jardin", animalerie: "Animalerie", epicerie: "Épicerie", bebe: "Bébé",
  loisirs: "Loisirs", bijoux: "Bijoux & Montres", literie: "Literie", bureau: "Bureau",
};

const prettyCategory = (slug: string) =>
  categoryLabels[slug] ?? categoryLabels[slug?.toLowerCase()] ?? slug.replace(/[-_]/g, " ");

const Index = () => {
  const navigate = useNavigate();
  const { totalProducts, categoryStats, latestProducts, loading } = useDashboardStats();
  const { isFavorite, toggleFavorite } = useFavorites();
  const progress = useHunterProgress();

  useEffect(() => {
    document.title = "Ta chasse aux pépites | Krakken";
  }, []);

  const pepites = useMemo(
    () => latestProducts.slice(0, 5).map((p: any, i: number) => mapToProduct(p, i)),
    [latestProducts],
  );

  const hotZones = useMemo(() => {
    const top = categoryStats.slice(0, 5);
    const max = top[0]?.recurrences || 1;
    return top.map((c) => ({ ...c, pct: Math.max(6, Math.round((c.recurrences / max) * 100)) }));
  }, [categoryStats]);

  const quickStats = [
    { label: "Produits à explorer", value: totalProducts.toLocaleString("fr-FR"), icon: Package, tone: "text-primary" },
    { label: "Mes pépites gardées", value: progress.kept, icon: Heart, tone: "text-rose-400" },
    { label: "Pépites validées", value: progress.validated, icon: CheckCircle2, tone: "text-emerald-400" },
    { label: "Meilleure série", value: `${progress.bestStreak} j`, icon: Flame, tone: "text-amber-400" },
  ];

  return (
    <div className="min-h-screen abyss-gradient">
      <KrakkenSidebar />
      <main className="pl-16 xl:pl-56 p-4 lg:p-6">
        <SubscriptionBanner />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          {/* HERO — chasse du jour */}
          <BentoTile className="lg:col-span-2 p-6" glow="teal">
            <div
              className="absolute -top-20 -right-16 w-72 h-72 pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.12), transparent 65%)" }}
            />
            <div className="relative z-10">
              <span className="game-chip game-chip-violet mb-3">
                <Compass className="w-3 h-3" /> Ta chasse du jour
              </span>
              <h1 className="font-display font-black text-2xl sm:text-3xl leading-tight mb-2">
                Trouve ta prochaine pépite à revendre
              </h1>
              <p className="text-sm text-muted-foreground max-w-xl mb-5">
                Pas besoin d'être expert : clique sur une chasse, regarde les produits qui reviennent le plus
                souvent, garde ceux qui te plaisent et vérifie ta marge. C'est tout.
              </p>

              <div className="flex flex-wrap gap-2.5 mb-6">
                <button
                  onClick={() => navigate("/produits")}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl font-display font-bold text-sm text-primary-foreground transition-transform hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--primary)), hsl(188 78% 52%))",
                    boxShadow: "0 8px 26px -10px hsl(var(--primary) / 0.7)",
                  }}
                >
                  <Target className="w-4 h-4" /> Lancer la chasse
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate("/favoris")}
                  className="hunt-chip py-3 px-5"
                >
                  <Heart className="w-4 h-4" /> Mes pépites ({progress.kept})
                </button>
              </div>

              <HunterCard {...progress} />
            </div>
          </BentoTile>

          {/* MISSIONS */}
          <BentoTile delay={0.05} glow="violet">
            <DailyMissions missions={progress.missions} allDone={progress.allMissionsDone} />
          </BentoTile>

          {/* STATS RAPIDES */}
          {quickStats.map((s, i) => (
            <BentoTile key={s.label} delay={0.1 + i * 0.04} className="lg:col-span-1 p-4">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-secondary/70 flex items-center justify-center shrink-0">
                  <s.icon className={`w-5 h-5 ${s.tone}`} />
                </span>
                <div className="min-w-0">
                  <p className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground truncate">
                    {s.label}
                  </p>
                  {loading && s.label === "Produits à explorer" ? (
                    <Skeleton className="h-6 w-20 mt-1" />
                  ) : (
                    <p className="font-display font-black text-xl tabular-nums">{s.value}</p>
                  )}
                </div>
              </div>
            </BentoTile>
          ))}

          {/* PÉPITES DU JOUR */}
          <BentoTile delay={0.2} className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-black text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> Pépites repérées récemment
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Barre pleine = fort potentiel (demande élevée, peu de concurrence)
                </p>
              </div>
              <button onClick={() => navigate("/produits")} className="hunt-chip text-xs py-1.5 px-3">
                Voir tout <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {loading && pepites.length === 0
                ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)
                : pepites.map((p, i) => (
                    <PepiteCard
                      key={p.url ?? p.id}
                      product={p}
                      delay={i * 0.05}
                      favorite={!!p.url && isFavorite(p.url)}
                      onToggleFavorite={() => p.url && toggleFavorite(p.url)}
                    />
                  ))}
            </div>
          </BentoTile>

          <div className="space-y-4">
            {/* ZONES CHAUDES */}
            <BentoTile delay={0.25}>
              <h2 className="font-display font-black text-base flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-primary" /> Zones les plus chaudes
              </h2>
              <p className="text-xs text-muted-foreground mb-4">Les rayons où il y a le plus de mouvement</p>
              <div className="space-y-3">
                {loading && hotZones.length === 0
                  ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
                  : hotZones.map((z) => (
                      <button
                        key={z.name}
                        onClick={() => navigate("/produits")}
                        className="w-full text-left group"
                      >
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {prettyCategory(z.name)}
                          </span>
                          <span className="text-muted-foreground tabular-nums">{z.count} produits</span>
                        </div>
                        <div className="xp-track h-1.5">
                          <div className="xp-fill" style={{ width: `${z.pct}%` }} />
                        </div>
                      </button>
                    ))}
              </div>
            </BentoTile>

            {/* GUIDE DÉBUTANT */}
            <BentoTile delay={0.3}>
              <h2 className="font-display font-black text-base flex items-center gap-2 mb-3">
                <HelpCircle className="w-4 h-4 text-primary" /> Comment gagner ?
              </h2>
              <ol className="space-y-3">
                {[
                  { icon: Target, t: "1. Chasse", d: "Ouvre « Produits » et clique sur une chasse rapide." },
                  { icon: Heart, t: "2. Garde", d: "Mets de côté les produits qui te plaisent." },
                  { icon: Calculator, t: "3. Calcule", d: "Vérifie ta marge avant d'acheter." },
                ].map((s) => (
                  <li key={s.t} className="flex gap-3">
                    <span className="w-8 h-8 rounded-lg bg-secondary/70 flex items-center justify-center shrink-0">
                      <s.icon className="w-4 h-4 text-primary" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">{s.t}</span>
                      <span className="block text-xs text-muted-foreground">{s.d}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </BentoTile>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
