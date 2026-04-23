import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";

const Auth = lazy(() => import("./pages/Auth"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Index = lazy(() => import("./pages/Index"));
const Produits = lazy(() => import("./pages/Produits"));
const Calculateur = lazy(() => import("./pages/Calculateur"));
const Profil = lazy(() => import("./pages/Profil"));
const Favoris = lazy(() => import("./pages/Favoris"));
const Abonnement = lazy(() => import("./pages/Abonnement"));
const CGV = lazy(() => import("./pages/CGV"));
const Confidentialite = lazy(() => import("./pages/Confidentialite"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));
const FAQ = lazy(() => import("./pages/FAQ"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: 'hsl(230 50% 3%)' }}>
    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

const Protected = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/connexion" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/cgv" element={<CGV />} />
              <Route path="/confidentialite" element={<Confidentialite />} />
              <Route path="/mentions-legales" element={<MentionsLegales />} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />
              <Route path="/dashboard" element={<Protected><Index /></Protected>} />
              <Route path="/produits" element={<Protected><Produits /></Protected>} />
              <Route path="/calculateur" element={<Protected><Calculateur /></Protected>} />
              <Route path="/analytics" element={<Navigate to="/calculateur" replace />} />
              <Route path="/profil" element={<Protected><Profil /></Protected>} />
              <Route path="/favoris" element={<Protected><Favoris /></Protected>} />
              <Route path="/abonnement" element={<Protected><Abonnement /></Protected>} />
              <Route path="/faq" element={<Protected><FAQ /></Protected>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
