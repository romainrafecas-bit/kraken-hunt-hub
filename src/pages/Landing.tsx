import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { 
  ChevronRight, ArrowDown, Search, Package, ShoppingCart,
  ExternalLink, AlertTriangle, Filter, FileSpreadsheet, 
  LayoutGrid, RefreshCw, CheckCircle2,
  Crosshair, TrendingDown, Users, Loader2
} from "lucide-react";
import krakkenLogo from "@/assets/krakken-logo.png";
import { Tentacle, DeepKraken, Particles, InkClouds } from "@/components/landing/KrakenAnimations";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";

// Animated counter hook
const useCountUp = (end: number, duration = 2000, startOnView = true) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true });
  
  useEffect(() => {
    if (!startOnView || !inView) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration, inView, startOnView]);
  
  return { count, ref };
};

// Glowing icon wrapper
const GlowIcon = ({ icon: Icon, color, size = 20 }: { icon: React.ElementType; color: string; size?: number }) => (
  <motion.div
    className="relative"
    whileHover={{ scale: 1.15 }}
    transition={{ type: "spring", stiffness: 400 }}
  >
    <Icon style={{
      width: size, height: size,
      color: `hsl(${color})`,
      filter: `drop-shadow(0 0 10px hsl(${color} / 0.5))`,
    }} />
    <div className="absolute inset-0 rounded-full" style={{
      background: `radial-gradient(circle, hsl(${color} / 0.15) 0%, transparent 70%)`,
      filter: 'blur(6px)',
      transform: 'scale(2.5)',
    }} />
  </motion.div>
);

