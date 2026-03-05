import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Search, Users, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product, products as allProducts, categories, brands } from "@/data/products";

type SortKey = "score" | "price" | "recurrences" | "rating" | "name" | "brand" | "sellers";
type SortDir = "asc" | "desc";

const ITEMS_PER_PAGE = 12;

const months = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

const ProductAnalysis = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedBrand, setSelectedBrand] = useState("Toutes");
  const [selectedMonth, setSelectedMonth] = useState(1); // February (0-indexed)
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

  const SortHeader = ({ label, sortKeyName, className: headerClass }: { label: string; sortKeyName: SortKey; className?: string }) => (
    <th
      className={cn("text-left px-4 py-3 cursor-pointer group/sort select-none", headerClass)}
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
      className="glass-panel-glow overflow-hidden"
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

          <div className="flex items-center gap-3">
            {/* Month selector */}
            <div className="relative flex items-center gap-2">
              <CalendarDays className="w-3.5 h-3.5 text-accent" />
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(Number(e.target.value))}
                className="bg-secondary/60 border border-border/40 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer pr-8"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2366b2b2' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
              >
                {months.map((m, i) => (
                  <option key={m} value={i} className="bg-card text-foreground">{m} 2026</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setPage(0); }}
                className="bg-secondary/60 border border-border/40 rounded-xl pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 w-full lg:w-56 transition-all"
              />
            </div>
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
                    ? "bg-accent/15 text-accent border border-accent/25"
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
              <th className="text-left px-4 py-3">
                <span className="soft-label">Image</span>
              </th>
              <SortHeader label="Produit" sortKeyName="name" />
              <SortHeader label="Marque" sortKeyName="brand" />
              <th className="text-left px-4 py-3">
                <span className="soft-label">Catégorie</span>
              </th>
              <SortHeader label="Prix" sortKeyName="price" />
              <SortHeader label="Récurrences" sortKeyName="recurrences" />
              <SortHeader label="Note" sortKeyName="rating" />
              <SortHeader label="Vendeurs" sortKeyName="sellers" />
              <SortHeader label="Score" sortKeyName="score" />
            </tr>
          </thead>
          <tbody>
            {paged.map((product, i) => {
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
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-secondary/60 border border-border/30 flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
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
                      "text-sm font-mono font-semibold",
                      product.recurrences >= 8000 ? "text-emerald-400" : product.recurrences >= 4000 ? "text-accent" : "text-foreground/80"
                    )}>
                      {product.recurrences.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={cn(
                        "text-sm font-bold",
                        product.rating >= 4.5 ? "text-amber-400" : product.rating >= 4 ? "text-yellow-400" : product.rating >= 3.5 ? "text-orange-300" : "text-muted-foreground"
                      )}>{product.rating}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <span key={star} className={cn(
                            "text-[10px]",
                            star <= Math.round(product.rating) ? "text-amber-400" : "text-muted-foreground/20"
                          )}>★</span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-accent/60" />
                      <span className={cn(
                        "text-sm font-bold",
                        product.sellers >= 25 ? "text-primary" : product.sellers >= 15 ? "text-accent" : "text-foreground/70"
                      )}>
                        {product.sellers}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-muted/40 overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            product.score >= 85 ? "bg-gradient-to-r from-emerald-500 to-emerald-300"
                              : product.score >= 70 ? "bg-gradient-to-r from-primary to-accent"
                              : product.score >= 50 ? "bg-gradient-to-r from-cyan-600 to-cyan-400"
                              : "bg-gradient-to-r from-muted-foreground to-muted-foreground"
                          )}
                          style={{ width: `${product.score}%` }}
                        />
                      </div>
                      <span className={cn(
                        "text-xs font-bold",
                        product.score >= 85 ? "text-emerald-400" : product.score >= 70 ? "text-primary" : product.score >= 50 ? "text-cyan-400" : "text-muted-foreground"
                      )}>{product.score}</span>
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
