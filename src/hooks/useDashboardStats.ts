import { useProductsStats } from "./useProductsStats";

interface DailyCount {
  day: string;
  v: number;
  added: number;
}

interface CategoryStat {
  name: string;
  count: number;
  recurrences: number;
}

interface DashboardStats {
  totalProducts: number;
  totalBrands: number;
  totalRecurrences: number;
  cumulativeData: DailyCount[];
  categoryStats: CategoryStat[];
  latestProducts: any[];
  lastUpdate: string | null;
  loading: boolean;
  error: string | null;
}

function buildCumulative(dailyAdded: Record<string, number>): DailyCount[] {
  const sortedDays = Object.keys(dailyAdded).sort();
  if (sortedDays.length === 0) return [];
  const out: DailyCount[] = [];
  const cursor = new Date(sortedDays[0]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let cumul = 0;
  while (cursor.getTime() <= today.getTime()) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(
      cursor.getDate(),
    ).padStart(2, "0")}`;
    const added = dailyAdded[key] || 0;
    cumul += added;
    const label = `${String(cursor.getDate()).padStart(2, "0")}/${String(
      cursor.getMonth() + 1,
    ).padStart(2, "0")}`;
    out.push({ day: label, v: cumul, added });
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
}

export function useDashboardStats(): DashboardStats {
  const { stats, isLoading, error } = useProductsStats();

  const categoryStats = [...(stats?.categoryStats ?? [])].sort(
    (a, b) => b.recurrences - a.recurrences || b.count - a.count || a.name.localeCompare(b.name),
  );

  return {
    totalProducts: stats?.totalProducts || 0,
    totalBrands: stats?.totalBrands || 0,
    totalRecurrences: stats?.totalRecurrences || 0,
    cumulativeData: buildCumulative(stats?.dailyAdded ?? {}),
    categoryStats,
    latestProducts: stats?.latestProducts ?? [],
    lastUpdate: stats?.lastUpdate ?? null,
    loading: isLoading,
    error,
  };
}
