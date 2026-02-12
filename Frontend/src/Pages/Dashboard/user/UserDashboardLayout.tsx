import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../../../Components/Sidebar';
import { useAuth } from '../../../contexts/AuthContext';
import { LayoutDashboard, Send, FileText, User } from 'lucide-react';

const sidebarItems = [
  { path: '/user/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/user/submit', label: 'Submit Issue', icon: Send },
  { path: '/user/issues', label: 'My Issues', icon: FileText },
  { path: '/user/profile', label: 'Profile', icon: User },
];

export function UserDashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      <Sidebar items={sidebarItems} onLogout={handleLogout} />
      <main className="flex-1 overflow-auto p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
