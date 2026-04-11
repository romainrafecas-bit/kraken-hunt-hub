import KrakkenSidebar from "@/components/dashboard/KrakkenSidebar";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Eye, Heart, Package, Tag, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { products, categories } from "@/data/products";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const stats = [
  { label: "Produits consultés", value: "128", icon: Eye },
  { label: "Favoris enregistrés", value: "18", icon: Heart },
  { label: "Catégorie favorite", value: "Électroménager", icon: Tag },
];

const allCategories = categories.filter(c => c !== "Tous");
const priceRanges = ["0 – 100€", "100 – 300€", "300 – 500€", "500 – 1 000€", "1 000€+"];

const Profil = () => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Smartphones", "Gaming"]);
  const [priceRange, setPriceRange] = useState("100 – 300€");
  const [catOpen, setCatOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);

  const toggleCat = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
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
            <Avatar className="w-20 h-20 border-2 flex-shrink-0" style={{
              borderColor: 'hsl(var(--primary) / 0.3)',
              boxShadow: '0 0 24px -4px hsl(var(--primary) / 0.3)',
            }}>
              <AvatarFallback className="bg-secondary text-2xl font-bold text-muted-foreground">
                <User className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="kraken-title text-2xl">Capitaine Kraken</h1>
                <span className="bio-badge bio-teal">Pro</span>
              </div>
              <div className="flex flex-wrap gap-3 mt-2.5">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Mail className="w-3.5 h-3.5 text-primary/60" /> capitaine@krakken.io
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 text-primary/60" /> Membre depuis Mars 2024
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate("/abonnement")}
              className="glass-panel px-4 py-2.5 rounded-xl text-sm font-semibold text-foreground hover:border-primary/30 transition-all whitespace-nowrap"
            >
              Gérer mon abonnement
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2 className="font-display text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            Mes statistiques
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 + i * 0.06 }}
                className="glass-panel-glow p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{
                  background: 'hsl(var(--primary) / 0.1)',
                  border: '1px solid hsl(var(--primary) / 0.15)',
                }}>
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground font-display">{stat.value}</p>
                  <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="glass-panel-glow p-5 space-y-5"
        >
          <h2 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
            <Tag className="w-4 h-4 text-accent" />
            Préférences
          </h2>

          {/* Catégories favorites */}
          <div className="space-y-2">
            <label className="soft-label">Catégories favorites</label>
            <div className="relative">
              <button
                onClick={() => setCatOpen(!catOpen)}
                className="w-full flex items-center justify-between bg-secondary/60 border border-border/40 rounded-xl px-4 py-2.5 text-sm text-foreground hover:border-primary/20 transition-all"
              >
                <span className="truncate">
                  {selectedCategories.length ? selectedCategories.join(", ") : "Choisir des catégories"}
                </span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${catOpen ? 'rotate-180' : ''}`} />
              </button>
              {catOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-20 mt-1 w-full bg-card border border-border/50 rounded-xl p-2 shadow-xl max-h-48 overflow-auto"
                >
                  {allCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => toggleCat(cat)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        selectedCategories.includes(cat)
                          ? 'text-primary bg-primary/10'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Fourchette de prix */}
          <div className="space-y-2">
            <label className="soft-label">Fourchette de prix par défaut</label>
            <div className="relative">
              <button
                onClick={() => setPriceOpen(!priceOpen)}
                className="w-full flex items-center justify-between bg-secondary/60 border border-border/40 rounded-xl px-4 py-2.5 text-sm text-foreground hover:border-primary/20 transition-all"
              >
                <span>{priceRange}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${priceOpen ? 'rotate-180' : ''}`} />
              </button>
              {priceOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-20 mt-1 w-full bg-card border border-border/50 rounded-xl p-2 shadow-xl"
                >
                  {priceRanges.map(range => (
                    <button
                      key={range}
                      onClick={() => { setPriceRange(range); setPriceOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        priceRange === range
                          ? 'text-primary bg-primary/10'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profil;
