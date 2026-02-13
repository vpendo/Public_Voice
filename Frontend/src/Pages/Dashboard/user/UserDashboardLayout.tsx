import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../../../Components/Sidebar';
import { useAuth } from '../../../contexts/AuthContext';
import { LayoutDashboard, Send, FileText, User, Menu } from 'lucide-react';

const sidebarItems = [
  { path: '/user/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/user/submit', label: 'Submit Issue', icon: Send },
  { path: '/user/issues', label: 'My Issues', icon: FileText },
  { path: '/user/profile', label: 'Profile', icon: User },
];

export function UserDashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      <Sidebar
        items={sidebarItems}
        onLogout={handleLogout}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <span className="text-sm font-semibold text-slate-700">PublicVoice</span>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
