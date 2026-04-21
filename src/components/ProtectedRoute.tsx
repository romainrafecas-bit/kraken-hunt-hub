import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import SubscriptionBanner from "@/components/SubscriptionBanner";

const LoadingScreen = () => (
  <div
    className="min-h-screen flex items-center justify-center"
    style={{ background: "hsl(230 50% 3%)" }}
  >
    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const { loading: subLoading, hasAccess } = useSubscription();
  const location = useLocation();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/auth" replace />;

  // Wait for subscription check before deciding
  if (subLoading) return <LoadingScreen />;

  // No access → force user to /abonnement (always allowed)
  if (!hasAccess && location.pathname !== "/abonnement") {
    return <Navigate to="/abonnement" replace />;
  }

  return (
    <>
      {/* Floating banner above sidebar layout — positioned via container in pages, but we render inline so pages without sidebar still get it */}
      <div className="fixed top-0 left-0 right-0 z-40 pl-16 xl:pl-56 px-4 lg:px-6 pt-3 pointer-events-none">
        <div className="pointer-events-auto">
          <SubscriptionBanner />
        </div>
      </div>
      {children}
    </>
  );
};

export default ProtectedRoute;
