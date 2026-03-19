import KrakkenSidebar from "@/components/dashboard/KrakkenSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Star, ExternalLink, Trash2, Pencil, ChevronDown, Download, Search as SearchIcon, ArrowDown, ArrowUp, AlertTriangle } from "lucide-react";
import { products } from "@/data/products";
import { useState } from "react";

type Collection = "À sourcer" | "En cours de test" | "Validé" | "Abandonné";

interface FavProduct {
  id: number;
  collection: Collection;
  addedAt: string;
  note: string;
  priceChange: "down" | "up" | "rupture" | null;
}

const initialFavorites: FavProduct[] = [
  { id: 1, collection: "À sourcer", addedAt: "12 mars 2026", note: "", priceChange: "down" },
  { id: 2, collection: "En cours de test", addedAt: "10 mars 2026", note: "Bon produit, tester la V2", priceChange: null },
  { id: 4, collection: "Validé", addedAt: "8 mars 2026", note: "", priceChange: "up" },
  { id: 6, collection: "À sourcer", addedAt: "5 mars 2026", note: "", priceChange: null },
  { id: 7, collection: "Validé", addedAt: "3 mars 2026", note: "Top seller, marge 35%", priceChange: "down" },
  { id: 10, collection: "En cours de test", addedAt: "1 mars 2026", note: "", priceChange: "rupture" },
  { id: 16, collection: "À sourcer", addedAt: "28 fév 2026", note: "", priceChange: null },
  { id: 18, collection: "Abandonné", addedAt: "25 fév 2026", note: "Trop de concurrence", priceChange: null },
  { id: 3, collection: "À sourcer", addedAt: "20 fév 2026", note: "", priceChange: "down" },
  { id: 5, collection: "En cours de test", addedAt: "18 fév 2026", note: "", priceChange: null },
];

const collections: Collection[] = ["À sourcer", "En cours de test", "Validé", "Abandonné"];

