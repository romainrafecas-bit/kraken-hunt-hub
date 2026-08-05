import { useState } from "react";
import { Heart, ExternalLink, Repeat, Users, ImageOff } from "lucide-react";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getCategoryLabel } from "@/lib/categoryLabels";

interface Props {
  product: Product;
  rank?: number;
  isFavorite: boolean;
  onToggleFavorite: (url: string) => void;
}

const ProductForYouCard = ({ product, rank, isFavorite, onToggleFavorite }: Props) => {
  const outOfStock = product.price === -1;
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="group relative grid grid-cols-[7rem_minmax(0,1fr)] gap-4 border-t border-border py-4 md:grid-cols-[8rem_minmax(0,1fr)_auto] md:items-center">
      <div className="relative overflow-hidden aspect-square rounded-md bg-card">
        {imageFailed || !product.image ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageOff className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-[10px]">Aperçu indisponible</span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
            className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]"
          />
        )}
        {rank != null && rank <= 3 && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-sm bg-primary/10 text-[10px] font-bold text-primary">
            TOP {rank}
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => product.url && onToggleFavorite(product.url)}
          title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          className="absolute top-1.5 right-1.5 w-8 h-8 bg-background/80"
        >
          <Heart
            className={cn("w-4 h-4 transition-all", isFavorite ? "text-primary" : "text-muted-foreground")}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </Button>
      </div>

      <div className="min-w-0 space-y-2">
        <p className="text-[10px] uppercase text-muted-foreground truncate">
          {product.brand} · {getCategoryLabel(product.category)}
        </p>
        <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2">{product.name}</h3>
        <div className="flex flex-wrap items-center gap-3 pt-0.5">
          <span className="text-base font-bold text-foreground">
            {outOfStock ? "—" : `${product.price.toFixed(2)} €`}
          </span>
           <span className="flex items-center gap-1 text-[11px] text-primary">
             <Repeat className="w-3 h-3" /> {product.recurrences} réc.
          </span>
           <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
             <Users className="w-3 h-3" /> {product.sellers} vend.
          </span>
        </div>
      </div>

      <Button asChild variant="outline" size="sm" className="col-span-2 md:col-span-1">
        <a href={product.url} target="_blank" rel="noopener noreferrer">
          Ouvrir <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </Button>
    </article>
  );
};

export default ProductForYouCard;
