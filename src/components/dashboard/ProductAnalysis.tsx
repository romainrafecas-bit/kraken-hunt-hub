import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, ArrowUp, ArrowDown, TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product, products as allProducts, categories, brands } from "@/data/products";

type SortKey = "score" | "price" | "sales" | "rating" | "name" | "brand";
type SortDir = "asc" | "desc";

const ITEMS_PER_PAGE = 12;

const TrendIcon = ({ trend }: { trend: Product["trend"] }) => {
  if (trend === "up") return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
  if (trend === "down") return <TrendingDown className="w-3.5 h-3.5 text-destructive" />;
  return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
};

const ProductAnalysis = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedBrand, setSelectedBrand] = useState("Toutes");
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let data = [...allProducts];
    if (selectedCategory !== "Tous") data = data.filter(p => p.category === selectedCategory);
    if (selectedBrand !== "Toutes") data = data.filter(p => p.brand === selectedBrand);
    if (searchQuery) data = data.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    data.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return data;
  }, [selectedCategory, selectedBrand, sortKey, sortDir, searchQuery]);

  const paged = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
    setPage(0);
  };

  const SortHeader = ({ label, sortKeyName }: { label: string; sortKeyName: SortKey }) => (
    <th
      className="text-left px-4 py-3 cursor-pointer group/sort select-none"
      onClick={() => toggleSort(sortKeyName)}
    >
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="glass-panel overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 border-b border-border/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-display text-base font-bold text-foreground">Résultats d'analyse</h3>
              <span className="text-[0.65rem] font-semibold text-primary px-2.5 py-1 bg-primary/10 rounded-full">
                {filtered.length} trouvés
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Dernière analyse complète — 28 fév. 2026</p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(0); }}
              className="bg-secondary/60 border border-border/40 rounded-xl pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 w-full lg:w-64 transition-all"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="soft-label mr-1">Catégorie</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setPage(0); }}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                  selectedCategory === cat
                    ? "bg-primary/15 text-primary border border-primary/25"
                    : "bg-secondary/40 text-muted-foreground border border-transparent hover:text-foreground hover:bg-secondary/70"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="soft-label mr-1">Marque</span>
            {brands.slice(0, 10).map(brand => (
              <button
                key={brand}
                onClick={() => { setSelectedBrand(brand); setPage(0); }}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                  selectedBrand === brand
                    ? "bg-coral/15 text-coral border border-coral/25"
                    : "bg-secondary/40 text-muted-foreground border border-transparent hover:text-foreground hover:bg-secondary/70"
                )}
              >
                {brand}
              </button>
            ))}
            {brands.length > 10 && (
              <span className="text-xs text-muted-foreground/50">+{brands.length - 10}</span>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left px-4 py-3">
                <span className="soft-label">#</span>
              </th>
              <SortHeader label="Produit" sortKeyName="name" />
              <SortHeader label="Marque" sortKeyName="brand" />
              <th className="text-left px-4 py-3">
                <span className="soft-label">Catégorie</span>
              </th>
              <SortHeader label="Prix" sortKeyName="price" />
              <th className="text-left px-4 py-3">
                <span className="soft-label">Réduc.</span>
              </th>
              <SortHeader label="Ventes" sortKeyName="sales" />
              <SortHeader label="Note" sortKeyName="rating" />
              <th className="text-left px-4 py-3">
                <span className="soft-label">Trend</span>
              </th>
              <SortHeader label="Score" sortKeyName="score" />
            </tr>
          </thead>
          <tbody>
            {paged.map((product, i) => {
              const discount = Math.round((1 - product.price / product.originalPrice) * 100);
              const globalRank = page * ITEMS_PER_PAGE + i + 1;
              return (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border/15 hover:bg-primary/[0.03] transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-3">
                    <span className={cn(
                      "font-display text-sm font-bold",
                      globalRank <= 3 ? "text-primary" : "text-muted-foreground/50"
                    )}>
                      {String(globalRank).padStart(2, '0')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground/90 font-medium group-hover:text-primary transition-colors">{product.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-secondary-foreground font-medium">{product.brand}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-secondary/60 text-muted-foreground border border-border/20 font-medium">{product.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-mono font-semibold text-foreground">{product.price}€</span>
                      <span className="text-xs text-muted-foreground/40 line-through">{product.originalPrice}€</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "text-xs font-semibold px-2 py-0.5 rounded-full",
                      discount >= 30 ? "text-emerald-400 bg-emerald-400/10" : discount >= 15 ? "text-primary bg-primary/10" : "text-muted-foreground"
                    )}>
                      -{discount}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono text-foreground/80">{product.sales.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-kraken-eye font-semibold">{product.rating}</span>
                      <span className="text-xs text-kraken-eye/50">★</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <TrendIcon trend={product.trend} />
                      <span className={cn(
                        "text-xs font-bold tracking-wider",
                        product.trend === "up" ? "text-emerald-400" : product.trend === "down" ? "text-destructive" : "text-muted-foreground"
                      )}>
                        {product.velocity}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1.5 rounded-full bg-muted/60 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-ocean-light"
                          style={{ width: `${product.score}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-primary">{product.score}</span>
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
        <div className="p-4 border-t border-border/25 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {page * ITEMS_PER_PAGE + 1}–{Math.min((page + 1) * ITEMS_PER_PAGE, filtered.length)} sur {filtered.length}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-lg bg-secondary/40 border border-border/25 text-muted-foreground hover:text-foreground hover:bg-secondary/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={cn(
                  "w-8 h-8 rounded-lg text-xs font-medium transition-all",
                  i === page ? "bg-primary/15 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="p-1.5 rounded-lg bg-secondary/40 border border-border/25 text-muted-foreground hover:text-foreground hover:bg-secondary/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductAnalysis;
