/**
 * If the current user is an admin, redirect to Admin Dashboard.
 * Wraps the User dashboard so admins never stay on /user (fixes redirect-after-login).
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface RedirectAdminToAdminProps {
  children: React.ReactNode;
}

export function RedirectAdminToAdmin({ children }: RedirectAdminToAdminProps) {
  const { isAdmin, user, isLoadingUser } = useAuth();

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (user != null && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}