const Landing = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const stat1 = useCountUp(100000, 2500);
  const stat2 = useCountUp(21, 1500);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'hsl(230 50% 3%)' }}>

      {/* ═══ NAV ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{
        background: 'hsl(230 50% 3% / 0.4)',
        backdropFilter: 'blur(30px) saturate(200%)',
        borderBottom: '1px solid hsl(174 72% 46% / 0.03)',
      }}>
        <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={krakkenLogo} alt="Krakken" className="w-9 h-9 object-contain" style={{
              filter: 'drop-shadow(0 0 14px hsl(174 72% 46% / 0.6))',
            }} />
            <span className="kraken-title text-lg font-black tracking-wider">KRAKKEN</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#features" className="text-[11px] text-foreground/60 hover:text-primary transition-colors hidden sm:block tracking-widest uppercase">Features</a>
            <a href="#pricing" className="text-[11px] text-foreground/60 hover:text-primary transition-colors hidden sm:block tracking-widest uppercase">Accès</a>
            <Link to="/" className="px-7 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_-8px_hsl(174_72%_46%_/_0.6)]" style={{
              background: 'linear-gradient(135deg, hsl(174 72% 46%), hsl(188 78% 48%))',
              color: 'hsl(230 50% 3%)',
              boxShadow: '0 0 30px -6px hsl(174 72% 46% / 0.5)',
            }}>
              Rejoindre Krakken
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO — Abyssal with Kraken ═══ */}
      <section ref={heroRef} className="relative h-[120vh] flex items-center justify-center overflow-hidden">
        <DeepKraken />
        <Particles />

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-[40%] pointer-events-none" style={{
          background: 'linear-gradient(to top, hsl(230 50% 3%) 0%, hsl(230 50% 3% / 0.8) 30%, transparent 100%)',
        }} />
        {/* Side vignettes */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `
            radial-gradient(ellipse at 0% 50%, hsl(230 50% 3% / 0.6) 0%, transparent 40%),
            radial-gradient(ellipse at 100% 50%, hsl(230 50% 3% / 0.6) 0%, transparent 40%)
          `,
        }} />

        <motion.div className="relative z-10 px-6 md:px-8 text-center max-w-5xl mx-auto" style={{ y: textY, opacity: heroOpacity }}>
          
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-display font-black leading-[0.95] tracking-tighter mb-8"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 6.5rem)' }}
          >
            <span className="text-foreground block">La traque</span>
            <motion.span 
              className="kraken-title block"
              style={{ filter: 'drop-shadow(0 0 50px hsl(174 72% 46% / 0.4))' }}
              animate={{ 
                filter: [
                  'drop-shadow(0 0 50px hsl(174 72% 46% / 0.3))',
                  'drop-shadow(0 0 70px hsl(174 72% 46% / 0.5))',
                  'drop-shadow(0 0 50px hsl(174 72% 46% / 0.3))',
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              commence ici.
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="max-w-xl mx-auto text-base md:text-lg leading-relaxed mb-14 text-foreground/55"
          >
            La base de données des produits qui se vendent <em className="text-foreground/90 not-italic font-semibold">vraiment</em> en France. Mise à jour chaque semaine. Sourcing en un clic.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <Link to="/" className="group inline-flex items-center gap-2.5 px-10 py-4 rounded-lg text-sm font-bold tracking-wide transition-all duration-300 hover:brightness-110" style={{
              background: 'hsl(174 72% 46%)',
              color: 'hsl(230 50% 3%)',
              boxShadow: '0 0 40px -8px hsl(174 72% 46% / 0.4)',
            }}>
              Rejoindre Krakken
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-kraken-emerald animate-pulse-glow" />
              <span className="text-[11px] text-foreground/50 tracking-wide">9,90€/mois · Exclusif membres de la formation</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="w-4 h-4 text-primary/20" />
        </motion.div>
      </section>

      {/* Tentacles — fewer, subtler */}
      <Tentacle side="left" top="120vh" color="174 72% 46%" delay={0} size={220} />
      <Tentacle side="right" top="280vh" color="262 52% 58%" delay={1.5} size={260} />
      <Tentacle side="left" top="480vh" color="188 78% 52%" delay={0.8} size={200} />

      {/* ═══ STAT STRIP — Animated counters ═══ */}
      <section className="py-12 md:py-16 px-6 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 50% 50%, hsl(174 72% 46% / 0.02) 0%, transparent 60%)',
        }} />
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-16 md:gap-0">
            {[
              { ref: stat1.ref, val: `+${stat1.count.toLocaleString('fr-FR')}`, sub: "produits analysés", color: "174 72% 46%" },
              { ref: stat2.ref, val: stat2.count.toString(), sub: "catégories scrutées", color: "188 78% 52%" },
              { ref: null, val: "5 min", sub: "pour trouver ta pépite", color: "174 72% 56%" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-center flex-1 relative"
              >
                <motion.span
                  ref={s.ref}
                  className="font-display font-black block mb-2"
                  style={{
                    fontSize: 'clamp(2.8rem, 5vw, 4.5rem)',
                    color: `hsl(${s.color})`,
                    textShadow: `0 0 60px hsl(${s.color} / 0.4), 0 0 120px hsl(${s.color} / 0.15)`,
                    lineHeight: 1,
                  }}
                  whileInView={{
                    textShadow: [
                      `0 0 60px hsl(${s.color} / 0.3), 0 0 120px hsl(${s.color} / 0.1)`,
                      `0 0 80px hsl(${s.color} / 0.5), 0 0 140px hsl(${s.color} / 0.2)`,
                      `0 0 60px hsl(${s.color} / 0.3), 0 0 120px hsl(${s.color} / 0.1)`,
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >{s.val}</motion.span>
                <span className="text-xs text-foreground/50 tracking-widest uppercase">{s.sub}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PAIN ═══ */}
      <section className="py-16 md:py-24 px-6 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 25% 40%, hsl(348 72% 56% / 0.03) 0%, transparent 50%)',
        }} />

        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <h2 className="font-display font-black text-3xl md:text-5xl text-foreground leading-[1.1] max-w-3xl">
              Tu passes encore des heures à chercher
              <br />
              <motion.span 
                className="text-foreground/45"
                whileInView={{ opacity: [0.3, 0.6, 0.45] }}
                transition={{ duration: 2, ease: "easeOut" }}
              >le bon produit ?</motion.span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Crosshair,
                title: "Des heures de recherche",
                desc: "À taper des Google Dorks pour trouver des avis Cdiscount qui remontent sur Google. À croiser les données à la main.",
                color: "348 72% 56%",
              },
              {
                icon: TrendingDown,
                title: "Des résultats peu fiables",
                desc: "Pas d'outil dédié au marché français. Tu perds du temps à chercher sans jamais être sûr que le produit se vend vraiment.",
                color: "38 92% 56%",
              },
              {
                icon: Users,
                title: "Les mêmes produits que tout le monde",
                desc: "Tu vends ce que 200 autres vendeurs vendent déjà. Résultat : guerre des prix, zéro marge.",
                color: "262 52% 58%",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 * i, duration: 0.7 }}
                className="group relative p-7 rounded-2xl overflow-hidden"
                style={{
                  background: `hsl(${item.color} / 0.02)`,
                  border: `1px solid hsl(${item.color} / 0.05)`,
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 relative" style={{
                  background: `hsl(${item.color} / 0.06)`,
                  border: `1px solid hsl(${item.color} / 0.1)`,
                }}>
                  <GlowIcon icon={item.icon} color={item.color} />
                </div>
                <h4 className="font-display font-bold text-base text-foreground/90 mb-2">{item.title}</h4>
                <p className="text-sm text-foreground/55 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SOLUTION — Dramatic 3-phase ═══ */}
      <section className="py-16 md:py-24 px-6 md:px-8 relative overflow-hidden">
        <InkClouds />

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-display font-black text-4xl md:text-6xl text-foreground leading-tight">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Trois phases.
              </motion.span>
              <br />
              <motion.span 
                className="kraken-title"
                style={{ filter: 'drop-shadow(0 0 30px hsl(174 72% 46% / 0.2))' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >Un seul objectif.</motion.span>
            </h2>
          </motion.div>

          {/* Vertical timeline */}
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px hidden md:block" style={{
              background: 'linear-gradient(180deg, transparent 0%, hsl(174 72% 46% / 0.08) 20%, hsl(262 52% 58% / 0.06) 50%, hsl(38 92% 56% / 0.08) 80%, transparent 100%)',
            }} />

            <div className="space-y-16 md:space-y-24">
              {[
                {
                  num: "I",
                  icon: Search,
                  title: "Détection",
                  subtitle: "On traque les signaux d'achat",
                  body: "Des milliers de signaux analysés sur Cdiscount. Si un produit est acheté encore et encore par les consommateurs français, on le détecte.",
                  color: "174 72% 46%",
                  align: "left" as const,
                },
                {
                  num: "II",
                  icon: Package,
                  title: "Enrichissement",
                  subtitle: "On prépare l'arsenal",
                  body: "Image, prix, marque, catégorie, nombre de vendeurs, dispo stock. Chaque produit arrive prêt à l'emploi. Zéro recherche supplémentaire.",
                  color: "262 52% 58%",
                  align: "right" as const,
                },
                {
                  num: "III",
                  icon: ShoppingCart,
                  title: "Sourcing",
                  subtitle: "Tu passes à l'action",
                  body: "AliExpress en un clic. Google Lens en un clic. Tu trouves ton fournisseur en quelques secondes, directement depuis Krakken.",
                  color: "38 92% 56%",
                  align: "left" as const,
                },
              ].map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: step.align === "left" ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
                  className={`flex flex-col ${step.align === "right" ? "md:items-end md:text-right" : "md:items-start md:text-left"} items-center text-center`}
                >
                  <div className={`max-w-lg ${step.align === "right" ? "md:pr-24" : "md:pl-24"}`}>
                    <div className="flex items-center gap-5 mb-8" style={{
                      flexDirection: step.align === "right" ? "row-reverse" : "row",
                    }}>
                      <motion.span 
                        className="font-display font-black"
                        style={{
                          fontSize: 'clamp(3rem, 5vw, 5rem)',
                          color: `hsl(${step.color} / 0.08)`,
                          lineHeight: 1,
                        }}
                        whileInView={{
                          textShadow: [
                            `0 0 40px hsl(${step.color} / 0.04)`,
                            `0 0 80px hsl(${step.color} / 0.1)`,
                            `0 0 40px hsl(${step.color} / 0.04)`,
                          ],
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      >{step.num}</motion.span>
                      <motion.div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{
                          background: `hsl(${step.color} / 0.06)`,
                          border: `1px solid hsl(${step.color} / 0.12)`,
                        }}
                        whileInView={{
                          boxShadow: [
                            `0 0 30px -12px hsl(${step.color} / 0.15)`,
                            `0 0 60px -12px hsl(${step.color} / 0.3)`,
                            `0 0 30px -12px hsl(${step.color} / 0.15)`,
                          ],
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <GlowIcon icon={step.icon} color={step.color} size={28} />
                      </motion.div>
                    </div>

                    <motion.p 
                      className="text-[10px] font-display font-bold uppercase tracking-[0.35em] mb-3"
                      style={{ color: `hsl(${step.color} / 0.5)` }}
                      initial={{ opacity: 0, letterSpacing: '0.2em' }}
                      whileInView={{ opacity: 1, letterSpacing: '0.35em' }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >{step.subtitle}</motion.p>
                    <h3 className="font-display font-black text-3xl md:text-4xl text-foreground mb-5" style={{
                      textShadow: `0 0 50px hsl(${step.color} / 0.1)`,
                    }}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-foreground/60 leading-relaxed">{step.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ DASHBOARD PREVIEW ═══ */}
      <section className="py-16 md:py-24 px-6 md:px-8 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto text-center mb-20"
        >
          <h2 className="font-display font-black text-3xl md:text-5xl text-foreground mb-5">
            L'interface.
          </h2>
          <p className="text-sm text-foreground/55 leading-relaxed">
            Les produits. Les données. Les boutons pour sourcer.
            <br />Pas d'écrans inutiles.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 100, rotateX: 8 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-5xl mx-auto relative"
          style={{ perspective: '1600px' }}
        >
          <div className="rounded-2xl overflow-hidden relative" style={{
            border: '1px solid hsl(174 72% 46% / 0.06)',
            boxShadow: `
              0 0 150px -30px hsl(174 72% 46% / 0.1),
              0 60px 120px -30px hsl(230 50% 2% / 0.95),
              inset 0 1px 0 hsl(174 72% 46% / 0.04)
            `,
            background: 'hsl(228 35% 4%)',
          }}>
            {/* Browser chrome */}
            <div className="px-5 py-3 flex items-center gap-3" style={{
              borderBottom: '1px solid hsl(225 20% 7%)',
              background: 'hsl(228 35% 3.5%)',
            }}>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'hsl(348 60% 40% / 0.5)' }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'hsl(38 70% 40% / 0.5)' }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'hsl(162 50% 35% / 0.5)' }} />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-6 py-1.5 rounded-lg text-[9px] font-mono text-foreground/45" style={{
                  background: 'hsl(225 20% 6%)',
                  border: '1px solid hsl(225 20% 8%)',
                }}>
                  app.krakken.io/produits
                </div>
              </div>
            </div>

            <div className="p-4 md:p-6">
              {/* Filter pills */}
              <div className="flex items-center gap-2 mb-5 flex-wrap">
                {["Smartphones", "Électroménager", "Gaming", "Beauté", "Mode"].map((cat, i) => (
                  <div key={cat} className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors" style={{
                    background: i === 0 ? 'hsl(174 72% 46% / 0.1)' : 'hsl(225 18% 7%)',
                    border: `1px solid ${i === 0 ? 'hsl(174 72% 46% / 0.2)' : 'hsl(225 20% 9%)'}`,
                    color: i === 0 ? 'hsl(174 72% 56%)' : 'hsl(210 10% 40%)',
                  }}>{cat}</div>
                ))}
                <div className="ml-auto px-3 py-1.5 rounded-lg text-[10px] font-bold" style={{
                  background: 'hsl(38 92% 56% / 0.06)',
                  border: '1px solid hsl(38 92% 56% / 0.1)',
                  color: 'hsl(38 92% 55%)',
                }}>Export Excel</div>
              </div>

              {/* Product rows */}
              {[
                { name: "Galaxy S24 Ultra 256Go", brand: "Samsung", price: "899€", sales: "127/sem", score: 98, stock: true },
                { name: "Dyson V15 Detect Absolute", brand: "Dyson", price: "549€", sales: "89/sem", score: 96, stock: true },
                { name: "PlayStation 5 Slim Digital", brand: "Sony", price: "399€", sales: "74/sem", score: 94, stock: true },
                { name: "AirPods Pro 2 USB-C", brand: "Apple", price: "229€", sales: "68/sem", score: 93, stock: false },
                { name: "Ninja Foodi MAX 9-en-1", brand: "Ninja", price: "179€", sales: "61/sem", score: 91, stock: true },
              ].map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                  className="flex items-center gap-3 md:gap-4 py-3.5 px-3 rounded-xl"
                  style={{
                    borderBottom: '1px solid hsl(225 20% 6%)',
                    background: i === 0 ? 'hsl(174 72% 46% / 0.02)' : 'transparent',
                  }}
                >
                  <div className="w-11 h-11 rounded-lg flex-shrink-0" style={{
                    background: `linear-gradient(145deg, hsl(${i * 25 + 170} 30% 16%), hsl(${i * 25 + 170} 30% 10%))`,
                    border: '1px solid hsl(225 20% 9%)',
                  }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground/80 truncate">{p.name}</span>
                      {!p.stock && (
                        <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-sm" style={{
                          background: 'hsl(348 72% 56% / 0.1)',
                          color: 'hsl(348 80% 62%)',
                          border: '1px solid hsl(348 72% 56% / 0.15)',
                        }}>RUPTURE</span>
                      )}
                    </div>
                    <span className="text-[10px] text-foreground/50 font-mono">{p.brand}</span>
                  </div>
                  <span className="text-xs font-black font-mono text-foreground/70 hidden sm:block">{p.price}</span>
                  <span className="text-[10px] font-mono font-bold hidden sm:block text-primary/70">{p.sales}</span>
                  <span className="text-xs font-bold hidden sm:block" style={{
                    color: 'hsl(162 72% 48%)',
                    textShadow: '0 0 12px hsl(162 68% 44% / 0.3)',
                  }}>⚡{p.score}</span>
                  <div className="flex gap-1">
                    <span className="px-2 py-1 rounded text-[8px] font-bold bio-amber">Ali</span>
                    <span className="px-2 py-1 rounded text-[8px] font-bold bio-cyan">Lens</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Glow underneath */}
          <div className="absolute -bottom-28 left-5 right-5 h-28 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at 50% 0%, hsl(174 72% 46% / 0.04), transparent 70%)',
          }} />
        </motion.div>
      </section>

      {/* ═══ FEATURES — Asymmetric premium grid ═══ */}
      <section id="features" className="py-16 md:py-24 px-6 md:px-8 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-14"
          >
            <h2 className="font-display font-black text-4xl md:text-6xl text-foreground max-w-2xl leading-tight">
              Chaque fonctionnalité
              <br />
              <motion.span 
                className="kraken-title"
                style={{ filter: 'drop-shadow(0 0 25px hsl(174 72% 46% / 0.2))' }}
                whileInView={{
                  filter: [
                    'drop-shadow(0 0 25px hsl(174 72% 46% / 0.15))',
                    'drop-shadow(0 0 40px hsl(174 72% 46% / 0.3))',
                    'drop-shadow(0 0 25px hsl(174 72% 46% / 0.15))',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >a une raison d'être.</motion.span>
            </h2>
          </motion.div>

          {/* Asymmetric grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Large card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-7 p-8 md:p-10 rounded-2xl relative overflow-hidden group"
              style={{
                background: 'hsl(174 72% 46% / 0.03)',
                border: '1px solid hsl(174 72% 46% / 0.06)',
              }}
            >
              <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full pointer-events-none" style={{
                background: 'radial-gradient(circle, hsl(174 72% 46% / 0.04) 0%, transparent 70%)',
              }} />
              <div className="mb-6">
                <GlowIcon icon={RefreshCw} color="174 72% 46%" size={28} />
              </div>
              <h3 className="font-display font-black text-xl md:text-2xl text-foreground mb-3">Mise à jour hebdomadaire</h3>
              <p className="text-sm text-foreground/55 leading-relaxed max-w-md">
                De nouveaux produits gagnants chaque semaine. La base évolue avec le marché français en temps réel.
              </p>
            </motion.div>

            {/* Large card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-5 p-8 md:p-10 rounded-2xl relative overflow-hidden group"
              style={{
                background: 'hsl(38 92% 56% / 0.03)',
                border: '1px solid hsl(38 92% 56% / 0.06)',
              }}
            >
              <div className="mb-6">
                <GlowIcon icon={ExternalLink} color="38 92% 56%" size={28} />
              </div>
              <h3 className="font-display font-black text-xl md:text-2xl text-foreground mb-3">Sourcing en 1 clic</h3>
              <p className="text-sm text-foreground/55 leading-relaxed">
                AliExpress + Google Lens intégrés. Sans quitter l'interface.
              </p>
            </motion.div>

            {/* 4 smaller cards */}
            {[
              { icon: Filter, title: "Filtres avancés", desc: "Catégorie, marque, prix, vendeurs.", color: "188 78% 52%" },
              { icon: AlertTriangle, title: "Alertes ruptures", desc: "Niche ouverte = opportunité détectée.", color: "348 72% 56%" },
              { icon: FileSpreadsheet, title: "Export Excel", desc: "Exporte ta sélection en un clic.", color: "262 52% 58%" },
              { icon: LayoutGrid, title: "21 catégories", desc: "Tout le spectre Cdiscount couvert.", color: "162 68% 50%" },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * i }}
                className="md:col-span-3 p-6 rounded-2xl group transition-all duration-500"
                style={{
                  background: 'hsl(225 30% 4.5%)',
                  border: '1px solid hsl(225 20% 7%)',
                }}
              >
                <div className="mb-4">
                  <GlowIcon icon={f.icon} color={f.color} />
                </div>
                <h4 className="font-display font-bold text-sm text-foreground/85 mb-1.5">{f.title}</h4>
                <p className="text-xs text-foreground/55 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" className="py-16 md:py-24 px-6 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 50% 50%, hsl(174 72% 46% / 0.03) 0%, transparent 45%)',
        }} />

        <div className="max-w-lg mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display font-black text-4xl md:text-5xl text-foreground mb-4">
              Un plan. <span className="text-foreground/50">Accès total.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-2xl p-8 md:p-10 relative overflow-hidden"
            style={{
              background: 'hsl(225 30% 4.5%)',
              border: '1px solid hsl(174 72% 46% / 0.1)',
              boxShadow: '0 0 120px -30px hsl(174 72% 46% / 0.08), 0 40px 80px -20px hsl(230 50% 2% / 0.9)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{
              background: 'linear-gradient(90deg, transparent, hsl(174 72% 46% / 0.4), transparent)',
            }} />

            <div className="text-center mb-10">
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
                style={{
                  background: 'hsl(162 68% 44% / 0.06)',
                  border: '1px solid hsl(162 68% 44% / 0.12)',
                }}
                animate={{ boxShadow: [
                  '0 0 0 0 hsl(162 68% 44% / 0)',
                  '0 0 20px -4px hsl(162 68% 44% / 0.15)',
                  '0 0 0 0 hsl(162 68% 44% / 0)',
                ]}}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-kraken-emerald animate-pulse-glow" />
                <span className="text-[11px] font-display font-bold tracking-wider" style={{ color: 'hsl(162 72% 50%)' }}>
                  Exclusif membres de la formation
                </span>
              </motion.div>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-2xl md:text-3xl font-display font-bold text-foreground/40 line-through mr-2">39,90€</span>
                <motion.span 
                  className="text-6xl md:text-7xl font-display font-black text-foreground"
                  whileInView={{
                    textShadow: [
                      '0 0 0px transparent',
                      '0 0 30px hsl(174 72% 46% / 0.2)',
                      '0 0 0px transparent',
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >9,90€</motion.span>
                <span className="text-lg text-foreground/50">/mois</span>
              </div>
            </div>

            <div className="space-y-3.5 mb-10">
              {[
                "Accès complet à la base de produits",
                "21 catégories Cdiscount",
                "Mise à jour hebdomadaire",
                "Sourcing AliExpress + Google Lens",
                "Détection des ruptures de stock",
                "Export Excel illimité",
                "Filtres avancés",
              ].map((f, i) => (
                <motion.div 
                  key={f} 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-primary/70" style={{ filter: 'drop-shadow(0 0 3px hsl(174 72% 46% / 0.3))' }} />
                  <span className="text-sm text-foreground/60">{f}</span>
                </motion.div>
              ))}
            </div>

            <Link to="/" className="block w-full py-4 rounded-xl text-center text-sm font-bold tracking-wider transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_50px_-10px_hsl(174_72%_46%_/_0.5)]" style={{
              background: 'linear-gradient(135deg, hsl(174 72% 46%), hsl(188 78% 48%))',
              color: 'hsl(230 50% 3%)',
              boxShadow: '0 0 50px -10px hsl(174 72% 46% / 0.4), inset 0 1px 0 hsl(180 80% 70% / 0.2)',
            }}>
              Rejoindre Krakken
            </Link>
            <p className="text-[10px] text-foreground/40 text-center mt-4 tracking-wide">Sans engagement · Annulation à tout moment</p>
          </motion.div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="py-16 md:py-24 px-6 md:px-8 relative overflow-hidden">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
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
                a: "On analyse les signaux d'achat réels des consommateurs français sur Cdiscount. Des données concrètes basées sur le comportement d'achat en France, pas des tendances Google ou du réchauffé US.",
              },
              {
                q: "Est-ce que ça fonctionne pour Amazon ?",
                a: "Krakken est focalisé sur Cdiscount. Cependant, les produits qui performent sur Cdiscount ont tendance à fonctionner sur d'autres marketplaces françaises. C'est un signal de marché fiable.",
              },
              {
                q: "À quelle fréquence la base est mise à jour ?",
                a: "Chaque semaine. De nouveaux produits gagnants sont ajoutés régulièrement pour que tu gardes une longueur d'avance.",
              },
              {
                q: "C'est légal ?",
                a: "Oui, totalement. On analyse des données publiquement accessibles. Il s'agit d'analyse de marché, pas de collecte de données personnelles.",
              },
              {
                q: "Je peux annuler quand je veux ?",
                a: "L'abonnement est sans engagement. Tu peux annuler à tout moment, sans justification.",
              },
            ].map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="rounded-xl px-6" style={{
                background: 'hsl(225 30% 4.5%)',
                border: '1px solid hsl(225 20% 7%)',
              }}>
                <AccordionTrigger className="text-sm font-semibold text-foreground/80 hover:no-underline py-5">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-foreground/45 leading-relaxed pb-5">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-20 md:py-28 px-6 md:px-8 relative text-center overflow-hidden">
        <InkClouds />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `
            radial-gradient(ellipse at 50% 50%, hsl(174 72% 46% / 0.05), transparent 45%),
            radial-gradient(ellipse at 30% 70%, hsl(262 52% 58% / 0.03), transparent 40%)
          `,
        }} />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative z-10"
        >
          <h2 className="font-display font-black text-foreground mb-6" style={{
            fontSize: 'clamp(2.2rem, 6vw, 5rem)',
            lineHeight: 0.95,
          }}>
            Les produits gagnants
            <br />
            <motion.span 
              className="kraken-title"
              animate={{ 
                filter: [
                  'drop-shadow(0 0 30px hsl(174 72% 46% / 0.2))',
                  'drop-shadow(0 0 50px hsl(174 72% 46% / 0.4))',
                  'drop-shadow(0 0 30px hsl(174 72% 46% / 0.2))',
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              n'attendent pas.
            </motion.span>
          </h2>
          <p className="text-sm text-foreground/50 mb-12 max-w-md mx-auto">
            Pendant que tu cherches, d'autres vendent.
          </p>
          <Link to="/" className="group inline-flex items-center gap-3 px-14 py-5 rounded-full text-sm font-bold tracking-wider transition-all duration-500 hover:scale-105 hover:shadow-[0_0_60px_-10px_hsl(174_72%_46%_/_0.6)]" style={{
            background: 'linear-gradient(135deg, hsl(174 72% 46%), hsl(188 78% 48%))',
            color: 'hsl(230 50% 3%)',
            boxShadow: '0 0 100px -20px hsl(174 72% 46% / 0.4), inset 0 1px 0 hsl(180 80% 70% / 0.2)',
          }}>
            Rejoindre Krakken
            <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </motion.div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-8 px-6 md:px-8" style={{
        borderTop: '1px solid hsl(225 20% 5%)',
        background: 'hsl(230 50% 3%)',
      }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={krakkenLogo} alt="" className="w-5 h-5 object-contain" style={{ opacity: 0.25, filter: 'drop-shadow(0 0 4px hsl(174 72% 46% / 0.3))' }} />
            <span className="text-[11px] text-foreground/40">© 2026 Krakken</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-[10px] text-foreground/35 hover:text-foreground/60 transition-colors">Mentions légales</a>
            <a href="#" className="text-[10px] text-foreground/35 hover:text-foreground/60 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
