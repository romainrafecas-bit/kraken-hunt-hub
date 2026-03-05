import { motion } from "framer-motion";
import abyssBg from "@/assets/abyss-bg.jpg";
import krakkenLogo from "@/assets/krakken-logo.png";

const DashboardHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative rounded-2xl overflow-hidden h-40"
      style={{
        border: '1px solid hsl(174 72% 46% / 0.08)',
        boxShadow: '0 0 40px -12px hsl(174 72% 46% / 0.1), 0 4px 32px -8px hsl(228 50% 2% / 0.6)',
      }}
    >
      <img src={abyssBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.07]" />
      
      {/* Multi-layered atmospheric gradient */}
      <div className="absolute inset-0" style={{
        background: `
          linear-gradient(135deg, hsl(228 42% 6% / 0.97) 0%, hsl(225 32% 8% / 0.85) 50%, hsl(228 42% 6% / 0.6) 100%),
          radial-gradient(ellipse at 80% 20%, hsl(262 52% 58% / 0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 20% 80%, hsl(174 72% 46% / 0.06) 0%, transparent 50%)
        `,
      }} />

      <div className="relative z-10 h-full flex items-center justify-between px-6">
        <div className="flex items-center gap-5">
          <motion.img
            src={krakkenLogo}
            alt="Krakken"
            className="w-20 h-20 object-contain hidden md:block"
            style={{
              filter: 'drop-shadow(0 0 16px hsl(174 72% 46% / 0.35)) drop-shadow(0 0 32px hsl(262 52% 58% / 0.15))'
            }}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <div>
            <h2 className="kraken-title text-2xl mb-1">
              Tableau de bord
            </h2>
            <p className="text-sm text-secondary-foreground">
              Analyse des profondeurs de <span className="font-semibold" style={{
                color: 'hsl(174 72% 56%)',
                textShadow: '0 0 8px hsl(174 72% 46% / 0.3)',
              }}>Cdiscount</span>
            </p>
            <div className="flex items-center gap-4 mt-2">
              <span className="bio-badge bio-teal">54 892 produits</span>
              <span className="bio-badge bio-violet">12 catégories</span>
              <span className="bio-badge bio-cyan">847 marques</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-5">
          <div className="flex items-center gap-4 px-4 py-2.5 rounded-xl" style={{
            background: 'hsl(225 32% 8% / 0.6)',
            border: '1px solid hsl(174 72% 46% / 0.1)',
            boxShadow: '0 0 20px -8px hsl(174 72% 46% / 0.1)',
          }}>
            <div className="text-right">
              <p className="text-[0.55rem] text-muted-foreground uppercase tracking-[0.15em]">Traqués</p>
              <p className="font-display text-sm font-black" style={{
                color: 'hsl(174 72% 56%)',
                textShadow: '0 0 10px hsl(174 72% 46% / 0.4)',
              }}>10</p>
            </div>
            <div className="tentacle-line-v h-8" />
            <div className="text-right">
              <p className="text-[0.55rem] text-muted-foreground uppercase tracking-[0.15em]">En surface</p>
              <p className="font-display text-sm font-black" style={{
                color: 'hsl(162 72% 52%)',
                textShadow: '0 0 10px hsl(162 68% 44% / 0.4)',
              }}>8</p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full" style={{
              backgroundColor: 'hsl(174 72% 46%)',
              animation: 'bioluminescence 3s ease-in-out infinite',
              boxShadow: '0 0 10px 3px hsl(174 72% 46% / 0.5)',
            }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
