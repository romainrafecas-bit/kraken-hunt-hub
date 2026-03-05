import KrakkenSidebar from "@/components/dashboard/KrakkenSidebar";
import ProductAnalysis from "@/components/dashboard/ProductAnalysis";
import { motion } from "framer-motion";
import { Radar } from "lucide-react";

const Produits = () => {
  return (
    <div className="min-h-screen abyss-gradient">
      <KrakkenSidebar />
      <main className="pl-16 xl:pl-56 p-4 lg:p-6 space-y-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-panel-glow p-5 relative overflow-hidden"
        >
          {/* Atmospheric ink */}
          <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at 100% 0%, hsl(262 52% 58% / 0.06), transparent 60%)',
          }} />
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
              background: 'hsl(262 52% 58% / 0.12)',
              border: '1px solid hsl(262 52% 58% / 0.2)',
              boxShadow: '0 0 12px -2px hsl(262 52% 58% / 0.2)',
            }}>
              <Radar className="w-5 h-5" style={{
                color: 'hsl(262 72% 72%)',
                filter: 'drop-shadow(0 0 4px hsl(262 52% 58% / 0.4))',
              }} />
            </div>
            <div>
              <h1 className="kraken-title text-xl">Produits traqués</h1>
              <p className="text-sm text-muted-foreground">Catalogue des proies repérées sur Cdiscount</p>
            </div>
          </div>
        </motion.div>

        <ProductAnalysis />
      </main>
    </div>
  );
};

export default Produits;
