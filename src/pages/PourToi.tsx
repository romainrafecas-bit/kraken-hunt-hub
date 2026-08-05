import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Flame,
  Check,
  RotateCcw,
  Loader2,
  Repeat,
  Users,
  ExternalLink,
  Heart,
  ChevronRight,
  Wallet,
} from "lucide-react";
import KrakkenNav from "@/components/dashboard/KrakkenSidebar";
import ProductForYouCard from "@/components/dashboard/ProductForYouCard";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useRecommendedProducts } from "@/hooks/useRecommendedProducts";
import { useProductsMeta } from "@/hooks/useProductsMeta";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";
import type { Product } from "@/data/products";

const BUDGETS: { label: string; min: number | null; max: number | null }[] = [
  { label: "Tous budgets", min: null, max: null },
  { label: "< 30 €", min: null, max: 30 },
  { label: "30 – 80 €", min: 30, max: 80 },
  { label: "80 – 200 €", min: 80, max: 200 },
  { label: "> 200 €", min: 200, max: null },
];

const Spotlight = ({
  product,
  isFavorite,
  onToggleFavorite,
}: {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (url: string) => void;
}) => (
  <motion.div
    key={product.url}
    initial={{ opacity: 0, scale: 0.99 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    className="glass-panel-glow relative overflow-hidden p-5 lg:p-7 h-full flex flex-col lg:flex-row gap-6 items-center"
  >
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse at 85% 15%, hsl(174 72% 46% / 0.12), transparent 55%), radial-gradient(ellipse at 5% 95%, hsl(262 52% 58% / 0.1), transparent 55%)",
      }}
    />
    <div
      className="relative z-10 w-full lg:w-[46%] aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden flex-shrink-0"
      style={{ background: "hsl(228 30% 10%)", border: "1px solid hsl(174 72% 46% / 0.1)" }}
    >
      <img
        src={product.image}
        alt={product.name}
        referrerPolicy="no-referrer"
        onError={(e) => {
          e.currentTarget.style.visibility = "hidden";
        }}
        className="w-full h-full object-contain p-6"
      />
      <span
        className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-[0.15em]"
        style={{
          background: "hsl(174 72% 46% / 0.16)",
          border: "1px solid hsl(174 72% 56% / 0.35)",
          color: "hsl(174 72% 70%)",
        }}
      >
        <Flame className="w-3 h-3" /> Prise n°1
      </span>
    </div>

    <div className="relative z-10 flex-1 min-w-0 space-y-4">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground truncate">
        {product.brand} · {product.category}
      </p>
      <h2 className="font-display font-black text-xl lg:text-2xl leading-tight text-foreground line-clamp-3">
        {product.name}
      </h2>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-2xl font-black font-mono text-foreground">
          {product.price === -1 ? "—" : `${product.price.toFixed(2)} €`}
        </span>
        <span className="bio-badge bio-teal flex items-center gap-1">
          <Repeat className="w-3 h-3" /> {product.recurrences} récurrences
        </span>
        <span className="bio-badge bio-violet flex items-center gap-1">
          <Users className="w-3 h-3" /> {product.sellers} vendeurs
        </span>
      </div>
      <div className="flex items-center gap-2 pt-1">
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-primary-foreground transition-all hover:brightness-110"
          style={{
            background: "linear-gradient(135deg, hsl(174 72% 50%), hsl(188 78% 52%))",
            boxShadow: "0 0 22px -6px hsl(174 72% 46% / 0.6)",
          }}
        >
          Voir la fiche <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <button
          onClick={() => product.url && onToggleFavorite(product.url)}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-primary/10"
          style={{ border: "1px solid hsl(174 72% 46% / 0.22)" }}
          title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart
            className={cn("w-4 h-4", isFavorite ? "text-primary" : "text-muted-foreground")}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>
      </div>
    </div>
  </motion.div>
);

const MiniRow = ({
  product,
  rank,
  active,
  onSelect,
}: {
  product: Product;
  rank: number;
  active: boolean;
  onSelect: () => void;
}) => (
  <button
    onClick={onSelect}
    className={cn(
      "w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all group",
      active ? "bg-primary/[0.07]" : "hover:bg-sidebar-accent/40",
    )}
    style={{ border: `1px solid ${active ? "hsl(174 72% 46% / 0.3)" : "hsl(225 20% 13%)"}` }}
  >
    <span
      className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"
      style={{ background: "hsl(228 30% 10%)" }}
    >
      <img
        src={product.image}
        alt=""
        loading="lazy"
        referrerPolicy="no-referrer"
        className="w-full h-full object-contain p-1"
      />
    </span>
    <span className="flex-1 min-w-0">
      <span className="block text-[12px] font-semibold text-foreground truncate">{product.name}</span>
      <span className="block text-[11px] text-muted-foreground font-mono">
        {product.price === -1 ? "—" : `${product.price.toFixed(2)} €`} · {product.recurrences} réc.
      </span>
    </span>
    <span className="text-[10px] font-mono text-primary/70 flex-shrink-0">#{rank}</span>
    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary flex-shrink-0" />
  </button>
);

