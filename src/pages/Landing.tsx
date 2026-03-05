import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, TrendingUp, BarChart3, Zap, ChevronRight, Check, Anchor, Eye, ArrowUpDown, Filter, Package, RefreshCw, FileSpreadsheet, AlertTriangle, Layers, ExternalLink, Image as ImageIcon, ShoppingCart } from "lucide-react";
import krakkenLogo from "@/assets/krakken-logo.png";
import krakenHero from "@/assets/kraken-landing-hero.jpg";
import { Tentacle, Particles } from "@/components/landing/KrakenAnimations";

/* ─── 3 STEPS ─── */
const steps = [
  {
    num: "01",
    title: "Scanner",
    desc: "On scanne les avis Cdiscount par catégorie pour détecter quels produits reçoivent des avis régulièrement — signe qu'ils se vendent bien.",
    icon: Search,
    color: "174 72% 46%",
    detail: "Récurrence d'avis = vélocité de vente",
  },
  {
    num: "02",
    title: "Enrichir",
    desc: "Chaque produit détecté est enrichi automatiquement : prix, image, marque, nombre de vendeurs, disponibilité stock.",
    icon: Layers,
    color: "262 52% 58%",
    detail: "Prix • Image • Marque • Vendeurs • Stock",
  },
  {
    num: "03",
    title: "Sourcer",
    desc: "En un clic, recherchez le même produit sur AliExpress par titre ou Google Lens par image. Trouvez votre fournisseur instantanément.",
    icon: ExternalLink,
    color: "38 92% 56%",
    detail: "AliExpress + Google Lens intégrés",
  },
];

/* ─── FEATURES ─── */
const features = [
  {
    icon: BarChart3,
    title: "Dashboard temps réel",
    desc: "Visualisez la répartition par catégorie, les tendances et les scores de vélocité en un coup d'œil.",
    color: "174 72% 46%",
  },
  {
    icon: Filter,
    title: "Filtres avancés",
    desc: "Filtrez par catégorie, marque, statut stock, recherche texte. Trouvez exactement ce que vous cherchez.",
    color: "188 78% 52%",
  },
  {
    icon: Zap,
    title: "Score de vélocité",
    desc: "Plus un produit apparaît sur plusieurs jours d'avis = plus il se vend. Notre score quantifie cette vélocité.",
    color: "262 52% 58%",
  },
  {
    icon: AlertTriangle,
    title: "Détection ruptures de stock",
    desc: "Identifiez les produits en rupture : c'est une opportunité de niche pour les revendeurs malins.",
    color: "348 72% 56%",
  },
  {
    icon: RefreshCw,
    title: "Re-enrichissement sélectif",
    desc: "Mettez à jour les données d'un produit à tout moment pour vérifier si le prix ou le stock a changé.",
    color: "162 68% 44%",
  },
  {
    icon: FileSpreadsheet,
    title: "Export Excel",
    desc: "Exportez votre sélection de produits gagnants en un clic pour votre workflow de sourcing.",
    color: "38 92% 56%",
  },
];

/* ─── STATS ─── */
const proofs = [
  { val: "21", label: "Catégories Cdiscount analysées", icon: "📊" },
  { val: "Vélocité", label: "Détection par récurrence d'avis", icon: "⚡" },
  { val: "Auto", label: "Enrichissement prix, marque, vendeurs, stock", icon: "🔄" },
  { val: "1 clic", label: "Sourcing AliExpress + Google Lens", icon: "🎯" },
];

/* ─── PLANS ─── */
const plans = [
  {
    name: "Explorateur",
    price: "Gratuit",
    period: "",
    desc: "Pour tester la chasse",
    color: "174 72% 46%",
    features: ["3 catégories", "50 produits/scan", "Score de vélocité", "Export limité"],
    cta: "Commencer gratuitement",
    popular: false,
  },
  {
    name: "Chasseur",
    price: "19,99€",
    period: "/mois",
    desc: "Pour les revendeurs sérieux",
    color: "262 52% 58%",
    features: ["21 catégories", "Produits illimités", "Sourcing AliExpress + Lens", "Export Excel complet", "Re-enrichissement", "Alertes rupture stock"],
    cta: "Choisir ce plan",
    popular: true,
  },
  {
    name: "Léviathan",
    price: "49,99€",
    period: "/mois",
    desc: "Pour les équipes de sourcing",
    color: "38 92% 56%",
    features: ["Tout Chasseur +", "API d'accès", "Multi-utilisateurs", "Scans automatiques", "Support prioritaire", "Données historiques", "Webhooks"],
    cta: "Contacter",
    popular: false,
  },
];

