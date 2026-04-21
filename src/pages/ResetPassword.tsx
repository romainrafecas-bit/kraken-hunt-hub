import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Loader2, Check, Circle, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import krakkenLogo from "@/assets/krakken-logo.png";
import Footer from "@/components/Footer";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Supabase parses the recovery token from the hash automatically and emits PASSWORD_RECOVERY
  useEffect(() => {
    const hash = window.location.hash;
    const isRecovery = hash.includes("type=recovery") || hash.includes("access_token");

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });

    // Fallback: si pas d'évent dans 800ms, on check la session
    const timer = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) setReady(true);
      else if (!isRecovery) setError("Lien invalide ou expiré. Demande un nouveau lien.");
    }, 800);

    return () => {
      sub.subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const checks = [
    { ok: password.length >= 8, label: "8 caractères minimum" },
    { ok: /[a-zA-Z]/.test(password), label: "Au moins une lettre" },
    { ok: /[0-9]/.test(password), label: "Au moins un chiffre" },
    { ok: /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\];'`~]/.test(password), label: "Au moins un caractère spécial" },
  ];
  const allOk = checks.every((c) => c.ok);
  const match = password.length > 0 && password === confirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy || !allOk || !match) return;
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Mot de passe mis à jour");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err?.message ?? "Erreur lors de la mise à jour");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen abyss-gradient flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-panel-glow w-full max-w-md p-8"
        >
          <div className="flex flex-col items-center mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 overflow-hidden"
              style={{
                background: "linear-gradient(145deg, hsl(228 42% 7%), hsl(225 35% 5%))",
                border: "1px solid hsl(174 72% 46% / 0.25)",
                boxShadow: "0 0 24px -4px hsl(174 72% 46% / 0.3)",
              }}
            >
              <img
                src={krakkenLogo}
                alt="Krakken"
                className="w-12 h-12 object-contain"
                style={{ filter: "drop-shadow(0 0 6px hsl(174 72% 46% / 0.5))" }}
              />
            </div>
            <h1 className="kraken-title text-2xl">Nouveau mot de passe</h1>
            <p className="text-xs text-muted-foreground mt-1">Choisis un mot de passe solide</p>
          </div>

          {error ? (
            <div className="text-center py-6">
              <p className="text-sm text-destructive mb-4">{error}</p>
              <button
                onClick={() => navigate("/auth")}
                className="text-xs text-primary hover:underline"
              >
                Retour à la connexion
              </button>
            </div>
          ) : !ready ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="soft-label flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Nouveau mot de passe
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-secondary/60 border border-border/40 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-all"
                  placeholder="••••••••"
                />
                <ul className="space-y-1 mt-2">
                  {checks.map((c) => (
                    <li
                      key={c.label}
                      className={`flex items-center gap-1.5 text-[11px] transition-colors ${c.ok ? "text-primary" : "text-muted-foreground/70"}`}
                    >
                      {c.ok ? <Check className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                      {c.label}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1.5">
                <label className="soft-label flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Confirmation
                </label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full bg-secondary/60 border border-border/40 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-all"
                  placeholder="••••••••"
                />
                {confirm.length > 0 && !match && (
                  <p className="text-[11px] text-destructive">Les mots de passe ne correspondent pas</p>
                )}
              </div>

              <button
                type="submit"
                disabled={busy || !allOk || !match}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-primary-foreground transition-all disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, hsl(174 72% 46%), hsl(174 72% 38%))",
                  boxShadow: "0 4px 16px -4px hsl(174 72% 46% / 0.4)",
                }}
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Mettre à jour"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;