const PourToi = () => {
  const { preferences, update, toggleCategory, reset, hasPreferences } = useUserPreferences();
  const { categories, isLoading: metaLoading } = useProductsMeta();
  const { featured, recent, isLoading, isFetching } = useRecommendedProducts(preferences);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [spotlightUrl, setSpotlightUrl] = useState<string | null>(null);

  const availableCategories = useMemo(() => categories.filter((c) => c !== "Tous"), [categories]);
  const spotlight = useMemo(
    () => featured.find((p) => p.url === spotlightUrl) ?? featured[0],
    [featured, spotlightUrl],
  );
  const shortlist = useMemo(() => featured.slice(0, 4), [featured]);
  const grid = useMemo(() => featured.slice(1), [featured]);

  return (
    <div className="min-h-screen abyss-gradient">
      <KrakkenNav />
      <main className="pt-24 px-4 lg:px-6 pb-10 space-y-7">
        {/* En-tête éditorial */}
        <section className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-primary/70 mb-1.5">Sélection du jour</p>
            <h1 className="kraken-title text-2xl lg:text-3xl">Produits pour toi</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Les dernières prises gagnantes, calibrées sur ton profil de chasse
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isFetching && !isLoading && <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />}
            <span className="flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] text-muted-foreground"
              style={{ border: "1px solid hsl(225 20% 14%)" }}>
              <Wallet className="w-3.5 h-3.5 text-primary/70" />
              <select
                value={BUDGETS.findIndex(
                  (b) => b.min === preferences.budgetMin && b.max === preferences.budgetMax,
                )}
                onChange={(e) => {
                  const b = BUDGETS[Number(e.target.value)] ?? BUDGETS[0];
                  update({ budgetMin: b.min, budgetMax: b.max });
                }}
                className="bg-transparent text-foreground text-[12px] font-semibold outline-none cursor-pointer"
              >
                {BUDGETS.map((b, i) => (
                  <option key={b.label} value={i} className="bg-card">
                    {b.label}
                  </option>
                ))}
              </select>
            </span>
            <label
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] text-muted-foreground cursor-pointer"
              style={{ border: "1px solid hsl(225 20% 14%)" }}
            >
              <input
                type="checkbox"
                checked={preferences.inStockOnly}
                onChange={(e) => update({ inStockOnly: e.target.checked })}
                className="accent-primary"
              />
              En stock
            </label>
            {hasPreferences && (
              <button
                onClick={reset}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                style={{ border: "1px solid hsl(225 20% 14%)" }}
                title="Réinitialiser mon profil"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </section>

        {/* Chips catégories */}
        <section className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          <button
            onClick={() => update({ categories: [] })}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all flex-shrink-0",
              preferences.categories.length === 0 ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
            style={{
              border: `1px solid ${preferences.categories.length === 0 ? "hsl(174 72% 46% / 0.4)" : "hsl(225 20% 18%)"}`,
              background: preferences.categories.length === 0 ? "hsl(174 72% 46% / 0.1)" : "transparent",
            }}
          >
            Toutes catégories
          </button>
          {metaLoading && (
            <span className="flex items-center gap-2 text-[12px] text-muted-foreground px-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> chargement…
            </span>
          )}
          {availableCategories.map((c) => {
            const active = preferences.categories.includes(c);
            return (
              <button
                key={c}
                onClick={() => toggleCategory(c)}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all flex-shrink-0",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
                style={{
                  border: `1px solid ${active ? "hsl(174 72% 46% / 0.4)" : "hsl(225 20% 18%)"}`,
                  background: active ? "hsl(174 72% 46% / 0.1)" : "transparent",
                }}
              >
                {active && <Check className="w-3 h-3" />}
                {c}
              </button>
            );
          })}
        </section>

        {/* Spotlight + shortlist */}
        {isLoading ? (
          <div className="grid lg:grid-cols-[2fr_1fr] gap-4">
            <div className="glass-panel h-72 animate-pulse" />
            <div className="glass-panel h-72 animate-pulse" />
          </div>
        ) : featured.length === 0 ? (
          <div className="glass-panel p-10 text-center space-y-2">
            <p className="text-sm text-foreground font-semibold">Aucune prise pour ce profil</p>
            <p className="text-[13px] text-muted-foreground">
              Élargis ton budget ou tes catégories pour voir remonter des produits.
            </p>
          </div>
        ) : (
          <>
            <section className="grid lg:grid-cols-[2fr_1fr] gap-4 items-stretch">
              {spotlight && (
                <Spotlight
                  product={spotlight}
                  isFavorite={!!spotlight.url && isFavorite(spotlight.url)}
                  onToggleFavorite={toggleFavorite}
                />
              )}
              <div className="glass-panel p-4 space-y-2.5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Le podium</p>
                {shortlist.map((p, i) => (
                  <MiniRow
                    key={p.url}
                    product={p}
                    rank={i + 1}
                    active={spotlight?.url === p.url}
                    onSelect={() => setSpotlightUrl(p.url)}
                  />
                ))}
              </div>
            </section>

            {/* Grille populaire */}
            {grid.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <h2 className="kraken-title text-lg">Prises populaires</h2>
                  <span className="text-[11px] text-muted-foreground">Les plus fortes récurrences de ton profil</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {grid.map((p, i) => (
                    <ProductForYouCard
                      key={p.url}
                      product={p}
                      rank={i + 2}
                      isFavorite={!!p.url && isFavorite(p.url)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Fraîches captures — carrousel horizontal */}
        {recent.length > 0 && (
          <>
            <div className="tentacle-line" />
            <section className="space-y-3">
              <div className="flex items-baseline justify-between">
                <h2 className="kraken-title text-lg">Fraîches captures</h2>
                <span className="text-[11px] text-muted-foreground">Repérées le plus récemment</span>
              </div>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x">
                {recent.map((p) => (
                  <div key={p.url} className="w-44 md:w-52 flex-shrink-0 snap-start">
                    <ProductForYouCard
                      product={p}
                      isFavorite={!!p.url && isFavorite(p.url)}
                      onToggleFavorite={toggleFavorite}
                    />
                  </div>
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