const Favoris = () => {
  const [favorites, setFavorites] = useState(initialFavorites);
  const [activeTab, setActiveTab] = useState<Collection>("À sourcer");
  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [moveDropdown, setMoveDropdown] = useState<number | null>(null);

  const filtered = favorites.filter(f => f.collection === activeTab);
  const totalFavs = favorites.length;

  const removeFav = (id: number) => setFavorites(prev => prev.filter(f => f.id !== id));

  const updateNote = (id: number, note: string) => {
    setFavorites(prev => prev.map(f => f.id === id ? { ...f, note } : f));
  };

  const moveToCollection = (id: number, col: Collection) => {
    setFavorites(prev => prev.map(f => f.id === id ? { ...f, collection: col } : f));
    setMoveDropdown(null);
  };

  const PriceBadge = ({ change }: { change: FavProduct["priceChange"] }) => {
    if (!change) return null;
    if (change === "down") return <span className="bio-badge bio-emerald text-[10px] py-0.5 px-2">Prix ↓</span>;
    if (change === "up") return <span className="bio-badge bio-rose text-[10px] py-0.5 px-2">Prix ↑</span>;
    return <span className="bio-badge bio-rose text-[10px] py-0.5 px-2">Rupture !</span>;
  };

  return (
    <div className="min-h-screen abyss-gradient">
      <KrakkenSidebar />
      <main className="pl-16 xl:pl-56 p-4 lg:p-6 space-y-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="glass-panel-glow p-5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at 100% 0%, hsl(var(--kraken-rose) / 0.06), transparent 60%)',
          }} />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                background: 'hsl(var(--kraken-rose) / 0.12)',
                border: '1px solid hsl(var(--kraken-rose) / 0.2)',
                boxShadow: '0 0 12px -2px hsl(var(--kraken-rose) / 0.2)',
              }}>
                <Heart className="w-5 h-5" style={{
                  color: 'hsl(var(--kraken-rose))',
                  filter: 'drop-shadow(0 0 4px hsl(var(--kraken-rose) / 0.4))',
                }} />
              </div>
              <div>
                <h1 className="kraken-title text-xl">Ma Sélection</h1>
                <p className="text-sm text-muted-foreground">{totalFavs} produits sauvegardés</p>
              </div>
            </div>
            <button className="glass-panel flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-foreground hover:border-primary/30 transition-all">
              <Download className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline">Exporter en Excel</span>
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="flex gap-1.5 overflow-x-auto pb-1"
        >
          {collections.map(col => {
            const count = favorites.filter(f => f.collection === col).length;
            return (
              <button
                key={col}
                onClick={() => setActiveTab(col)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === col
                    ? 'bg-primary/15 text-primary border border-primary/25'
                    : 'bg-secondary/40 text-muted-foreground border border-border/30 hover:text-foreground hover:border-border/60'
                }`}
              >
                {col}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === col ? 'bg-primary/20 text-primary' : 'bg-muted/60 text-muted-foreground'
                }`}>{count}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-12 text-center">
            <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Aucun produit dans cette collection</p>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((fav, i) => {
                const product = products.find(p => p.id === fav.id);
                if (!product) return null;
                const discount = Math.round((1 - product.price / product.originalPrice) * 100);

                return (
                  <motion.div
                    key={fav.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    className="glass-panel group relative overflow-hidden hover:border-primary/20 transition-all duration-300"
                  >
                    {/* Top badges */}
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                      <PriceBadge change={fav.priceChange} />
                      <span className="bio-badge bio-teal text-[10px] py-0.5 px-2">-{discount}%</span>
                    </div>

                    <div className="p-4">
                      {/* Image */}
                      <div className="w-full aspect-square rounded-lg overflow-hidden mb-3" style={{ background: 'hsl(var(--secondary))' }}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        />
                      </div>

                      {/* Info */}
                      <p className="text-[10px] font-medium text-primary/70 uppercase tracking-wider">{product.brand}</p>
                      <h3 className="text-sm font-semibold text-foreground mt-0.5 leading-tight line-clamp-2">{product.name}</h3>

                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-lg font-bold text-foreground font-display">{product.price}€</span>
                        <span className="text-xs text-muted-foreground line-through">{product.originalPrice}€</span>
                      </div>

                      {/* Score & views */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-kraken-amber" fill="hsl(38 92% 56%)" />
                          <span className="text-xs text-foreground font-medium">{product.rating}</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">{product.recurrences.toLocaleString()} récurrences</span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border/50">
                        <a href={`https://www.aliexpress.com/w/wholesale-${encodeURIComponent(product.name)}.html`} target="_blank" rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-primary/10 text-primary text-[11px] font-semibold hover:bg-primary/20 transition-colors">
                          Ali <ExternalLink className="w-3 h-3" />
                        </a>
                        <a href={`https://lens.google.com/uploadbyurl?url=${encodeURIComponent(product.image)}`} target="_blank" rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-accent/10 text-accent text-[11px] font-semibold hover:bg-accent/20 transition-colors">
                          Lens <SearchIcon className="w-3 h-3" />
                        </a>

                        {/* Note button */}
                        <button
                          onClick={() => setEditingNote(editingNote === fav.id ? null : fav.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        {/* Move dropdown */}
                        <div className="relative">
                          <button
                            onClick={() => setMoveDropdown(moveDropdown === fav.id ? null : fav.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          {moveDropdown === fav.id && (
                            <motion.div
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute bottom-full right-0 mb-1 w-40 bg-card border border-border/50 rounded-xl p-1.5 shadow-xl z-30"
                            >
                              {collections.filter(c => c !== fav.collection).map(col => (
                                <button key={col} onClick={() => moveToCollection(fav.id, col)}
                                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
                                  → {col}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </div>

                        {/* Delete */}
                        <button
                          onClick={() => removeFav(fav.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center bg-destructive/10 text-destructive/70 hover:text-destructive hover:bg-destructive/20 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Note editor */}
                      <AnimatePresence>
                        {editingNote === fav.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <textarea
                              value={fav.note}
                              onChange={e => updateNote(fav.id, e.target.value)}
                              placeholder="Ajouter une note…"
                              className="w-full mt-2 bg-secondary/60 border border-border/40 rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary/30"
                              rows={2}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Footer: date + note */}
                      <div className="mt-2.5 space-y-1">
                        <p className="text-[10px] text-muted-foreground/60">Ajouté le {fav.addedAt}</p>
                        {fav.note && editingNote !== fav.id && (
                          <p className="text-[11px] text-muted-foreground italic bg-secondary/30 rounded-lg px-2 py-1">📝 {fav.note}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
};

export default Favoris;
