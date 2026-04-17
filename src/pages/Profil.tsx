import KrakkenSidebar from "@/components/dashboard/KrakkenSidebar";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Heart, Tag, Layers, LogOut, Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useFavorites, COLLECTIONS } from "@/hooks/useFavorites";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useMemo } from "react";

const Profil = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, updateProfile, uploadAvatar, uploadingAvatar } = useProfile();
  const { favorites } = useFavorites();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");

  const email = user?.email ?? "";
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
    : "—";

  const initials = (profile?.display_name || email || "?")
    .split(/[@\s.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  const totalFavorites = favorites.length;

  const collectionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    COLLECTIONS.forEach((c) => (counts[c] = 0));
    favorites.forEach((f) => {
      const c = f.collection ?? "À sourcer";
      counts[c] = (counts[c] ?? 0) + 1;
    });
    return counts;
  }, [favorites]);

  const favoriteCategory = useMemo(() => {
    const tally: Record<string, number> = {};
    favorites.forEach((f) => {
      const cat = f.product?.category;
      if (cat) tally[cat] = (tally[cat] ?? 0) + 1;
    });
    const top = Object.entries(tally).sort((a, b) => b[1] - a[1])[0];
    return top?.[0] ?? "—";
  }, [favorites]);

  const startEditName = () => {
    setNameDraft(profile?.display_name ?? "");
    setEditingName(true);
  };
  const saveName = () => {
    const trimmed = nameDraft.trim();
    if (trimmed && trimmed !== profile?.display_name) updateProfile({ display_name: trimmed });
    setEditingName(false);
  };

  const onAvatarPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadAvatar(file);
    e.target.value = "";
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen abyss-gradient">
      <KrakkenSidebar />
      <main className="pl-16 xl:pl-56 p-4 lg:p-6 space-y-5">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-panel-glow p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at 100% 0%, hsl(var(--kraken-violet) / 0.06), transparent 60%)',
          }} />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 relative z-10">
            <div className="relative flex-shrink-0">
              <Avatar className="w-20 h-20 border-2" style={{
                borderColor: 'hsl(var(--primary) / 0.3)',
                boxShadow: '0 0 24px -4px hsl(var(--primary) / 0.3)',
              }}>
                {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt="avatar" />}
                <AvatarFallback className="bg-secondary text-2xl font-bold text-primary">
                  {initials || <User className="w-8 h-8" />}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 transition-transform"
                aria-label="Changer l'avatar"
              >
                {uploadingAvatar ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={onAvatarPick} />
            </div>

            <div className="flex-1 min-w-0">
              {editingName ? (
                <div className="flex gap-2 items-center">
                  <input
                    autoFocus
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    onBlur={saveName}
                    onKeyDown={(e) => e.key === "Enter" && saveName()}
                    className="bg-secondary/60 border border-primary/30 rounded-lg px-3 py-1 text-xl font-bold text-foreground focus:outline-none"
                  />
                </div>
              ) : (
                <button onClick={startEditName} className="text-left group">
                  <h1 className="kraken-title text-2xl group-hover:text-primary transition-colors">
                    {profile?.display_name || email.split("@")[0] || "Élève"}
                  </h1>
                  <span className="text-[10px] text-muted-foreground/60 group-hover:text-primary/60">cliquer pour modifier</span>
                </button>
              )}
              <div className="flex flex-wrap gap-3 mt-2.5">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Mail className="w-3.5 h-3.5 text-primary/60" /> {email}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 text-primary/60" /> Membre depuis {memberSince}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <button
                onClick={() => navigate("/abonnement")}
                className="glass-panel px-4 py-2.5 rounded-xl text-sm font-semibold text-foreground hover:border-primary/30 transition-all whitespace-nowrap"
              >
                Gérer mon abonnement
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                style={{
                  background: 'hsl(var(--destructive) / 0.1)',
                  border: '1px solid hsl(var(--destructive) / 0.25)',
                  color: 'hsl(var(--destructive))',
                }}
              >
                <LogOut className="w-3.5 h-3.5" /> Se déconnecter
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2 className="font-display text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary" />
            Mon activité
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Total favoris */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="glass-panel-glow p-4 flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{
                background: 'hsl(var(--kraken-rose) / 0.1)',
                border: '1px solid hsl(var(--kraken-rose) / 0.2)',
              }}>
                <Heart className="w-5 h-5" style={{ color: 'hsl(var(--kraken-rose))' }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground font-display leading-none">{totalFavorites}</p>
                <p className="text-[11px] text-muted-foreground mt-1">Favoris au total</p>
              </div>
            </motion.div>

            {/* Catégorie favorite */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="glass-panel-glow p-4 flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{
                background: 'hsl(var(--primary) / 0.1)',
                border: '1px solid hsl(var(--primary) / 0.15)',
              }}>
                <Tag className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold text-foreground font-display leading-tight truncate">{favoriteCategory}</p>
                <p className="text-[11px] text-muted-foreground mt-1">Catégorie favorite</p>
              </div>
            </motion.div>

            {/* Répartition */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.25 }}
              className="glass-panel-glow p-4 md:col-span-1"
            >
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-accent" />
                <p className="text-xs font-semibold text-foreground">Par collection</p>
              </div>
              <div className="space-y-2">
                {COLLECTIONS.map((c) => {
                  const count = collectionCounts[c] ?? 0;
                  const pct = totalFavorites ? Math.round((count / totalFavorites) * 100) : 0;
                  return (
                    <div key={c} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground">{c}</span>
                        <span className="text-foreground font-semibold">{count}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary/60 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profil;
