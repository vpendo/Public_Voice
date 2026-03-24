import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../../../Components/Sidebar';
import { LanguageSwitcher } from '../../../Components/LanguageSwitcher';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { LayoutDashboard, FileText, MessageSquare, Users, Menu } from 'lucide-react';

export function AdminDashboardLayout() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const adminCategoryLabel = user?.admin_category
    ? (t.admin.categories as Record<string, string>)[user.admin_category] ?? user.admin_category
    : t.admin.filterAllCategories;
  const scopeLevel = (user?.admin_scope_level ?? '').toLowerCase();
  const scopeLabel =
    scopeLevel === 'cell' && user?.scope_district && user?.scope_sector && user?.scope_cell
      ? `Cell: ${user.scope_cell} (${user.scope_sector}, ${user.scope_district})`
      : scopeLevel === 'sector' && user?.scope_district && user?.scope_sector
        ? `Sector: ${user.scope_sector} (${user.scope_district})`
        : scopeLevel === 'district' && user?.scope_district
          ? `District: ${user.scope_district}`
          : scopeLevel && scopeLevel !== 'all'
            ? [user?.scope_district, user?.scope_sector, user?.scope_cell].filter(Boolean).join(' → ') || scopeLevel
            : null;
  const headerScopeText = scopeLabel || (scopeLevel === 'all' || !scopeLevel ? null : 'Scope');
  const sidebarItems = [
    { path: '/admin/dashboard', label: t.admin.sidebar.dashboard, icon: LayoutDashboard },
    { path: '/admin/issues', label: t.admin.sidebar.allIssues, icon: FileText },
    { path: '/admin/respond', label: t.admin.sidebar.respond, icon: MessageSquare },
    { path: '/admin/users', label: t.admin.sidebar.users, icon: Users },
  ];
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
          <div className="flex-1 h-full bg-[var(--color-primary)]" />
        </div>
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3 px-4 py-3 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 shrink-0 mt-0.5"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            <span className="text-sm font-semibold text-slate-700 break-words min-w-0 leading-snug">
              PublicVoice Admin
              <span className="font-normal text-slate-500"> · {adminCategoryLabel}</span>
              {headerScopeText && (
                <span className="font-normal text-slate-500"> · {headerScopeText}</span>
              )}
            </span>
          </div>
          <div className="shrink-0 self-end sm:self-auto">
            <LanguageSwitcher />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          {/* 11/12 width: consistent side margins, scales with any screen size */}
          <div className="w-11/12 mx-auto min-w-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}