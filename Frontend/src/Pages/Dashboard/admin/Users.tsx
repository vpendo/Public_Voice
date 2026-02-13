import { useEffect, useState } from 'react';
import { apiClient } from '../../../api/client';
import { Users as UsersIcon, Mail, Shield, User } from 'lucide-react';

interface UserItem {
  id: number;
  full_name: string;
  email: string;
  role: string;
}

export function Users() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchUsers() {
      try {
        const { data } = await apiClient.get<UserItem[]>('/api/users');
        if (!cancelled) setUsers(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setError('Could not load users.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchUsers();
    return () => { cancelled = true; };
  }, []);

  const adminCount = users.filter((u) => u.role === 'Admin').length;
  const userCount = users.filter((u) => u.role === 'User').length;

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Shield className="w-4 h-4 text-[var(--rwanda-blue)]" />
            <span>Admin</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Users
          </h1>
          <p className="text-slate-500 mt-0.5">
            Registered users · {users.length} total ({adminCount} admin, {userCount} citizens)
          </p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--rwanda-blue-light)] text-[var(--rwanda-blue)] text-sm font-medium border border-[var(--rwanda-blue)]/20">
            <Shield size={16} />
            {adminCount} Admin
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium">
            <User size={16} />
            {userCount} Citizens
          </span>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 rounded-xl border-2 border-[var(--rwanda-blue)] border-t-transparent animate-spin" />
          <p className="text-slate-500 text-sm">Loading users...</p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm p-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
            <UsersIcon size={40} className="text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">No users yet</h2>
          <p className="text-slate-500 max-w-sm mx-auto">
            Registered users will appear here. Citizens can sign up from the public site.
          </p>
        </div>
      )}

      {!loading && !error && users.length > 0 && (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[32rem]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--rwanda-blue-light)] flex items-center justify-center text-[var(--rwanda-blue)]">
                          <User size={18} />
                        </div>
                        <span className="font-medium text-slate-900">{u.full_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 text-slate-600">
                        <Mail size={14} className="text-slate-400" />
                        {u.email}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          u.role === 'Admin'
                            ? 'bg-[var(--rwanda-blue-light)] text-[var(--rwanda-blue)]'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.role === 'Admin' ? <Shield size={12} /> : <User size={12} />}
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
