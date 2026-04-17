import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Search, Users, CalendarDays, Crosshair, Clock, Heart, X, Filter, Euro, Camera, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/data/products";
import { useProductsPaginated } from "@/hooks/useProductsPaginated";
import { externalSupabase as supabase } from "@/integrations/supabase/external-client";
import * as XLSX from "xlsx";
import ProductSkeleton from "./ProductSkeleton";
import EmptyState from "./EmptyState";

type SortKey = "price" | "recurrences" | "rating" | "name" | "brand" | "sellers" | "lastSeen";
type SortDir = "asc" | "desc";

const ITEMS_PER_PAGE = 20;

const FRENCH_MONTHS = ["Janv.", "Févr.", "Mars", "Avril", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."];

function buildDatePresets() {
  const presets: { label: string; value: string; group?: string }[] = [
    { label: "Tout", value: "all" },
    { label: "24 heures", value: "24h" },
    { label: "7 jours", value: "7d" },
    { label: "30 jours", value: "30d" },
    { label: "3 mois", value: "3m" },
    { label: "6 mois", value: "6m" },
  ];
  // Années entières
  const now = new Date();
  const currentYear = now.getFullYear();
  for (let y = currentYear; y >= 2025; y--) {
    presets.push({ label: `Année ${y}`, value: String(y), group: "year" });
  }
  // Mois : du mois courant jusqu'à janvier 2025 (ordre décroissant = récent en premier)
  const startYear = 2025, startMonth = 1;
  let y = currentYear;
  let m = now.getMonth() + 1; // 1-12
  while (y > startYear || (y === startYear && m >= startMonth)) {
    const value = `month-${y}-${String(m).padStart(2, "0")}`;
    const label = `${FRENCH_MONTHS[m - 1]} ${y}`;
    presets.push({ label, value, group: "month" });
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
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [excludedBrands, setExcludedBrands] = useState<Set<string>>(new Set());
  const [selectedDatePreset, setSelectedDatePreset] = useState("all");
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const brandDropdownRef = useRef<HTMLDivElement>(null);
  const [sortKey, setSortKey] = useState<SortKey>("lastSeen");
  const [stockFilter, setStockFilter] = useState<"all" | "in_stock" | "out_of_stock">("all");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [sellersMin, setSellersMin] = useState<string>("");
  const [sellersMax, setSellersMax] = useState<string>("");
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());

  // Fetch categories list for dropdown
  const [dynamicCategories, setDynamicCategories] = useState<string[]>(["Tous"]);
  const [dynamicBrands, setDynamicBrands] = useState<string[]>(["Toutes"]);

  useEffect(() => {
    // Fetch distinct categories and brands (lightweight)
    const fetchMeta = async () => {
      const PAGE = 1000;
      const cats = new Set<string>();
      const brands = new Set<string>();
      let from = 0;
      while (true) {
        const { data } = await supabase
          .from("products")
          .select("category, brand")
          .range(from, from + PAGE - 1);
        if (!data || data.length === 0) break;
        data.forEach((r: any) => {
          if (r.category) cats.add(r.category);
          if (r.brand) brands.add(r.brand);
        });
        if (data.length < PAGE) break;
        from += PAGE;
      }
      setDynamicCategories(["Tous", ...[...cats].sort()]);
      setDynamicBrands(["Toutes", ...[...brands].sort()]);
    };
    fetchMeta();
  }, []);

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
        .select("title,brand,category,price,rating,review_count,sellers_count,in_stock,recurrences,last_seen,added_date,url,image_url")
        .in("url", chunk);
      if (data) rows.push(...data);
    }
    const exportRows = rows.map((p: any) => ({
      "Produit": p.title,
      "Marque": p.brand || "",
      "Catégorie": formatCategoryName(p.category || ""),
      "Prix (€)": p.price === -1 ? "Rupture" : (p.price ?? ""),
      "En stock": p.in_stock === false ? "Non" : "Oui",
      "Note": p.rating ?? "",
      "Avis": p.review_count ?? "",
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
      { wch: 8 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 14 },
      { wch: 14 }, { wch: 60 }, { wch: 60 }, { wch: 60 },
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
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={e => { setSelectedCategory(e.target.value); setPage(0); }}
              className="bg-secondary/60 border border-border/40 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer pr-8 min-w-[160px]"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234dd4ac' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
            >
              {dynamicCategories.map(cat => (
                <option key={cat} value={cat} className="bg-card text-foreground">
                  {formatCategoryName(cat)}
                </option>
              ))}
            </select>
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
              <optgroup label="Périodes récentes">
                {datePresets.filter(dp => !dp.group).map(dp => (
                  <option key={dp.value} value={dp.value} className="bg-card text-foreground">{dp.label}</option>
                ))}
              </optgroup>
              <optgroup label="Par année">
                {datePresets.filter(dp => dp.group === "year").map(dp => (
                  <option key={dp.value} value={dp.value} className="bg-card text-foreground">{dp.label}</option>
                ))}
              </optgroup>
              <optgroup label="Par mois">
                {datePresets.filter(dp => dp.group === "month").map(dp => (
                  <option key={dp.value} value={dp.value} className="bg-card text-foreground">{dp.label}</option>
                ))}
              </optgroup>
            </select>
          </div>

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
              onClick={() => setBrandDropdownOpen(prev => !prev)}
              className="bg-secondary/60 border border-border/40 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/40 transition-all cursor-pointer pr-8 min-w-[180px] text-left flex items-center gap-2"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234dd4ac' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
            >
              <Filter className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <span className="truncate">
                {excludedBrands.size === 0 ? "Exclure des marques" : `${excludedBrands.size} marque${excludedBrands.size > 1 ? 's' : ''} exclue${excludedBrands.size > 1 ? 's' : ''}`}
              </span>
            </button>
            {brandDropdownOpen && (
              <div className="absolute z-30 mt-1 w-64 bg-card border border-border/50 rounded-xl p-2 shadow-2xl max-h-56 overflow-auto">
                {excludedBrands.size > 0 && (
                  <button
                    onClick={() => { setExcludedBrands(new Set()); setPage(0); }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-primary hover:bg-primary/10 transition-colors mb-1 font-medium"
                  >
                    ✕ Réinitialiser tout
                  </button>
                )}
                {dynamicBrands.filter(b => b !== "Toutes").map(brand => (
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
                ))}
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
          <div className="relative ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input type="text" placeholder="Traquer un produit..." value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(0); }}
              className="bg-secondary/60 border border-border/40 rounded-xl pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 w-full lg:w-56 transition-all" />
          </div>
        </div>
      </div>

      {/* Selection toolbar */}
      {selectedUrls.size > 0 && (
        <div className="px-5 py-2.5 border-b border-border/30 bg-primary/[0.04] flex items-center justify-between flex-wrap gap-2">
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
              <SortHeader label="Note" sortKeyName="rating" />
              <SortHeader label="Vendeurs" sortKeyName="sellers" />
              <th className="text-left px-4 py-3"><span className="soft-label"></span></th>
            </tr>
          </thead>
          <tbody>
            {paged.map((product, i) => {
              const globalRank = page * ITEMS_PER_PAGE + i + 1;
              const ratingColor = getRatingColor(product.rating);
              const isFav = product.url ? favorites.has(product.url) : false;
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
                    <span className={cn("font-display text-sm font-black")}
                      style={globalRank <= 3 ? { color: 'hsl(174 72% 56%)', textShadow: '0 0 8px hsl(174 72% 46% / 0.3)' } : { color: 'hsl(210 10% 30%)' }}>
                      {String(globalRank).padStart(2, '0')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                      style={{ border: '1px solid hsl(225 20% 15%)', boxShadow: '0 2px 8px hsl(228 50% 2% / 0.4)' }}>
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <a href={product.url} target="_blank" rel="noopener noreferrer"
                       className="text-sm text-foreground/90 font-medium hover:text-primary transition-colors hover:underline">
                      {product.name}
                    </a>
                  </td>
                  <td className="px-4 py-3"><span className="text-xs text-secondary-foreground font-medium">{product.brand}</span></td>
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
                      <Clock className="w-3 h-3" style={{ color: 'hsl(174 72% 56%)', opacity: 0.6 }} />
                      <span className="text-sm font-medium" style={{ color: 'hsl(174 72% 56%)' }}>{product.lastSeen}</span>
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
                    <div className="flex items-center gap-1">
                      {product.image && (
                        <a
                          href={googleLensUrl(product.image)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-lg hover:bg-secondary/50 transition-all"
                          title="Rechercher avec Google Lens"
                          aria-label="Rechercher avec Google Lens"
                        >
                          <Camera className="w-4 h-4" style={{
                            color: 'hsl(174 72% 56%)',
                            filter: 'drop-shadow(0 0 4px hsl(174 72% 46% / 0.35))',
                          }} />
                        </a>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product); }}
                        className="p-1.5 rounded-lg hover:bg-secondary/50 transition-all"
                        title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}>
                        <Heart className={cn("w-4 h-4 transition-all", isFav ? "fill-current" : "")}
                          style={{
                            color: isFav ? 'hsl(340 75% 55%)' : 'hsl(210 10% 30%)',
                            filter: isFav ? 'drop-shadow(0 0 6px hsl(340 75% 55% / 0.4))' : undefined,
                          }} />
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
