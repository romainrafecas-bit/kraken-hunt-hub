import { useState, useMemo, useEffect, useRef, useCallback } from "react";

// ─── Persisted state helper ─────────────────────────────────────────────
// Stores filter values in localStorage so they survive tab switches & reloads.
// Supports Set via {__set:true, values:[...]} sentinel.
const STORAGE_PREFIX = "krakken:produits:";

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (raw == null) return fallback;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.__set === true && Array.isArray(parsed.values)) {
      return new Set(parsed.values) as unknown as T;
    }
    return parsed as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  try {
    const serialized = value instanceof Set
      ? JSON.stringify({ __set: true, values: [...value] })
      : JSON.stringify(value);
    localStorage.setItem(STORAGE_PREFIX + key, serialized);
  } catch {
    /* quota / private mode — ignore */
  }
}

function usePersistedState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(() => readStorage(key, defaultValue));
  useEffect(() => { writeStorage(key, state); }, [key, state]);
  return [state, setState] as const;
}

const FILTER_KEYS = [
  "selectedCategory", "excludedBrands", "selectedDatePreset",
  "sortKey", "sortDir", "stockFilter", "page",
  "searchQuery", "priceMin", "priceMax", "sellersMin", "sellersMax",
  "selectedUrls",
];
import { motion } from "framer-motion";
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Search, Users, CalendarDays, Crosshair, Clock, Heart, X, Filter, Euro, Camera, Download, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/data/products";
import { useProductsPaginated } from "@/hooks/useProductsPaginated";
import { useProductsMeta } from "@/hooks/useProductsMeta";
import { fetchAllMatchingUrls, SELECT_ALL_CAP } from "@/hooks/productsQuery";
import { toast } from "sonner";
import { externalSupabase as supabase } from "@/integrations/supabase/external-client";
import * as XLSX from "xlsx";
import ProductSkeleton from "./ProductSkeleton";
import EmptyState from "./EmptyState";
import { useFavorites } from "@/hooks/useFavorites";

type SortKey = "price" | "recurrences" | "rating" | "name" | "brand" | "sellers" | "lastSeen";
type SortDir = "asc" | "desc";

const ITEMS_PER_PAGE = 20;

const FRENCH_MONTHS_FULL = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

function buildDatePresets() {
  const presets: { label: string; value: string }[] = [
    { label: "Tout", value: "all" },
  ];
  const now = new Date();
  let y = now.getFullYear();
  let m = now.getMonth() + 1; // 1-12
  // Du mois courant jusqu'à Janvier 2025 (récent → ancien)
  while (y > 2025 || (y === 2025 && m >= 1)) {
    presets.push({
      label: `${FRENCH_MONTHS_FULL[m - 1]} ${y}`,
      value: `month-${y}-${String(m).padStart(2, "0")}`,
    });
    m -= 1;
    if (m === 0) { m = 12; y -= 1; }
  }
  return presets;
}

const datePresets = buildDatePresets();

const categoryDisplayNames: Record<string, string> = {
  "Tous": "Tous",
  "telephonie": "Téléphonie", "photo-numerique": "Photo Numérique", "informatique": "Informatique",
  "tv-son": "TV & Son", "electromenager": "Électroménager", "gaming": "Gaming", "maison": "Maison",
  "jouets": "Jouets", "sport": "Sport", "mode": "Mode", "beaute": "Beauté", "auto": "Auto",
  "bagages": "Bagages", "juniors": "Juniors", "image-son": "Image & Son", "high-tech": "High-Tech",
  "bricolage": "Bricolage", "jardin": "Jardin", "animalerie": "Animalerie", "epicerie": "Épicerie",
  "bebe": "Bébé", "loisirs": "Loisirs", "bijoux": "Bijoux & Montres", "literie": "Literie",
  "bureau": "Bureau", "vin": "Vin & Spiritueux",
};

