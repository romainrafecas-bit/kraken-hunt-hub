import KrakkenSidebar from "@/components/dashboard/KrakkenSidebar";
import { motion } from "framer-motion";
import { User, Mail, MapPin, Calendar, Shield, Bell, Eye, Anchor, TrendingUp, Heart } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const stats = [
  { label: "Produits traqués", value: "47", icon: Anchor },
  { label: "Alertes actives", value: "12", icon: Bell },
  { label: "Économies totales", value: "2 340€", icon: TrendingUp },
  { label: "Favoris", value: "18", icon: Heart },
];

const Profil = () => {
  return (
    <div className="min-h-screen abyss-gradient">
      <KrakkenSidebar />
      <main className="pl-16 xl:pl-56 p-4 lg:p-6 space-y-5">
        {/* Header */}
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
            <Avatar className="w-20 h-20 border-2" style={{
              borderColor: 'hsl(var(--primary) / 0.3)',
              boxShadow: '0 0 24px -4px hsl(var(--primary) / 0.3)',
            }}>
              <AvatarFallback className="bg-secondary text-2xl font-bold text-primary">
                CK
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="kraken-title text-2xl">Capitaine Kraken</h1>
              <p className="text-sm text-muted-foreground mt-1">Chasseur des profondeurs depuis Mars 2024</p>
              <div className="flex flex-wrap gap-3 mt-3">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Mail className="w-3.5 h-3.5 text-primary/60" /> capitaine@krakken.io
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-primary/60" /> Paris, France
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 text-primary/60" /> Membre depuis Mars 2024
                </span>
              </div>
            </div>

            <button className="px-4 py-2 rounded-lg text-sm font-medium bg-secondary text-foreground border border-border hover:border-primary/30 transition-all">
              Modifier le profil
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="glass-panel p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                background: 'hsl(var(--primary) / 0.1)',
                border: '1px solid hsl(var(--primary) / 0.15)',
              }}>
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Settings sections */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="glass-panel p-5 space-y-4"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-semibold text-foreground">Préférences de traque</h2>
            </div>

            {[
              { label: "Alertes prix", desc: "Recevoir une notification quand un prix chute", on: true },
              { label: "Nouveaux produits", desc: "Être alerté des nouvelles proies détectées", on: true },
              { label: "Rapport hebdomadaire", desc: "Résumé des tendances chaque lundi", on: false },
              { label: "Mode furtif", desc: "Masquer votre activité aux autres chasseurs", on: false },
            ].map((pref) => (
              <div key={pref.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div>
                  <p className="text-sm text-foreground">{pref.label}</p>
                  <p className="text-[11px] text-muted-foreground">{pref.desc}</p>
                </div>
                <div className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors cursor-pointer ${pref.on ? 'bg-primary/80 justify-end' : 'bg-secondary justify-start'}`}>
                  <div className="w-4 h-4 rounded-full bg-foreground" />
                </div>
              </div>
            ))}
          </motion.div>

          {/* Activity */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="glass-panel p-5 space-y-4"
          >
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Activité récente</h2>
            </div>

            {[
              { action: "Ajouté aux favoris", target: "Galaxy S24 Ultra", time: "Il y a 2h" },
              { action: "Alerte déclenchée", target: "Dyson V15 — prix en baisse", time: "Il y a 5h" },
              { action: "Nouveau suivi", target: "PlayStation 5 Slim", time: "Hier" },
              { action: "Score mis à jour", target: "AirPods Pro 2 → 93/100", time: "Hier" },
              { action: "Alerte déclenchée", target: "OLED C4 55\" — stock faible", time: "Il y a 2j" },
              { action: "Ajouté aux favoris", target: "Switch OLED", time: "Il y a 3j" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" style={{
                  boxShadow: '0 0 6px hsl(var(--primary) / 0.5)',
                }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{item.action}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{item.target}</p>
                </div>
                <span className="text-[10px] text-muted-foreground flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Profil;
