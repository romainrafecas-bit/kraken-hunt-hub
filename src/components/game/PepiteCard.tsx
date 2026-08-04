import { Heart, ExternalLink, Users, Repeat, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Product } from "@/data/products";

export function potentialScore(p: Product) {
  const demand = Math.min(60, (p.recurrences || 0) * 6);
  const competition = p.sellers <= 3 ? 30 : p.sellers <= 8 ? 22 : p.sellers <= 15 ? 12 : 4;
  const deal = p.originalPrice > p.price ? 10 : 0;
  return Math.max(8, Math.min(100, Math.round(demand + competition + deal)));
}

function badgeFor(score: number) {
  if (score >= 72) return { label: "Pépite en or", chip: "game-chip-amber" };
  if (score >= 50) return { label: "Bon filon", chip: "game-chip-teal" };
  return { label: "À creuser", chip: "game-chip-violet" };
}

interface PepiteCardProps {
  product: Product;
  favorite: boolean;
  onToggleFavorite: () => void;
  delay?: number;
}

const PepiteCard = ({ product, favorite, onToggleFavorite, delay = 0 }: PepiteCardProps) => {
  const score = potentialScore(product);
  const badge = badgeFor(score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bento-tile bento-interactive p-3.5 flex gap-3.5 items-center"
    >
      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-secondary flex items-center justify-center">
        {product.image ? (
          <img
            src={product.image}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <Sparkles className="w-5 h-5 text-muted-foreground" />
        )}
      </div>


      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn("game-chip", badge.chip)}>{badge.label}</span>
          <span className="text-[0.7rem] text-muted-foreground truncate">{product.brand}</span>
        </div>
        <p className="text-sm font-semibold text-foreground line-clamp-1">{product.name}</p>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
          <span className="font-display font-black text-primary text-sm">
            {product.price > 0 ? `${product.price.toFixed(2)} €` : "—"}
          </span>
          <span className="flex items-center gap-1">
            <Repeat className="w-3 h-3" /> {product.recurrences}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" /> {product.sellers}
          </span>
        </div>
        <div className="xp-track mt-2 h-1.5">
          <div className="xp-fill" style={{ width: `${score}%` }} />
        </div>
      </div>

      <div className="flex flex-col gap-2 shrink-0">
        <button
          onClick={onToggleFavorite}
          aria-label={favorite ? "Retirer de mes pépites" : "Garder cette pépite"}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-secondary"
        >
          <Heart
            className={cn("w-4 h-4 transition-all", favorite ? "text-rose-400 fill-rose-400" : "text-muted-foreground")}
          />
        </button>
        {product.url && (
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ouvrir la fiche produit"
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-secondary text-muted-foreground hover:text-primary"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default PepiteCard;
