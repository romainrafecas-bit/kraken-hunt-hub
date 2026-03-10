import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ChevronRight, ArrowDown, Clock, Target, Zap, Search, 
  Package, ExternalLink, AlertTriangle, Filter, FileSpreadsheet, 
  LayoutGrid, RefreshCw, Eye, ShoppingCart, CheckCircle2,
  HelpCircle
} from "lucide-react";
import krakkenLogo from "@/assets/krakken-logo.png";
import { Tentacle, Particles } from "@/components/landing/KrakenAnimations";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Landing = () => {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'hsl(228 42% 3%)' }}>

      {/* ═══ NAV ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{
        background: 'hsl(228 42% 3% / 0.7)',
        backdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid hsl(174 72% 46% / 0.06)',
      }}>
        <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={krakkenLogo} alt="Krakken" className="w-8 h-8 object-contain" style={{
              filter: 'drop-shadow(0 0 8px hsl(174 72% 46% / 0.5))',
            }} />
            <span className="kraken-title text-base font-black tracking-wider">KRAKKEN</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#pricing" className="text-sm text-foreground/70 hover:text-foreground transition-colors hidden sm:block">Tarifs</a>
            <a href="#faq" className="text-sm text-foreground/70 hover:text-foreground transition-colors hidden sm:block">FAQ</a>
            <Link to="/" className="px-5 py-2 rounded-full text-xs font-bold tracking-wide uppercase transition-all duration-300 hover:scale-105" style={{
              background: 'linear-gradient(135deg, hsl(174 72% 46%), hsl(188 78% 48%))',
              color: 'hsl(228 42% 4%)',
              boxShadow: '0 0 20px -4px hsl(174 72% 46% / 0.4)',
            }}>
              Accéder à la base
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <Particles />
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse at 50% 30%, hsl(174 72% 46% / 0.06) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 80%, hsl(262 52% 58% / 0.04) 0%, transparent 50%)
          `,
        }} />

        <div className="relative z-10 px-6 md:px-8 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
            style={{
              background: 'hsl(174 72% 46% / 0.08)',
              border: '1px solid hsl(174 72% 46% / 0.15)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-xs font-semibold text-primary">+500 produits analysés chaque semaine</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-black leading-[1.05] tracking-tight mb-6"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}
          >
            <span className="text-foreground">Arrête de chercher.</span>
            <br />
            <span className="kraken-title" style={{ filter: 'drop-shadow(0 0 30px hsl(174 72% 46% / 0.3))' }}>
              Trouve ce qui se vend.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto text-lg leading-relaxed mb-10 text-foreground/70"
          >
            Krakken te livre chaque semaine les produits qui se vendent <strong className="text-foreground">vraiment</strong> sur Cdiscount. 
            Basé sur des achats réels, pas des suppositions. Trouve ton prochain produit gagnant en <strong className="text-primary">5 minutes</strong> au lieu de 5 heures.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/" className="group inline-flex items-center gap-3 px-10 py-4 rounded-full text-sm font-bold tracking-wide transition-all duration-300 hover:scale-105" style={{
              background: 'linear-gradient(135deg, hsl(174 72% 46%), hsl(188 78% 48%))',
              color: 'hsl(228 42% 4%)',
              boxShadow: '0 0 60px -10px hsl(174 72% 46% / 0.5)',
            }}>
              Voir les produits
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <span className="text-xs text-foreground/40">1 mois offert · Puis 29,90€/mois</span>
          </motion.div>

          {/* Dashboard preview screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-16 relative"
          >
            <div className="rounded-2xl overflow-hidden relative" style={{
              border: '1px solid hsl(174 72% 46% / 0.1)',
              boxShadow: '0 0 100px -25px hsl(174 72% 46% / 0.15), 0 40px 80px -20px hsl(228 50% 2% / 0.8)',
              background: 'hsl(225 32% 6%)',
            }}>
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
                  <div className="px-4 py-1 rounded-md text-[10px] font-mono text-foreground/40" style={{
                    background: 'hsl(225 20% 8%)',
                  }}>
                    app.krakken.io/produits
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-5">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {["Smartphones", "Électroménager", "Gaming", "Beauté"].map((cat, i) => (
                    <div key={cat} className="px-3 py-1.5 rounded-lg text-[10px] font-bold" style={{
                      background: i === 0 ? 'hsl(174 72% 46% / 0.1)' : 'hsl(225 18% 10%)',
                      border: `1px solid ${i === 0 ? 'hsl(174 72% 46% / 0.2)' : 'hsl(225 20% 12%)'}`,
                      color: i === 0 ? 'hsl(174 72% 56%)' : 'hsl(210 10% 55%)',
                    }}>{cat}</div>
                  ))}
                  <div className="ml-auto px-3 py-1.5 rounded-lg text-[10px] font-bold" style={{
                    background: 'hsl(38 92% 56% / 0.1)',
                    border: '1px solid hsl(38 92% 56% / 0.15)',
                    color: 'hsl(38 92% 64%)',
                  }}>📊 Export Excel</div>
                </div>

                {[
                  { name: "Galaxy S24 Ultra 256Go", brand: "Samsung", price: "899€", sales: "127 achats/sem", score: 98, stock: true },
                  { name: "Dyson V15 Detect Absolute", brand: "Dyson", price: "549€", sales: "89 achats/sem", score: 96, stock: true },
                  { name: "PlayStation 5 Slim", brand: "Sony", price: "399€", sales: "74 achats/sem", score: 94, stock: true },
                  { name: "AirPods Pro 2 USB-C", brand: "Apple", price: "229€", sales: "68 achats/sem", score: 93, stock: false },
                  { name: "Ninja Foodi MAX 9-en-1", brand: "Ninja", price: "179€", sales: "61 achats/sem", score: 91, stock: true },
                ].map((p, i) => (
                  <div key={p.name} className="flex items-center gap-3 md:gap-4 py-3 px-2 rounded-xl" style={{
                    borderBottom: '1px solid hsl(225 20% 8%)',
                    background: i === 0 ? 'hsl(174 72% 46% / 0.03)' : 'transparent',
                  }}>
                    <div className="w-10 h-10 rounded-lg flex-shrink-0" style={{
                      background: `linear-gradient(135deg, hsl(${i * 30 + 170} 40% 20%), hsl(${i * 30 + 170} 40% 15%))`,
                      border: '1px solid hsl(225 20% 12%)',
                    }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground truncate">{p.name}</span>
                        {!p.stock && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bio-rose">RUPTURE</span>}
                      </div>
                      <span className="text-[10px] text-foreground/50 font-mono">{p.brand}</span>
                    </div>
                    <span className="text-xs font-black font-mono text-foreground hidden sm:block">{p.price}</span>
                    <span className="text-[10px] font-mono font-bold hidden sm:block text-primary">{p.sales}</span>
                    <span className="text-xs font-bold hidden sm:block" style={{
                      color: 'hsl(162 72% 52%)',
                      textShadow: '0 0 8px hsl(162 68% 44% / 0.3)',
                    }}>⚡{p.score}</span>
                    <div className="flex gap-1">
                      <span className="px-2 py-1 rounded text-[9px] font-bold bio-amber">Ali</span>
                      <span className="px-2 py-1 rounded text-[9px] font-bold bio-cyan">Lens</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-20 left-10 right-10 h-20 pointer-events-none" style={{
              background: 'radial-gradient(ellipse at 50% 0%, hsl(174 72% 46% / 0.06), transparent 70%)',
            }} />
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="w-4 h-4 text-foreground/30" />
        </motion.div>
      </section>

      {/* Tentacles */}
      <Tentacle side="left" top="110vh" color="174 72% 46%" delay={0} size={280} />
      <Tentacle side="right" top="220vh" color="262 52% 58%" delay={1.5} size={300} />
      <Tentacle side="left" top="350vh" color="188 78% 52%" delay={0.8} size={240} />
      <Tentacle side="right" top="500vh" color="174 72% 46%" delay={2} size={260} />

      {/* ═══ PROBLÈME ═══ */}
      <section className="py-24 md:py-32 px-6 md:px-8 relative" style={{ background: 'hsl(228 42% 3%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-mono uppercase tracking-widest text-primary/70 mb-6">Le problème</p>
            <h2 className="font-display font-black text-3xl md:text-5xl text-foreground mb-8 leading-tight">
              Tu passes combien d'heures par semaine
              <br />
              <span className="kraken-title">à chercher ton prochain produit ?</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto space-y-6 text-left"
          >
            {[
              { icon: Clock, text: "Tu scrolles Cdiscount, Amazon, AliExpress pendant des heures. Tu testes au pif. Tu pries." },
              { icon: AlertTriangle, text: "Tu te retrouves à vendre les mêmes trucs que tout le monde. Résultat : pas de ventes, pas de marge." },
              { icon: Target, text: "Y'a quasiment aucun outil fiable pour savoir ce qui se vend VRAIMENT en France. Tout est basé sur le marché US." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-4 p-5 rounded-xl"
                style={{
                  background: 'hsl(348 72% 56% / 0.04)',
                  border: '1px solid hsl(348 72% 56% / 0.08)',
                }}
              >
                <item.icon className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'hsl(348 80% 66%)' }} />
                <p className="text-sm text-foreground/80 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ SOLUTION — 3 étapes ═══ */}
      <section className="py-24 md:py-32 px-6 md:px-8 relative" style={{ background: 'hsl(228 42% 3%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px tentacle-line" />
        
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-sm font-mono uppercase tracking-widest text-primary/70 mb-6">La solution</p>
            <h2 className="font-display font-black text-3xl md:text-5xl text-foreground mb-4">
              3 étapes. <span className="kraken-title">5 minutes.</span>
            </h2>
            <p className="text-foreground/60 max-w-lg mx-auto">
              Tu ouvres Krakken, tu filtres, tu trouves ton produit. C'est tout.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                num: "01",
                icon: Search,
                title: "On détecte",
                body: "On analyse des milliers de signaux d'achat sur Cdiscount pour repérer les produits que les gens achètent encore et encore.",
                color: "174 72% 46%",
              },
              {
                num: "02",
                icon: Package,
                title: "On te livre tout",
                body: "Image, prix, marque, catégorie, nombre de vendeurs, stock. Tout est prêt, pas besoin de chercher.",
                color: "262 52% 58%",
              },
              {
                num: "03",
                icon: ShoppingCart,
                title: "Tu sources et tu vends",
                body: "En un clic, trouve le fournisseur sur AliExpress ou via Google Lens. T'as plus qu'à lancer.",
                color: "38 92% 56%",
              },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative p-8 rounded-2xl group hover:scale-[1.02] transition-transform duration-300"
                style={{
                  background: `hsl(${step.color} / 0.04)`,
                  border: `1px solid hsl(${step.color} / 0.1)`,
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-px" style={{
                  background: `linear-gradient(90deg, transparent, hsl(${step.color} / 0.5), transparent)`,
                }} />
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{
                  background: `hsl(${step.color} / 0.1)`,
                  border: `1px solid hsl(${step.color} / 0.2)`,
                  boxShadow: `0 0 30px -8px hsl(${step.color} / 0.3)`,
                }}>
                  <step.icon className="w-6 h-6" style={{
                    color: `hsl(${step.color})`,
                    filter: `drop-shadow(0 0 6px hsl(${step.color} / 0.5))`,
                  }} />
                </div>
                <span className="text-xs font-mono font-bold mb-3 block" style={{ color: `hsl(${step.color} / 0.5)` }}>
                  Étape {step.num}
                </span>
                <h3 className="font-display font-black text-xl text-foreground mb-3">{step.title}</h3>
                <p className="text-sm text-foreground/65 leading-relaxed">{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES GRID ═══ */}
      <section className="py-24 md:py-32 px-6 md:px-8 relative" style={{ background: 'hsl(228 42% 3%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px tentacle-line" />
        
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display font-black text-3xl md:text-4xl text-foreground mb-4">
              Tout ce qu'il faut.
              <br />
              <span className="kraken-title">Rien de superflu.</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: RefreshCw, title: "Mise à jour chaque semaine", desc: "De nouveaux produits gagnants livrés chaque semaine. La base évolue en continu.", color: "174 72% 46%" },
              { icon: Filter, title: "Filtres avancés", desc: "Par catégorie, marque, prix, nombre de vendeurs. Trouve exactement ce que tu cherches.", color: "188 78% 52%" },
              { icon: ExternalLink, title: "Sourcing en 1 clic", desc: "Bouton AliExpress + Google Lens intégrés. Pas besoin de quitter l'app.", color: "38 92% 56%" },
              { icon: AlertTriangle, title: "Détection ruptures", desc: "Repère les ruptures de stock chez la concurrence avant tout le monde. Niche ouverte = opportunité.", color: "348 72% 56%" },
              { icon: FileSpreadsheet, title: "Export Excel", desc: "Exporte ta sélection en un clic. Partage-la avec ton équipe ou ton agent de sourcing.", color: "262 52% 58%" },
              { icon: LayoutGrid, title: "21 catégories", desc: "De l'électroménager au gaming, en passant par la mode, la beauté et les jouets.", color: "162 68% 50%" },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl group hover:scale-[1.02] transition-transform duration-300"
                style={{
                  background: 'hsl(225 32% 6% / 0.6)',
                  border: '1px solid hsl(225 20% 10%)',
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{
                  background: `hsl(${f.color} / 0.1)`,
                  border: `1px solid hsl(${f.color} / 0.15)`,
                }}>
                  <f.icon className="w-5 h-5" style={{ color: `hsl(${f.color})` }} />
                </div>
                <h3 className="font-display font-bold text-sm text-foreground mb-2">{f.title}</h3>
                <p className="text-xs text-foreground/55 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF / CHIFFRES ═══ */}
      <section className="py-20 px-6 md:px-8 relative" style={{ background: 'hsl(228 42% 3%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px tentacle-line" />
        
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display font-black text-3xl md:text-4xl text-foreground">
              En chiffres.
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { val: "+500", label: "Produits dans la base", icon: Eye },
              { val: "21", label: "Catégories analysées", icon: LayoutGrid },
              { val: "1x", label: "Mise à jour par semaine", icon: RefreshCw },
              { val: "1 clic", label: "Pour sourcer sur Ali", icon: Zap },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl"
                style={{
                  background: 'hsl(174 72% 46% / 0.03)',
                  border: '1px solid hsl(174 72% 46% / 0.06)',
                }}
              >
                <s.icon className="w-5 h-5 mx-auto mb-3 text-primary" />
                <span className="font-display font-black text-3xl md:text-4xl text-primary block mb-1" style={{
                  textShadow: '0 0 30px hsl(174 72% 46% / 0.3)',
                }}>{s.val}</span>
                <span className="text-xs text-foreground/55 font-medium">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" className="py-24 md:py-32 px-6 md:px-8 relative" style={{ background: 'hsl(228 42% 3%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px tentacle-line" />
        
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-black text-3xl md:text-4xl text-foreground mb-3">Un prix. Un accès.</h2>
            <p className="text-foreground/55">Pas 15 options. Un plan simple et clair.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-8 relative overflow-hidden"
            style={{
              background: 'hsl(174 72% 46% / 0.05)',
              border: '1px solid hsl(174 72% 46% / 0.2)',
              boxShadow: '0 0 80px -20px hsl(174 72% 46% / 0.15)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{
              background: 'linear-gradient(90deg, transparent, hsl(174 72% 46% / 0.6), transparent)',
            }} />
            
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" style={{
                background: 'hsl(162 68% 44% / 0.12)',
                border: '1px solid hsl(162 68% 44% / 0.2)',
              }}>
                <Zap className="w-3 h-3" style={{ color: 'hsl(162 72% 52%)' }} />
                <span className="text-[11px] font-bold" style={{ color: 'hsl(162 72% 52%)' }}>1 mois offert</span>
              </div>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl md:text-6xl font-display font-black text-foreground">29,90€</span>
                <span className="text-lg text-foreground/50">/mois</span>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              {[
                "Accès à toute la base de produits",
                "21 catégories Cdiscount",
                "Mise à jour chaque semaine",
                "Sourcing AliExpress + Google Lens en 1 clic",
                "Détection des ruptures de stock",
                "Export Excel",
                "Filtres avancés (catégorie, marque, prix…)",
              ].map(f => (
                <div key={f} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-primary" />
                  <span className="text-sm text-foreground/80">{f}</span>
                </div>
              ))}
            </div>

            <Link to="/" className="block w-full py-4 rounded-xl text-center text-sm font-bold transition-all duration-300 hover:scale-[1.02]" style={{
              background: 'linear-gradient(135deg, hsl(174 72% 46%), hsl(188 78% 48%))',
              color: 'hsl(228 42% 4%)',
              boxShadow: '0 0 40px -8px hsl(174 72% 46% / 0.4)',
            }}>
              Commencer maintenant — 1 mois gratuit
            </Link>
            <p className="text-[11px] text-foreground/35 text-center mt-3">Annulation possible à tout moment. Sans engagement.</p>
          </motion.div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="py-24 md:py-32 px-6 md:px-8 relative" style={{ background: 'hsl(228 42% 3%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px tentacle-line" />
        
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-black text-3xl md:text-4xl text-foreground mb-3">Questions fréquentes</h2>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-3">
            {[
              {
                q: "C'est quoi Krakken exactement ?",
                a: "Krakken est une base de données de produits qui se vendent sur Cdiscount, mise à jour chaque semaine. On détecte les produits avec le plus d'achats récurrents et on te les livre avec toutes les infos pour les sourcer et les vendre.",
              },
              {
                q: "Comment vous savez ce qui se vend ?",
                a: "On analyse les signaux d'achat réels des consommateurs français sur Cdiscount. Pas des tendances Google, pas du réchauffé US. Des données concrètes basées sur les achats en France.",
              },
              {
                q: "Est-ce que ça marche pour Amazon aussi ?",
                a: "Pour l'instant, Krakken est focalisé sur Cdiscount. Mais les produits qui marchent sur Cdiscount marchent souvent sur d'autres marketplaces. C'est un signal de marché fiable pour la France.",
              },
              {
                q: "À quelle fréquence la base est mise à jour ?",
                a: "Chaque semaine. Tu reçois de nouveaux produits gagnants régulièrement pour garder une longueur d'avance.",
              },
              {
                q: "C'est légal ?",
                a: "Oui. On analyse des données publiquement accessibles. On ne scrape pas de données personnelles. C'est de l'analyse de marché, point.",
              },
              {
                q: "Je peux annuler quand je veux ?",
                a: "Oui. Sans engagement, tu peux annuler ton abonnement à tout moment. Pas de piège.",
              },
            ].map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="rounded-xl px-6 border-none" style={{
                background: 'hsl(225 32% 6% / 0.6)',
                border: '1px solid hsl(225 20% 10%) !important',
              }}>
                <AccordionTrigger className="text-sm font-semibold text-foreground/90 hover:no-underline py-5">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-foreground/60 leading-relaxed pb-5">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-32 md:py-40 px-6 md:px-8 relative text-center" style={{ background: 'hsl(228 42% 3%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 50% 50%, hsl(174 72% 46% / 0.05), transparent 60%)',
        }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          <h2 className="font-display font-black text-foreground mb-4" style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
          }}>
            Les produits gagnants sont là.
            <br />
            <span className="kraken-title">T'attends quoi ?</span>
          </h2>
          <p className="text-foreground/50 mb-8 max-w-md mx-auto">
            Pendant que tu cherches, d'autres vendent. 1 mois offert pour tester.
          </p>
          <Link to="/" className="group inline-flex items-center gap-3 px-12 py-5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 hover:scale-105" style={{
            background: 'linear-gradient(135deg, hsl(174 72% 46%), hsl(188 78% 48%))',
            color: 'hsl(228 42% 4%)',
            boxShadow: '0 0 80px -15px hsl(174 72% 46% / 0.4)',
          }}>
            Accéder à la base
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-8 px-6 md:px-8" style={{
        borderTop: '1px solid hsl(225 20% 8%)',
        background: 'hsl(228 42% 3%)',
      }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={krakkenLogo} alt="" className="w-5 h-5 object-contain opacity-40" />
            <span className="text-xs text-foreground/40">© 2026 Krakken</span>
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
