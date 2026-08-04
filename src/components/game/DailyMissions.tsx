import { Check, ChevronRight, PartyPopper } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Mission {
  id: string;
  label: string;
  hint: string;
  xp: number;
  to: string;
  done: boolean;
}

const DailyMissions = ({ missions, allDone }: { missions: Mission[]; allDone: boolean }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-black text-base">Missions du jour</h3>
        <span className="text-xs text-muted-foreground tabular-nums">
          {missions.filter((m) => m.done).length}/{missions.length}
        </span>
      </div>

      <div className="space-y-2">
        {missions.map((m) => (
          <button
            key={m.id}
            onClick={() => navigate(m.to)}
            className={cn("mission-row", m.done && "mission-row-done")}
          >
            <span className={cn("mission-check", m.done && "mission-check-done")}>
              {m.done && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
            </span>
            <span className="flex-1 text-left min-w-0">
              <span className="block text-sm font-semibold text-foreground truncate">{m.label}</span>
              <span className="block text-xs text-muted-foreground truncate">{m.hint}</span>
            </span>
            <span className="game-chip game-chip-teal shrink-0">+{m.xp} XP</span>
            {!m.done && <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
          </button>
        ))}
      </div>

      {allDone && (
        <p className="flex items-center gap-2 text-sm font-semibold text-primary">
          <PartyPopper className="w-4 h-4" /> Toutes les missions sont faites, reviens demain !
        </p>
      )}
    </div>
  );
};

export default DailyMissions;
