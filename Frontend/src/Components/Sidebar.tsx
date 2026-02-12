import { Link, useLocation } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { LogOut } from 'lucide-react';

export interface SidebarItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  items: SidebarItem[];
  onLogout: () => void;
  title?: string;
}

export function Sidebar({ items, onLogout, title = 'PublicVoice' }: SidebarProps) {
  const location = useLocation();
  const titleParts = title.split(/(?=[A-Z])/);

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col shrink-0 font-sans">
      <div className="p-6 border-b border-slate-100">
        <Link to="/" className="text-xl font-bold flex items-baseline gap-0.5">
          <span className="text-slate-800">{titleParts[0]}</span>
          <span className="text-[var(--color-primary)]">{titleParts.slice(1).join('')}</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
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
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
