import KrakkenSidebar from "@/components/dashboard/KrakkenSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ExternalLink, Trash2, Pencil, ChevronDown, Search as SearchIcon } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/dashboard/EmptyState";
import { useFavorites, COLLECTIONS, type Collection } from "@/hooks/useFavorites";

const Favoris = () => {
  const { favorites, isLoading, updateCollection, updateNote, removeFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState<Collection>("À sourcer");
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [moveDropdown, setMoveDropdown] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({});

  const filtered = favorites.filter((f) => (f.collection ?? "À sourcer") === activeTab);

  if (isLoading) {
    return (
      <div className="min-h-screen abyss-gradient">
        <KrakkenSidebar />
        <main className="pl-16 xl:pl-56 p-4 lg:p-6 space-y-5">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen abyss-gradient">
      <KrakkenSidebar />
      <main className="pl-16 xl:pl-56 p-4 lg:p-6 space-y-5">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="glass-panel-glow p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 100% 0%, hsl(var(--kraken-rose) / 0.06), transparent 60%)' }} />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                background: 'hsl(var(--kraken-rose) / 0.12)', border: '1px solid hsl(var(--kraken-rose) / 0.2)', boxShadow: '0 0 12px -2px hsl(var(--kraken-rose) / 0.2)',
              }}>
                <Heart className="w-5 h-5" style={{ color: 'hsl(var(--kraken-rose))', filter: 'drop-shadow(0 0 4px hsl(var(--kraken-rose) / 0.4))' }} />
              </div>
              <div>
                <h1 className="kraken-title text-xl">Ma Sélection</h1>
                <p className="text-sm text-muted-foreground">{favorites.length} produits sauvegardés</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="flex gap-1.5 overflow-x-auto pb-1">
          {COLLECTIONS.map((col) => {
            const count = favorites.filter((f) => (f.collection ?? "À sourcer") === col).length;
            return (
              <button key={col} onClick={() => setActiveTab(col)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === col ? 'bg-primary/15 text-primary border border-primary/25' : 'bg-secondary/40 text-muted-foreground border border-border/30 hover:text-foreground hover:border-border/60'
                }`}>
                {col}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === col ? 'bg-primary/20 text-primary' : 'bg-muted/60 text-muted-foreground'}`}>{count}</span>
              </button>
            );
          })}
        </motion.div>

        {favorites.length === 0 ? (
          <EmptyState message="Aucun favori" sub="Ajoute des produits à ta sélection depuis la page Produits 🐙" />
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-12 text-center">
            <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Aucun produit dans cette collection</p>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((fav, i) => {
                const p = fav.product;
                const title = p?.title ?? fav.product_url;
                const image = p?.image_url ?? "";
                const price = p?.price ?? 0;
                const brand = p?.brand ?? "—";
                return (
                  <motion.div key={fav.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }} className="glass-panel group relative overflow-hidden hover:border-primary/20 transition-all duration-300">
                    <div className="p-4">
                      <div className="w-full aspect-square rounded-lg overflow-hidden mb-3 bg-secondary">
                        {image ? (
                          <img src={image} alt={title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 text-xs">Pas d'image</div>
                        )}
                      </div>
                      <p className="text-[10px] font-medium text-primary/70 uppercase tracking-wider truncate">{brand}</p>
                      <h3 className="text-sm font-semibold text-foreground mt-0.5 leading-tight line-clamp-2">{title}</h3>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-lg font-bold text-foreground font-display">{price}€</span>
                      </div>

                      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border/50">
                        <a href={fav.product_url} target="_blank" rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-primary/10 text-primary text-[11px] font-semibold hover:bg-primary/20 transition-colors">
                          Voir <ExternalLink className="w-3 h-3" />
                        </a>
                        {image && (
                          <a href={`https://lens.google.com/uploadbyurl?url=${encodeURIComponent(image)}`} target="_blank" rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-accent/10 text-accent text-[11px] font-semibold hover:bg-accent/20 transition-colors">
                            Image <SearchIcon className="w-3 h-3" />
                          </a>
                        )}
                        <button onClick={() => {
                          setEditingNote(editingNote === fav.id ? null : fav.id);
                          setNoteDraft((d) => ({ ...d, [fav.id]: fav.note ?? "" }));
                        }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <div className="relative">
                          <button onClick={() => setMoveDropdown(moveDropdown === fav.id ? null : fav.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          {moveDropdown === fav.id && (
                            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                              className="absolute bottom-full right-0 mb-1 w-40 bg-card border border-border/50 rounded-xl p-1.5 shadow-xl z-30">
                              {COLLECTIONS.filter((c) => c !== fav.collection).map((col) => (
                                <button key={col} onClick={() => { updateCollection(fav.id, col); setMoveDropdown(null); }}
                                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
                                  → {col}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </div>
                        <button onClick={() => removeFavorite(fav.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center bg-destructive/10 text-destructive/70 hover:text-destructive hover:bg-destructive/20 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <AnimatePresence>
                        {editingNote === fav.id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <textarea
                              value={noteDraft[fav.id] ?? ""}
                              onChange={(e) => setNoteDraft((d) => ({ ...d, [fav.id]: e.target.value }))}
                              onBlur={() => updateNote(fav.id, noteDraft[fav.id] ?? "")}
                              placeholder="Ajouter une note…"
                              className="w-full mt-2 bg-secondary/60 border border-border/40 rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary/30" rows={2} />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="mt-2.5 space-y-1">
                        {fav.created_at && (
                          <p className="text-[10px] text-muted-foreground/60">
                            Ajouté le {new Date(fav.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                        )}
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
