import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ShieldCheck, AlertTriangle, CheckCircle2, Clock, Crown, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Row {
  user_id: string;
  email: string;
  signed_up_at: string | null;
  raw_status: string;
  computed_status: string;
  has_access: boolean;
  trial_ends_at: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  days_left: number | null;
  is_paying: boolean;
}

interface Payload {
  total: number;
  active: number;
  expired: number;
  paying: number;
  rows: Row[];
}

const fmtDate = (s: string | null) =>
  s ? new Date(s).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const statusBadge = (r: Row) => {
  if (r.is_paying && r.has_access) {
    return { label: "Pro payé", color: "hsl(var(--primary))", Icon: Crown };
  }
  if (r.computed_status === "trial_expired") {
    return { label: "Trial expiré", color: "hsl(0 70% 60%)", Icon: AlertTriangle };
  }
  if (r.raw_status === "trialing" && r.has_access) {
    return { label: "Trial actif", color: "hsl(174 72% 56%)", Icon: Clock };
  }
  if (r.raw_status === "canceled") {
    return { label: r.has_access ? "Annulé (grace)" : "Annulé", color: "hsl(40 80% 60%)", Icon: AlertTriangle };
  }
  if (r.has_access) {
    return { label: r.raw_status, color: "hsl(174 72% 56%)", Icon: CheckCircle2 };
  }
  return { label: r.raw_status, color: "hsl(0 70% 60%)", Icon: AlertTriangle };
};

const AdminSubscriptions = () => {
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "expired" | "trialing" | "paying">("all");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("admin-list-subscriptions");
    if (error) {
      toast.error("Erreur de chargement", { description: error.message });
      setLoading(false);
      return;
    }
    setData(data as Payload);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const rows = (data?.rows ?? []).filter((r) => {
    if (filter === "expired") return !r.has_access;
    if (filter === "trialing") return r.raw_status === "trialing" && r.has_access;
    if (filter === "paying") return r.is_paying;
    return true;
  });

  const copy = (txt: string) => {
    navigator.clipboard.writeText(txt);
    toast.success("Copié");
  };

  return (
    <div className="glass-panel-glow p-5 mt-6">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <h2 className="text-base font-bold text-foreground font-display">Admin · Abonnements</h2>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border/50 hover:border-primary/40 transition-colors text-foreground/80"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          Rafraîchir
        </button>
      </div>

      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {[
            { key: "all" as const, label: "Total", value: data.total, color: "hsl(var(--foreground))" },
            { key: "trialing" as const, label: "Trial actif", value: data.rows.filter((r) => r.raw_status === "trialing" && r.has_access).length, color: "hsl(174 72% 56%)" },
            { key: "paying" as const, label: "Payants", value: data.paying, color: "hsl(var(--primary))" },
            { key: "expired" as const, label: "Expirés", value: data.expired, color: "hsl(0 70% 60%)" },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => setFilter(s.key)}
              className={`p-3 rounded-lg border text-left transition-all ${filter === s.key ? "border-primary/60" : "border-border/40"}`}
              style={{ background: "hsl(var(--secondary) / 0.4)" }}
            >
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold font-display mt-0.5" style={{ color: s.color }}>{s.value}</p>
            </button>
          ))}
        </div>
      )}

      {loading && !data && (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      )}

      {data && (
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border/40">
                <th className="px-2 py-2 font-medium">Email</th>
                <th className="px-2 py-2 font-medium">Statut</th>
                <th className="px-2 py-2 font-medium">Fin</th>
                <th className="px-2 py-2 font-medium text-right">Jours</th>
                <th className="px-2 py-2 font-medium">Inscription</th>
                <th className="px-2 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const b = statusBadge(r);
                const endDate = r.raw_status === "trialing" ? r.trial_ends_at : r.current_period_end;
                return (
                  <tr key={r.user_id} className="border-b border-border/20 hover:bg-secondary/30">
                    <td className="px-2 py-2 text-foreground">{r.email}</td>
                    <td className="px-2 py-2">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold" style={{ background: `${b.color} / 0.12`, color: b.color, border: `1px solid ${b.color}` }}>
                        <b.Icon className="w-3 h-3" />
                        {b.label}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-foreground/80">{fmtDate(endDate)}</td>
                    <td className="px-2 py-2 text-right font-mono" style={{ color: r.days_left !== null && r.days_left < 0 ? "hsl(0 70% 60%)" : "hsl(var(--foreground))" }}>
                      {r.days_left ?? "—"}
                    </td>
                    <td className="px-2 py-2 text-muted-foreground">{fmtDate(r.signed_up_at)}</td>
                    <td className="px-2 py-2">
                      <button onClick={() => copy(r.email)} className="p-1 hover:text-primary text-muted-foreground" title="Copier email">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr><td colSpan={6} className="text-center text-muted-foreground py-6">Aucun résultat</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminSubscriptions;
