import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, SlidersHorizontal, Check, RotateCcw, Loader2 } from "lucide-react";
import KrakkenSidebar from "@/components/dashboard/KrakkenSidebar";
import ProductForYouCard from "@/components/dashboard/ProductForYouCard";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useRecommendedProducts } from "@/hooks/useRecommendedProducts";
import { useProductsMeta } from "@/hooks/useProductsMeta";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

const BUDGETS: { label: string; min: number | null; max: number | null }[] = [
  { label: "Tous budgets", min: null, max: null },
  { label: "< 30 €", min: null, max: 30 },
  { label: "30 – 80 €", min: 30, max: 80 },
  { label: "80 – 200 €", min: 80, max: 200 },
  { label: "> 200 €", min: 200, max: null },
];

const PourToi = () => {
  const { preferences, update, toggleCategory, reset, hasPreferences } = useUserPreferences();
  const { categories, isLoading: metaLoading } = useProductsMeta();
  const { featured, recent, isLoading, isFetching } = useRecommendedProducts(preferences);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [panelOpen, setPanelOpen] = useState(false);

  const availableCategories = useMemo(() => categories.filter((c) => c !== "Tous"), [categories]);

  const activeBudget = BUDGETS.find(
    (b) => b.min === preferences.budgetMin && b.max === preferences.budgetMax,
  ) ?? BUDGETS[0];

  return (
    <div className="min-h-screen abyss-gradient">
      <KrakkenSidebar />
      <main className="pt-20 p-4 lg:p-6 space-y-6">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel-glow p-6 relative overflow-hidden"
        >
          <div
            className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 100% 0%, hsl(174 72% 46% / 0.08), transparent 65%)" }}
          />
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{
                  background: "hsl(174 72% 46% / 0.12)",
                  border: "1px solid hsl(174 72% 46% / 0.2)",
                  boxShadow: "0 0 14px -2px hsl(174 72% 46% / 0.25)",
                }}
              >
                <Sparkles
                  className="w-5 h-5 text-primary"
                  style={{ filter: "drop-shadow(0 0 5px hsl(174 72% 46% / 0.45))" }}
                />
              </div>
              <div>
                <h1 className="kraken-title text-xl">Produits pour toi</h1>
                <p className="text-sm text-muted-foreground">
                  Les dernières prises gagnantes, filtrées selon ton profil de chasse
                </p>
              </div>
            </div>
            <button
              onClick={() => setPanelOpen((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-primary transition-all hover:bg-primary/10"
              style={{ border: "1px solid hsl(174 72% 46% / 0.25)" }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Mon profil de chasse
            </button>
          </div>

          {/* Résumé / panneau préférences */}
          <div className="relative z-10 mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Profil</span>
            <span
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-primary"
              style={{ background: "hsl(174 72% 46% / 0.1)" }}
            >
              {activeBudget.label}
            </span>
            <span
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-foreground/80"
              style={{ background: "hsl(262 52% 58% / 0.12)" }}
            >
              {preferences.categories.length === 0
                ? "Toutes catégories"
                : `${preferences.categories.length} catégorie${preferences.categories.length > 1 ? "s" : ""}`}
            </span>
            {isFetching && !isLoading && <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />}
          </div>

          {panelOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="relative z-10 overflow-hidden"
            >
              <div className="mx-0 tentacle-line my-5" />
              <div className="space-y-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Budget</p>
                  <div className="flex flex-wrap gap-2">
                    {BUDGETS.map((b) => {
                      const active = b.min === preferences.budgetMin && b.max === preferences.budgetMax;
                      return (
                        <button
                          key={b.label}
                          onClick={() => update({ budgetMin: b.min, budgetMax: b.max })}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all",
                            active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                          )}
                          style={{
                            border: `1px solid ${active ? "hsl(174 72% 46% / 0.4)" : "hsl(225 20% 20%)"}`,
                            background: active ? "hsl(174 72% 46% / 0.1)" : "transparent",
                          }}
                        >
                          {b.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
                    Catégories préférées
                    {metaLoading && <span className="ml-2 normal-case tracking-normal">chargement…</span>}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableCategories.map((c) => {
                      const active = preferences.categories.includes(c);
                      return (
                        <button
                          key={c}
                          onClick={() => toggleCategory(c)}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all",
                            active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                          )}
                          style={{
                            border: `1px solid ${active ? "hsl(174 72% 46% / 0.4)" : "hsl(225 20% 20%)"}`,
                            background: active ? "hsl(174 72% 46% / 0.1)" : "transparent",
                          }}
                        >
                          {active && <Check className="w-3 h-3" />}
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[12px] text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.inStockOnly}
                      onChange={(e) => update({ inStockOnly: e.target.checked })}
                      className="accent-primary"
                    />
                    Uniquement les produits en stock
                  </label>
                  {hasPreferences && (
                    <button
                      onClick={reset}
                      className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </motion.section>

        {/* À la une */}
        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="kraken-title text-lg">À la une</h2>
            <span className="text-[11px] text-muted-foreground">Les plus fortes récurrences de ton profil</span>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="glass-panel p-3 space-y-3">
                  <div className="aspect-square rounded-xl bg-muted/10 animate-pulse" />
                  <div className="h-3 w-2/3 rounded bg-muted/10 animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-muted/10 animate-pulse" />
                </div>
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div className="glass-panel p-8 text-center space-y-2">
              <p className="text-sm text-foreground font-semibold">Aucune prise pour ce profil</p>
              <p className="text-[13px] text-muted-foreground">
                Élargis ton budget ou tes catégories pour voir remonter des produits.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {featured.map((p, i) => (
                <ProductForYouCard
                  key={p.url}
                  product={p}
                  rank={i + 1}
                  isFavorite={!!p.url && isFavorite(p.url)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </section>

        {/* Fraîches captures */}
        {recent.length > 0 && (
          <>
            <div className="tentacle-line" />
            <section className="space-y-3">
              <div className="flex items-baseline justify-between">
                <h2 className="kraken-title text-lg">Fraîches captures</h2>
                <span className="text-[11px] text-muted-foreground">Repérées le plus récemment</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                {recent.map((p) => (
                  <ProductForYouCard
                    key={p.url}
                    product={p}
                    isFavorite={!!p.url && isFavorite(p.url)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default PourToi;
