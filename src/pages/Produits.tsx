import KrakkenSidebar from "@/components/dashboard/KrakkenSidebar";
import ProductAnalysis from "@/components/dashboard/ProductAnalysis";
import { motion } from "framer-motion";
import { Package } from "lucide-react";

const Produits = () => {
  return (
    <div className="min-h-screen abyss-gradient">
      <KrakkenSidebar />
      <main className="pl-16 xl:pl-56 p-4 lg:p-6 space-y-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-coral/12 flex items-center justify-center">
              <Package className="w-4 h-4 text-coral" />
            </div>
            <div>
              <h1 className="font-display text-xl font-extrabold text-foreground">Produits</h1>
              <p className="text-sm text-muted-foreground">Catalogue complet des produits analysés sur Cdiscount</p>
            </div>
          </div>
        </motion.div>

        <ProductAnalysis />
      </main>
    </div>
  );
};

export default Produits;
