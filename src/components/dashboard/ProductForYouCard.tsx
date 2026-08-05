import { Heart, ExternalLink, Repeat, Users } from "lucide-react";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

interface Props {
  product: Product;
  rank?: number;
  isFavorite: boolean;
  onToggleFavorite: (url: string) => void;
}

const ProductForYouCard = ({ product, rank, isFavorite, onToggleFavorite }: Props) => {
  const outOfStock = product.price === -1;

  return (
    <div className="glass-panel p-3 group relative flex flex-col gap-3 transition-all duration-300 hover:border-primary/30">
      <div className="relative rounded-xl overflow-hidden aspect-square" style={{ background: "hsl(228 30% 10%)" }}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.style.visibility = "hidden";
          }}
          className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {rank != null && rank <= 3 && (
          <span
            className="absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-wide"
            style={{
              background: "hsl(174 72% 46% / 0.15)",
              border: "1px solid hsl(174 72% 46% / 0.3)",
              color: "hsl(174 72% 66%)",
            }}
          >
            TOP {rank}
          </span>
        )}
        <button
          onClick={() => product.url && onToggleFavorite(product.url)}
          title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{
            background: "hsl(228 42% 7% / 0.75)",
            border: "1px solid hsl(174 72% 46% / 0.15)",
            backdropFilter: "blur(6px)",
          }}
        >
          <Heart
            className={cn("w-4 h-4 transition-all", isFavorite ? "text-primary" : "text-muted-foreground")}
            fill={isFavorite ? "currentColor" : "none"}
            style={isFavorite ? { filter: "drop-shadow(0 0 6px hsl(174 72% 46% / 0.6))" } : {}}
          />
        </button>
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground truncate">
          {product.brand} · {product.category}
        </p>
        <h3 className="text-[13px] font-semibold text-foreground leading-snug line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-3 pt-0.5">
          <span className="text-base font-bold text-foreground font-mono">
            {outOfStock ? "—" : `${product.price.toFixed(2)} €`}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-primary font-mono">
            <Repeat className="w-3 h-3" /> {product.recurrences}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
            <Users className="w-3 h-3" /> {product.sellers}
          </span>
        </div>
      </div>

      <a
        href={product.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-semibold text-primary transition-all hover:bg-primary/10"
        style={{ border: "1px solid hsl(174 72% 46% / 0.2)" }}
      >
        Voir la fiche <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
};

export default ProductForYouCard;
