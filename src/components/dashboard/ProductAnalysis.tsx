import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Search, Users, CalendarDays, Crosshair, Clock, MoreHorizontal, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product, products as allProducts, categories, brands } from "@/data/products";

type SortKey = "score" | "price" | "recurrences" | "rating" | "name" | "brand" | "sellers" | "lastSeen";
type SortDir = "asc" | "desc";

const ITEMS_PER_PAGE = 12;

const months = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

const ProductAnalysis = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedBrand, setSelectedBrand] = useState("Toutes");
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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
              <Crosshair className="w-4 h-4" style={{
                color: 'hsl(174 72% 56%)',
                filter: 'drop-shadow(0 0 4px hsl(174 72% 46% / 0.4))',
              }} />
              <h3 className="font-display text-base font-bold text-foreground">Résultats d'analyse</h3>
              <span className="bio-badge bio-teal">
                {filtered.length} proies
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 ml-7">Dernière plongée — 28 fév. 2026</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Month selector */}
            <div className="relative flex items-center gap-2">
              <CalendarDays className="w-3.5 h-3.5" style={{ color: 'hsl(262 72% 72%)' }} />
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(Number(e.target.value))}
                className="bg-secondary/60 border border-border/40 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer pr-8"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234dd4ac' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
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
                placeholder="Traquer un produit..."
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
                    ? "bio-teal"
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
                    ? "bio-violet"
                    : "bg-secondary/40 text-muted-foreground border border-transparent hover:text-foreground hover:bg-secondary/70"
                )}
              >
                {brand}
              </button>
            ))}
            {brands.length > 10 && (
              <span className="text-xs text-muted-foreground/40">+{brands.length - 10}</span>
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
            </tr>
          </thead>
          <tbody>
            {paged.map((product, i) => {
              const globalRank = page * ITEMS_PER_PAGE + i + 1;
              const scoreStyle = getScoreStyle(product.score);
              const ratingColor = getRatingColor(product.rating);

              return (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border/10 hover:bg-primary/[0.03] transition-all duration-200 cursor-pointer group"
                >
                  <td className="px-4 py-3">
                    <span className={cn("font-display text-sm font-black")}
                      style={globalRank <= 3 ? {
                        color: 'hsl(174 72% 56%)',
                        textShadow: '0 0 8px hsl(174 72% 46% / 0.3)',
                      } : { color: 'hsl(210 10% 30%)' }}
                    >
                      {String(globalRank).padStart(2, '0')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-300" style={{
                      border: '1px solid hsl(225 20% 15%)',
                      boxShadow: '0 2px 8px hsl(228 50% 2% / 0.4)',
                    }}>
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground/90 font-medium group-hover:text-primary transition-colors">{product.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-secondary-foreground font-medium">{product.brand}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bio-badge bio-cyan text-[10px]">{product.category}</span>
                  </td>
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
                          ? 'hsl(162 72% 52%)'
                          : product.lastSeen.includes('j')
                          ? 'hsl(210 10% 50%)'
                          : 'hsl(174 72% 56%)',
                      }}>
                        {product.lastSeen}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold" style={{ color: ratingColor, textShadow: `0 0 8px ${ratingColor}40` }}>
                        {product.rating}
                      </span>
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
                        color: product.sellers >= 25
                          ? 'hsl(262 72% 72%)'
                          : product.sellers >= 15
                          ? 'hsl(262 50% 62%)'
                          : 'hsl(210 10% 50%)',
                        textShadow: product.sellers >= 25 ? '0 0 8px hsl(262 52% 58% / 0.3)' : undefined,
                      }}>
                        {product.sellers}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full overflow-hidden" style={{ background: 'hsl(225 18% 12%)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${product.score}%`,
                            backgroundColor: scoreStyle.bg,
                            boxShadow: `0 0 8px ${scoreStyle.shadow}`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-black font-mono" style={{
                        color: scoreStyle.color,
                        textShadow: `0 0 8px ${scoreStyle.shadow}`,
                      }}>{product.score}</span>
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
                    <MoreHorizontal className="w-4 h-4" />
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                      p === page ? "bio-teal" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    {p + 1}
                  </button>
                )
              );
            })()}
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
