import { Flame, Wallet, ShieldCheck, Sparkles, RotateCcw } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface HuntPreset {
  id: string;
  label: string;
  help: string;
  icon: typeof Flame;
  filters: Record<string, unknown>;
}

export const HUNT_PRESETS: HuntPreset[] = [
  {
    id: "hot",
    label: "Ça cartonne",
    help: "Les produits qui reviennent le plus souvent",
    icon: Flame,
    filters: { sortKey: "recurrences", sortDir: "desc", stockFilter: "in_stock", datePreset: "all" },
  },
  {
    id: "cheap",
    label: "Petit budget",
    help: "Moins de 50 € à l'achat",
    icon: Wallet,
    filters: { priceMax: "50", sortKey: "recurrences", sortDir: "desc", stockFilter: "in_stock" },
  },
  {
    id: "low-competition",
    label: "Peu de concurrence",
    help: "5 vendeurs ou moins",
    icon: ShieldCheck,
    filters: { sellersMax: "5", sortKey: "recurrences", sortDir: "desc", stockFilter: "in_stock" },
  },
  {
    id: "fresh",
    label: "Nouveautés",
    help: "Repérés le plus récemment",
    icon: Sparkles,
    filters: { sortKey: "lastSeen", sortDir: "desc", stockFilter: "in_stock" },
  },
];

export function applyHuntPreset(preset: HuntPreset) {
  window.dispatchEvent(new CustomEvent("krakken:hunt-preset", { detail: preset.filters }));
}

const QuickHunt = () => {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="space-y-2.5">
      <p className="text-sm text-muted-foreground">
        Choisis une chasse en 1 clic — tu peux affiner ensuite avec les filtres.
      </p>
      <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
        {HUNT_PRESETS.map((p) => (
          <button
            key={p.id}
            title={p.help}
            onClick={() => {
              setActive(p.id);
              applyHuntPreset(p);
            }}
            className={cn("hunt-chip", active === p.id && "hunt-chip-active")}
          >
            <p.icon className="w-4 h-4" />
            {p.label}
          </button>
        ))}
        <button
          onClick={() => {
            setActive(null);
            window.dispatchEvent(new CustomEvent("krakken:hunt-reset"));
          }}
          className="hunt-chip"
        >
          <RotateCcw className="w-4 h-4" />
          Tout remettre à zéro
        </button>
      </div>
    </div>
  );
};

export default QuickHunt;
