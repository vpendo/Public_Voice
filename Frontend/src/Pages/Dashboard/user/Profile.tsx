import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { User, Mail, Lock, KeyRound } from 'lucide-react';

export function Profile() {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const [message, setMessage] = useState<string | null>(null);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(lang === 'English' ? 'Password change will be available in a future update.' : 'Guhindura ijambobanga kuzasobanukirwa mu mihindagurikire y\'igihe kizaza.');
  };

  const p = t.user.profile;

  return (
    <div className="space-y-6 font-sans">
      <div>
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
          <span className="w-1 h-4 rounded-full bg-[var(--color-primary)]" />
          {p.yourAccount}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{p.title}</h1>
        <p className="text-slate-500 mt-0.5">{p.subtitle}</p>
      </div>

      <div className="max-w-xl space-y-6">
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="h-1 bg-[var(--color-primary)]" />
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/80">
            <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-2">
              <User size={16} className="text-[var(--color-primary)]" />
              {p.account}
            </h2>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white">
                <User size={32} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{user?.full_name ?? '—'}</h3>
                <p className="text-slate-500 flex items-center gap-2 mt-0.5">
                  <Mail size={14} />
                  {user?.email ?? '—'}
                </p>
              </div>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">{p.fullName}</dt>
                <dd className="mt-1 text-slate-900 font-medium">{user?.full_name ?? '—'}</dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">{p.email}</dt>
                <dd className="mt-1 text-slate-900 font-medium">{user?.email ?? '—'}</dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">{p.role}</dt>
                <dd className="mt-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                    {user?.role ?? '—'}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center gap-2">
            <KeyRound size={18} className="text-[var(--color-primary)]" />
            <h3 className="text-sm font-semibold text-slate-700">{p.changePassword}</h3>
          </div>
          <div className="p-6">
            {message && (
              <div className="mb-4 p-4 rounded-xl bg-[var(--color-primary-light)] border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-sm">
                {message}
              </div>
            )}
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Lock size={14} />
                  {p.currentPassword}
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] bg-white"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Lock size={14} />
                  {p.newPassword}
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] bg-white"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:opacity-95 transition-opacity"
              >
                {p.updatePassword}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
