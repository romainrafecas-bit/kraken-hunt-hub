import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { Search, TrendingUp, Bell, BarChart3, Shield, Zap, ChevronRight, Check, Anchor, Eye, ArrowUpDown, Filter, Star } from "lucide-react";
import krakkenLogo from "@/assets/krakken-logo.png";
import krakenHero from "@/assets/kraken-landing-hero.jpg";
import { Tentacle, FloatingKraken, Particles } from "@/components/landing/KrakenAnimations";

const features = [
  {
    icon: Search,
    title: "Traque des bestsellers",
    desc: "Identifiez les produits les plus vendus chaque semaine. Données de ventes récupérées automatiquement.",
    color: "174 72% 46%",
  },
  {
    icon: ArrowUpDown,
    title: "Tri multi-critères",
    desc: "Triez par marque, prix, vendeurs, récurrences, notes. Trouvez exactement ce que vous cherchez.",
    color: "162 68% 44%",
  },
  {
    icon: BarChart3,
    title: "Ventes hebdomadaires",
    desc: "Chaque semaine, récupérez les ventes de la semaine précédente. Suivez l'évolution en temps réel.",
    color: "262 52% 58%",
  },
  {
    icon: Bell,
    title: "Alertes intelligentes",
    desc: "Soyez prévenu quand un produit explose en ventes ou quand une opportunité apparaît.",
    color: "188 78% 52%",
  },
  {
    icon: Shield,
    title: "Veille concurrentielle",
    desc: "Analysez le nombre de vendeurs, les prix pratiqués, et identifiez les niches rentables.",
    color: "38 92% 56%",
  },
  {
    icon: Zap,
    title: "Score Krakken",
    desc: "Notre algorithme exclusif note chaque produit selon 12 critères de potentiel commercial.",
    color: "348 72% 56%",
  },
];

const plans = [
  {
    name: "Explorateur",
    price: "Gratuit",
    period: "",
    desc: "Pour commencer la chasse",
    color: "174 72% 46%",
    features: ["5 produits traqués", "Alertes email", "Historique 7 jours", "1 marketplace"],
    cta: "Commencer",
    popular: false,
  },
  {
    name: "Chasseur",
    price: "9,99€",
    period: "/mois",
    desc: "Pour les chasseurs sérieux",
    color: "262 52% 58%",
    features: ["50 produits traqués", "Alertes instantanées", "Historique 90 jours", "Toutes les marketplaces", "Analytics avancés", "Score Krakken"],
    cta: "Choisir ce plan",
    popular: true,
  },
  {
    name: "Léviathan",
    price: "24,99€",
    period: "/mois",
    desc: "Dominez les profondeurs",
    color: "38 92% 56%",
    features: ["Produits illimités", "Alertes prioritaires", "Historique illimité", "Toutes les marketplaces", "API & exports", "Support prioritaire", "Multi-comptes"],
    cta: "Contacter",
    popular: false,
  },
];

