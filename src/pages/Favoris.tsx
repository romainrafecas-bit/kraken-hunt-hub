import KrakkenSidebar from "@/components/dashboard/KrakkenSidebar";
import { motion } from "framer-motion";
import { Heart, TrendingDown, Star, ExternalLink, Trash2 } from "lucide-react";
import { products } from "@/data/products";
import { useState } from "react";

const initialFavorites = [1, 2, 4, 6, 7, 10, 16, 18]; // product IDs

const Favoris = () => {
  const [favoriteIds, setFavoriteIds] = useState(initialFavorites);
  const favoriteProducts = products.filter(p => favoriteIds.includes(p.id));

  const removeFavorite = (id: number) => {
    setFavoriteIds(prev => prev.filter(fid => fid !== id));
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
                <h1 className="kraken-title text-xl">Mes favoris</h1>
                <p className="text-sm text-muted-foreground">{favoriteProducts.length} proies marquées</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Products grid */}
        {favoriteProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel p-12 text-center"
          >
            <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Aucun favori pour le moment</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Ajoutez des produits depuis la page Produits</p>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {favoriteProducts.map((product, i) => {
              const discount = Math.round((1 - product.price / product.originalPrice) * 100);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                  className="glass-panel group relative overflow-hidden hover:border-primary/20 transition-all duration-300"
                >
                  {/* Discount badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{
                      background: 'hsl(var(--primary) / 0.15)',
                      color: 'hsl(var(--primary))',
                      border: '1px solid hsl(var(--primary) / 0.2)',
                    }}>
                      -{discount}%
                    </span>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeFavorite(product.id)}
                    className="absolute top-3 left-3 z-10 w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: 'hsl(var(--destructive) / 0.15)',
                      border: '1px solid hsl(var(--destructive) / 0.2)',
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </button>

                  <div className="p-4">
                    {/* Image */}
                    <div className="w-full aspect-square rounded-lg overflow-hidden mb-3" style={{
                      background: 'hsl(var(--secondary))',
                    }}>
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
                      <span className="text-lg font-bold text-foreground">{product.price}€</span>
                      <span className="text-xs text-muted-foreground line-through">{product.originalPrice}€</span>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-kraken-amber" fill="hsl(38 92% 56%)" />
                        <span className="text-xs text-foreground font-medium">{product.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingDown className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[11px] text-muted-foreground">{product.recurrences.toLocaleString()} vues</span>
                      </div>
                      <div className="flex items-center gap-1 text-primary/60 hover:text-primary transition-colors cursor-pointer">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Favoris;
