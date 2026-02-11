import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../../../Components/Sidebar';
import { useAuth } from '../../../contexts/AuthContext';
import { LayoutDashboard, FileText, MessageSquare, Users } from 'lucide-react';

const sidebarItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/issues', label: 'All Issues', icon: FileText },
  { path: '/admin/respond', label: 'Respond to Issues', icon: MessageSquare },
  { path: '/admin/users', label: 'Users', icon: Users },
];

export function AdminDashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-50" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <Sidebar items={sidebarItems} onLogout={handleLogout} />
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}