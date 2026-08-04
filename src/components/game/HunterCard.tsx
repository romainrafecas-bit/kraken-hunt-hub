import { Flame, Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface HunterCardProps {
  level: number;
  rank: string;
  nextRank: string | null;
  xp: number;
  nextAt: number | null;
  progress: number;
  streak: number;
  compact?: boolean;
}

const HunterCard = ({ level, rank, nextRank, xp, nextAt, progress, streak, compact }: HunterCardProps) => {
  const size = compact ? 76 : 104;
  const stroke = compact ? 6 : 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div className="flex items-center gap-5">
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={stroke} />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="url(#hunterGrad)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: c - (c * progress) / 100 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ filter: "drop-shadow(0 0 6px hsl(var(--primary) / 0.55))" }}
          />
          <defs>
            <linearGradient id="hunterGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground">Niv.</span>
          <span className="font-display font-black text-2xl text-primary leading-none">{level}</span>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-display font-black text-lg text-foreground truncate">{rank}</h3>
          <span className="game-chip game-chip-amber">
            <Flame className="w-3 h-3" /> {streak} j de suite
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          {nextRank ? (
            <>
              Encore <span className="text-primary font-bold">{Math.max(0, (nextAt ?? 0) - xp)} XP</span> pour devenir{" "}
              <span className="text-foreground font-semibold">{nextRank}</span>
            </>
          ) : (
            "Rang maximum atteint, bravo !"
          )}
        </p>
        <div className="xp-track mt-3">
          <motion.div
            className="xp-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
          <Trophy className="w-3.5 h-3.5 text-primary" />
          <span className="tabular-nums font-semibold text-foreground">{xp.toLocaleString("fr-FR")} XP</span>
          <span>au total</span>
        </div>
      </div>
    </div>
  );
};

export default HunterCard;
