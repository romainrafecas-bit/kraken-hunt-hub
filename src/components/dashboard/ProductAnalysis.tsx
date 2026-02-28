import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, ArrowUp, ArrowDown, TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product, products as allProducts, categories, brands } from "@/data/products";

type SortKey = "score" | "price" | "sales" | "rating" | "name" | "brand";
type SortDir = "asc" | "desc";

const ITEMS_PER_PAGE = 12;

const TrendIcon = ({ trend }: { trend: Product["trend"] }) => {
  if (trend === "up") return <TrendingUp className="w-3.5 h-3.5 text-accent" />;
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
      className="text-left px-4 py-3 cursor-pointer group select-none"
      onClick={() => toggleSort(sortKeyName)}
    >
      <div className="flex items-center gap-1.5">
        <span className="cryptic-mono text-muted-foreground group-hover:text-secondary-foreground transition-colors" style={{ fontSize: '0.6rem' }}>{label}</span>
        {sortKey === sortKeyName ? (
          sortDir === "desc" ? <ArrowDown className="w-3 h-3 text-primary" /> : <ArrowUp className="w-3 h-3 text-primary" />
        ) : (
          <ArrowUpDown className="w-3 h-3 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
        )}
      </div>
    </th>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-panel rounded-md overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-display text-sm font-bold tracking-[0.2em] text-foreground">RÉSULTATS D'ANALYSE</h3>
              <span className="cryptic-mono text-primary px-2 py-0.5 bg-primary/5 rounded border border-primary/10" style={{ fontSize: '0.55rem' }}>
                {filtered.length} TROUVÉS
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-mono">Dernière analyse complète — 28.02.2026</p>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(0); }}
              className="bg-secondary/50 border border-border/30 rounded px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/10 w-full lg:w-56 font-mono"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 space-y-3">
          {/* Categories */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="cryptic-mono text-muted-foreground mr-1" style={{ fontSize: '0.55rem' }}>CATÉGORIE</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setPage(0); }}
                className={cn(
                  "px-2.5 py-1 rounded text-xs font-mono transition-all duration-200",
                  selectedCategory === cat
                    ? "bg-primary/10 text-primary border border-primary/20 glow-border"
                    : "bg-secondary/30 text-muted-foreground border border-transparent hover:text-secondary-foreground hover:bg-secondary/60"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Brands */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="cryptic-mono text-muted-foreground mr-1" style={{ fontSize: '0.55rem' }}>MARQUE</span>
            {brands.slice(0, 10).map(brand => (
              <button
                key={brand}
                onClick={() => { setSelectedBrand(brand); setPage(0); }}
                className={cn(
                  "px-2.5 py-1 rounded text-xs font-mono transition-all duration-200",
                  selectedBrand === brand
                    ? "bg-primary/10 text-primary border border-primary/20 glow-border"
                    : "bg-secondary/30 text-muted-foreground border border-transparent hover:text-secondary-foreground hover:bg-secondary/60"
                )}
              >
                {brand}
              </button>
            ))}
            {brands.length > 10 && (
              <span className="text-xs text-muted-foreground/50 font-mono">+{brands.length - 10}</span>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/20">
              <th className="text-left px-4 py-3">
                <span className="cryptic-mono text-muted-foreground" style={{ fontSize: '0.6rem' }}>#</span>
              </th>
              <SortHeader label="PRODUIT" sortKeyName="name" />
              <SortHeader label="MARQUE" sortKeyName="brand" />
              <th className="text-left px-4 py-3">
                <span className="cryptic-mono text-muted-foreground" style={{ fontSize: '0.6rem' }}>CATÉGORIE</span>
              </th>
              <SortHeader label="PRIX" sortKeyName="price" />
              <th className="text-left px-4 py-3">
                <span className="cryptic-mono text-muted-foreground" style={{ fontSize: '0.6rem' }}>RÉDUCTION</span>
              </th>
              <SortHeader label="VENTES" sortKeyName="sales" />
              <SortHeader label="NOTE" sortKeyName="rating" />
              <th className="text-left px-4 py-3">
                <span className="cryptic-mono text-muted-foreground" style={{ fontSize: '0.6rem' }}>TREND</span>
              </th>
              <SortHeader label="SCORE" sortKeyName="score" />
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
                  className="border-b border-border/10 hover:bg-primary/[0.02] transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-3">
                    <span className={cn(
                      "font-display text-xs font-bold",
                      globalRank <= 3 ? "text-primary glow-text-subtle" : "text-muted-foreground/50"
                    )}>
                      {String(globalRank).padStart(2, '0')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground/90 group-hover:text-primary transition-colors">{product.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-secondary-foreground">{product.brand}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded bg-secondary/50 text-muted-foreground border border-border/20">{product.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-mono font-semibold text-foreground">{product.price}€</span>
                      <span className="text-xs font-mono text-muted-foreground/40 line-through">{product.originalPrice}€</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "text-xs font-mono font-semibold px-1.5 py-0.5 rounded",
                      discount >= 30 ? "text-accent bg-accent/10" : discount >= 15 ? "text-primary bg-primary/10" : "text-muted-foreground"
                    )}>
                      -{discount}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono text-foreground/80">{product.sales.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-mono text-kraken-eye">{product.rating}</span>
                      <span className="text-xs text-kraken-eye/50">★</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <TrendIcon trend={product.trend} />
                      <span className={cn(
                        "text-xs font-mono font-bold tracking-wider",
                        product.trend === "up" ? "text-accent" : product.trend === "down" ? "text-destructive" : "text-muted-foreground"
                      )}>
                        {product.velocity}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                          style={{ width: `${product.score}%` }}
                        />
                      </div>
                      <span className="text-xs font-display font-bold text-primary glow-text-subtle">{product.score}</span>
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
        <div className="p-4 border-t border-border/20 flex items-center justify-between">
          <span className="text-xs font-mono text-muted-foreground">
            {page * ITEMS_PER_PAGE + 1}–{Math.min((page + 1) * ITEMS_PER_PAGE, filtered.length)} sur {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded bg-secondary/30 border border-border/20 text-muted-foreground hover:text-foreground hover:bg-secondary/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={cn(
                  "w-7 h-7 rounded text-xs font-mono transition-all",
                  i === page ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                )}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="p-1.5 rounded bg-secondary/30 border border-border/20 text-muted-foreground hover:text-foreground hover:bg-secondary/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
