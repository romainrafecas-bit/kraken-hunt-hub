import { useEffect } from "react";
import KrakkenSidebar from "@/components/dashboard/KrakkenSidebar";
import ProductAnalysis from "@/components/dashboard/ProductAnalysis";
import QuickHunt from "@/components/game/QuickHunt";
import BentoTile from "@/components/game/BentoTile";
import { useHunterProgress, markMission } from "@/hooks/useHunterProgress";
import { Target, Flame } from "lucide-react";

const Produits = () => {
  const { streak, kept } = useHunterProgress();

  useEffect(() => {
    document.title = "Chasse aux pépites | Krakken";
    markMission("chasse");
  }, []);

  return (
    <div className="min-h-screen abyss-gradient">
      <KrakkenSidebar />
      <main className="pl-16 xl:pl-56 p-4 lg:p-6 space-y-5">
        <BentoTile glow="teal" className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "hsl(var(--primary) / 0.12)",
                  border: "1px solid hsl(var(--primary) / 0.25)",
                }}
              >
                <Target className="w-5 h-5 text-primary" />
              </span>
              <div>
                <h1 className="font-display font-black text-xl">La chasse aux pépites</h1>
                <p className="text-sm text-muted-foreground">
                  Repère les produits qui se vendent, garde-les, calcule ta marge.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="game-chip game-chip-amber">
                <Flame className="w-3 h-3" /> {streak} j de suite
              </span>
              <span className="game-chip game-chip-teal">{kept} pépites gardées</span>
            </div>
          </div>

          <div className="mt-5">
            <QuickHunt />
          </div>
        </BentoTile>

        <ProductAnalysis />
      </main>
    </div>
  );
};

export default Produits;
