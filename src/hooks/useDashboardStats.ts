import { useQuery } from "@tanstack/react-query";
import { externalSupabase as supabase } from "@/integrations/supabase/external-client";

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

async function fetchAllColumn<T>(extraSelect: string): Promise<T[]> {
  const PAGE = 1000;
  let all: T[] = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from("products")
      .select(extraSelect)
      .range(from, from + PAGE - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    all = all.concat(data as T[]);
    if (data.length < PAGE) break;
    from += PAGE;
  }
  return all;
}

async function loadDashboardStats(): Promise<Omit<DashboardStats, "loading" | "error">> {
  const { count } = await supabase.from("products").select("url", { count: "exact", head: true });

  const rows = await fetchAllColumn<{
    added_date: string | null;
    category: string | null;
    brand: string | null;
    recurrences: number | null;
  }>("added_date, category, brand, recurrences");

  const dateCountMap: Record<string, number> = {};
  const catMap: Record<string, { count: number; recurrences: number }> = {};
  const brandSet = new Set<string>();
  let totalRec = 0;

  for (const r of rows) {
    if (r.added_date) {
      let key = "";
      const iso = r.added_date.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (iso) {
        key = `${iso[1]}-${iso[2]}-${iso[3]}`;
      } else {
        const m = r.added_date.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (m) {
          key = `${m[3]}-${m[2]}-${m[1]}`;
        } else {
          const d = new Date(r.added_date);
          if (!isNaN(d.getTime())) {
            key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          }
        }
      }
      if (key) dateCountMap[key] = (dateCountMap[key] || 0) + 1;
    }

    const cat = r.category || "Autre";
    if (!catMap[cat]) catMap[cat] = { count: 0, recurrences: 0 };
    catMap[cat].count++;
    catMap[cat].recurrences += r.recurrences || 0;

    if (r.brand) brandSet.add(r.brand);
    totalRec += r.recurrences || 0;
  }

  const sortedDays = Object.keys(dateCountMap).sort();
  const cumulativeData: DailyCount[] = [];
  if (sortedDays.length > 0) {
    const start = new Date(sortedDays[0]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let cumul = 0;
    const cursor = new Date(start);
    while (cursor.getTime() <= today.getTime()) {
      const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`;
      const added = dateCountMap[key] || 0;
      cumul += added;
      const label = `${String(cursor.getDate()).padStart(2, '0')}/${String(cursor.getMonth() + 1).padStart(2, '0')}`;
      cumulativeData.push({ day: label, v: cumul, added });
      cursor.setDate(cursor.getDate() + 1);
    }
  }

  const categoryStats = Object.entries(catMap)
    .map(([name, d]) => ({ name, ...d }))
    .sort((a, b) => b.recurrences - a.recurrences);

  const { data: latestRaw } = await supabase
    .from("products")
    .select("*")
    .order("last_seen", { ascending: false, nullsFirst: false })
    .limit(8);

  const { data: lastUpdRow } = await supabase
    .from("products")
    .select("added_date")
    .order("added_date", { ascending: false, nullsFirst: false })
    .limit(1);
  const lastUpdate = lastUpdRow?.[0]?.added_date || null;

  return {
    totalProducts: count || rows.length,
    totalBrands: brandSet.size,
    totalRecurrences: totalRec,
    cumulativeData,
    categoryStats,
    latestProducts: latestRaw || [],
    lastUpdate,
  };
}

export function useDashboardStats(): DashboardStats {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: loadDashboardStats,
  });

  return {
    totalProducts: data?.totalProducts || 0,
    totalBrands: data?.totalBrands || 0,
    totalRecurrences: data?.totalRecurrences || 0,
    cumulativeData: data?.cumulativeData || [],
    categoryStats: data?.categoryStats || [],
    latestProducts: data?.latestProducts || [],
    lastUpdate: data?.lastUpdate || null,
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}
