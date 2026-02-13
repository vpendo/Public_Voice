import { Link, useLocation } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { LogOut, X } from 'lucide-react';

export interface SidebarItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  items: SidebarItem[];
  onLogout: () => void;
  title?: string;
  /** When set, sidebar becomes a drawer on small screens. Open state is controlled by parent. */
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ items, onLogout, title = 'PublicVoice', mobileOpen = false, onMobileClose }: SidebarProps) {
  const location = useLocation();
  const titleParts = title.split(/(?=[A-Z])/);
  const isAdmin = title.toLowerCase().includes('admin');
  const accent = isAdmin ? 'rwanda' : 'primary';
  const closeDrawer = () => onMobileClose?.();

  const linkClass = (isActive: boolean) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
      isActive
        ? accent === 'rwanda'
          ? 'bg-[var(--rwanda-blue-light)] text-[var(--rwanda-blue)]'
          : 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
    }`;

  const content = (
    <>
      <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between">
        <Link
          to={isAdmin ? '/admin/dashboard' : '/'}
          className="text-lg md:text-xl font-bold flex items-baseline gap-0.5"
          onClick={closeDrawer}
        >
          <span className="text-slate-800">{titleParts[0]}</span>
          <span
            className={
              accent === 'rwanda'
                ? 'text-[var(--rwanda-blue)]'
                : 'text-[var(--color-primary)]'
            }
          >
            {titleParts.slice(1).join('')}
          </span>
        </Link>
        {onMobileClose && (
          <button
            type="button"
            onClick={onMobileClose}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        )}
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={linkClass(isActive)}
              onClick={closeDrawer}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-100">
        <button
          type="button"
          onClick={() => {
            onLogout();
            closeDrawer();
          }}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </>
  );

  const isDrawer = typeof onMobileClose === 'function';

  if (isDrawer) {
    return (
      <>
        {/* Backdrop - mobile only */}
        <div
          className={`fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden ${
            mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={onMobileClose}
          aria-hidden
        />
        {/* Sidebar - drawer on mobile, normal on lg+ */}
        <aside
          className={`
            w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col shrink-0 font-sans
            fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
            transform transition-transform duration-200 ease-out
            ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {content}
        </aside>
      </>
    );
  }

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col shrink-0 font-sans hidden lg:flex">
      {content}
    </aside>
  );
}
