import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../../../Components/Sidebar';
import { LanguageSwitcher } from '../../../Components/LanguageSwitcher';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { LayoutDashboard, Send, FileText, User, Menu } from 'lucide-react';

export function UserDashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarItems = [
    { path: '/user/dashboard', label: t.user.sidebar.dashboard, icon: LayoutDashboard },
    { path: '/user/submit', label: t.user.sidebar.submitIssue, icon: Send },
    { path: '/user/issues', label: t.user.sidebar.myIssues, icon: FileText },
    { path: '/user/profile', label: t.user.sidebar.profile, icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-100/80 font-sans">
      <Sidebar
        items={sidebarItems}
        onLogout={handleLogout}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Rwanda flag stripe */}
        <div className="h-1 flex shrink-0">
          <div className="flex-1 h-full bg-[var(--color-primary)]" />
        </div>
        {/* Top bar: language switcher (desktop) / menu + title + switcher + citizen (mobile) */}
        <header className="flex items-center justify-between gap-3 px-4 py-3 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            <span className="lg:hidden text-sm font-semibold text-slate-700">PublicVoice</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-medium">
              {t.user.citizen}
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
