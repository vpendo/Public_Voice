import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { User } from 'lucide-react';

export function Profile() {
  const { user } = useAuth();
  const [message, setMessage] = useState<string | null>(null);

  // Change password could call a backend endpoint; for MVP we just show a placeholder
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Password change will be available in a future update.');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Profile</h1>
      <p className="text-slate-500 mb-8">Your account information.</p>

      <div className="max-w-xl space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: '#0066CC' }}
            >
              <User size={28} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{user?.full_name ?? '—'}</h2>
              <p className="text-slate-500">{user?.email ?? '—'}</p>
            </div>
          </div>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-slate-500">Full name</dt>
              <dd className="text-slate-900">{user?.full_name ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Email</dt>
              <dd className="text-slate-900">{user?.email ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Role</dt>
              <dd className="text-slate-900">{user?.role ?? '—'}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Change password</h3>
          {message && (
            <p className="mb-4 p-3 rounded-xl bg-blue-50 text-blue-800 text-sm">{message}</p>
          )}
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 mb-1">
                Current password
              </label>
              <input
                type="password"
                id="currentPassword"
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1">
                New password
              </label>
              <input
                type="password"
                id="newPassword"
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-white font-medium"
              style={{ backgroundColor: '#0066CC' }}
            >
              Update password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}