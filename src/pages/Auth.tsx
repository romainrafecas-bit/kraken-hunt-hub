import { useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, UserPlus, Loader2, Check, Circle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import krakkenLogo from "@/assets/krakken-logo.png";
import ForgotPasswordDialog from "@/components/ForgotPasswordDialog";
import Footer from "@/components/Footer";

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Connexion réussie");
        navigate("/dashboard");
        return;
      }

      // Inscription ouverte à tous

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/dashboard` },
      });
      if (error) throw error;

      // Welcome email — fire-and-forget (won't block signup)
      if (data.user) {
        supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "welcome-pro",
            recipientEmail: email,
            idempotencyKey: `welcome-${data.user.id}`,
            templateData: { name: email.split("@")[0] },
          },
        }).catch((e) => console.warn("welcome email failed", e));
      }

      toast.success("Compte créé. Bienvenue à bord !");
      navigate("/dashboard");
    } catch (err: any) {
      const raw = String(err?.message ?? "Erreur");
      const fr = raw
        .replace(/Invalid login credentials/i, "Email ou mot de passe incorrect")
        .replace(/Email not confirmed/i, "Email non confirmé")
        .replace(/User already registered/i, "Un compte existe déjà avec cet email")
        .replace(/Password should contain at least one character of each.*/i, "Le mot de passe doit contenir une lettre, un chiffre et un caractère spécial")
        .replace(/Password.*at least one letter/i, "Le mot de passe doit contenir au moins une lettre")
        .replace(/Password.*at least one (number|digit)/i, "Le mot de passe doit contenir au moins un chiffre")
        .replace(/Password.*at least one (special character|symbol)/i, "Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*...)")
        .replace(/Password.*at least one (lower|upper)case/i, "Le mot de passe doit contenir des majuscules et minuscules")
        .replace(/Password should be at least (\d+) characters?/i, "Le mot de passe doit contenir au moins $1 caractères")
        .replace(/Signup is disabled/i, "Les inscriptions sont désactivées")
        .replace(/Email rate limit exceeded/i, "Trop de tentatives, réessaie dans quelques minutes")
        .replace(/Unable to validate email address: invalid format/i, "Format d'email invalide")
        .replace(/Network|Failed to fetch/i, "Problème de connexion réseau");
      toast.error(fr);
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
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 overflow-hidden" style={{
              background: 'linear-gradient(145deg, hsl(228 42% 7%), hsl(225 35% 5%))',
              border: '1px solid hsl(174 72% 46% / 0.25)',
              boxShadow: '0 0 24px -4px hsl(174 72% 46% / 0.3)',
            }}>
              <img src={krakkenLogo} alt="Krakken" className="w-12 h-12 object-contain" style={{
                filter: 'drop-shadow(0 0 6px hsl(174 72% 46% / 0.5))',
              }} />
            </div>
            <h1 className="kraken-title text-2xl">KRAKKEN</h1>
            <p className="text-xs text-muted-foreground mt-1">
              {mode === "login" ? "Rejoins l'équipage" : "Première connexion"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="soft-label flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-secondary/60 border border-border/40 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-all"
                placeholder="ton@email.com"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="soft-label flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Mot de passe
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => setForgotOpen(true)}
                    className="text-[11px] text-muted-foreground hover:text-primary transition-colors"
                  >
                    Mot de passe oublié ?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                minLength={8}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-secondary/60 border border-border/40 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-all"
                placeholder="••••••••"
              />
              {mode === "signup" && (
                <ul className="space-y-1 mt-2">
                  {[
                    { ok: password.length >= 8, label: "8 caractères minimum" },
                    { ok: /[a-zA-Z]/.test(password), label: "Au moins une lettre" },
                    { ok: /[0-9]/.test(password), label: "Au moins un chiffre" },
                    { ok: /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\];'`~]/.test(password), label: "Au moins un caractère spécial" },
                  ].map((c) => (
                    <li key={c.label} className={`flex items-center gap-1.5 text-[11px] transition-colors ${c.ok ? "text-primary" : "text-muted-foreground/70"}`}>
                      {c.ok ? <Check className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                      {c.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-primary-foreground transition-all disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, hsl(174 72% 46%), hsl(174 72% 38%))',
                boxShadow: '0 4px 16px -4px hsl(174 72% 46% / 0.4)',
              }}
            >
              {busy ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mode === "login" ? (
                <><LogIn className="w-4 h-4" /> Se connecter</>
              ) : (
                <><UserPlus className="w-4 h-4" /> Créer mon compte</>
              )}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-border/40 text-center">
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              {mode === "login" ? (
                <>Première connexion ? <span className="text-primary font-semibold">Créer mon compte</span></>
              ) : (
                <>Déjà un compte ? <span className="text-primary font-semibold">Se connecter</span></>
              )}
            </button>
          </div>

        </motion.div>
      </div>
      <Footer />
      <ForgotPasswordDialog open={forgotOpen} onOpenChange={setForgotOpen} defaultEmail={email} />
    </div>
  );
};

export default Auth;
