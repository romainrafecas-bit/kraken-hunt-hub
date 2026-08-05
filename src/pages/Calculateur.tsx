import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Save, RotateCcw, TrendingUp, Trash2, Sparkles } from "lucide-react";
import KrakkenSidebar from "@/components/dashboard/KrakkenSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  MARKETPLACES,
  getMarketplace,
  getCategory,
  type MarketplaceId,
} from "@/data/marketplaceFees";
import { useMarginCalculations } from "@/hooks/useMarginCalculations";

interface Inputs {
  label: string;
  marketplaceId: MarketplaceId;
  categoryId: string;
  sellPrice: number;
  buyPrice: number;
  vatRate: number;
  shippingCharged: number;
  shippingCost: number;
  packagingCost: number;
  adsCost: number;
}

const DEFAULTS: Inputs = {
  label: "",
  marketplaceId: "cdiscount",
  categoryId: "high_tech",
  sellPrice: 0,
  buyPrice: 0,
  vatRate: 20,
  shippingCharged: 0,
  shippingCost: 0,
  packagingCost: 0,
  adsCost: 0,
};

const fmt = (n: number) =>
  Number.isFinite(n)
    ? n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "—";

const Calculateur = () => {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const { calculations, save, remove } = useMarginCalculations();
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof Inputs>(k: K, v: Inputs[K]) =>
    setInputs((s) => ({ ...s, [k]: v }));

  const num = <K extends keyof Inputs>(k: K) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    set(k, (Number.isFinite(v) ? v : 0) as Inputs[K]);
  };

  const marketplace = useMemo(() => getMarketplace(inputs.marketplaceId), [inputs.marketplaceId]);
  const category = useMemo(
    () => getCategory(marketplace, inputs.categoryId),
    [marketplace, inputs.categoryId]
  );

  const results = useMemo(() => {
    const totalRevenue = inputs.sellPrice + inputs.shippingCharged;
    const hasRevenue = totalRevenue > 0;
    const vatAmount = hasRevenue ? totalRevenue - totalRevenue / (1 + inputs.vatRate / 100) : 0;
    const revenueHT = totalRevenue - vatAmount;
    // Pas de commission si pas de vente (évite -0,30€ avec frais fixes)
    const commission = hasRevenue ? totalRevenue * category.rate + marketplace.fixedFee : 0;
    const totalCost =
      inputs.buyPrice +
      inputs.shippingCost +
      inputs.packagingCost +
      inputs.adsCost +
      commission;
    const grossMargin = totalRevenue - totalCost;
    const grossMarginPct = totalRevenue > 0 ? (grossMargin / totalRevenue) * 100 : 0;
    const netMargin = revenueHT - totalCost;
    const netMarginPct = revenueHT > 0 ? (netMargin / revenueHT) * 100 : 0;
    const coefficient = inputs.buyPrice > 0 ? inputs.sellPrice / inputs.buyPrice : 0;
    // Seuil de rentabilité : prix de vente min pour marge brute = 0
    // sellPrice * (1 - rate) + shippingCharged*(1 - rate) - buy - ship - pack - ads - fixed = 0
    const fixedCharges =
      inputs.buyPrice +
      inputs.shippingCost +
      inputs.packagingCost +
      inputs.adsCost +
      marketplace.fixedFee +
      inputs.shippingCharged * category.rate -
      inputs.shippingCharged;
    const breakEven = (1 - category.rate) > 0 ? fixedCharges / (1 - category.rate) : 0;

    return {
      totalRevenue,
      revenueHT,
      vatAmount,
      commission,
      totalCost,
      grossMargin,
      grossMarginPct,
      netMargin,
      netMarginPct,
      coefficient,
      breakEven: breakEven > 0 ? breakEven : 0,
    };
  }, [inputs, marketplace, category]);

  const marginColor =
    results.grossMarginPct >= 20
      ? "text-emerald-400"
      : results.grossMarginPct >= 10
      ? "text-amber-400"
      : "text-rose-400";

  const handleReset = () => setInputs(DEFAULTS);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await save(inputs.label || `${marketplace.label} · ${category.label}`, inputs as unknown as Record<string, unknown>, results as unknown as Record<string, unknown>);
    setSaving(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Calcul sauvegardé", description: "Disponible dans ton historique." });
    }
  };

  const loadCalc = (id: string) => {
    const c = calculations.find((x) => x.id === id);
    if (c) setInputs({ ...DEFAULTS, ...(c.inputs as unknown as Inputs), label: c.label });
  };

  return (
    <div className="min-h-screen flex bg-background">
      <KrakkenSidebar />
      <main className="flex-1 ml-16 xl:ml-56 p-6 lg:p-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(145deg, hsl(228 42% 7%), hsl(225 35% 5%))",
                  border: "1px solid hsl(174 72% 46% / 0.25)",
                  boxShadow: "0 0 24px -4px hsl(174 72% 46% / 0.3)",
                }}
              >
                <Calculator className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="kraken-title text-3xl tracking-wide">Calculateur de marge</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Mesure ta marge nette réelle avant de lancer la chasse.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Inputs */}
            <Card className="lg:col-span-3 bg-card/60 backdrop-blur-xl border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> Tes paramètres
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="label">Libellé du calcul</Label>
                    <Input
                      id="label"
                      placeholder="Ex : iPhone 15 Cdiscount"
                      value={inputs.label}
                      onChange={(e) => set("label", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Marketplace</Label>
                    <Select
                      value={inputs.marketplaceId}
                      onValueChange={(v) => {
                        const mp = getMarketplace(v as MarketplaceId);
                        setInputs((s) => ({
                          ...s,
                          marketplaceId: v as MarketplaceId,
                          categoryId: mp.categories[0].id,
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MARKETPLACES.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Catégorie produit</Label>
                    <Select
                      value={inputs.categoryId}
                      onValueChange={(v) => set("categoryId", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {marketplace.categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.label} — {(c.rate * 100).toFixed(1)}%
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>TVA</Label>
                    <Select
                      value={String(inputs.vatRate)}
                      onValueChange={(v) => set("vatRate", parseFloat(v))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20">20%</SelectItem>
                        <SelectItem value="10">10%</SelectItem>
                        <SelectItem value="5.5">5,5%</SelectItem>
                        <SelectItem value="0">0% (export / non assujetti)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="h-px bg-border/50" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Prix de vente TTC (€)</Label>
                    <Input type="number" step="0.01" min="0" value={inputs.sellPrice || ""} onChange={num("sellPrice")} placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Prix d'achat HT (€)</Label>
                    <Input type="number" step="0.01" min="0" value={inputs.buyPrice || ""} onChange={num("buyPrice")} placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Frais de port facturés (€)</Label>
                    <Input type="number" step="0.01" min="0" value={inputs.shippingCharged || ""} onChange={num("shippingCharged")} placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Coût d'expédition réel (€)</Label>
                    <Input type="number" step="0.01" min="0" value={inputs.shippingCost || ""} onChange={num("shippingCost")} placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Emballage / picking (€)</Label>
                    <Input type="number" step="0.01" min="0" value={inputs.packagingCost || ""} onChange={num("packagingCost")} placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Pub / acquisition (€)</Label>
                    <Input type="number" step="0.01" min="0" value={inputs.adsCost || ""} onChange={num("adsCost")} placeholder="0.00" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button onClick={handleSave} disabled={saving || inputs.sellPrice <= 0}>
                    <Save className="w-4 h-4" /> {saving ? "Sauvegarde…" : "Sauvegarder"}
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    <RotateCcw className="w-4 h-4" /> Réinitialiser
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card
              className="lg:col-span-2 lg:sticky lg:top-6 self-start bg-card/60 backdrop-blur-xl border-border/50 overflow-hidden"
              style={{
                boxShadow: "0 0 40px -12px hsl(174 72% 46% / 0.15)",
              }}
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" /> Résultat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div
                  className="p-5 rounded-xl text-center"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(225 32% 8% / 0.9), hsl(225 28% 10% / 0.6))",
                    border: "1px solid hsl(174 72% 46% / 0.2)",
                  }}
                >
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
                    Marge brute
                  </p>
                  <p className={`text-4xl font-bold font-mono ${marginColor}`}>
                    {fmt(results.grossMargin)} €
                  </p>
                  <p className={`text-sm font-semibold mt-1 ${marginColor}`}>
                    {results.grossMarginPct.toFixed(1)} %
                  </p>
                </div>

                <div className="space-y-2.5 text-sm">
                  <Row label="Chiffre d'affaires TTC" value={`${fmt(results.totalRevenue)} €`} />
                  <Row label="CA HT" value={`${fmt(results.revenueHT)} €`} muted />
                  <Row label="TVA collectée" value={`${fmt(results.vatAmount)} €`} muted />
                  <Row
                    label={`Commission ${marketplace.label}`}
                    value={`${fmt(results.commission)} € (${(category.rate * 100).toFixed(1)}%)`}
                  />
                  <Row label="Coût total" value={`${fmt(results.totalCost)} €`} />
                  <div className="h-px bg-border/40 my-1" />
                  <Row
                    label="Marge nette (HT)"
                    value={`${fmt(results.netMargin)} € · ${results.netMarginPct.toFixed(1)}%`}
                    strong
                  />
                  <Row
                    label="Coefficient"
                    value={results.coefficient > 0 ? `× ${results.coefficient.toFixed(2)}` : "—"}
                  />
                  <Row label="Seuil de rentabilité" value={`${fmt(results.breakEven)} €`} muted />
                </div>

                {marketplace.monthlyFee > 0 && (
                  <p className="text-[11px] text-muted-foreground italic">
                    Hors abonnement {marketplace.label} ({marketplace.monthlyFee}€/mois).
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* History */}
          {calculations.length > 0 && (
            <Card className="mt-6 bg-card/60 backdrop-blur-xl border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">Historique récent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {calculations.slice(0, 5).map((c) => {
                    const r = c.results as { grossMarginPct?: number; grossMargin?: number };
                    return (
                      <div
                        key={c.id}
                        className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border/30 hover:border-primary/30 transition-colors"
                      >
                        <button
                          onClick={() => loadCalc(c.id)}
                          className="flex-1 text-left min-w-0"
                        >
                          <p className="text-sm font-medium truncate">{c.label}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {new Date(c.created_at).toLocaleString("fr-FR")}
                          </p>
                        </button>
                        <div className="text-right">
                          <p className="text-sm font-mono font-semibold text-primary">
                            {fmt(r.grossMargin ?? 0)} €
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {(r.grossMarginPct ?? 0).toFixed(1)}%
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(c.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </main>
    </div>
  );
};

const Row = ({
  label,
  value,
  muted,
  strong,
}: {
  label: string;
  value: string;
  muted?: boolean;
  strong?: boolean;
}) => (
  <div className="flex items-center justify-between gap-3">
    <span className={`text-[13px] ${muted ? "text-muted-foreground" : "text-foreground/80"}`}>
      {label}
    </span>
    <span
      className={`font-mono ${strong ? "text-primary font-semibold" : muted ? "text-muted-foreground" : "text-foreground"}`}
    >
      {value}
    </span>
  </div>
);

export default Calculateur;
