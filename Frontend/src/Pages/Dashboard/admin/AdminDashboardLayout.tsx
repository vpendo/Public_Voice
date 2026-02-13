import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../../../Components/Sidebar';
import { useAuth } from '../../../contexts/AuthContext';
import { LayoutDashboard, FileText, MessageSquare, Users, Menu } from 'lucide-react';

const sidebarItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/issues', label: 'All Issues', icon: FileText },
  { path: '/admin/respond', label: 'Respond to Issues', icon: MessageSquare },
  { path: '/admin/users', label: 'Users', icon: Users },
];

export function AdminDashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-100/80 font-sans">
      <Sidebar
        items={sidebarItems}
        onLogout={handleLogout}
        title="PublicVoice Admin"
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-1 flex shrink-0">
          <div className="flex-1 h-full bg-[var(--rwanda-blue)]" />
          <div className="flex-1 h-full bg-[var(--rwanda-yellow)]" />
          <div className="flex-1 h-full bg-[var(--rwanda-green)]" />
        </div>
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <span className="text-sm font-semibold text-slate-700">Admin</span>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}