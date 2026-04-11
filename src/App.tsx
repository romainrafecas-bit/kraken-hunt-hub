import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";

const Index = lazy(() => import("./pages/Index"));
const Produits = lazy(() => import("./pages/Produits"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Profil = lazy(() => import("./pages/Profil"));
const Favoris = lazy(() => import("./pages/Favoris"));
const Abonnement = lazy(() => import("./pages/Abonnement"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: 'hsl(230 50% 3%)' }}>
    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Index />} />
            <Route path="/produits" element={<Produits />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/favoris" element={<Favoris />} />
            <Route path="/abonnement" element={<Abonnement />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
