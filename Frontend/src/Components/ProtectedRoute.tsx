import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const REDIRECT_TO_ADMIN_KEY = 'publicvoice_redirect_to_admin';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, isLoadingUser, isAdmin, user } = useAuth();
  const location = useLocation();

  // Clear "redirect to admin" flag once we have user so we don't block redirect on next visit
  useEffect(() => {
    if (user != null) {
      sessionStorage.removeItem(REDIRECT_TO_ADMIN_KEY);
    }
  }, [user]);

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // On admin route: wait for user to load so we have the correct role (don't redirect admin to user dashboard)
  if (requireAdmin && user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    sessionStorage.removeItem(REDIRECT_TO_ADMIN_KEY);
    return <Navigate to="/user/dashboard" replace />;
  }

  return <>{children}</>;
}
