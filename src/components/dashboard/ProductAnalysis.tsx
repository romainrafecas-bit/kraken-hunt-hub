import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Search, Users, CalendarDays, Crosshair, Clock, Heart, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product, categories, brands } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { externalSupabase as supabase } from "@/integrations/supabase/external-client";
import ProductSkeleton from "./ProductSkeleton";
import EmptyState from "./EmptyState";

type SortKey = "score" | "price" | "recurrences" | "rating" | "name" | "brand" | "sellers" | "lastSeen";
type SortDir = "asc" | "desc";

const ITEMS_PER_PAGE = 12;

const datePresets = [
  { label: "Tout", value: "all" },
  { label: "24h", value: "24h" },
  { label: "7 jours", value: "7d" },
  { label: "30 jours", value: "30d" },
  { label: "3 mois", value: "3m" },
  { label: "6 mois", value: "6m" },
];

const categoryDisplayNames: Record<string, string> = {
  "Tous": "Tous",
  "telephonie": "Téléphonie",
  "photo-numerique": "Photo Numérique",
  "informatique": "Informatique",
  "tv-son": "TV & Son",
  "electromenager": "Électroménager",
  "gaming": "Gaming",
  "maison": "Maison",
  "jouets": "Jouets",
  "sport": "Sport",
  "mode": "Mode",
  "beaute": "Beauté",
  "auto": "Auto",
  "bagages": "Bagages",
  "juniors": "Juniors",
  "image-son": "Image & Son",
  "high-tech": "High-Tech",
  "bricolage": "Bricolage",
  "jardin": "Jardin",
  "animalerie": "Animalerie",
  "epicerie": "Épicerie",
  "bebe": "Bébé",
  "loisirs": "Loisirs",
  "bijoux": "Bijoux & Montres",
  "literie": "Literie",
  "bureau": "Bureau",
  "vin": "Vin & Spiritueux",
};

