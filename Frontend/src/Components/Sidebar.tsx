import { Link, useLocation } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react'; // only for types
import { LogOut } from 'lucide-react'; // component/value import

const PRIMARY = '#0066CC';
const SLATE_800 = '#1E293B';
const SLATE_500 = '#64748B';

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

  // Split title into words for optional coloring
  const titleParts = title.split(/(?=[A-Z])/); // splits on uppercase letters

  return (
    <aside
      className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col shrink-0"
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      {/* Header / Title */}
      <div className="p-6 border-b border-slate-100">
        <Link to="/" className="text-xl font-bold">
          {titleParts.map((part, index) => (
            <span
              key={index}
              style={{ color: index === 1 ? PRIMARY : SLATE_800 }}
            >
              {part}
            </span>
          ))}
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive ? 'bg-blue-50' : 'hover:bg-slate-50'
              }`}
              style={{ color: isActive ? PRIMARY : SLATE_500 }}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-red-50"
          style={{ color: SLATE_500 }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
