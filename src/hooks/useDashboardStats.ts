import { useState, useEffect } from "react";
import { externalSupabase as supabase } from "@/integrations/supabase/external-client";

interface DailyCount {
  day: string; // dd/mm
  v: number; // cumulative
  added: number; // added that day
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
  loading: boolean;
  error: string | null;
}

async function fetchAllColumn<T>(column: string, extraSelect?: string): Promise<T[]> {
  const PAGE = 1000;
  let all: T[] = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from("products")
      .select(extraSelect || column)
      .range(from, from + PAGE - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    all = all.concat(data as T[]);
    if (data.length < PAGE) break;
    from += PAGE;
  }
  return all;
}

export function useDashboardStats(): DashboardStats {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalBrands: 0,
    totalRecurrences: 0,
    cumulativeData: [],
    categoryStats: [],
    latestProducts: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const load = async () => {
      try {
        // 1. Total count
        const { count } = await supabase
          .from("products")
          .select("url", { count: "exact", head: true });

        // 2. Fetch lightweight columns for aggregation
        const rows = await fetchAllColumn<{
          added_date: string | null;
          category: string | null;
          brand: string | null;
          recurrences: number | null;
        }>("added_date, category, brand, recurrences", "added_date, category, brand, recurrences");

        // Build cumulative chart
        const dateCountMap: Record<string, number> = {};
        const catMap: Record<string, { count: number; recurrences: number }> = {};
        const brandSet = new Set<string>();
        let totalRec = 0;

        for (const r of rows) {
          // Date
          if (r.added_date) {
            let key = "";
            // Try dd/mm/yyyy FIRST (before ISO, to avoid US mm/dd/yyyy misparse)
            const m = r.added_date.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
            if (m) {
              key = `${m[3]}-${m[2]}-${m[1]}`;
            } else {
              const iso = new Date(r.added_date);
              if (!isNaN(iso.getTime())) {
                key = `${iso.getFullYear()}-${String(iso.getMonth() + 1).padStart(2, '0')}-${String(iso.getDate()).padStart(2, '0')}`;
              }
            }
            if (key) dateCountMap[key] = (dateCountMap[key] || 0) + 1;
          }

          // Category
          const cat = r.category || "Autre";
          if (!catMap[cat]) catMap[cat] = { count: 0, recurrences: 0 };
          catMap[cat].count++;
          catMap[cat].recurrences += r.recurrences || 0;

          // Brand
          if (r.brand) brandSet.add(r.brand);
          totalRec += r.recurrences || 0;
        }

        // Cumulative
        const sortedDays = Object.keys(dateCountMap).sort();
        let cumul = 0;
        const cumulativeData: DailyCount[] = sortedDays.map(day => {
          cumul += dateCountMap[day];
          const d = new Date(day);
          const label = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
          return { day: label, v: cumul, added: dateCountMap[day] };
        });

        // Categories
        const categoryStats = Object.entries(catMap)
          .map(([name, d]) => ({ name, ...d }))
          .sort((a, b) => b.recurrences - a.recurrences);

        // 3. Latest products (top 8)
        const { data: latest } = await supabase
          .from("products")
          .select("*")
          .order("last_seen", { ascending: false })
          .limit(8);

        setStats({
          totalProducts: count || rows.length,
          totalBrands: brandSet.size,
          totalRecurrences: totalRec,
          cumulativeData,
          categoryStats,
          latestProducts: latest || [],
          loading: false,
          error: null,
        });
      } catch (e: any) {
        setStats(prev => ({ ...prev, loading: false, error: e.message }));
      }
    };
    load();
  }, []);

  return stats;
}
