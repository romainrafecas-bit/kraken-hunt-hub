import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, TrendingUp, Bell, BarChart3, Shield, Zap, ChevronRight, Check, Anchor, Eye } from "lucide-react";
import krakkenLogo from "@/assets/krakken-logo.png";

const features = [
  {
    icon: Search,
    title: "Traque intelligente",
    desc: "Scannez des milliers de produits en temps réel sur les plus grandes marketplaces.",
    color: "174 72% 46%",
  },
  {
    icon: TrendingUp,
    title: "Détection des baisses",
    desc: "Soyez alerté dès qu'un prix plonge dans les abysses. Aucune bonne affaire ne vous échappe.",
    color: "162 68% 44%",
  },
  {
    icon: BarChart3,
    title: "Analytics profonds",
    desc: "Visualisez les tendances, historiques de prix et performances par catégorie.",
    color: "262 52% 58%",
  },
  {
    icon: Bell,
    title: "Alertes en surface",
    desc: "Notifications instantanées quand vos produits traqués atteignent le prix cible.",
    color: "188 78% 52%",
  },
  {
    icon: Shield,
    title: "Veille concurrentielle",
    desc: "Analysez les vendeurs, le nombre de marchands et la popularité des offres.",
    color: "38 92% 56%",
  },
  {
    icon: Zap,
    title: "Score Krakken",
    desc: "Notre algorithme exclusif évalue chaque deal selon 12 critères de pertinence.",
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
    <div className="min-h-screen abyss-gradient overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl" style={{
        background: 'hsl(228 42% 5% / 0.8)',
        borderBottom: '1px solid hsl(174 72% 46% / 0.08)',
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
            <a href="#demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Démo</a>
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

      {/* HERO */}
      <section className="relative pt-32 pb-24 px-6">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px]" style={{
            background: 'radial-gradient(circle, hsl(174 72% 46% / 0.06), transparent 60%)',
          }} />
          <div className="absolute top-40 right-1/4 w-[400px] h-[400px]" style={{
            background: 'radial-gradient(circle, hsl(262 52% 58% / 0.05), transparent 60%)',
          }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
            style={{
              background: 'hsl(174 72% 46% / 0.08)',
              border: '1px solid hsl(174 72% 46% / 0.2)',
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{
              backgroundColor: 'hsl(174 72% 46%)',
              animation: 'bioluminescence 3s ease-in-out infinite',
              boxShadow: '0 0 8px 2px hsl(174 72% 46% / 0.5)',
            }} />
            <span className="text-xs font-semibold" style={{ color: 'hsl(174 72% 56%)' }}>Chasseur de prix intelligent</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-black leading-tight mb-6"
          >
            <span className="text-foreground">Traquez les prix</span>
            <br />
            <span className="kraken-title">depuis les abysses</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Krakken scanne les profondeurs des marketplaces pour dénicher les meilleures affaires.
            Alertes en temps réel, analytics avancés, scoring intelligent.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/" className="group px-8 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2" style={{
              background: 'linear-gradient(135deg, hsl(174 72% 46%), hsl(188 78% 52%))',
              color: 'hsl(228 42% 4%)',
              boxShadow: '0 0 30px -8px hsl(174 72% 46% / 0.5), 0 4px 16px -4px hsl(228 50% 2% / 0.5)',
            }}>
              Commencer la traque
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#demo" className="px-8 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300" style={{
              background: 'hsl(225 32% 8% / 0.8)',
              border: '1px solid hsl(174 72% 46% / 0.15)',
              color: 'hsl(185 20% 88%)',
            }}>
              Voir la démo
            </a>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center justify-center gap-8 md:gap-12 mt-16"
          >
            {[
              { val: "54K+", label: "Produits scannés" },
              { val: "847", label: "Marques suivies" },
              { val: "-42%", label: "Réduction max trouvée" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl md:text-3xl font-display font-black" style={{
                  color: 'hsl(174 72% 56%)',
                  textShadow: '0 0 20px hsl(174 72% 46% / 0.3)',
                }}>{s.val}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6 relative">
        <div className="absolute top-0 left-0 right-0 h-px tentacle-line" />
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="bio-badge bio-teal inline-block mb-4">Fonctionnalités</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-display font-black text-foreground mb-4">
              Des tentacules partout
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-xl mx-auto">
              Krakken déploie ses tentacules dans chaque recoin des marketplaces pour vous offrir une vision complète.
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

      {/* DEMO */}
      <section id="demo" className="py-24 px-6 relative">
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
              Plongez dans le dashboard
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-xl mx-auto">
              Interface abyssale conçue pour les chasseurs de prix exigeants.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden"
            style={{
              border: '1px solid hsl(174 72% 46% / 0.15)',
              boxShadow: '0 0 60px -15px hsl(174 72% 46% / 0.15), 0 25px 50px -12px hsl(228 50% 2% / 0.6)',
            }}
          >
            {/* Mock dashboard preview */}
            <div className="aspect-video relative" style={{
              background: 'linear-gradient(135deg, hsl(228 42% 6%), hsl(225 32% 8%))',
            }}>
              <div className="absolute inset-0 p-6 md:p-10">
                {/* Simulated dashboard layout */}
                <div className="flex items-center gap-3 mb-6">
                  <img src={krakkenLogo} alt="" className="w-8 h-8 object-contain opacity-80" />
                  <div className="h-3 w-32 rounded-full" style={{ background: 'hsl(174 72% 46% / 0.2)' }} />
                  <div className="ml-auto flex gap-2">
                    <div className="h-3 w-16 rounded-full" style={{ background: 'hsl(262 52% 58% / 0.15)' }} />
                    <div className="h-3 w-16 rounded-full" style={{ background: 'hsl(188 78% 52% / 0.15)' }} />
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {["174 72% 46%", "162 68% 44%", "262 52% 58%", "38 92% 56%"].map((c, i) => (
                    <div key={i} className="rounded-xl p-3" style={{
                      background: `hsl(${c} / 0.06)`,
                      border: `1px solid hsl(${c} / 0.12)`,
                    }}>
                      <div className="h-2 w-12 rounded-full mb-2" style={{ background: `hsl(${c} / 0.3)` }} />
                      <div className="h-5 w-10 rounded" style={{ background: `hsl(${c} / 0.25)` }} />
                    </div>
                  ))}
                </div>

                {/* Chart area */}
                <div className="rounded-xl p-4 flex-1" style={{
                  background: 'hsl(225 32% 8% / 0.6)',
                  border: '1px solid hsl(174 72% 46% / 0.08)',
                }}>
                  <div className="h-2 w-40 rounded-full mb-4" style={{ background: 'hsl(174 72% 46% / 0.15)' }} />
                  <div className="flex items-end gap-2 h-24">
                    {[30, 45, 40, 55, 50, 65, 60, 75, 70, 85, 80, 90].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t" style={{
                        height: `${h}%`,
                        background: `linear-gradient(180deg, hsl(174 72% 46% / 0.4), hsl(262 52% 58% / 0.1))`,
                        boxShadow: `0 0 6px hsl(174 72% 46% / 0.15)`,
                      }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Overlay glow */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: 'radial-gradient(ellipse at 50% 120%, hsl(174 72% 46% / 0.08), transparent 60%)',
              }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8"
          >
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold transition-colors" style={{
              color: 'hsl(174 72% 56%)',
            }}>
              <Eye className="w-4 h-4" />
              Explorer le dashboard en direct
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6 relative">
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
                  background: plan.popular ? `hsl(${plan.color} / 0.06)` : 'hsl(225 32% 8% / 0.5)',
                  border: `1px solid hsl(${plan.color} / ${plan.popular ? '0.25' : '0.1'})`,
                  boxShadow: plan.popular ? `0 0 40px -10px hsl(${plan.color} / 0.2)` : undefined,
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
                      textShadow: `0 0 20px hsl(${plan.color} / 0.3)`,
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
                  boxShadow: plan.popular ? `0 0 20px -4px hsl(${plan.color} / 0.3)` : undefined,
                }}>
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 relative">
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
