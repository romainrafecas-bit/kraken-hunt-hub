import { useCallback, useEffect, useState } from "react";

export interface UserPreferences {
  budgetMin: number | null;
  budgetMax: number | null;
  categories: string[];
  inStockOnly: boolean;
}

const STORAGE_KEY = "krakken:preferences";

export const DEFAULT_PREFERENCES: UserPreferences = {
  budgetMin: null,
  budgetMax: null,
  categories: [],
  inStockOnly: true,
};

function read(): UserPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw);
    return {
      budgetMin: typeof parsed.budgetMin === "number" ? parsed.budgetMin : null,
      budgetMax: typeof parsed.budgetMax === "number" ? parsed.budgetMax : null,
      categories: Array.isArray(parsed.categories) ? parsed.categories.filter((c: unknown) => typeof c === "string") : [],
      inStockOnly: parsed.inStockOnly !== false,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

/** Préférences de sourcing (budget, catégories) persistées en local. */
export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => read());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      /* quota / mode privé : on ignore */
    }
  }, [preferences]);

  const update = useCallback((patch: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...patch }));
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setPreferences((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  }, []);

  const reset = useCallback(() => setPreferences(DEFAULT_PREFERENCES), []);

  const hasPreferences =
    preferences.categories.length > 0 || preferences.budgetMin != null || preferences.budgetMax != null;

  return { preferences, update, toggleCategory, reset, hasPreferences };
}
