import { useEffect, useState } from 'react';
import { apiClient } from '../../../api/client';
import { Users as UsersIcon } from 'lucide-react';

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

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Users</h1>
      <p className="text-slate-500 mb-8">List of registered users.</p>

      {loading && <p className="text-slate-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && users.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
          <UsersIcon className="w-16 h-16 mx-auto mb-4 text-[#0066CC]" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">No users yet</h2>
          <p className="text-slate-500">Registered users will appear here.</p>
        </div>
      )}

      {!loading && !error && users.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">Name</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">Email</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{u.full_name}</td>
                    <td className="px-6 py-4 text-slate-600">{u.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          u.role === 'Admin' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
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