/* ─── DEMO TABLE ─── */
const demoProducts = [
  { name: "Galaxy S24 Ultra 256Go", brand: "Samsung", price: 899, sales: "127 avis/sem", sellers: 24, score: 98, stock: true },
  { name: "Dyson V15 Detect Absolute", brand: "Dyson", price: 549, sales: "89 avis/sem", sellers: 18, score: 96, stock: true },
  { name: "PlayStation 5 Slim", brand: "Sony", price: 399, sales: "74 avis/sem", sellers: 31, score: 94, stock: true },
  { name: "AirPods Pro 2 USB-C", brand: "Apple", price: 229, sales: "68 avis/sem", sellers: 22, score: 93, stock: false },
  { name: "Ninja Foodi MAX 9-en-1", brand: "Ninja", price: 179, sales: "61 avis/sem", sellers: 12, score: 91, stock: true },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const Landing = () => {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'hsl(228 42% 3%)' }}>

      {/* ═══ NAV ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl" style={{
        background: 'hsl(228 42% 3% / 0.85)',
        borderBottom: '1px solid hsl(174 72% 46% / 0.06)',
      }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={krakkenLogo} alt="Krakken" className="w-9 h-9 object-contain" style={{
              filter: 'drop-shadow(0 0 8px hsl(174 72% 46% / 0.4))',
            }} />
            <span className="kraken-title text-lg tracking-wide font-black">KRAKKEN</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Comment ça marche</a>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Fonctionnalités</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Tarifs</a>
          </div>
          <Link to="/" className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300" style={{
            background: 'hsl(174 72% 46% / 0.12)',
            border: '1px solid hsl(174 72% 46% / 0.25)',
            color: 'hsl(174 72% 56%)',
          }}>
            Accéder au dashboard →
          </Link>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Floating Kraken bg */}
        <motion.div
          className="absolute inset-0"
          animate={{
            y: [0, -12, 0, 8, 0],
            x: [0, 6, 0, -4, 0],
            scale: [1, 1.03, 1, 0.98, 1],
            rotate: [0, 0.5, 0, -0.3, 0],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src={krakenHero} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.3, scale: 1.1 }} />
        </motion.div>

        <Particles />

        {/* Overlays */}
        <div className="absolute inset-0" style={{
          background: `
            linear-gradient(180deg, hsl(228 42% 3% / 0.5) 0%, hsl(228 42% 3% / 0.3) 40%, hsl(228 42% 3% / 0.7) 70%, hsl(228 42% 3%) 100%),
            radial-gradient(ellipse at 50% 30%, transparent 0%, hsl(228 42% 3% / 0.6) 70%)
          `,
        }} />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
            style={{
              background: 'hsl(174 72% 46% / 0.1)',
              border: '1px solid hsl(174 72% 46% / 0.2)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{
              backgroundColor: 'hsl(174 72% 46%)',
              animation: 'bioluminescence 3s ease-in-out infinite',
              boxShadow: '0 0 8px 2px hsl(174 72% 46% / 0.5)',
            }} />
            <span className="text-xs font-semibold" style={{ color: 'hsl(174 72% 56%)' }}>Outil de sourcing pour revendeurs e-commerce</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-black leading-[1.1] mb-6"
          >
            <span className="text-foreground">Trouvez les produits qui</span>
            <br />
            <span className="kraken-title">se vendent vraiment</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: 'hsl(185 20% 70%)' }}
          >
            Analysez la <strong className="text-foreground">vélocité de vente</strong> sur Cdiscount
            et sourcez vos produits gagnants en un clic
            sur <strong className="text-foreground">AliExpress</strong> et <strong className="text-foreground">Google Lens</strong>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/" className="group px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2" style={{
              background: 'linear-gradient(135deg, hsl(174 72% 46%), hsl(188 78% 48%))',
              color: 'hsl(228 42% 4%)',
              boxShadow: '0 0 40px -8px hsl(174 72% 46% / 0.5), 0 8px 24px -4px hsl(228 50% 2% / 0.5)',
            }}>
              Commencer la traque
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#how" className="px-8 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 backdrop-blur-md" style={{
              background: 'hsl(225 32% 8% / 0.5)',
              border: '1px solid hsl(185 20% 88% / 0.1)',
              color: 'hsl(185 20% 88%)',
            }}>
              Comment ça marche
            </a>
          </motion.div>

          {/* Audience tag */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-xs text-muted-foreground"
          >
            Pour les <span style={{ color: 'hsl(174 72% 56%)' }}>dropshippers</span>, <span style={{ color: 'hsl(262 72% 72%)' }}>vendeurs marketplace</span> et <span style={{ color: 'hsl(38 92% 64%)' }}>agents de sourcing</span>
          </motion.p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32" style={{
          background: 'linear-gradient(180deg, transparent, hsl(228 42% 3%))',
        }} />
      </section>

      {/* Tentacles */}
      <Tentacle side="left" top="90vh" color="174 72% 46%" delay={0} size={250} />
      <Tentacle side="right" top="160vh" color="262 52% 58%" delay={1.5} size={280} />
      <Tentacle side="left" top="250vh" color="188 78% 52%" delay={0.8} size={220} />
      <Tentacle side="right" top="340vh" color="174 72% 46%" delay={2} size={260} />
      <Tentacle side="left" top="430vh" color="262 52% 58%" delay={0.5} size={240} />
      <Tentacle side="right" top="520vh" color="38 92% 56%" delay={1} size={200} />

      {/* ═══ DASHBOARD PREVIEW ═══ */}
      <section className="py-16 px-6 relative" style={{ background: 'hsl(228 42% 3%)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden"
            style={{
              border: '1px solid hsl(174 72% 46% / 0.12)',
              boxShadow: '0 0 80px -20px hsl(174 72% 46% / 0.12), 0 25px 50px -12px hsl(228 50% 2% / 0.7)',
              background: 'hsl(225 32% 6%)',
            }}
          >
            {/* Toolbar */}
            <div className="px-5 py-3.5 flex items-center justify-between" style={{
              borderBottom: '1px solid hsl(225 20% 10%)',
              background: 'hsl(225 32% 7%)',
            }}>
              <div className="flex items-center gap-3">
                <img src={krakkenLogo} alt="" className="w-6 h-6 object-contain opacity-70" />
                <span className="text-xs font-display font-bold text-foreground/80">Produits détectés — Cdiscount</span>
                <span className="bio-badge bio-teal text-[9px] py-0.5">LIVE</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold" style={{
                  background: 'hsl(174 72% 46% / 0.08)',
                  border: '1px solid hsl(174 72% 46% / 0.15)',
                  color: 'hsl(174 72% 56%)',
                }}>
                  <Filter className="w-3 h-3" /> Catégorie
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold" style={{
                  background: 'hsl(262 52% 58% / 0.08)',
                  border: '1px solid hsl(262 52% 58% / 0.15)',
                  color: 'hsl(262 72% 72%)',
                }}>
                  <ArrowUpDown className="w-3 h-3" /> Vélocité ↓
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold" style={{
                  background: 'hsl(38 92% 56% / 0.08)',
                  border: '1px solid hsl(38 92% 56% / 0.15)',
                  color: 'hsl(38 92% 64%)',
                }}>
                  <FileSpreadsheet className="w-3 h-3" /> Export
                </div>
              </div>
            </div>

            {/* Table header */}
            <div className="hidden md:grid grid-cols-[1fr_90px_100px_70px_70px_90px] gap-3 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground" style={{
              borderBottom: '1px solid hsl(225 20% 8%)',
            }}>
              <span>Produit</span>
              <span className="text-right">Prix</span>
              <span className="text-right">Vélocité</span>
              <span className="text-right">Vendeurs</span>
              <span className="text-right">Score</span>
              <span className="text-right">Sourcer</span>
            </div>

            {/* Product rows */}
            <div>
              {demoProducts.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_90px_100px_70px_70px_90px] gap-3 px-5 py-3.5 items-center transition-colors duration-200 group cursor-pointer"
                  style={{ borderBottom: '1px solid hsl(225 20% 8%)' }}
                  whileHover={{ backgroundColor: 'hsl(174 72% 46% / 0.03)' }}
                >
                  {/* Product */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center" style={{
                      background: `hsl(${i < 3 ? '174 72% 46%' : '225 18% 14%'} / 0.1)`,
                      border: `1px solid hsl(${i < 3 ? '174 72% 46%' : '225 18% 14%'} / 0.15)`,
                    }}>
                      <Package className="w-4 h-4" style={{
                        color: i < 3 ? 'hsl(174 72% 56%)' : 'hsl(210 10% 40%)',
                      }} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground/90 truncate group-hover:text-primary transition-colors">{p.name}</p>
                        {!p.stock && (
                          <span className="bio-badge bio-rose text-[8px] py-0 px-1.5 flex-shrink-0">RUPTURE</span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground font-mono">{p.brand}</p>
                    </div>
                  </div>

                  {/* Mobile compact */}
                  <div className="md:hidden text-right">
                    <p className="text-sm font-black font-mono text-foreground">{p.price}€</p>
                    <p className="text-[10px] font-bold" style={{ color: 'hsl(162 72% 52%)' }}>⚡{p.score}</p>
                  </div>

                  {/* Desktop */}
                  <span className="hidden md:block text-right text-sm font-black font-mono text-foreground">{p.price}€</span>
                  <span className="hidden md:block text-right text-xs font-mono font-bold" style={{
                    color: 'hsl(174 72% 56%)',
                    textShadow: '0 0 8px hsl(174 72% 46% / 0.3)',
                  }}>{p.sales}</span>
                  <span className="hidden md:block text-right text-sm font-mono text-foreground/70">{p.sellers}</span>
                  <span className="hidden md:block text-right text-sm font-bold" style={{
                    color: 'hsl(162 72% 52%)',
                    textShadow: '0 0 6px hsl(162 68% 44% / 0.3)',
                  }}>⚡ {p.score}</span>
                  {/* Sourcing buttons */}
                  <div className="hidden md:flex items-center justify-end gap-1.5">
                    <span className="px-2 py-1 rounded text-[9px] font-bold cursor-pointer transition-all" style={{
                      background: 'hsl(38 92% 56% / 0.1)',
                      border: '1px solid hsl(38 92% 56% / 0.2)',
                      color: 'hsl(38 92% 64%)',
                    }}>Ali</span>
                    <span className="px-2 py-1 rounded text-[9px] font-bold cursor-pointer transition-all" style={{
                      background: 'hsl(188 78% 52% / 0.1)',
                      border: '1px solid hsl(188 78% 52% / 0.2)',
                      color: 'hsl(188 80% 62%)',
                    }}>Lens</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom */}
            <div className="px-5 py-3 flex items-center justify-between" style={{ background: 'hsl(225 32% 5%)' }}>
              <span className="text-[10px] text-muted-foreground">21 catégories • 54 892 produits analysés</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map(n => (
                  <span key={n} className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold" style={{
                    background: n === 1 ? 'hsl(174 72% 46% / 0.15)' : 'transparent',
                    color: n === 1 ? 'hsl(174 72% 56%)' : 'hsl(210 10% 42%)',
                    border: n === 1 ? '1px solid hsl(174 72% 46% / 0.25)' : '1px solid transparent',
                  }}>{n}</span>
                ))}
                <span className="text-[10px] text-muted-foreground mx-1">…</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ 3 STEPS ═══ */}
      <section id="how" className="py-24 px-6 relative" style={{ background: 'hsl(228 42% 3%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px tentacle-line" />
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="bio-badge bio-teal inline-block mb-4">Comment ça marche</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-display font-black text-foreground mb-4">
              3 étapes pour trouver vos pépites
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-xl mx-auto">
              De la détection au sourcing, Krakken automatise tout le processus de recherche de produits gagnants.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={i}
                variants={fadeUp}
                className="relative p-6 rounded-2xl group transition-all duration-300 overflow-hidden"
                style={{
                  background: `hsl(${step.color} / 0.04)`,
                  border: `1px solid hsl(${step.color} / 0.12)`,
                }}
                whileHover={{
                  borderColor: `hsl(${step.color} / 0.3)`,
                  boxShadow: `0 0 40px -10px hsl(${step.color} / 0.2)`,
                }}
              >
                {/* Connecting line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px" style={{
                    background: `linear-gradient(90deg, hsl(${step.color} / 0.3), hsl(${steps[i + 1].color} / 0.3))`,
                  }} />
                )}

                <div className="absolute -top-10 -right-10 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
                  background: `radial-gradient(circle, hsl(${step.color} / 0.08), transparent 70%)`,
                }} />

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-display font-black" style={{
                    color: `hsl(${step.color} / 0.2)`,
                  }}>{step.num}</span>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                    background: `hsl(${step.color} / 0.12)`,
                    boxShadow: `0 0 16px -4px hsl(${step.color} / 0.25)`,
                  }}>
                    <step.icon className="w-5 h-5" style={{
                      color: `hsl(${step.color})`,
                      filter: `drop-shadow(0 0 4px hsl(${step.color} / 0.4))`,
                    }} />
                  </div>
                </div>
                <h3 className="font-display font-bold text-lg text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{step.desc}</p>
                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-md" style={{
                  background: `hsl(${step.color} / 0.08)`,
                  color: `hsl(${step.color})`,
                  border: `1px solid hsl(${step.color} / 0.15)`,
                }}>{step.detail}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS / PROOFS ═══ */}
      <section className="py-20 px-6 relative" style={{ background: 'hsl(228 42% 3%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px tentacle-line" />
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {proofs.map((p, i) => (
              <motion.div
                key={p.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="text-center p-5 rounded-2xl"
                style={{
                  background: 'hsl(225 32% 6% / 0.8)',
                  border: '1px solid hsl(174 72% 46% / 0.08)',
                }}
              >
                <span className="text-2xl mb-2 block">{p.icon}</span>
                <p className="text-2xl font-display font-black" style={{
                  color: 'hsl(174 72% 56%)',
                  textShadow: '0 0 20px hsl(174 72% 46% / 0.3)',
                }}>{p.val}</p>
                <p className="text-[11px] text-muted-foreground mt-1 leading-tight">{p.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="py-24 px-6 relative" style={{ background: 'hsl(228 42% 3%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px tentacle-line" />
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="bio-badge bio-violet inline-block mb-4">Fonctionnalités</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-display font-black text-foreground mb-4">
              Tout ce qu'il faut pour sourcer malin
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-xl mx-auto">
              Des outils pensés pour les revendeurs qui veulent aller au-delà des top ventes mainstream.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={i}
                variants={fadeUp}
                className="group p-6 rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden"
                style={{
                  background: `hsl(${f.color} / 0.04)`,
                  border: `1px solid hsl(${f.color} / 0.1)`,
                }}
                whileHover={{
                  borderColor: `hsl(${f.color} / 0.3)`,
                  boxShadow: `0 0 30px -8px hsl(${f.color} / 0.2)`,
                }}
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
                  background: `radial-gradient(circle, hsl(${f.color} / 0.08), transparent 70%)`,
                }} />
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{
                  background: `hsl(${f.color} / 0.12)`,
                  boxShadow: `0 0 16px -4px hsl(${f.color} / 0.25)`,
                }}>
                  <f.icon className="w-5 h-5" style={{
                    color: `hsl(${f.color})`,
                    filter: `drop-shadow(0 0 4px hsl(${f.color} / 0.4))`,
                  }} />
                </div>
                <h3 className="font-display font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TARGET AUDIENCE ═══ */}
      <section className="py-20 px-6 relative" style={{ background: 'hsl(228 42% 3%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px tentacle-line" />
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-display font-black text-foreground mb-4">
              Krakken est fait pour vous si…
            </motion.h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { emoji: "🏪", title: "Vendeur marketplace", desc: "Vous vendez sur Amazon, Cdiscount, Rakuten et cherchez des produits de niche à forte demande." },
              { emoji: "📦", title: "Dropshipper", desc: "Vous cherchez des produits gagnants à sourcer sur AliExpress sans passer des heures en recherche manuelle." },
              { emoji: "🔍", title: "Agent de sourcing", desc: "Vous identifiez des produits pour vos clients et avez besoin de données fiables sur la demande réelle." },
            ].map((a, i) => (
              <motion.div
                key={a.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="p-5 rounded-2xl text-center"
                style={{
                  background: 'hsl(225 32% 6% / 0.8)',
                  border: '1px solid hsl(225 20% 12%)',
                }}
              >
                <span className="text-3xl mb-3 block">{a.emoji}</span>
                <h3 className="font-display font-bold text-foreground mb-2 text-sm">{a.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" className="py-24 px-6 relative" style={{ background: 'hsl(228 42% 3%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px tentacle-line" />
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="bio-badge bio-amber inline-block mb-4">Tarifs</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-display font-black text-foreground mb-4">
              Choisissez votre profondeur
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-xl mx-auto">
              Commencez gratuitement, évoluez quand votre business grandit.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={i}
                variants={fadeUp}
                className="relative rounded-2xl p-6 transition-all duration-300"
                style={{
                  background: plan.popular ? `hsl(${plan.color} / 0.06)` : 'hsl(225 32% 6% / 0.8)',
                  border: `1px solid hsl(${plan.color} / ${plan.popular ? '0.25' : '0.1'})`,
                  boxShadow: plan.popular ? `0 0 50px -12px hsl(${plan.color} / 0.2)` : undefined,
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bio-badge bio-violet text-[10px]">⭐ Populaire</span>
                  </div>
                )}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Anchor className="w-4 h-4" style={{ color: `hsl(${plan.color})` }} />
                    <h3 className="font-display font-bold text-foreground">{plan.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">{plan.desc}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-display font-black" style={{
                      color: `hsl(${plan.color})`,
                      textShadow: `0 0 24px hsl(${plan.color} / 0.3)`,
                    }}>{plan.price}</span>
                    {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
                  </div>
                </div>
                <div className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5">
                      <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: `hsl(${plan.color})` }} />
                      <span className="text-sm text-foreground/80">{f}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-300" style={{
                  background: plan.popular ? `linear-gradient(135deg, hsl(${plan.color}), hsl(${plan.color} / 0.8))` : `hsl(${plan.color} / 0.1)`,
                  color: plan.popular ? 'hsl(228 42% 4%)' : `hsl(${plan.color})`,
                  border: `1px solid hsl(${plan.color} / ${plan.popular ? '0.5' : '0.2'})`,
                  boxShadow: plan.popular ? `0 0 24px -4px hsl(${plan.color} / 0.3)` : undefined,
                }}>
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-24 px-6 relative" style={{ background: 'hsl(228 42% 3%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px tentacle-line" />
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-display font-black text-foreground mb-4">
              Prêt à plonger dans les <span className="kraken-title">abysses</span> ?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Rejoignez les revendeurs qui utilisent Krakken pour dénicher des produits de niche avant la concurrence.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <Link to="/" className="group inline-flex items-center gap-2 px-10 py-4 rounded-2xl text-sm font-bold transition-all duration-300" style={{
                background: 'linear-gradient(135deg, hsl(174 72% 46%), hsl(188 78% 48%))',
                color: 'hsl(228 42% 4%)',
                boxShadow: '0 0 50px -8px hsl(174 72% 46% / 0.4), 0 8px 24px -4px hsl(228 50% 2% / 0.5)',
              }}>
                Commencer gratuitement
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-12 px-6 relative" style={{ background: 'hsl(228 42% 3%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px tentacle-line" />
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={krakkenLogo} alt="Krakken" className="w-7 h-7 object-contain opacity-60" />
            <span className="text-sm text-muted-foreground">© 2026 Krakken — Chasseur des abysses</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Mentions légales</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Confidentialité</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
