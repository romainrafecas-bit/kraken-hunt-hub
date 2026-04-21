import { useState } from "react";
import { Mail, Loader2, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultEmail?: string;
}

export const ForgotPasswordDialog = ({ open, onOpenChange, defaultEmail = "" }: Props) => {
  const [email, setEmail] = useState(defaultEmail);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast.success("Email envoyé. Vérifie ta boîte mail.");
    } catch (err: any) {
      toast.error(err?.message ?? "Erreur lors de l'envoi");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setSent(false); }}>
      <DialogContent className="glass-panel-glow border-border/40 max-w-md">
        <DialogHeader>
          <DialogTitle className="kraken-title text-lg">Mot de passe oublié</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Saisis ton email et on t'envoie un lien pour le réinitialiser.
          </DialogDescription>
        </DialogHeader>

        {sent ? (
          <div className="py-4 text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Send className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm text-foreground font-semibold">Lien envoyé !</p>
            <p className="text-xs text-muted-foreground">
              Si un compte existe avec <span className="text-foreground/80">{email}</span>, tu vas recevoir un email d'ici quelques minutes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="soft-label flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-secondary/60 border border-border/40 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-all"
                placeholder="ton@email.com"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-primary-foreground transition-all disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, hsl(174 72% 46%), hsl(174 72% 38%))",
                boxShadow: "0 4px 16px -4px hsl(174 72% 46% / 0.4)",
              }}
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Envoyer le lien</>}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
