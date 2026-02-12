import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { User, Mail, Lock, KeyRound } from 'lucide-react';

export function Profile() {
  const { user } = useAuth();
  const [message, setMessage] = useState<string | null>(null);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Password change will be available in a future update.');
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Profile</h1>
        <p className="text-slate-500 mt-0.5">Your account information.</p>
      </div>

      <div className="max-w-xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/80">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Account</h2>
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
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">Full name</dt>
                <dd className="mt-1 text-slate-900 font-medium">{user?.full_name ?? '—'}</dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">Email</dt>
                <dd className="mt-1 text-slate-900 font-medium">{user?.email ?? '—'}</dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">Role</dt>
                <dd className="mt-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                    {user?.role ?? '—'}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center gap-2">
            <KeyRound size={18} className="text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-700">Change password</h3>
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
                  Current password
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
                  New password
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
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                Update password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
