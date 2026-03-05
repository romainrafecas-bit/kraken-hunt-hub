import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { ChevronRight, Search, Layers, ExternalLink, ArrowDown } from "lucide-react";
import krakkenLogo from "@/assets/krakken-logo.png";
import krakenHero from "@/assets/kraken-landing-hero.jpg";
import { Tentacle, Particles } from "@/components/landing/KrakenAnimations";

const Landing = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'hsl(228 42% 3%)' }}>

      {/* ═══ NAV — Minimal ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{
        background: 'hsl(228 42% 3% / 0.6)',
        backdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid hsl(174 72% 46% / 0.04)',
      }}>
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={krakkenLogo} alt="Krakken" className="w-8 h-8 object-contain" style={{
              filter: 'drop-shadow(0 0 8px hsl(174 72% 46% / 0.5))',
            }} />
            <span className="kraken-title text-base font-black tracking-wider">KRAKKEN</span>
          </div>
          <Link to="/" className="px-5 py-2 rounded-full text-xs font-bold tracking-wide uppercase transition-all duration-300" style={{
            background: 'linear-gradient(135deg, hsl(174 72% 46%), hsl(188 78% 48%))',
            color: 'hsl(228 42% 4%)',
            boxShadow: '0 0 20px -4px hsl(174 72% 46% / 0.4)',
          }}>
            Ouvrir l'app
          </Link>
        </div>
      </nav>

      {/* ═══ HERO — Cinematic fullscreen ═══ */}
      <section ref={heroRef} className="relative h-[110vh] flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
          <motion.div
            className="absolute inset-0"
            animate={{ y: [0, -10, 0, 6, 0], scale: [1, 1.02, 1, 0.99, 1] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          >
            <img src={krakenHero} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.4 }} />
          </motion.div>
        </motion.div>

        <Particles />

        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse at 50% 40%, transparent 20%, hsl(228 42% 3% / 0.7) 70%),
            linear-gradient(180deg, hsl(228 42% 3% / 0.3) 0%, transparent 30%, hsl(228 42% 3%) 95%)
          `,
        }} />

        <motion.div className="relative z-10 px-8 text-center" style={{ y: textY, opacity: heroOpacity }}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-xs font-mono uppercase tracking-[0.4em] mb-8"
            style={{ color: 'hsl(174 72% 56% / 0.7)' }}
          >
            Outil de sourcing e-commerce
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display font-black leading-[0.95] tracking-tight mb-8"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
          >
            <span className="text-foreground block">Trouvez ce qui</span>
            <span className="kraken-title block" style={{
              filter: 'drop-shadow(0 0 30px hsl(174 72% 46% / 0.3))',
            }}>se vend.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-lg mx-auto text-base leading-relaxed mb-12"
            style={{ color: 'hsl(185 15% 55%)' }}
          >
            Krakken analyse la vélocité de vente sur Cdiscount.
            <br className="hidden md:block" />
            Vous sourcez sur AliExpress en un clic.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link to="/" className="group inline-flex items-center gap-3 px-10 py-4 rounded-full text-sm font-bold tracking-wide transition-all duration-300" style={{
              background: 'linear-gradient(135deg, hsl(174 72% 46%), hsl(188 78% 48%))',
              color: 'hsl(228 42% 4%)',
              boxShadow: '0 0 60px -10px hsl(174 72% 46% / 0.5)',
            }}>
              Commencer gratuitement
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="w-4 h-4 text-muted-foreground/40" />
        </motion.div>
      </section>

      {/* Tentacles woven through page */}
      <Tentacle side="left" top="95vh" color="174 72% 46%" delay={0} size={280} />
      <Tentacle side="right" top="180vh" color="262 52% 58%" delay={1.5} size={300} />
      <Tentacle side="left" top="300vh" color="188 78% 52%" delay={0.8} size={240} />
      <Tentacle side="right" top="420vh" color="174 72% 46%" delay={2} size={260} />

      {/* ═══ MASSIVE STAT STRIP ═══ */}
      <section className="py-20 px-8 relative" style={{ background: 'hsl(228 42% 3%)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-0">
            {[
              { val: "21", unit: "catégories", sub: "Cdiscount analysées" },
              { val: "54K", unit: "produits", sub: "scannés chaque semaine" },
              { val: "1", unit: "clic", sub: "pour sourcer sur Ali" },
            ].map((s, i) => (
              <motion.div
                key={s.val}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center flex-1"
              >
                <div className="flex items-baseline justify-center gap-2">
                  <span className="font-display font-black" style={{
                    fontSize: 'clamp(3rem, 6vw, 5rem)',
                    color: 'hsl(174 72% 56%)',
                    textShadow: '0 0 40px hsl(174 72% 46% / 0.3)',
                    lineHeight: 1,
                  }}>{s.val}</span>
                  <span className="text-lg font-display font-bold text-foreground/60">{s.unit}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 font-mono tracking-wide">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ THE PROCESS — Vertical dramatic ═══ */}
      <section className="relative py-32 px-8" style={{ background: 'hsl(228 42% 3%)' }}>
        {/* Vertical tentacle line */}
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 tentacle-line-v hidden md:block" />

        <div className="max-w-5xl mx-auto space-y-32 md:space-y-48">
          {[
            {
              num: "01",
              icon: Search,
              title: "On scanne les avis.",
              body: "Krakken analyse les avis Cdiscount par catégorie. Si un produit reçoit des avis régulièrement, c'est qu'il se vend. On mesure cette vélocité et on la transforme en score.",
              color: "174 72% 46%",
              align: "left" as const,
            },
            {
              num: "02",
              icon: Layers,
              title: "On enrichit tout.",
              body: "Prix, image, marque, nombre de vendeurs, statut stock — chaque produit détecté est enrichi automatiquement. Vous n'avez rien à faire.",
              color: "262 52% 58%",
              align: "right" as const,
            },
            {
              num: "03",
              icon: ExternalLink,
              title: "Vous sourcez.",
              body: "Un bouton AliExpress. Un bouton Google Lens. Trouvez votre fournisseur en un clic, directement depuis le dashboard.",
              color: "38 92% 56%",
              align: "left" as const,
            },
          ].map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: step.align === "left" ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className={`flex flex-col ${step.align === "right" ? "md:items-end md:text-right" : "md:items-start md:text-left"} items-center text-center`}
            >
              <div className={`max-w-lg ${step.align === "right" ? "md:pr-16" : "md:pl-16"}`}>
                {/* Step number */}
                <div className="flex items-center gap-4 mb-6" style={{
                  flexDirection: step.align === "right" ? "row-reverse" : "row",
                }}>
                  <span className="font-display font-black text-5xl" style={{
                    color: `hsl(${step.color} / 0.15)`,
                  }}>{step.num}</span>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{
                    background: `hsl(${step.color} / 0.1)`,
                    border: `1px solid hsl(${step.color} / 0.2)`,
                    boxShadow: `0 0 30px -8px hsl(${step.color} / 0.3)`,
                  }}>
                    <step.icon className="w-6 h-6" style={{
                      color: `hsl(${step.color})`,
                      filter: `drop-shadow(0 0 6px hsl(${step.color} / 0.5))`,
                    }} />
                  </div>
                </div>

                <h3 className="font-display font-black text-2xl md:text-3xl text-foreground mb-4" style={{
                  textShadow: `0 0 40px hsl(${step.color} / 0.15)`,
                }}>
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-base">{step.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ DASHBOARD — Emerges from the deep ═══ */}
      <section className="py-32 px-8 relative" style={{ background: 'hsl(228 42% 3%)' }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-lg mx-auto text-center mb-16"
        >
          <h2 className="font-display font-black text-3xl md:text-4xl text-foreground mb-4">
            Le dashboard.
          </h2>
          <p className="text-muted-foreground">
            Pas de bullshit. Les produits, les scores, les boutons pour sourcer.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 80, rotateX: 8 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto relative"
          style={{ perspective: '1200px' }}
        >
          <div className="rounded-2xl overflow-hidden relative" style={{
            border: '1px solid hsl(174 72% 46% / 0.1)',
            boxShadow: '0 0 100px -25px hsl(174 72% 46% / 0.15), 0 40px 80px -20px hsl(228 50% 2% / 0.8)',
            background: 'hsl(225 32% 6%)',
          }}>
            {/* Header bar */}
            <div className="px-5 py-3 flex items-center gap-3" style={{
              borderBottom: '1px solid hsl(225 20% 9%)',
              background: 'hsl(225 32% 5%)',
            }}>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'hsl(348 72% 50% / 0.6)' }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'hsl(38 92% 50% / 0.6)' }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'hsl(162 68% 44% / 0.6)' }} />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md text-[10px] font-mono text-muted-foreground/50" style={{
                  background: 'hsl(225 20% 8%)',
                }}>
                  app.krakken.io/produits
                </div>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="p-5">
              {/* Filters row */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <div className="px-3 py-1.5 rounded-lg text-[10px] font-bold" style={{
                  background: 'hsl(174 72% 46% / 0.1)',
                  border: '1px solid hsl(174 72% 46% / 0.2)',
                  color: 'hsl(174 72% 56%)',
                }}>Smartphones</div>
                <div className="px-3 py-1.5 rounded-lg text-[10px] font-semibold" style={{
                  background: 'hsl(225 18% 10%)',
                  border: '1px solid hsl(225 20% 12%)',
                  color: 'hsl(210 10% 50%)',
                }}>Électroménager</div>
                <div className="px-3 py-1.5 rounded-lg text-[10px] font-semibold" style={{
                  background: 'hsl(225 18% 10%)',
                  border: '1px solid hsl(225 20% 12%)',
                  color: 'hsl(210 10% 50%)',
                }}>Gaming</div>
                <div className="ml-auto px-3 py-1.5 rounded-lg text-[10px] font-bold" style={{
                  background: 'hsl(38 92% 56% / 0.1)',
                  border: '1px solid hsl(38 92% 56% / 0.15)',
                  color: 'hsl(38 92% 64%)',
                }}>📊 Export Excel</div>
              </div>

              {/* Product rows */}
              {[
                { name: "Galaxy S24 Ultra 256Go", brand: "Samsung", price: "899€", vel: "127/sem", score: 98, stock: true },
                { name: "Dyson V15 Detect Absolute", brand: "Dyson", price: "549€", vel: "89/sem", score: 96, stock: true },
                { name: "PlayStation 5 Slim", brand: "Sony", price: "399€", vel: "74/sem", score: 94, stock: true },
                { name: "AirPods Pro 2 USB-C", brand: "Apple", price: "229€", vel: "68/sem", score: 93, stock: false },
                { name: "Ninja Foodi MAX 9-en-1", brand: "Ninja", price: "179€", vel: "61/sem", score: 91, stock: true },
              ].map((p, i) => (
                <div key={p.name} className="flex items-center gap-4 py-3 px-2 rounded-xl" style={{
                  borderBottom: '1px solid hsl(225 20% 8%)',
                  background: i === 0 ? 'hsl(174 72% 46% / 0.03)' : 'transparent',
                }}>
                  {/* Fake product image */}
                  <div className="w-10 h-10 rounded-lg flex-shrink-0" style={{
                    background: `linear-gradient(135deg, hsl(${i * 30 + 170} 40% 20%), hsl(${i * 30 + 170} 40% 15%))`,
                    border: '1px solid hsl(225 20% 12%)',
                  }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground/90 truncate">{p.name}</span>
                      {!p.stock && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded" style={{
                        background: 'hsl(348 72% 56% / 0.12)',
                        color: 'hsl(348 80% 66%)',
                        border: '1px solid hsl(348 72% 56% / 0.2)',
                      }}>RUPTURE</span>}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">{p.brand}</span>
                  </div>
                  <span className="text-xs font-black font-mono text-foreground hidden sm:block">{p.price}</span>
                  <span className="text-[10px] font-mono font-bold hidden sm:block" style={{
                    color: 'hsl(174 72% 56%)',
                  }}>{p.vel}</span>
                  <span className="text-xs font-bold hidden sm:block" style={{
                    color: 'hsl(162 72% 52%)',
                    textShadow: '0 0 8px hsl(162 68% 44% / 0.3)',
                  }}>⚡{p.score}</span>
                  {/* Source buttons */}
                  <div className="flex gap-1">
                    <span className="px-2 py-1 rounded text-[9px] font-bold" style={{
                      background: 'hsl(38 92% 56% / 0.12)',
                      color: 'hsl(38 92% 64%)',
                      border: '1px solid hsl(38 92% 56% / 0.2)',
                    }}>Ali</span>
                    <span className="px-2 py-1 rounded text-[9px] font-bold" style={{
                      background: 'hsl(188 78% 52% / 0.12)',
                      color: 'hsl(188 80% 62%)',
                      border: '1px solid hsl(188 78% 52% / 0.2)',
                    }}>Lens</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reflection glow underneath */}
          <div className="absolute -bottom-20 left-10 right-10 h-20 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at 50% 0%, hsl(174 72% 46% / 0.06), transparent 70%)',
          }} />
        </motion.div>
      </section>

      {/* ═══ KILLER FEATURES — Asymmetric ═══ */}
      <section className="py-32 px-8 relative" style={{ background: 'hsl(228 42% 3%)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-black text-3xl md:text-5xl text-foreground mb-20 max-w-md"
          >
            Pas juste un scraper.
            <br />
            <span className="kraken-title">Un radar.</span>
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
            {[
              { title: "Score de vélocité", desc: "On ne compte pas les ventes — on mesure à quelle vitesse un produit accumule des avis. Plus la récurrence est forte, plus le score monte.", color: "174 72% 46%" },
              { title: "Détection ruptures", desc: "Un produit best-seller en rupture = niche ouverte. Krakken le signale automatiquement pour que vous preniez la place.", color: "348 72% 56%" },
              { title: "21 catégories Cdiscount", desc: "De l'électroménager au gaming, en passant par la mode et les jouets. Chaque catégorie est scannée et mise à jour.", color: "262 52% 58%" },
              { title: "Sourcing intégré", desc: "Bouton AliExpress pour chercher par titre. Bouton Google Lens pour chercher par image. Pas besoin de quitter Krakken.", color: "38 92% 56%" },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i % 2 === 1 ? 0.15 : 0 }}
                className="group"
              >
                <div className="w-1 h-8 rounded-full mb-4 transition-all duration-500 group-hover:h-12" style={{
                  background: `linear-gradient(180deg, hsl(${f.color}), hsl(${f.color} / 0.1))`,
                  boxShadow: `0 0 12px hsl(${f.color} / 0.3)`,
                }} />
                <h3 className="font-display font-bold text-lg text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHO IS THIS FOR — Raw ═══ */}
      <section className="py-24 px-8 relative overflow-hidden" style={{ background: 'hsl(228 42% 3%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px tentacle-line" />

        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="font-display font-black text-3xl md:text-4xl text-foreground">
              Pour ceux qui cherchent
              <br />
              <span className="text-muted-foreground">des produits de niche.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { role: "Dropshippers", line: "Trouvez des produits à forte vélocité et sourcez-les sur Ali en un clic. Stop le guessing.", color: "174 72% 46%" },
              { role: "Vendeurs marketplace", line: "Identifiez ce qui se vend vraiment sur Cdiscount avant de référencer. Data > intuition.", color: "262 52% 58%" },
              { role: "Agents de sourcing", line: "Fournissez à vos clients des données fiables sur la demande réelle. Pas des suppositions.", color: "38 92% 56%" },
            ].map((a, i) => (
              <motion.div
                key={a.role}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl relative overflow-hidden group"
                style={{
                  background: `hsl(${a.color} / 0.03)`,
                  border: `1px solid hsl(${a.color} / 0.08)`,
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-px" style={{
                  background: `linear-gradient(90deg, transparent, hsl(${a.color} / 0.4), transparent)`,
                }} />
                <p className="text-xs font-mono font-bold uppercase tracking-wider mb-3" style={{
                  color: `hsl(${a.color})`,
                }}>{a.role}</p>
                <p className="text-sm text-foreground/80 leading-relaxed">{a.line}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING — Clean ═══ */}
      <section id="pricing" className="py-32 px-8 relative" style={{ background: 'hsl(228 42% 3%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px tentacle-line" />
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display font-black text-3xl md:text-4xl text-foreground mb-3">Tarifs</h2>
            <p className="text-muted-foreground text-sm">Commencez gratos. Évoluez quand ça rapporte.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                name: "Free", price: "0€", features: ["3 catégories", "50 produits/scan", "Score de vélocité"],
                color: "174 72% 46%", pop: false, cta: "Commencer",
              },
              {
                name: "Pro", price: "19€", period: "/mois",
                features: ["21 catégories", "Illimité", "AliExpress + Lens", "Export Excel", "Alertes rupture"],
                color: "262 52% 58%", pop: true, cta: "Essai gratuit",
              },
              {
                name: "Team", price: "49€", period: "/mois",
                features: ["Tout Pro +", "Multi-users", "API", "Scans auto", "Support prio"],
                color: "38 92% 56%", pop: false, cta: "Nous contacter",
              },
            ].map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-6 relative"
                style={{
                  background: plan.pop ? `hsl(${plan.color} / 0.06)` : 'hsl(225 32% 6% / 0.6)',
                  border: `1px solid hsl(${plan.color} / ${plan.pop ? '0.25' : '0.08'})`,
                  boxShadow: plan.pop ? `0 0 60px -15px hsl(${plan.color} / 0.2)` : undefined,
                }}
              >
                {plan.pop && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full" style={{
                      background: `hsl(${plan.color})`,
                      color: 'hsl(228 42% 4%)',
                    }}>Recommandé</span>
                  </div>
                )}
                <p className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: `hsl(${plan.color})` }}>{plan.name}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-display font-black text-foreground">{plan.price}</span>
                  {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
                </div>
                <div className="space-y-2.5 mb-8">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full" style={{ background: `hsl(${plan.color})` }} />
                      <span className="text-sm text-foreground/75">{f}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-300" style={{
                  background: plan.pop ? `hsl(${plan.color})` : `hsl(${plan.color} / 0.08)`,
                  color: plan.pop ? 'hsl(228 42% 4%)' : `hsl(${plan.color})`,
                  border: `1px solid hsl(${plan.color} / ${plan.pop ? '0.6' : '0.15'})`,
                }}>
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA — Big and bold ═══ */}
      <section className="py-40 px-8 relative text-center" style={{ background: 'hsl(228 42% 3%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 50% 50%, hsl(174 72% 46% / 0.04), transparent 60%)',
        }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          <h2 className="font-display font-black text-foreground mb-6" style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
          }}>
            Les produits sont là.
            <br />
            <span className="kraken-title">Venez les chercher.</span>
          </h2>
          <Link to="/" className="group inline-flex items-center gap-3 px-12 py-5 rounded-full text-sm font-bold tracking-wide transition-all duration-300" style={{
            background: 'linear-gradient(135deg, hsl(174 72% 46%), hsl(188 78% 48%))',
            color: 'hsl(228 42% 4%)',
            boxShadow: '0 0 80px -15px hsl(174 72% 46% / 0.4)',
          }}>
            Commencer la traque
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>

      {/* ═══ FOOTER — Minimal ═══ */}
      <footer className="py-8 px-8" style={{
        borderTop: '1px solid hsl(225 20% 8%)',
        background: 'hsl(228 42% 3%)',
      }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={krakkenLogo} alt="" className="w-5 h-5 object-contain opacity-40" />
            <span className="text-xs text-muted-foreground/50">© 2026 Krakken</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-[10px] text-muted-foreground/40 hover:text-muted-foreground transition-colors">Légal</a>
            <a href="#" className="text-[10px] text-muted-foreground/40 hover:text-muted-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
