import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, Check, AlertCircle, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";

type State = "loading" | "valid" | "already" | "invalid" | "submitting" | "done" | "error";

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>("loading");

  useEffect(() => {
    if (!token) {
      setState("invalid");
      return;
    }
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const apikey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    fetch(`${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`, {
      headers: { apikey },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.valid) setState("valid");
        else if (data.reason === "already_unsubscribed") setState("already");
        else setState("invalid");
      })
      .catch(() => setState("invalid"));
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setState("submitting");
    try {
      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (error) throw error;
      if (data?.success || data?.reason === "already_unsubscribed") setState("done");
      else setState("error");
    } catch {
      setState("error");
    }
  };

  return (
    <div className="min-h-screen abyss-gradient flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="glass-panel-glow w-full max-w-md p-8 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{
              background: 'linear-gradient(145deg, hsl(228 42% 7%), hsl(225 35% 5%))',
              border: '1px solid hsl(174 72% 46% / 0.25)',
              boxShadow: '0 0 24px -4px hsl(174 72% 46% / 0.3)',
            }}>
            <Mail className="w-6 h-6 text-primary" />
          </div>

          <h1 className="kraken-title text-2xl mb-2">Désabonnement</h1>

          {state === "loading" && (
            <div className="flex flex-col items-center gap-3 mt-6">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Vérification du lien…</p>
            </div>
          )}

          {state === "valid" && (
            <>
              <p className="text-sm text-muted-foreground mt-3 mb-6">
                Confirme pour ne plus recevoir d'emails de Krakken (hors emails de sécurité comme la réinitialisation du mot de passe).
              </p>
              <button
                onClick={confirm}
                className="w-full py-2.5 rounded-xl text-sm font-bold text-primary-foreground transition-all"
                style={{
                  background: 'linear-gradient(135deg, hsl(174 72% 46%), hsl(174 72% 38%))',
                  boxShadow: '0 4px 16px -4px hsl(174 72% 46% / 0.4)',
                }}
              >
                Confirmer le désabonnement
              </button>
            </>
          )}

          {state === "submitting" && (
            <div className="flex flex-col items-center gap-3 mt-6">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Désabonnement en cours…</p>
            </div>
          )}

          {state === "done" && (
            <div className="flex flex-col items-center gap-3 mt-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-foreground font-semibold">Désabonnement confirmé.</p>
              <p className="text-xs text-muted-foreground">Tu ne recevras plus d'emails de notre part.</p>
            </div>
          )}

          {state === "already" && (
            <div className="flex flex-col items-center gap-3 mt-6">
              <Check className="w-6 h-6 text-primary" />
              <p className="text-sm text-foreground">Tu es déjà désabonné.</p>
            </div>
          )}

          {(state === "invalid" || state === "error") && (
            <div className="flex flex-col items-center gap-3 mt-6">
              <AlertCircle className="w-6 h-6 text-destructive" />
              <p className="text-sm text-foreground">
                {state === "invalid" ? "Lien invalide ou expiré." : "Une erreur est survenue, réessaie plus tard."}
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Unsubscribe;
