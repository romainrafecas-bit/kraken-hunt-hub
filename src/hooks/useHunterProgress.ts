import { useCallback, useEffect, useMemo, useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";

/**
 * Gamification layer (100% frontend/localStorage).
 * XP, niveaux, série de jours et missions quotidiennes — dérivés des favoris
 * de l'utilisateur et de son activité du jour, sans changement backend.
 */

const P = "krakken:game:";
const todayKey = () => new Date().toISOString().slice(0, 10);

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(P + key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(P + key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export type MissionId = "favori" | "chasse" | "marge";

export const MISSIONS: { id: MissionId; label: string; hint: string; xp: number; to: string }[] = [
  { id: "chasse", label: "Ouvre la chasse du jour", hint: "Va voir les nouvelles pépites", xp: 10, to: "/produits" },
  { id: "favori", label: "Garde 1 pépite", hint: "Ajoute un produit à tes pépites", xp: 20, to: "/produits" },
  { id: "marge", label: "Calcule 1 marge", hint: "Vérifie combien tu gagnes", xp: 20, to: "/calculateur" },
];

export const RANKS = [
  { name: "Moussaillon", min: 0 },
  { name: "Plongeur", min: 100 },
  { name: "Chasseur", min: 300 },
  { name: "Harponneur", min: 700 },
  { name: "Capitaine", min: 1400 },
  { name: "Kraken", min: 2600 },
];

function rankFor(xp: number) {
  let i = 0;
  for (let k = 0; k < RANKS.length; k++) if (xp >= RANKS[k].min) i = k;
  const current = RANKS[i];
  const next = RANKS[i + 1] ?? null;
  const span = (next ? next.min : current.min + 1000) - current.min;
  const progress = Math.min(100, Math.round(((xp - current.min) / span) * 100));
  return { level: i + 1, rank: current.name, nextRank: next?.name ?? null, nextAt: next?.min ?? null, progress };
}

/** Marque une mission comme faite pour aujourd'hui. */
export function markMission(id: MissionId) {
  const day = todayKey();
  const done = read<Record<string, string[]>>("missions", {});
  const list = new Set(done[day] ?? []);
  if (list.has(id)) return;
  list.add(id);
  write("missions", { [day]: [...list] });
  window.dispatchEvent(new Event("krakken:game-update"));
}

/** Enregistre la visite du jour pour la série (streak). */
function touchStreak() {
  const day = todayKey();
  const last = read<string>("lastDay", "");
  if (last === day) return;
  let streak = read<number>("streak", 0);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  streak = last === yesterday ? streak + 1 : 1;
  write("streak", streak);
  write("lastDay", day);
  write("bestStreak", Math.max(streak, read<number>("bestStreak", 0)));
}

export function useHunterProgress() {
  const { favorites } = useFavorites();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    touchStreak();
    const bump = () => setTick((t) => t + 1);
    window.addEventListener("krakken:game-update", bump);
    return () => window.removeEventListener("krakken:game-update", bump);
  }, []);

  const day = todayKey();

  const stats = useMemo(() => {
    const kept = favorites.length;
    const validated = favorites.filter((f) => f.collection === "Validé").length;
    const testing = favorites.filter((f) => f.collection === "En cours de test").length;
    const keptToday = favorites.filter((f) => (f.created_at ?? "").slice(0, 10) === day).length;

    const missionsDone = new Set(read<Record<string, string[]>>("missions", {})[day] ?? []);
    if (keptToday > 0) missionsDone.add("favori");

    const streak = read<number>("streak", 1);
    const bestStreak = read<number>("bestStreak", 1);

    const missionXp = MISSIONS.filter((m) => missionsDone.has(m.id)).reduce((s, m) => s + m.xp, 0);
    const xp = kept * 15 + validated * 60 + testing * 25 + streak * 10 + missionXp;

    const missions = MISSIONS.map((m) => ({ ...m, done: missionsDone.has(m.id) }));
    const missionsCompleted = missions.filter((m) => m.done).length;

    return {
      kept,
      validated,
      testing,
      keptToday,
      streak,
      bestStreak,
      xp,
      missions,
      missionsCompleted,
      allMissionsDone: missionsCompleted === MISSIONS.length,
      ...rankFor(xp),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favorites, day, tick]);

  const complete = useCallback((id: MissionId) => markMission(id), []);

  return { ...stats, complete };
}