function formatCategoryName(slug: string): string {
  if (categoryDisplayNames[slug]) return categoryDisplayNames[slug];
  if (categoryDisplayNames[slug.toLowerCase()]) return categoryDisplayNames[slug.toLowerCase()];
  // Fallback: capitalize each word, replace dashes/underscores with spaces
  return slug
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

interface ProductAnalysisProps {
  externalProducts?: Product[];
  externalLoading?: boolean;
}

const ProductAnalysis = ({ externalProducts, externalLoading }: ProductAnalysisProps) => {
  const { products: fetchedProducts, loading: fetchLoading } = useProducts();
  const allProducts = externalProducts || fetchedProducts;
  const isLoading = externalLoading ?? fetchLoading;

  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [excludedBrands, setExcludedBrands] = useState<Set<string>>(new Set());
  const [selectedDatePreset, setSelectedDatePreset] = useState("all");
  const catScrollRef = useRef<HTMLDivElement>(null);
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        supabase.from("favorites").select("product_url").eq("user_id", data.user.id)
          .then(({ data: favs }) => {
            if (favs) setFavorites(new Set(favs.map(f => f.product_url)));
          });
      }
    });
  }, []);

  const toggleFavorite = async (product: Product) => {
    if (!userId || !product.url) return;
    const url = product.url;
    const isFav = favorites.has(url);
    const next = new Set(favorites);
    if (isFav) {
      next.delete(url);
      setFavorites(next);
      await supabase.from("favorites").delete().eq("user_id", userId).eq("product_url", url);
    } else {
      next.add(url);
      setFavorites(next);
      await supabase.from("favorites").insert({ user_id: userId, product_url: url });
    }
  };

  const dynamicCategories = useMemo(() => {
    const cats = [...new Set(allProducts.map(p => p.category))].sort();
    return ["Tous", ...cats];
  }, [allProducts]);

  const dynamicBrands = useMemo(() => {
    const b = [...new Set(allProducts.map(p => p.brand))].sort();
    return ["Toutes", ...b];
  }, [allProducts]);

  const toggleExcludeBrand = (brand: string) => {
    setExcludedBrands(prev => {
      const next = new Set(prev);
      if (next.has(brand)) next.delete(brand); else next.add(brand);
      return next;
    });
    setPage(0);
  };

  const filtered = useMemo(() => {
    let data = [...allProducts];
    if (selectedCategory !== "Tous") data = data.filter(p => p.category === selectedCategory);
    if (excludedBrands.size > 0) data = data.filter(p => !excludedBrands.has(p.brand));
    if (searchQuery) data = data.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    // Date filtering
    if (selectedDatePreset !== "all") {
      const now = Date.now();
      const cutoffs: Record<string, number> = { "24h": 86400000, "7d": 604800000, "30d": 2592000000, "3m": 7776000000, "6m": 15552000000 };
      const cutoff = cutoffs[selectedDatePreset];
      if (cutoff) {
        data = data.filter(p => {
          const ls = p.lastSeen;
          if (!ls) return false;
          // Parse "Il y a Xmin/Xh/Xj" format
          const minMatch = ls.match(/(\d+)\s*min/);
          const hMatch = ls.match(/(\d+)\s*h/);
          const dMatch = ls.match(/(\d+)\s*j/);
          let age = Infinity;
          if (minMatch) age = parseInt(minMatch[1]) * 60000;
          else if (hMatch) age = parseInt(hMatch[1]) * 3600000;
          else if (dMatch) age = parseInt(dMatch[1]) * 86400000;
          return age <= cutoff;
        });
      }
    }
    data.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return data;
  }, [allProducts, selectedCategory, excludedBrands, sortKey, sortDir, searchQuery, selectedDatePreset]);

  const paged = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
    setPage(0);
  };

  const SortHeader = ({ label, sortKeyName, className: headerClass }: { label: string; sortKeyName: SortKey; className?: string }) => (
    <th className={cn("text-left px-4 py-3 cursor-pointer group/sort select-none", headerClass)} onClick={() => toggleSort(sortKeyName)}>
      <div className="flex items-center gap-1.5">
        <span className="soft-label group-hover/sort:text-foreground transition-colors">{label}</span>
        {sortKey === sortKeyName ? (
          sortDir === "desc" ? <ArrowDown className="w-3 h-3 text-primary" /> : <ArrowUp className="w-3 h-3 text-primary" />
        ) : (
          <ArrowUpDown className="w-3 h-3 text-muted-foreground/30 group-hover/sort:text-muted-foreground transition-colors" />
        )}
      </div>
    </th>
  );

  const getScoreStyle = (score: number) => {
    if (score >= 90) return { color: 'hsl(162 72% 52%)', shadow: 'hsl(162 68% 44% / 0.4)', bg: 'hsl(162 68% 44%)' };
    if (score >= 80) return { color: 'hsl(174 72% 56%)', shadow: 'hsl(174 72% 46% / 0.4)', bg: 'hsl(174 72% 46%)' };
    if (score >= 70) return { color: 'hsl(188 80% 62%)', shadow: 'hsl(188 78% 52% / 0.4)', bg: 'hsl(188 78% 52%)' };
    return { color: 'hsl(210 10% 50%)', shadow: 'transparent', bg: 'hsl(210 10% 40%)' };
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.7) return 'hsl(38 92% 60%)';
    if (rating >= 4.4) return 'hsl(45 85% 55%)';
    if (rating >= 4.0) return 'hsl(30 75% 55%)';
    return 'hsl(210 10% 50%)';
  };

  if (isLoading) return <ProductSkeleton />;
  if (allProducts.length === 0) return <EmptyState />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="glass-panel-glow overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 border-b border-border/40 relative">
        <div className="absolute top-0 left-0 right-0 h-px tentacle-line" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Crosshair className="w-4 h-4" style={{ color: 'hsl(174 72% 56%)', filter: 'drop-shadow(0 0 4px hsl(174 72% 46% / 0.4))' }} />
              <h3 className="font-display text-base font-bold text-foreground">Résultats d'analyse</h3>
              <span className="bio-badge bio-teal">{filtered.length} proies</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 ml-7">Données en temps réel</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-3.5 h-3.5" style={{ color: 'hsl(262 72% 72%)' }} />
              {datePresets.map(dp => (
                <button key={dp.value} onClick={() => { setSelectedDatePreset(dp.value); setPage(0); }}
                  className={cn("px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                    selectedDatePreset === dp.value ? "bio-violet" : "bg-secondary/40 text-muted-foreground hover:text-foreground hover:bg-secondary/70")}>
                  {dp.label}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input type="text" placeholder="Traquer un produit..." value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setPage(0); }}
                className="bg-secondary/60 border border-border/40 rounded-xl pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 w-full lg:w-56 transition-all" />
            </div>
          </div>
        </div>
        {/* Filters */}
        <div className="mt-4 space-y-3">
          {/* Categories - horizontal scroll */}
          <div className="flex items-center gap-2">
            <span className="soft-label mr-1 flex-shrink-0">Catégorie</span>
            <div ref={catScrollRef} className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1" style={{ scrollbarWidth: 'none' }}>
              {dynamicCategories.map(cat => (
                <button key={cat} onClick={() => { setSelectedCategory(cat); setPage(0); }}
                  className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0",
                    selectedCategory === cat ? "bio-teal" : "bg-secondary/40 text-muted-foreground border border-transparent hover:text-foreground hover:bg-secondary/70")}>
                  {cat === "Tous" ? "Tous" : formatCategoryName(cat)}
                </button>
              ))}
            </div>
          </div>
          {/* Brands - excludable */}
          <div className="flex items-center gap-2">
            <span className="soft-label mr-1 flex-shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Exclure
            </span>
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1" style={{ scrollbarWidth: 'none' }}>
              {dynamicBrands.filter(b => b !== "Toutes").map(brand => (
                <button key={brand} onClick={() => toggleExcludeBrand(brand)}
                  className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 flex items-center gap-1",
                    excludedBrands.has(brand)
                      ? "bg-red-500/15 text-red-400 border border-red-500/30"
                      : "bg-secondary/40 text-muted-foreground border border-transparent hover:text-foreground hover:bg-secondary/70")}>
                  {formatCategoryName(brand)}
                  {excludedBrands.has(brand) && <X className="w-3 h-3" />}
                </button>
              ))}
            </div>
            {excludedBrands.size > 0 && (
              <button onClick={() => { setExcludedBrands(new Set()); setPage(0); }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 underline">
                Réinitialiser
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left px-4 py-3"><span className="soft-label">#</span></th>
              <th className="text-left px-4 py-3"><span className="soft-label">Image</span></th>
              <SortHeader label="Produit" sortKeyName="name" />
              <SortHeader label="Marque" sortKeyName="brand" />
              <th className="text-left px-4 py-3"><span className="soft-label">Catégorie</span></th>
              <SortHeader label="Prix" sortKeyName="price" />
              <SortHeader label="Dernier vu" sortKeyName="lastSeen" />
              <SortHeader label="Note" sortKeyName="rating" />
              <SortHeader label="Vendeurs" sortKeyName="sellers" />
              <SortHeader label="Score" sortKeyName="score" />
              <th className="text-left px-4 py-3"><span className="soft-label"></span></th>
            </tr>
          </thead>
          <tbody>
            {paged.map((product, i) => {
              const globalRank = page * ITEMS_PER_PAGE + i + 1;
              const scoreStyle = getScoreStyle(product.score);
              const ratingColor = getRatingColor(product.rating);
              const isFav = product.url ? favorites.has(product.url) : false;

              return (
                <motion.tr key={product.url || product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-border/10 hover:bg-primary/[0.03] transition-all duration-200 cursor-pointer group">
                  <td className="px-4 py-3">
                    <span className={cn("font-display text-sm font-black")}
                      style={globalRank <= 3 ? { color: 'hsl(174 72% 56%)', textShadow: '0 0 8px hsl(174 72% 46% / 0.3)' } : { color: 'hsl(210 10% 30%)' }}>
                      {String(globalRank).padStart(2, '0')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                      style={{ border: '1px solid hsl(225 20% 15%)', boxShadow: '0 2px 8px hsl(228 50% 2% / 0.4)' }}>
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground/90 font-medium group-hover:text-primary transition-colors">{product.name}</span>
                  </td>
                  <td className="px-4 py-3"><span className="text-xs text-secondary-foreground font-medium">{product.brand}</span></td>
                  <td className="px-4 py-3"><span className="bio-badge bio-cyan text-[10px]">{product.category}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-mono font-bold text-foreground">{product.price}€</span>
                      <span className="text-[10px] text-muted-foreground/35 line-through">{product.originalPrice}€</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" style={{ color: 'hsl(174 72% 56%)', opacity: 0.6 }} />
                      <span className="text-sm font-medium" style={{
                        color: product.lastSeen.includes('min') || product.lastSeen.includes('1h') || product.lastSeen.includes('2h')
                          ? 'hsl(162 72% 52%)' : product.lastSeen.includes('j') ? 'hsl(210 10% 50%)' : 'hsl(174 72% 56%)',
                      }}>{product.lastSeen}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold" style={{ color: ratingColor, textShadow: `0 0 8px ${ratingColor}40` }}>{product.rating}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <span key={star} className="text-[10px]" style={{
                            color: star <= Math.round(product.rating) ? ratingColor : 'hsl(210 10% 20%)',
                            textShadow: star <= Math.round(product.rating) ? `0 0 4px ${ratingColor}60` : undefined,
                          }}>★</span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3 h-3" style={{ color: 'hsl(262 60% 64%)', opacity: 0.6 }} />
                      <span className="text-sm font-bold" style={{
                        color: product.sellers >= 25 ? 'hsl(262 72% 72%)' : product.sellers >= 15 ? 'hsl(262 50% 62%)' : 'hsl(210 10% 50%)',
                        textShadow: product.sellers >= 25 ? '0 0 8px hsl(262 52% 58% / 0.3)' : undefined,
                      }}>{product.sellers}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full overflow-hidden" style={{ background: 'hsl(225 18% 12%)' }}>
                        <div className="h-full rounded-full" style={{ width: `${product.score}%`, backgroundColor: scoreStyle.bg, boxShadow: `0 0 8px ${scoreStyle.shadow}` }} />
                      </div>
                      <span className="text-xs font-black font-mono" style={{ color: scoreStyle.color, textShadow: `0 0 8px ${scoreStyle.shadow}` }}>{product.score}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product); }}
                      className="p-1.5 rounded-lg hover:bg-secondary/50 transition-all">
                      <Heart className={cn("w-4 h-4 transition-all", isFav ? "fill-current" : "")}
                        style={{
                          color: isFav ? 'hsl(340 75% 55%)' : 'hsl(210 10% 30%)',
                          filter: isFav ? 'drop-shadow(0 0 6px hsl(340 75% 55% / 0.4))' : undefined,
                        }} />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-border/20 flex items-center justify-between relative">
          <div className="absolute top-0 left-0 right-0 h-px tentacle-line" />
          <span className="text-xs text-muted-foreground">
            {page * ITEMS_PER_PAGE + 1}–{Math.min((page + 1) * ITEMS_PER_PAGE, filtered.length)} sur {filtered.length}
          </span>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="p-1.5 rounded-lg bg-secondary/40 border border-border/25 text-muted-foreground hover:text-foreground hover:bg-secondary/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {(() => {
              const pages: (number | 'ellipsis')[] = [];
              if (totalPages <= 5) {
                for (let i = 0; i < totalPages; i++) pages.push(i);
              } else {
                pages.push(0);
                if (page > 2) pages.push('ellipsis');
                for (let i = Math.max(1, page - 1); i <= Math.min(totalPages - 2, page + 1); i++) pages.push(i);
                if (page < totalPages - 3) pages.push('ellipsis');
                pages.push(totalPages - 1);
              }
              return pages.map((p, idx) =>
                p === 'ellipsis' ? (
                  <span key={`e-${idx}`} className="w-8 h-8 flex items-center justify-center text-muted-foreground/40">
                    <span className="text-sm">···</span>
                  </span>
                ) : (
                  <button key={p} onClick={() => setPage(p)}
                    className={cn("w-8 h-8 rounded-lg text-xs font-bold transition-all",
                      p === page ? "bio-teal" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50")}>
                    {p + 1}
                  </button>
                )
              );
            })()}
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
              className="p-1.5 rounded-lg bg-secondary/40 border border-border/25 text-muted-foreground hover:text-foreground hover:bg-secondary/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductAnalysis;