const demoProducts = [
  { name: "Galaxy S24 Ultra 256Go", brand: "Samsung", price: 899, oldPrice: 1159, sales: "12 847", sellers: 24, score: 98, trend: "+12%" },
  { name: "Dyson V15 Detect Absolute", brand: "Dyson", price: 549, oldPrice: 699, sales: "9 234", sellers: 18, score: 96, trend: "+8%" },
  { name: "PlayStation 5 Slim", brand: "Sony", price: 399, oldPrice: 449, sales: "8 102", sellers: 31, score: 94, trend: "+15%" },
  { name: "AirPods Pro 2 USB-C", brand: "Apple", price: 229, oldPrice: 279, sales: "7 891", sellers: 22, score: 93, trend: "+5%" },
  { name: "Foodi MAX 9-en-1", brand: "Ninja", price: 179, oldPrice: 249, sales: "6 543", sellers: 12, score: 91, trend: "+22%" },
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
      {/* NAV */}
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
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Fonctionnalités</a>
            <a href="#demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Aperçu</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Tarifs</a>
          </div>
          <Link to="/" className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300" style={{
            background: 'hsl(174 72% 46% / 0.12)',
            border: '1px solid hsl(174 72% 46% / 0.25)',
            color: 'hsl(174 72% 56%)',
          }}>
            Dashboard →
          </Link>
        </div>
      </nav>

      {/* HERO — Full visual with Kraken image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Floating Kraken background */}
        <motion.div
          className="absolute inset-0"
          animate={{
            y: [0, -12, 0, 8, 0],
            x: [0, 6, 0, -4, 0],
            scale: [1, 1.03, 1, 0.98, 1],
            rotate: [0, 0.5, 0, -0.3, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <img
            src={krakenHero}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.35, scale: 1.1 }}
          />
        </motion.div>

        {/* Particles */}
        <Particles />

        {/* Gradient overlays */}
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
            <span className="text-xs font-semibold" style={{ color: 'hsl(174 72% 56%)' }}>Données de ventes hebdomadaires</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-black leading-[1.1] mb-6"
          >
            <span className="text-foreground">Trouvez les produits</span>
            <br />
            <span className="text-foreground">qui </span>
            <span className="kraken-title">cartonnent</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: 'hsl(185 20% 70%)' }}
          >
            Krakken récupère chaque semaine les ventes des meilleures marketplaces.
            Triez par marque, prix, vendeurs — et identifiez les pépites avant tout le monde.
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
            <a href="#demo" className="px-8 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 backdrop-blur-md" style={{
              background: 'hsl(225 32% 8% / 0.5)',
              border: '1px solid hsl(185 20% 88% / 0.1)',
              color: 'hsl(185 20% 88%)',
            }}>
              Voir l'aperçu
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="flex items-center justify-center gap-6 md:gap-12 mt-20 mb-8"
          >
            {[
              { val: "54K+", label: "Produits scannés", color: "174 72% 56%" },
              { val: "847", label: "Marques suivies", color: "262 72% 72%" },
              { val: "Chaque sem.", label: "Mise à jour des ventes", color: "188 80% 62%" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl md:text-3xl font-display font-black" style={{
                  color: `hsl(${s.color})`,
                  textShadow: `0 0 24px hsl(${s.color} / 0.4)`,
                }}>{s.val}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32" style={{
          background: 'linear-gradient(180deg, transparent, hsl(228 42% 3%))',
        }} />
      </section>

      {/* Tentacles between sections */}
      <Tentacle side="left" top="90vh" color="174 72% 46%" delay={0} size={250} />
      <Tentacle side="right" top="140vh" color="262 52% 58%" delay={1.5} size={280} />
      <Tentacle side="left" top="220vh" color="188 78% 52%" delay={0.8} size={220} />
      <Tentacle side="right" top="300vh" color="174 72% 46%" delay={2} size={260} />
      <Tentacle side="left" top="380vh" color="262 52% 58%" delay={0.5} size={240} />
      <Tentacle side="right" top="450vh" color="38 92% 56%" delay={1} size={200} />

      {/* FEATURES */}
      <section id="features" className="py-24 px-6 relative" style={{ background: 'hsl(228 42% 3%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px tentacle-line" />
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="bio-badge bio-teal inline-block mb-4">Ce qu'on fait</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-display font-black text-foreground mb-4">
              Chaque vente, chaque semaine
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-xl mx-auto">
              On scanne les marketplaces et on récupère les données de ventes pour que vous puissiez identifier les produits qui performent.
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

      {/* DEMO — Real data preview */}
      <section id="demo" className="py-24 px-6 relative" style={{ background: 'hsl(228 42% 3%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px tentacle-line" />
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
          >
            <motion.p variants={fadeUp} custom={0} className="bio-badge bio-violet inline-block mb-4">Aperçu</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-display font-black text-foreground mb-4">
              Voilà ce que vous voyez
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-xl mx-auto">
              Les produits les mieux vendus, triés comme vous voulez. Données fraîches chaque semaine.
            </motion.p>
          </motion.div>

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
                <span className="text-xs font-display font-bold text-foreground/80">Top Ventes — Semaine 9</span>
                <span className="bio-badge bio-teal text-[9px] py-0.5">LIVE</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold" style={{
                  background: 'hsl(174 72% 46% / 0.08)',
                  border: '1px solid hsl(174 72% 46% / 0.15)',
                  color: 'hsl(174 72% 56%)',
                }}>
                  <Filter className="w-3 h-3" /> Filtrer
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold" style={{
                  background: 'hsl(262 52% 58% / 0.08)',
                  border: '1px solid hsl(262 52% 58% / 0.15)',
                  color: 'hsl(262 72% 72%)',
                }}>
                  <ArrowUpDown className="w-3 h-3" /> Trier
                </div>
              </div>
            </div>

            {/* Table header */}
            <div className="hidden md:grid grid-cols-[1fr_100px_90px_100px_70px_70px] gap-3 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground" style={{
              borderBottom: '1px solid hsl(225 20% 8%)',
            }}>
              <span>Produit</span>
              <span className="text-right">Prix</span>
              <span className="text-right">Ventes/sem</span>
              <span className="text-right">Vendeurs</span>
              <span className="text-right">Score</span>
              <span className="text-right">Trend</span>
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
                  className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_100px_90px_100px_70px_70px] gap-3 px-5 py-3.5 items-center transition-colors duration-200 group cursor-pointer"
                  style={{
                    borderBottom: '1px solid hsl(225 20% 8%)',
                  }}
                  whileHover={{
                    backgroundColor: 'hsl(174 72% 46% / 0.03)',
                  }}
                >
                  {/* Product info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0" style={{
                      backgroundColor: i === 0 ? 'hsl(38 92% 56% / 0.15)' : i === 1 ? 'hsl(174 72% 46% / 0.12)' : 'hsl(225 18% 14%)',
                      color: i === 0 ? 'hsl(38 92% 64%)' : i === 1 ? 'hsl(174 72% 56%)' : 'hsl(210 10% 45%)',
                      boxShadow: i < 2 ? `0 0 8px ${i === 0 ? 'hsl(38 92% 56% / 0.2)' : 'hsl(174 72% 46% / 0.15)'}` : undefined,
                    }}>
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground/90 truncate group-hover:text-primary transition-colors">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground font-mono">{p.brand}</p>
                    </div>
                  </div>

                  {/* Mobile: compact price + score */}
                  <div className="md:hidden text-right">
                    <p className="text-sm font-black font-mono text-foreground">{p.price}€</p>
                    <p className="text-[10px] font-bold" style={{ color: 'hsl(162 72% 52%)' }}>⚡{p.score}</p>
                  </div>

                  {/* Desktop columns */}
                  <div className="hidden md:block text-right">
                    <span className="text-sm font-black font-mono text-foreground">{p.price}€</span>
                    <span className="text-[10px] text-muted-foreground line-through ml-1.5">{p.oldPrice}€</span>
                  </div>
                  <span className="hidden md:block text-right text-sm font-mono font-bold" style={{
                    color: 'hsl(174 72% 56%)',
                    textShadow: '0 0 8px hsl(174 72% 46% / 0.3)',
                  }}>{p.sales}</span>
                  <span className="hidden md:block text-right text-sm font-mono text-foreground/70">{p.sellers}</span>
                  <span className="hidden md:flex items-center justify-end gap-1 text-sm font-bold" style={{
                    color: 'hsl(162 72% 52%)',
                    textShadow: '0 0 6px hsl(162 68% 44% / 0.3)',
                  }}>⚡ {p.score}</span>
                  <span className="hidden md:block text-right text-xs font-bold" style={{
                    color: 'hsl(162 72% 52%)',
                  }}>{p.trend}</span>
                </motion.div>
              ))}
            </div>

            {/* Bottom bar */}
            <div className="px-5 py-3 flex items-center justify-between" style={{
              background: 'hsl(225 32% 5%)',
            }}>
              <span className="text-[10px] text-muted-foreground">Affichage 1-5 sur 54 892 produits</span>
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

            {/* Glow overlay */}
            <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
              background: 'radial-gradient(ellipse at 50% 0%, hsl(174 72% 46% / 0.03), transparent 50%)',
            }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-8"
          >
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-200 group" style={{
              color: 'hsl(174 72% 56%)',
            }}>
              <Eye className="w-4 h-4" />
              Explorer le dashboard complet
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* PRICING */}
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
              Du simple explorateur au maître des abysses, trouvez l'offre qui vous correspond.
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
                className="relative rounded-2xl p-6 transition-all duration-300 group"
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
                      <Check className="w-3.5 h-3.5 flex-shrink-0" style={{
                        color: `hsl(${plan.color})`,
                      }} />
                      <span className="text-sm text-foreground/80">{f}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-300" style={{
                  background: plan.popular
                    ? `linear-gradient(135deg, hsl(${plan.color}), hsl(${plan.color} / 0.8))`
                    : `hsl(${plan.color} / 0.1)`,
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

      {/* FOOTER */}
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
