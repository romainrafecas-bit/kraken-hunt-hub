import { useMemo, useState } from "react";
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
  ImageOff,
} from "lucide-react";
import KrakkenNav from "@/components/dashboard/KrakkenSidebar";
import ProductForYouCard from "@/components/dashboard/ProductForYouCard";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useRecommendedProducts } from "@/hooks/useRecommendedProducts";
import { useProductsMeta } from "@/hooks/useProductsMeta";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";
import type { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { getCategoryLabel } from "@/lib/categoryLabels";

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
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  return (
  <article className="grid min-w-0 gap-6 border-y border-border py-6 md:grid-cols-[minmax(18rem,0.9fr)_minmax(0,1.1fr)] md:items-center lg:gap-10">
    <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-card">
      {imageFailed || !product.image ? (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
          <ImageOff className="w-7 h-7" strokeWidth={1.5} />
          <span className="text-xs">Aperçu indisponible</span>
        </div>
      ) : (
        <img src={product.image} alt={product.name} referrerPolicy="no-referrer" onError={() => setImageFailed(true)} className="w-full h-full object-contain p-8" />
      )}
      <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-sm bg-primary px-2.5 py-1 text-xs font-bold uppercase text-primary-foreground">
        <Flame className="w-3 h-3" /> N°1 aujourd’hui
      </span>
    </div>

    <div className="min-w-0 space-y-5">
      <p className="text-xs uppercase text-muted-foreground truncate">
        {product.brand} · {getCategoryLabel(product.category)}
      </p>
      <h2 className="font-display font-black text-2xl lg:text-3xl leading-tight text-foreground line-clamp-3">
        {product.name}
      </h2>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-2xl font-black text-foreground">
          {product.price === -1 ? "—" : `${product.price.toFixed(2)} €`}
        </span>
        <span className="bio-badge bio-teal flex items-center gap-1">
          <Repeat className="w-3 h-3" /> {product.recurrences} récurrences
        </span>
        <span className="bio-badge flex items-center gap-1 text-muted-foreground">
          <Users className="w-3 h-3" /> {product.sellers} vendeurs
        </span>
      </div>
      <div className="flex items-center gap-2 pt-1">
        <Button asChild>
          <a href={product.url} target="_blank" rel="noopener noreferrer">Voir la fiche <ExternalLink className="w-3.5 h-3.5" /></a>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => product.url && onToggleFavorite(product.url)}
          className="w-10 h-10"
          title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart
            className={cn("w-4 h-4", isFavorite ? "text-primary" : "text-muted-foreground")}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </Button>
      </div>
    </div>
  </article>
  );
};

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
  <Button
    variant="ghost"
    onClick={onSelect}
    className={cn(
      "w-full h-auto justify-start gap-3 rounded-md p-2.5 text-left group",
      active ? "bg-secondary text-foreground" : "text-muted-foreground",
    )}
  >
    <span
      className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-card"
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
      <span className="block text-xs text-muted-foreground font-mono">
        {product.price === -1 ? "—" : `${product.price.toFixed(2)} €`} · {product.recurrences} réc.
      </span>
    </span>
    <span className="text-xs font-mono text-primary/70 flex-shrink-0">#{rank}</span>
    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary flex-shrink-0" />
  </Button>
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
    <div className="min-h-screen bg-background">
      <KrakkenNav />
      <main className="max-w-[1440px] mx-auto pt-24 px-4 lg:px-8 pb-12 space-y-8">
        {/* En-tête éditorial */}
        <section className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase text-primary mb-1.5">Sélection du jour</p>
            <h1 className="font-display font-black text-3xl text-foreground">Produits pour toi</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Les dernières prises gagnantes, calibrées sur ton profil de chasse
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isFetching && !isLoading && <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />}
            <span className="flex items-center gap-2 px-3 py-2 rounded-md border border-border text-[12px] text-muted-foreground">
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
              className="flex items-center gap-2 px-3 py-2 rounded-md border border-border text-[12px] text-muted-foreground cursor-pointer"
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
              <Button
                variant="ghost"
                size="icon"
                onClick={reset}
                className="w-9 h-9"
                title="Réinitialiser mon profil"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </section>

        {/* Chips catégories */}
        <section className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          <Button
            variant="outline"
            onClick={() => update({ categories: [] })}
            className={cn(
              "h-8 px-3.5 text-[12px] flex-shrink-0",
              preferences.categories.length === 0 ? "border-primary text-primary" : "text-muted-foreground",
            )}
          >
            Toutes catégories
          </Button>
          {metaLoading && (
            <span className="flex items-center gap-2 text-[12px] text-muted-foreground px-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> chargement…
            </span>
          )}
          {availableCategories.map((c) => {
            const active = preferences.categories.includes(c);
            return (
              <Button
                variant="outline"
                key={c}
                onClick={() => toggleCategory(c)}
                className={cn(
                  "h-8 gap-1.5 px-3.5 text-[12px] flex-shrink-0",
                  active ? "border-primary text-primary" : "text-muted-foreground",
                )}
              >
                {active && <Check className="w-3 h-3" />}
                {getCategoryLabel(c)}
              </Button>
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
            <p className="text-sm text-muted-foreground">
              Élargis ton budget ou tes catégories pour voir remonter des produits.
            </p>
          </div>
        ) : (
          <>
            <section className="grid lg:grid-cols-[minmax(0,1.7fr)_minmax(18rem,0.7fr)] gap-8 items-stretch">
              {spotlight && (
                <Spotlight
                  product={spotlight}
                  isFavorite={!!spotlight.url && isFavorite(spotlight.url)}
                  onToggleFavorite={toggleFavorite}
                />
              )}
              <div className="min-w-0 border-t border-border py-4 space-y-2.5">

                <p className="text-xs uppercase text-muted-foreground">À comparer</p>
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
                  <span className="text-xs text-muted-foreground">Les plus fortes récurrences de ton profil</span>
                </div>
                <div className="grid lg:grid-cols-2 gap-x-8">
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
                <span className="text-xs text-muted-foreground">Repérées le plus récemment</span>
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