function formatCategoryName(slug: string): string {
  if (categoryDisplayNames[slug]) return categoryDisplayNames[slug];
  if (categoryDisplayNames[slug.toLowerCase()]) return categoryDisplayNames[slug.toLowerCase()];
  return slug.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

const ProductAnalysis = () => {
  const [selectedCategory, setSelectedCategory] = usePersistedState<string>("selectedCategory", "Tous");
  const [excludedBrands, setExcludedBrands] = usePersistedState<Set<string>>("excludedBrands", new Set());
  const [selectedDatePreset, setSelectedDatePreset] = usePersistedState<string>("selectedDatePreset", "all");
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const brandDropdownRef = useRef<HTMLDivElement>(null);
  const [sortKey, setSortKey] = usePersistedState<SortKey>("sortKey", "lastSeen");
  const [stockFilter, setStockFilter] = usePersistedState<"all" | "in_stock" | "out_of_stock">("stockFilter", "all");
  const [sortDir, setSortDir] = usePersistedState<SortDir>("sortDir", "desc");
  const [page, setPage] = usePersistedState<number>("page", 0);
  const [searchQuery, setSearchQuery] = usePersistedState<string>("searchQuery", "");
  const { isFavorite, toggleFavorite: toggleFavoriteUrl } = useFavorites();
  const [priceMin, setPriceMin] = usePersistedState<string>("priceMin", "");
  const [priceMax, setPriceMax] = usePersistedState<string>("priceMax", "");
  const [sellersMin, setSellersMin] = usePersistedState<string>("sellersMin", "");
  const [sellersMax, setSellersMax] = usePersistedState<string>("sellersMax", "");
  const [selectedUrls, setSelectedUrls] = usePersistedState<Set<string>>("selectedUrls", new Set());
  const [selectingAll, setSelectingAll] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");

  const resetAllFilters = useCallback(() => {
    try {
      FILTER_KEYS.forEach(k => localStorage.removeItem(STORAGE_PREFIX + k));
    } catch { /* ignore */ }
    setSelectedCategory("Tous");
    setExcludedBrands(new Set());
    setSelectedDatePreset("all");
    setSortKey("lastSeen");
    setStockFilter("all");
    setSortDir("desc");
    setPage(0);
    setSearchQuery("");
    setPriceMin("");
    setPriceMax("");
    setSellersMin("");
    setSellersMax("");
    setSelectedUrls(new Set());
  }, [setSelectedCategory, setExcludedBrands, setSelectedDatePreset, setSortKey, setStockFilter, setSortDir, setPage, setSearchQuery, setPriceMin, setPriceMax, setSellersMin, setSellersMax, setSelectedUrls]);

  // Cached meta (categories + brands) — shared via React Query so it survives navigation
  const {
    categories: dynamicCategories,
    brands: dynamicBrands,
    isLoading: metaLoading,
    error: metaError,
    refetch: refetchMeta,
  } = useProductsMeta();

  const filters = useMemo(() => ({
    category: selectedCategory,
    excludedBrands,
    searchQuery,
    stockFilter,
    datePreset: selectedDatePreset,
    sortKey,
    sortDir,
    page,
    pageSize: ITEMS_PER_PAGE,
    priceMin: priceMin === "" ? null : Number(priceMin),
    priceMax: priceMax === "" ? null : Number(priceMax),
    sellersMin: sellersMin === "" ? null : Number(sellersMin),
    sellersMax: sellersMax === "" ? null : Number(sellersMax),
  }), [selectedCategory, excludedBrands, searchQuery, stockFilter, selectedDatePreset, sortKey, sortDir, page, priceMin, priceMax, sellersMin, sellersMax]);

  const { products: paged, totalCount, loading: isLoading } = useProductsPaginated(filters);
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(e.target as Node)) {
        setBrandDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleFavorite = (product: Product) => {
    if (!product.url) return;
    toggleFavoriteUrl(product.url);
  };

  const toggleExcludeBrand = (brand: string) => {
    setExcludedBrands(prev => {
      const next = new Set(prev);
      if (next.has(brand)) next.delete(brand); else next.add(brand);
      return next;
    });
    setPage(0);
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
    setPage(0);
  };

  const toggleSelect = (url: string) => {
    setSelectedUrls(prev => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url); else next.add(url);
      return next;
    });
  };

  const allPageSelected = paged.length > 0 && paged.every(p => p.url && selectedUrls.has(p.url));
  const togglePageSelectAll = () => {
    setSelectedUrls(prev => {
      const next = new Set(prev);
      if (allPageSelected) {
        paged.forEach(p => p.url && next.delete(p.url));
      } else {
        paged.forEach(p => p.url && next.add(p.url));
      }
      return next;
    });
  };

  const selectAllMatching = async () => {
    if (selectingAll) return;
    if (totalCount > SELECT_ALL_CAP) {
      toast.error(`Sélection limitée à ${SELECT_ALL_CAP} produits. Affinez vos filtres.`);
      return;
    }
    setSelectingAll(true);
    try {
      const urls = await fetchAllMatchingUrls({
        category: selectedCategory,
        excludedBrands,
        searchQuery,
        stockFilter,
        datePreset: selectedDatePreset,
        priceMin: priceMin === "" ? null : Number(priceMin),
        priceMax: priceMax === "" ? null : Number(priceMax),
        sellersMin: sellersMin === "" ? null : Number(sellersMin),
        sellersMax: sellersMax === "" ? null : Number(sellersMax),
      });
      const currentPreset = datePresets.find(d => d.value === selectedDatePreset);
      const scope = selectedDatePreset.startsWith("month-") && currentPreset
        ? ` (${currentPreset.label})`
        : "";
      let added = 0;
      let total = 0;
      setSelectedUrls(prev => {
        const next = new Set(prev);
        for (const u of urls) {
          if (!next.has(u)) added++;
          next.add(u);
        }
        total = next.size;
        return next;
      });
      if (added === 0) {
        toast.info(`Tous les produits${scope} étaient déjà sélectionnés — ${total} au total`);
      } else {
        toast.success(`+${added} produit${added > 1 ? "s" : ""} ajouté${added > 1 ? "s" : ""}${scope} — ${total} sélectionné${total > 1 ? "s" : ""} au total`);
      }
    } catch (e: any) {
      toast.error("Erreur lors de la sélection globale");
    } finally {
      setSelectingAll(false);
    }
  };

  const deselectAllMatching = async () => {
    if (selectingAll) return;
    if (totalCount > SELECT_ALL_CAP) {
      toast.error(`Désélection limitée à ${SELECT_ALL_CAP} produits. Affinez vos filtres.`);
      return;
    }
    setSelectingAll(true);
    try {
      const urls = await fetchAllMatchingUrls({
        category: selectedCategory,
        excludedBrands,
        searchQuery,
        stockFilter,
        datePreset: selectedDatePreset,
        priceMin: priceMin === "" ? null : Number(priceMin),
        priceMax: priceMax === "" ? null : Number(priceMax),
        sellersMin: sellersMin === "" ? null : Number(sellersMin),
        sellersMax: sellersMax === "" ? null : Number(sellersMax),
      });
      const currentPreset = datePresets.find(d => d.value === selectedDatePreset);
      const scope = selectedDatePreset.startsWith("month-") && currentPreset
        ? ` (${currentPreset.label})`
        : "";
      let removed = 0;
      let total = 0;
      setSelectedUrls(prev => {
        const next = new Set(prev);
        for (const u of urls) {
          if (next.delete(u)) removed++;
        }
        total = next.size;
        return next;
      });
      if (removed === 0) {
        toast.info(`Aucun produit${scope} n'était sélectionné`);
      } else {
        toast.success(`-${removed} produit${removed > 1 ? "s" : ""} retiré${removed > 1 ? "s" : ""}${scope} — ${total} restant${total > 1 ? "s" : ""}`);
      }
    } catch (e: any) {
      toast.error("Erreur lors de la désélection globale");
    } finally {
      setSelectingAll(false);
    }
  };

  const googleLensUrl = (imageUrl: string) =>
    `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(imageUrl)}`;

  const exportSelectedToExcel = async () => {
    if (selectedUrls.size === 0) return;
    const urls = [...selectedUrls];
    // Fetch full data for selected products from the server (in chunks to stay under URL limits)
    const chunkSize = 100;
    const rows: any[] = [];
    for (let i = 0; i < urls.length; i += chunkSize) {
      const chunk = urls.slice(i, i + chunkSize);
      const { data } = await supabase
        .from("products")
        .select("title,brand,category,price,sellers_count,in_stock,recurrences,last_seen,added_date,url,image_url")
        .in("url", chunk);
      if (data) rows.push(...data);
    }
    const exportRows = rows.map((p: any) => ({
      "Produit": p.title,
      "Marque": p.brand || "",
      "Catégorie": formatCategoryName(p.category || ""),
      "Prix (€)": p.price === -1 ? "Rupture" : (p.price ?? ""),
      "En stock": p.in_stock === false ? "Non" : "Oui",
      "Vendeurs": p.sellers_count ?? "",
      "Récurrences": p.recurrences ?? "",
      "Dernier vu": p.last_seen ? new Date(p.last_seen).toLocaleDateString("fr-FR") : "",
      "Ajouté le": p.added_date ? new Date(p.added_date).toLocaleDateString("fr-FR") : "",
      "URL produit": p.url,
      "Image": p.image_url || "",
      "Google Lens": p.image_url ? googleLensUrl(p.image_url) : "",
    }));
    const ws = XLSX.utils.json_to_sheet(exportRows);
    ws["!cols"] = [
      { wch: 50 }, { wch: 18 }, { wch: 18 }, { wch: 12 }, { wch: 10 },
      { wch: 10 }, { wch: 12 }, { wch: 14 }, { wch: 14 },
      { wch: 60 }, { wch: 60 }, { wch: 60 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Produits Kraken");
    const date = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `kraken-produits-${date}.xlsx`);
  };

  const clearSelection = () => setSelectedUrls(new Set());

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

  const getRatingColor = (rating: number) => {
    if (rating >= 4.7) return 'hsl(38 92% 60%)';
    if (rating >= 4.4) return 'hsl(45 85% 55%)';
    if (rating >= 4.0) return 'hsl(30 75% 55%)';
    return 'hsl(210 10% 50%)';
  };

  if (isLoading && paged.length === 0) return <ProductSkeleton />;

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
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Crosshair className="w-4 h-4" style={{ color: 'hsl(174 72% 56%)', filter: 'drop-shadow(0 0 4px hsl(174 72% 46% / 0.4))' }} />
              <h3 className="font-display text-base font-bold text-foreground">Résultats d'analyse</h3>
              <span className="bio-badge bio-teal">{totalCount.toLocaleString("fr-FR")} proies</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 ml-7">Données en temps réel — pagination serveur</p>
          </div>
        </div>
        {/* Filters row */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {/* Category dropdown */}
          <div className="relative flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={e => { setSelectedCategory(e.target.value); setPage(0); }}
              disabled={metaLoading}
              aria-busy={metaLoading}
              className={cn(
                "bg-secondary/60 border border-border/40 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all appearance-none pr-8 min-w-[200px]",
                metaLoading ? "cursor-wait opacity-70 text-muted-foreground italic" : "cursor-pointer"
              )}
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234dd4ac' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
            >
              {metaLoading ? (
                <option value="Tous" className="bg-card text-foreground">Chargement des catégories…</option>
              ) : (
                dynamicCategories.map(cat => (
                  <option key={cat} value={cat} className="bg-card text-foreground">
                    {formatCategoryName(cat)}
                  </option>
                ))
              )}
            </select>
            {metaLoading && (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary flex-shrink-0" aria-hidden="true" />
            )}
            {metaError && !metaLoading && (
              <button
                onClick={() => refetchMeta()}
                className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                title="Erreur de chargement — cliquez pour réessayer"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                Réessayer
              </button>
            )}
            {!metaLoading && !metaError && dynamicCategories.length > 1 && (
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-medium whitespace-nowrap">
                {dynamicCategories.length - 1} cat.
              </span>
            )}
          </div>


          {/* Date preset dropdown */}
          <div className="relative flex items-center gap-2">
            <CalendarDays className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'hsl(174 72% 60%)' }} />
            <select
              value={selectedDatePreset}
              onChange={e => { setSelectedDatePreset(e.target.value); setPage(0); }}
              className="bg-secondary/60 border border-border/40 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer pr-8 min-w-[140px]"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234dd4ac' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
            >
              {datePresets.map(dp => (
                <option key={dp.value} value={dp.value} className="bg-card text-foreground">{dp.label}</option>
              ))}
            </select>
          </div>

          {/* Select all matching filters — quick access */}
          {totalCount > 0 && (() => {
            const overCap = totalCount > SELECT_ALL_CAP;
            const currentPreset = datePresets.find(d => d.value === selectedDatePreset);
            const scopeLabel = selectedDatePreset.startsWith("month-") && currentPreset
              ? `tout ${currentPreset.label}`
              : `les ${totalCount.toLocaleString("fr-FR")} produits filtrés`;
            const deselectLabel = selectedDatePreset.startsWith("month-") && currentPreset
              ? `Désélectionner ${currentPreset.label}`
              : `Désélectionner les ${totalCount.toLocaleString("fr-FR")} filtrés`;
            return (
              <>
                <button
                  onClick={selectAllMatching}
                  disabled={selectingAll || overCap}
                  title={overCap ? `Maximum ${SELECT_ALL_CAP} produits — affinez les filtres` : undefined}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/15 border border-primary/30 text-primary hover:bg-primary/25 transition-all text-xs font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {selectingAll ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" />Sélection en cours…</>
                  ) : overCap ? (
                    <>Trop de produits ({totalCount.toLocaleString("fr-FR")}) — max {SELECT_ALL_CAP}</>
                  ) : (
                    <>Sélectionner {scopeLabel}</>
                  )}
                </button>
                {selectedUrls.size > 0 && !overCap && (
                  <button
                    onClick={deselectAllMatching}
                    disabled={selectingAll}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary/60 border border-border/40 text-muted-foreground hover:text-foreground hover:border-border transition-all text-xs font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {deselectLabel}
                  </button>
                )}
              </>
            );
          })()}


          {/* Stock filter */}
          <select
            value={stockFilter}
            onChange={e => { setStockFilter(e.target.value as any); setPage(0); }}
            className="bg-secondary/60 border border-border/40 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer pr-8 min-w-[130px]"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234dd4ac' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
          >
            <option value="all" className="bg-card text-foreground">Tous les stocks</option>
            <option value="in_stock" className="bg-card text-foreground">En stock</option>
            <option value="out_of_stock" className="bg-card text-foreground">En rupture</option>
          </select>

          {/* Price range */}
          <div className="flex items-center gap-1.5 bg-secondary/60 border border-border/40 rounded-xl px-3 py-1.5">
            <Euro className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'hsl(174 72% 56%)' }} />
            <input
              type="number"
              min={0}
              placeholder="Min"
              value={priceMin}
              onChange={e => { setPriceMin(e.target.value); setPage(0); }}
              className="bg-transparent w-16 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            />
            <span className="text-muted-foreground/50 text-xs">–</span>
            <input
              type="number"
              min={0}
              placeholder="Max"
              value={priceMax}
              onChange={e => { setPriceMax(e.target.value); setPage(0); }}
              className="bg-transparent w-16 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            />
            {(priceMin !== "" || priceMax !== "") && (
              <button
                onClick={() => { setPriceMin(""); setPriceMax(""); setPage(0); }}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Réinitialiser le prix"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Sellers range */}
          <div className="flex items-center gap-1.5 bg-secondary/60 border border-border/40 rounded-xl px-3 py-1.5">
            <Users className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'hsl(262 72% 72%)' }} />
            <input
              type="number"
              min={0}
              placeholder="Min"
              value={sellersMin}
              onChange={e => { setSellersMin(e.target.value); setPage(0); }}
              className="bg-transparent w-14 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            />
            <span className="text-muted-foreground/50 text-xs">–</span>
            <input
              type="number"
              min={0}
              placeholder="Max"
              value={sellersMax}
              onChange={e => { setSellersMax(e.target.value); setPage(0); }}
              className="bg-transparent w-14 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            />
            {(sellersMin !== "" || sellersMax !== "") && (
              <button
                onClick={() => { setSellersMin(""); setSellersMax(""); setPage(0); }}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Réinitialiser les vendeurs"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Exclude brands dropdown */}
          <div className="relative" ref={brandDropdownRef}>
            <button
              onClick={() => !metaLoading && setBrandDropdownOpen(prev => !prev)}
              disabled={metaLoading}
              aria-busy={metaLoading}
              className={cn(
                "bg-secondary/60 border border-border/40 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/40 transition-all pr-8 min-w-[200px] text-left flex items-center gap-2",
                metaLoading ? "cursor-wait opacity-70" : "cursor-pointer"
              )}
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234dd4ac' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
            >
              {metaLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary flex-shrink-0" />
              ) : (
                <Filter className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              )}
              <span className={cn("truncate", metaLoading && "text-muted-foreground italic")}>
                {metaLoading
                  ? "Chargement des marques…"
                  : excludedBrands.size === 0
                    ? "Exclure des marques"
                    : `${excludedBrands.size} marque${excludedBrands.size > 1 ? 's' : ''} exclue${excludedBrands.size > 1 ? 's' : ''}`}
              </span>
            </button>
            {brandDropdownOpen && (
              <div className="absolute z-30 mt-1 w-72 bg-card border border-border/50 rounded-xl p-2 shadow-2xl">
                <div className="relative mb-2">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Rechercher une marque…"
                    value={brandSearch}
                    onChange={e => setBrandSearch(e.target.value)}
                    className="w-full bg-secondary/60 border border-border/40 rounded-lg pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40"
                  />
                </div>
                {excludedBrands.size > 0 && (
                  <button
                    onClick={() => { setExcludedBrands(new Set()); setPage(0); }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-primary hover:bg-primary/10 transition-colors mb-1 font-medium"
                  >
                    ✕ Réinitialiser tout
                  </button>
                )}
                <div className="max-h-56 overflow-auto">
                  {(() => {
                    const q = brandSearch.trim().toLowerCase();
                    const list = dynamicBrands
                      .filter(b => b !== "Toutes")
                      .filter(b => !q || b.toLowerCase().includes(q));
                    if (list.length === 0) {
                      return <p className="px-3 py-3 text-xs text-muted-foreground text-center">Aucune marque trouvée</p>;
                    }
                    return list.map(brand => (
                      <button
                        key={brand}
                        onClick={() => toggleExcludeBrand(brand)}
                        className={cn(
                          "w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center justify-between",
                          excludedBrands.has(brand)
                            ? "text-red-400 bg-red-500/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                        )}
                      >
                        <span>{formatCategoryName(brand)}</span>
                        {excludedBrands.has(brand) && <X className="w-3.5 h-3.5" />}
                      </button>
                    ));
                  })()}
                </div>
              </div>
            )}
          </div>

          {/* Excluded brand pills */}
          {excludedBrands.size > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {[...excludedBrands].map(brand => (
                <span key={brand} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-red-500/10 text-red-400 border border-red-500/20">
                  {formatCategoryName(brand)}
                  <button onClick={() => toggleExcludeBrand(brand)} className="hover:text-red-300 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Search */}
          <div className="relative ml-auto flex items-center gap-2">
            <button
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary/40 border border-border/30 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-all"
              title="Réinitialiser tous les filtres"
            >
              <X className="w-3.5 h-3.5" />
              Réinitialiser
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input type="text" placeholder="Traquer un produit..." value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setPage(0); }}
                className="bg-secondary/60 border border-border/40 rounded-xl pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 w-full lg:w-56 transition-all" />
            </div>
          </div>
        </div>
      </div>

      {/* Selection toolbar */}
      {selectedUrls.size > 0 && (
        <div className="border-b border-border/30 bg-primary/[0.04]">
          <div className="px-5 py-2.5 flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs text-foreground">
              <span className="font-bold text-primary">{selectedUrls.size}</span> produit{selectedUrls.size > 1 ? 's' : ''} sélectionné{selectedUrls.size > 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={exportSelectedToExcel}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/15 border border-primary/30 text-primary hover:bg-primary/25 transition-all text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                Exporter en Excel
              </button>
              <button
                onClick={clearSelection}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-secondary/40 border border-border/30 text-muted-foreground hover:text-foreground transition-all text-xs"
              >
                <X className="w-3.5 h-3.5" />
                Effacer
              </button>
            </div>
          </div>
          {allPageSelected && totalCount > paged.length && selectedUrls.size < totalCount && (
            <div className="px-5 py-2 border-t border-border/20 bg-primary/[0.06] flex items-center justify-center gap-2 text-xs text-muted-foreground flex-wrap">
              <span>
                Les <span className="font-semibold text-foreground">{paged.length}</span> produits de cette page sont sélectionnés.
              </span>
              <button
                onClick={selectAllMatching}
                disabled={selectingAll || totalCount > SELECT_ALL_CAP}
                className="inline-flex items-center gap-1.5 font-bold text-primary hover:text-primary/80 disabled:opacity-60 disabled:cursor-not-allowed underline underline-offset-2"
              >
                {selectingAll ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Sélection en cours… ({totalCount})
                  </>
                ) : totalCount > SELECT_ALL_CAP ? (
                  <>Trop de produits ({totalCount}) — affinez les filtres (max {SELECT_ALL_CAP})</>
                ) : (
                  <>Sélectionner les {totalCount} produits correspondant au filtre</>
                )}
              </button>
            </div>
          )}
        </div>
      )}


      {/* Table */}
      <div className="overflow-x-auto relative">
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left px-3 py-3">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  onChange={togglePageSelectAll}
                  className="w-4 h-4 rounded border-border/40 bg-secondary/40 accent-primary cursor-pointer"
                  aria-label="Tout sélectionner"
                />
              </th>
              <th className="text-left px-4 py-3"><span className="soft-label">#</span></th>
              <th className="text-left px-4 py-3"><span className="soft-label">Image</span></th>
              <SortHeader label="Produit" sortKeyName="name" />
              <SortHeader label="Marque" sortKeyName="brand" />
              <th className="text-left px-4 py-3"><span className="soft-label">Catégorie</span></th>
              <SortHeader label="Prix" sortKeyName="price" />
              <SortHeader label="Dernier vu" sortKeyName="lastSeen" />
              <SortHeader label="Vendeurs" sortKeyName="sellers" />
              <th className="px-3 py-3 text-center"><span className="soft-label">Sourcer</span></th>
              <th className="px-3 py-3 text-center"><span className="soft-label">Favoris</span></th>
            </tr>
          </thead>
          <tbody>
            {paged.map((product, i) => {
              const globalRank = page * ITEMS_PER_PAGE + i + 1;
              const ratingColor = getRatingColor(product.rating);
              const isFav = product.url ? isFavorite(product.url) : false;
              const isSelected = product.url ? selectedUrls.has(product.url) : false;

              return (
                <motion.tr key={product.url || product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  className={cn(
                    "border-b border-border/10 hover:bg-primary/[0.03] transition-all duration-200 cursor-pointer group",
                    isSelected && "bg-primary/[0.05]"
                  )}>
                  <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => product.url && toggleSelect(product.url)}
                      className="w-4 h-4 rounded border-border/40 bg-secondary/40 accent-primary cursor-pointer"
                      aria-label={`Sélectionner ${product.name}`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="font-display text-sm font-black"
                      style={{
                        color: 'hsl(174 72% 62%)',
                        textShadow: globalRank <= 3
                          ? '0 0 10px hsl(174 72% 46% / 0.5)'
                          : '0 0 6px hsl(174 72% 46% / 0.25)',
                        opacity: globalRank <= 3 ? 1 : 0.85,
                      }}
                    >
                      {String(globalRank).padStart(2, '0')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                      style={{ border: '1px solid hsl(174 72% 46% / 0.18)', boxShadow: '0 2px 12px hsl(228 50% 2% / 0.5), inset 0 0 0 1px hsl(174 72% 46% / 0.06)' }}>
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <a href={product.url} target="_blank" rel="noopener noreferrer"
                       className="text-sm text-foreground/90 font-medium hover:text-primary transition-colors hover:underline">
                      {product.name}
                    </a>
                  </td>
                  <td className="px-4 py-3"><span className="text-sm font-medium text-foreground/85">{product.brand}</span></td>
                  <td className="px-4 py-3"><span className="bio-badge bio-cyan text-[10px]">{formatCategoryName(product.category)}</span></td>
                  <td className="px-4 py-3">
                    {product.price === -1 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/25">Rupture</span>
                    ) : (
                      <span className="text-sm font-mono font-bold text-foreground">{product.price}€</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" style={{ color: 'hsl(174 72% 60%)' }} />
                      <span className="text-sm font-semibold" style={{ color: 'hsl(174 72% 68%)' }}>{product.lastSeen}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" style={{ color: 'hsl(188 78% 62%)' }} />
                      <span className="text-sm font-bold" style={{
                        color: product.sellers >= 25 ? 'hsl(188 80% 70%)' : product.sellers >= 15 ? 'hsl(188 70% 65%)' : 'hsl(195 25% 75%)',
                        textShadow: product.sellers >= 25 ? '0 0 8px hsl(188 78% 52% / 0.35)' : undefined,
                      }}>{product.sellers}</span>
                    </div>
                  </td>
                  {/* Sourcer (Google Lens) */}
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-center">
                      {product.image ? (
                        <a
                          href={googleLensUrl(product.image)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="group/lens relative inline-flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                          style={{
                            background: 'linear-gradient(135deg, hsl(174 72% 42% / 0.18), hsl(188 78% 48% / 0.18))',
                            border: '1px solid hsl(188 78% 60% / 0.35)',
                            boxShadow: '0 2px 8px -2px hsl(174 72% 46% / 0.3)',
                          }}
                          title="Chercher par image (Google Lens)"
                          aria-label="Chercher par image"
                        >
                          <Camera
                            className="w-[18px] h-[18px] transition-transform duration-200 group-hover/lens:scale-110"
                            style={{
                              color: 'hsl(188 80% 78%)',
                              filter: 'drop-shadow(0 0 6px hsl(188 78% 52% / 0.55))',
                            }}
                          />
                        </a>
                      ) : (
                        <span className="text-muted-foreground/40 text-xs">—</span>
                      )}
                    </div>
                  </td>
                  {/* Favoris */}
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(product); }}
                        className="group/fav relative inline-flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                        style={{
                          background: isFav
                            ? 'linear-gradient(135deg, hsl(348 80% 55% / 0.22), hsl(0 75% 58% / 0.22))'
                            : 'hsl(225 22% 11%)',
                          border: `1px solid ${isFav ? 'hsl(348 80% 60% / 0.5)' : 'hsl(225 20% 18%)'}`,
                          boxShadow: isFav
                            ? '0 2px 10px -2px hsl(348 80% 55% / 0.45)'
                            : '0 2px 6px -2px hsl(228 50% 2% / 0.4)',
                        }}
                        title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
                        aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
                      >
                        <Heart
                          className={cn(
                            "w-[18px] h-[18px] transition-all duration-200",
                            isFav
                              ? "fill-current scale-110"
                              : "group-hover/fav:fill-current group-hover/fav:scale-110"
                          )}
                          style={{
                            color: isFav ? 'hsl(348 85% 65%)' : undefined,
                            filter: isFav
                              ? 'drop-shadow(0 0 6px hsl(348 85% 65% / 0.7))'
                              : undefined,
                          }}
                          color={!isFav ? 'hsl(348 75% 62%)' : undefined}
                        />
                      </button>
                    </div>
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
            {(page * ITEMS_PER_PAGE + 1).toLocaleString("fr-FR")}–{Math.min((page + 1) * ITEMS_PER_PAGE, totalCount).toLocaleString("fr-FR")} sur {totalCount.toLocaleString("fr-FR")}
          </span>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="p-1.5 rounded-lg bg-secondary/40 border border-border/25 text-muted-foreground hover:text-foreground hover:bg-secondary/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {(() => {
              const pages: (number | 'ellipsis')[] = [];
              if (totalPages <= 7) {
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
