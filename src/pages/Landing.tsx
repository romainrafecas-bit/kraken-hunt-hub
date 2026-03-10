import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { 
  ChevronRight, ArrowDown, Search, Package, ShoppingCart,
  ExternalLink, AlertTriangle, Filter, FileSpreadsheet, 
  LayoutGrid, RefreshCw, Eye, Zap, CheckCircle2, Shield
} from "lucide-react";
import krakkenLogo from "@/assets/krakken-logo.png";
import krakenHero from "@/assets/kraken-landing-hero.jpg";
import { Tentacle, Particles } from "@/components/landing/KrakenAnimations";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Landing = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'hsl(228 42% 3%)' }}>

      {/* ═══ NAV ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{
        background: 'hsl(228 42% 3% / 0.5)',
        backdropFilter: 'blur(24px) saturate(200%)',
        borderBottom: '1px solid hsl(174 72% 46% / 0.04)',
      }}>
        <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={krakkenLogo} alt="Krakken" className="w-8 h-8 object-contain" style={{
              filter: 'drop-shadow(0 0 12px hsl(174 72% 46% / 0.6))',
            }} />
            <span className="kraken-title text-base font-black tracking-wider">KRAKKEN</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-xs text-foreground/50 hover:text-foreground/80 transition-colors hidden sm:block uppercase tracking-wider font-mono">Fonctionnalités</a>
            <a href="#pricing" className="text-xs text-foreground/50 hover:text-foreground/80 transition-colors hidden sm:block uppercase tracking-wider font-mono">Accès</a>
            <Link to="/" className="px-5 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-500 hover:scale-105" style={{
              background: 'linear-gradient(135deg, hsl(174 72% 46%), hsl(188 78% 48%))',
              color: 'hsl(228 42% 4%)',
              boxShadow: '0 0 30px -6px hsl(174 72% 46% / 0.5)',
            }}>
              Entrer
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO — Cinematic Kraken ═══ */}
      <section ref={heroRef} className="relative h-[115vh] flex items-center justify-center overflow-hidden">
        {/* Kraken background image */}
        <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
          <motion.div
            className="absolute inset-0"
            animate={{ y: [0, -10, 0, 6, 0], scale: [1, 1.02, 1, 0.99, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          >
            <img src={krakenHero} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.35 }} />
          </motion.div>
        </motion.div>

        <Particles />

        {/* Deep overlay */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse at 50% 35%, transparent 15%, hsl(228 42% 3% / 0.75) 65%),
            linear-gradient(180deg, hsl(228 42% 3% / 0.2) 0%, transparent 25%, hsl(228 42% 3%) 96%)
          `,
        }} />

        {/* Bioluminescent accents */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute w-96 h-96 rounded-full"
            style={{
              top: '20%', left: '10%',
              background: 'radial-gradient(circle, hsl(174 72% 46% / 0.06) 0%, transparent 70%)',
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-72 h-72 rounded-full"
            style={{
              bottom: '25%', right: '8%',
              background: 'radial-gradient(circle, hsl(262 52% 58% / 0.05) 0%, transparent 70%)',
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        <motion.div className="relative z-10 px-6 md:px-8 text-center max-w-5xl mx-auto" style={{ y: textY, opacity: heroOpacity }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-10"
            style={{
              background: 'hsl(174 72% 46% / 0.06)',
              border: '1px solid hsl(174 72% 46% / 0.12)',
            }}
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'hsl(174 72% 56%)' }}
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary/80">Base de données premium · Mise à jour hebdomadaire</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="font-display font-black leading-[0.95] tracking-tight mb-8"
            style={{ fontSize: 'clamp(2.8rem, 8vw, 6.5rem)' }}
          >
            <span className="text-foreground block">La traque</span>
            <span className="kraken-title block" style={{
              filter: 'drop-shadow(0 0 40px hsl(174 72% 46% / 0.35))',
            }}>commence ici.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-xl mx-auto text-base md:text-lg leading-relaxed mb-12 text-foreground/60"
          >
            Des centaines de produits gagnants détectés sur le marché français, 
            livrés chaque semaine. Basé sur des <span className="text-foreground/90 font-semibold">achats réels</span>, pas des suppositions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col items-center gap-5"
          >
            <Link to="/" className="group inline-flex items-center gap-3 px-12 py-4 rounded-full text-sm font-bold tracking-wide transition-all duration-500 hover:scale-105" style={{
              background: 'linear-gradient(135deg, hsl(174 72% 46%), hsl(188 78% 48%))',
              color: 'hsl(228 42% 4%)',
              boxShadow: '0 0 80px -15px hsl(174 72% 46% / 0.5), inset 0 1px 0 hsl(180 80% 70% / 0.3)',
            }}>
              Accéder à la base
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
            <span className="text-[11px] text-foreground/30 font-mono tracking-wide">Premier mois offert · 29,90€/mois ensuite</span>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <span className="text-[9px] font-mono uppercase tracking-widest text-foreground/20">Explorer</span>
          <ArrowDown className="w-3.5 h-3.5 text-foreground/20" />
        </motion.div>
      </section>

      {/* Tentacles woven through page */}
      <Tentacle side="left" top="100vh" color="174 72% 46%" delay={0} size={300} />
      <Tentacle side="right" top="200vh" color="262 52% 58%" delay={1.5} size={320} />
      <Tentacle side="left" top="340vh" color="188 78% 52%" delay={0.8} size={260} />
      <Tentacle side="right" top="480vh" color="174 72% 46%" delay={2} size={280} />
      <Tentacle side="left" top="600vh" color="262 52% 58%" delay={1} size={240} />

      {/* ═══ STAT STRIP — Bioluminescent ═══ */}
      <section className="py-20 px-6 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 50% 50%, hsl(174 72% 46% / 0.03) 0%, transparent 60%)',
        }} />
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-0">
            {[
              { val: "+500", unit: "produits", sub: "dans la base" },
              { val: "21", unit: "catégories", sub: "analysées en profondeur" },
              { val: "5 min", unit: "", sub: "pour trouver ton produit" },
            ].map((s, i) => (
              <motion.div
                key={s.val}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="text-center flex-1"
              >
                <div className="flex items-baseline justify-center gap-2">
                  <span className="font-display font-black text-primary" style={{
                    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                    textShadow: '0 0 50px hsl(174 72% 46% / 0.35)',
                    lineHeight: 1,
                  }}>{s.val}</span>
                  {s.unit && <span className="text-lg font-display font-bold text-foreground/55">{s.unit}</span>}
                </div>
                <p className="text-[11px] text-foreground/35 mt-2 font-mono tracking-widest uppercase">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROBLÈME — Dark & immersive ═══ */}
      <section className="py-28 md:py-36 px-6 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 30% 50%, hsl(348 72% 56% / 0.03) 0%, transparent 50%)',
        }} />
        <div className="absolute top-0 left-0 right-0 h-px tentacle-line" />

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-kraken-rose/60 mb-6">Le problème</p>
            <h2 className="font-display font-black text-3xl md:text-5xl text-foreground leading-tight mb-6">
              Tu passes des heures à chercher
              <br />
              <span className="text-foreground/40">le produit qui va marcher.</span>
            </h2>
            <p className="text-foreground/50 max-w-xl leading-relaxed">
              Tu scrolles Cdiscount, Amazon, AliExpress. Tu testes au pif. Tu vends les mêmes trucs que tout le monde. 
              Pas de ventes, pas de marge, du temps perdu. Et quasi aucun outil fiable pour le marché français.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: "⏳", title: "5h+ par semaine", desc: "perdues à chercher manuellement des produits" },
              { icon: "📉", title: "0 data fiable", desc: "sur ce qui se vend vraiment en France" },
              { icon: "🔄", title: "Mêmes produits", desc: "que tous les autres vendeurs — zéro différenciation" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="p-6 rounded-2xl"
                style={{
                  background: 'hsl(348 72% 56% / 0.03)',
                  border: '1px solid hsl(348 72% 56% / 0.06)',
                }}
              >
                <span className="text-2xl mb-4 block">{item.icon}</span>
                <h4 className="font-display font-bold text-sm text-foreground mb-1">{item.title}</h4>
                <p className="text-xs text-foreground/45 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SOLUTION — 3 phases dramatiques ═══ */}
      <section className="py-28 md:py-36 px-6 md:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px tentacle-line" />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 70% 30%, hsl(174 72% 46% / 0.03) 0%, transparent 50%)',
        }} />

        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-primary/60 mb-6">Comment ça marche</p>
            <h2 className="font-display font-black text-3xl md:text-5xl text-foreground">
              Trois phases.
              <br />
              <span className="kraken-title">Un seul objectif.</span>
            </h2>
          </motion.div>

          {/* Vertical timeline */}
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 tentacle-line-v hidden md:block" />

            <div className="space-y-24 md:space-y-36">
              {[
                {
                  num: "I",
                  icon: Search,
                  title: "Détection",
                  subtitle: "On traque les signaux",
                  body: "Krakken analyse des milliers de signaux d'achat sur Cdiscount pour repérer les produits que les consommateurs français achètent encore et encore. Pas des tendances. Des preuves.",
                  color: "174 72% 46%",
                  align: "left" as const,
                },
                {
                  num: "II",
                  icon: Package,
                  title: "Enrichissement",
                  subtitle: "On prépare l'arsenal",
                  body: "Image, prix, marque, catégorie, nombre de vendeurs, disponibilité stock. Chaque produit détecté est enrichi et livré prêt à l'emploi. Zéro recherche supplémentaire.",
                  color: "262 52% 58%",
                  align: "right" as const,
                },
                {
                  num: "III",
                  icon: ShoppingCart,
                  title: "Sourcing",
                  subtitle: "Tu passes à l'action",
                  body: "Un clic pour chercher sur AliExpress. Un clic pour Google Lens. Tu trouves ton fournisseur en quelques secondes, directement depuis Krakken.",
                  color: "38 92% 56%",
                  align: "left" as const,
                },
              ].map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: step.align === "left" ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.8 }}
                  className={`flex flex-col ${step.align === "right" ? "md:items-end md:text-right" : "md:items-start md:text-left"} items-center text-center`}
                >
                  <div className={`max-w-lg ${step.align === "right" ? "md:pr-20" : "md:pl-20"}`}>
                    <div className="flex items-center gap-5 mb-6" style={{
                      flexDirection: step.align === "right" ? "row-reverse" : "row",
                    }}>
                      <span className="font-display font-black text-6xl" style={{
                        color: `hsl(${step.color} / 0.1)`,
                        textShadow: `0 0 40px hsl(${step.color} / 0.08)`,
                      }}>{step.num}</span>
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{
                        background: `hsl(${step.color} / 0.08)`,
                        border: `1px solid hsl(${step.color} / 0.15)`,
                        boxShadow: `0 0 40px -10px hsl(${step.color} / 0.25)`,
                      }}>
                        <step.icon className="w-7 h-7" style={{
                          color: `hsl(${step.color})`,
                          filter: `drop-shadow(0 0 8px hsl(${step.color} / 0.5))`,
                        }} />
                      </div>
                    </div>

                    <p className="text-[10px] font-mono uppercase tracking-[0.3em] mb-2" style={{
                      color: `hsl(${step.color} / 0.6)`,
                    }}>{step.subtitle}</p>
                    <h3 className="font-display font-black text-2xl md:text-3xl text-foreground mb-4" style={{
                      textShadow: `0 0 40px hsl(${step.color} / 0.1)`,
                    }}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-foreground/50 leading-relaxed">{step.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ DASHBOARD PREVIEW ═══ */}
      <section className="py-28 md:py-36 px-6 md:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px tentacle-line" />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 50% 60%, hsl(174 72% 46% / 0.03) 0%, transparent 50%)',
        }} />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto text-center mb-16"
        >
          <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-primary/60 mb-6">Aperçu</p>
          <h2 className="font-display font-black text-3xl md:text-4xl text-foreground mb-4">
            Un tableau de bord.<br /><span className="text-foreground/40">Pas de bullshit.</span>
          </h2>
          <p className="text-sm text-foreground/45">
            Les produits, les données, les boutons pour sourcer. Tout ce dont tu as besoin, rien de plus.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 80, rotateX: 6 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-5xl mx-auto relative"
          style={{ perspective: '1400px' }}
        >
          <div className="rounded-2xl overflow-hidden relative" style={{
            border: '1px solid hsl(174 72% 46% / 0.08)',
            boxShadow: '0 0 120px -30px hsl(174 72% 46% / 0.12), 0 50px 100px -25px hsl(228 50% 2% / 0.9)',
            background: 'hsl(225 32% 5%)',
          }}>
            <div className="px-5 py-3 flex items-center gap-3" style={{
              borderBottom: '1px solid hsl(225 20% 8%)',
              background: 'hsl(225 32% 4%)',
            }}>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'hsl(348 72% 50% / 0.5)' }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'hsl(38 92% 50% / 0.5)' }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'hsl(162 68% 44% / 0.5)' }} />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md text-[9px] font-mono text-foreground/30" style={{
                  background: 'hsl(225 20% 7%)',
                }}>
                  app.krakken.io/produits
                </div>
              </div>
            </div>

            <div className="p-4 md:p-5">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {["Smartphones", "Électroménager", "Gaming", "Beauté", "Mode"].map((cat, i) => (
                  <div key={cat} className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors" style={{
                    background: i === 0 ? 'hsl(174 72% 46% / 0.1)' : 'hsl(225 18% 8%)',
                    border: `1px solid ${i === 0 ? 'hsl(174 72% 46% / 0.2)' : 'hsl(225 20% 10%)'}`,
                    color: i === 0 ? 'hsl(174 72% 56%)' : 'hsl(210 10% 45%)',
                  }}>{cat}</div>
                ))}
                <div className="ml-auto px-3 py-1.5 rounded-lg text-[10px] font-bold" style={{
                  background: 'hsl(38 92% 56% / 0.08)',
                  border: '1px solid hsl(38 92% 56% / 0.12)',
                  color: 'hsl(38 92% 60%)',
                }}>📊 Export</div>
              </div>

              {[
                { name: "Galaxy S24 Ultra 256Go", brand: "Samsung", price: "899€", sales: "127/sem", score: 98, stock: true },
                { name: "Dyson V15 Detect Absolute", brand: "Dyson", price: "549€", sales: "89/sem", score: 96, stock: true },
                { name: "PlayStation 5 Slim", brand: "Sony", price: "399€", sales: "74/sem", score: 94, stock: true },
                { name: "AirPods Pro 2 USB-C", brand: "Apple", price: "229€", sales: "68/sem", score: 93, stock: false },
                { name: "Ninja Foodi MAX 9-en-1", brand: "Ninja", price: "179€", sales: "61/sem", score: 91, stock: true },
              ].map((p, i) => (
                <div key={p.name} className="flex items-center gap-3 md:gap-4 py-3 px-2 rounded-xl transition-colors" style={{
                  borderBottom: '1px solid hsl(225 20% 7%)',
                  background: i === 0 ? 'hsl(174 72% 46% / 0.02)' : 'transparent',
                }}>
                  <div className="w-10 h-10 rounded-lg flex-shrink-0" style={{
                    background: `linear-gradient(135deg, hsl(${i * 30 + 170} 35% 18%), hsl(${i * 30 + 170} 35% 12%))`,
                    border: '1px solid hsl(225 20% 10%)',
                  }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground/85 truncate">{p.name}</span>
                      {!p.stock && <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-sm bio-rose">RUPTURE</span>}
                    </div>
                    <span className="text-[10px] text-foreground/40 font-mono">{p.brand}</span>
                  </div>
                  <span className="text-xs font-black font-mono text-foreground/80 hidden sm:block">{p.price}</span>
                  <span className="text-[10px] font-mono font-bold hidden sm:block text-primary/80">{p.sales}</span>
                  <span className="text-xs font-bold hidden sm:block" style={{
                    color: 'hsl(162 72% 50%)',
                    textShadow: '0 0 10px hsl(162 68% 44% / 0.3)',
                  }}>⚡{p.score}</span>
                  <div className="flex gap-1">
                    <span className="px-2 py-1 rounded text-[8px] font-bold bio-amber">Ali</span>
                    <span className="px-2 py-1 rounded text-[8px] font-bold bio-cyan">Lens</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Glow underneath */}
          <div className="absolute -bottom-24 left-8 right-8 h-24 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at 50% 0%, hsl(174 72% 46% / 0.05), transparent 70%)',
          }} />
        </motion.div>
      </section>

      {/* ═══ FEATURES — Premium grid ═══ */}
      <section id="features" className="py-28 md:py-36 px-6 md:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px tentacle-line" />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 20% 80%, hsl(262 52% 58% / 0.03) 0%, transparent 50%)',
        }} />

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-accent/60 mb-6">Arsenal complet</p>
            <h2 className="font-display font-black text-3xl md:text-5xl text-foreground max-w-lg">
              Chaque fonctionnalité
              <br />
              <span className="kraken-title">a une raison d'être.</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: RefreshCw, title: "Mise à jour hebdomadaire", desc: "De nouveaux produits gagnants chaque semaine. La base évolue avec le marché.", color: "174 72% 46%" },
              { icon: Filter, title: "Filtres précis", desc: "Catégorie, marque, prix, vendeurs. Cible exactement ce que tu cherches.", color: "188 78% 52%" },
              { icon: ExternalLink, title: "Sourcing intégré", desc: "AliExpress + Google Lens en un clic. Sans quitter l'interface.", color: "38 92% 56%" },
              { icon: AlertTriangle, title: "Alertes ruptures", desc: "Produit best-seller en rupture = niche ouverte. On te le signale avant les autres.", color: "348 72% 56%" },
              { icon: FileSpreadsheet, title: "Export Excel", desc: "Exporte ta sélection pour ton équipe ou ton agent de sourcing.", color: "262 52% 58%" },
              { icon: LayoutGrid, title: "21 catégories", desc: "Électroménager, gaming, mode, beauté, jouets… tout le spectre Cdiscount.", color: "162 68% 50%" },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl group transition-all duration-500"
                style={{
                  background: 'hsl(225 30% 5%)',
                  border: '1px solid hsl(225 20% 8%)',
                }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110" style={{
                  background: `hsl(${f.color} / 0.08)`,
                  border: `1px solid hsl(${f.color} / 0.12)`,
                  boxShadow: `0 0 20px -8px hsl(${f.color} / 0.2)`,
                }}>
                  <f.icon className="w-5 h-5" style={{
                    color: `hsl(${f.color})`,
                    filter: `drop-shadow(0 0 4px hsl(${f.color} / 0.4))`,
                  }} />
                </div>
                <h3 className="font-display font-bold text-sm text-foreground/90 mb-2">{f.title}</h3>
                <p className="text-xs text-foreground/45 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF — Minimal chiffres ═══ */}
      <section className="py-24 px-6 md:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px tentacle-line" />

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              { icon: Eye, stat: "+500", label: "produits analysés", color: "174 72% 46%" },
              { icon: Shield, stat: "100%", label: "marché français", color: "262 52% 58%" },
              { icon: Zap, stat: "< 5 min", label: "pour trouver un produit", color: "38 92% 56%" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="text-center p-8 rounded-2xl relative overflow-hidden"
                style={{
                  background: `hsl(${s.color} / 0.03)`,
                  border: `1px solid hsl(${s.color} / 0.06)`,
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-px" style={{
                  background: `linear-gradient(90deg, transparent, hsl(${s.color} / 0.3), transparent)`,
                }} />
                <s.icon className="w-5 h-5 mx-auto mb-4" style={{
                  color: `hsl(${s.color})`,
                  filter: `drop-shadow(0 0 6px hsl(${s.color} / 0.4))`,
                }} />
                <span className="font-display font-black text-3xl md:text-4xl text-foreground block mb-1">{s.stat}</span>
                <span className="text-[11px] text-foreground/40 font-mono tracking-wide uppercase">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ PRICING — Clean & premium ═══ */}
      <section id="pricing" className="py-28 md:py-36 px-6 md:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px tentacle-line" />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 50% 50%, hsl(174 72% 46% / 0.03) 0%, transparent 50%)',
        }} />

        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-primary/60 mb-6">Accès</p>
            <h2 className="font-display font-black text-3xl md:text-4xl text-foreground mb-3">
              Un plan. <span className="text-foreground/40">Un accès complet.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-8 md:p-10 relative overflow-hidden"
            style={{
              background: 'hsl(225 30% 5%)',
              border: '1px solid hsl(174 72% 46% / 0.12)',
              boxShadow: '0 0 100px -25px hsl(174 72% 46% / 0.1), 0 30px 60px -15px hsl(228 50% 2% / 0.8)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{
              background: 'linear-gradient(90deg, transparent, hsl(174 72% 46% / 0.5), transparent)',
            }} />

            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6" style={{
                background: 'hsl(162 68% 44% / 0.08)',
                border: '1px solid hsl(162 68% 44% / 0.15)',
              }}>
                <Zap className="w-3 h-3" style={{ color: 'hsl(162 72% 50%)', filter: 'drop-shadow(0 0 4px hsl(162 72% 52% / 0.5))' }} />
                <span className="text-[10px] font-bold font-mono uppercase tracking-wider" style={{ color: 'hsl(162 72% 50%)' }}>Premier mois offert</span>
              </div>
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-5xl md:text-6xl font-display font-black text-foreground">29,90€</span>
                <span className="text-base text-foreground/40 font-mono">/mois</span>
              </div>
            </div>

            <div className="space-y-3.5 mb-10">
              {[
                "Accès complet à la base de produits",
                "21 catégories Cdiscount analysées",
                "Mise à jour hebdomadaire",
                "Sourcing AliExpress + Google Lens en 1 clic",
                "Détection automatique des ruptures de stock",
                "Export Excel illimité",
                "Filtres avancés (catégorie, marque, prix…)",
              ].map(f => (
                <div key={f} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-primary" style={{ filter: 'drop-shadow(0 0 4px hsl(174 72% 46% / 0.3))' }} />
                  <span className="text-sm text-foreground/70">{f}</span>
                </div>
              ))}
            </div>

            <Link to="/" className="block w-full py-4 rounded-xl text-center text-sm font-bold transition-all duration-500 hover:scale-[1.02]" style={{
              background: 'linear-gradient(135deg, hsl(174 72% 46%), hsl(188 78% 48%))',
              color: 'hsl(228 42% 4%)',
              boxShadow: '0 0 50px -10px hsl(174 72% 46% / 0.4), inset 0 1px 0 hsl(180 80% 70% / 0.2)',
            }}>
              Commencer — 1 mois gratuit
            </Link>
            <p className="text-[10px] text-foreground/25 text-center mt-4 font-mono tracking-wide">Sans engagement · Annulation à tout moment</p>
          </motion.div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="py-28 md:py-36 px-6 md:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px tentacle-line" />

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-foreground/30 mb-6">FAQ</p>
            <h2 className="font-display font-black text-3xl md:text-4xl text-foreground">Questions fréquentes</h2>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-2">
            {[
              {
                q: "C'est quoi Krakken exactement ?",
                a: "Krakken est une base de données premium de produits qui se vendent sur Cdiscount, mise à jour chaque semaine. On détecte les produits avec le plus d'achats récurrents et on te les livre avec toutes les informations nécessaires pour les sourcer et les vendre.",
              },
              {
                q: "Comment vous détectez ce qui se vend ?",
                a: "On analyse les signaux d'achat réels des consommateurs français sur Cdiscount. Pas des tendances Google, pas du réchauffé US. Des données concrètes basées sur le comportement d'achat en France.",
              },
              {
                q: "Est-ce que ça fonctionne pour Amazon ?",
                a: "Krakken est actuellement focalisé sur Cdiscount. Cependant, les produits qui performent sur Cdiscount ont tendance à fonctionner sur d'autres marketplaces françaises. C'est un signal de marché fiable.",
              },
              {
                q: "À quelle fréquence la base est mise à jour ?",
                a: "Chaque semaine. De nouveaux produits gagnants sont ajoutés régulièrement pour que tu gardes une longueur d'avance sur la concurrence.",
              },
              {
                q: "C'est légal ?",
                a: "Oui, totalement. Krakken analyse des données publiquement accessibles. Il s'agit d'analyse de marché, pas de collecte de données personnelles.",
              },
              {
                q: "Je peux annuler quand je veux ?",
                a: "Bien sûr. L'abonnement est sans engagement. Tu peux annuler à tout moment, sans justification.",
              },
            ].map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="rounded-xl px-6" style={{
                background: 'hsl(225 30% 5%)',
                border: '1px solid hsl(225 20% 8%)',
              }}>
                <AccordionTrigger className="text-sm font-semibold text-foreground/85 hover:no-underline py-5">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-foreground/50 leading-relaxed pb-5">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-36 md:py-44 px-6 md:px-8 relative text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `
            radial-gradient(ellipse at 50% 50%, hsl(174 72% 46% / 0.05), transparent 50%),
            radial-gradient(ellipse at 30% 70%, hsl(262 52% 58% / 0.03), transparent 40%)
          `,
        }} />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h2 className="font-display font-black text-foreground mb-5" style={{
            fontSize: 'clamp(2rem, 6vw, 4.5rem)',
            lineHeight: 1,
          }}>
            Les produits gagnants
            <br />
            <span className="kraken-title" style={{ filter: 'drop-shadow(0 0 30px hsl(174 72% 46% / 0.25))' }}>
              n'attendent pas.
            </span>
          </h2>
          <p className="text-sm text-foreground/40 mb-10 max-w-md mx-auto font-mono">
            Pendant que tu cherches, d'autres vendent.
          </p>
          <Link to="/" className="group inline-flex items-center gap-3 px-14 py-5 rounded-full text-sm font-bold tracking-wide transition-all duration-500 hover:scale-105" style={{
            background: 'linear-gradient(135deg, hsl(174 72% 46%), hsl(188 78% 48%))',
            color: 'hsl(228 42% 4%)',
            boxShadow: '0 0 100px -20px hsl(174 72% 46% / 0.4), inset 0 1px 0 hsl(180 80% 70% / 0.2)',
          }}>
            Accéder à la base
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </motion.div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-8 px-6 md:px-8" style={{
        borderTop: '1px solid hsl(225 20% 6%)',
        background: 'hsl(228 42% 3%)',
      }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={krakkenLogo} alt="" className="w-5 h-5 object-contain" style={{ opacity: 0.3, filter: 'drop-shadow(0 0 4px hsl(174 72% 46% / 0.3))' }} />
            <span className="text-[11px] text-foreground/25 font-mono">© 2026 Krakken</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-[10px] text-foreground/20 hover:text-foreground/50 transition-colors font-mono">Mentions légales</a>
            <a href="#" className="text-[10px] text-foreground/20 hover:text-foreground/50 transition-colors font-mono">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
