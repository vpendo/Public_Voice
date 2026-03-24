/** Admin: list citizens / create scoped admins */
import { useEffect, useState, type FormEvent } from 'react';
import { apiClient } from '../../../api/client';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { Users as UsersIcon, Mail, Shield, User, Trash2, Plus, X, MapPin } from 'lucide-react';

interface UserItem {
  id: number;
  full_name: string;
  email: string;
  role: string;
  admin_scope_level?: string | null;
  scope_district?: string | null;
  scope_sector?: string | null;
  scope_cell?: string | null;
}

interface CreateAdminForm {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  admin_scope_level: 'all' | 'district' | 'sector' | 'cell' | '';
  scope_district: string;
  scope_sector: string;
  scope_cell: string;
}

interface ApiErrorPayload {
  detail?: string;
}

type ApiError = {
  response?: {
    data?: ApiErrorPayload;
  };
};

interface CreateAdminPayload {
  full_name: string;
  email: string;
  password: string;
  admin_scope_level: 'all' | 'district' | 'sector' | 'cell';
  scope_district?: string;
  scope_sector?: string;
  scope_cell?: string;
}

export function Users() {
  const { t } = useLanguage();
  const { user: currentUser } = useAuth();
  const p = t.admin.usersPage;
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [formData, setFormData] = useState<CreateAdminForm>({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    admin_scope_level: 'cell',
    scope_district: '',
    scope_sector: '',
    scope_cell: '',
  });

  useEffect(() => {
    let cancelled = false;
    async function fetchUsers() {
      try {
        // Fetch users - backend will automatically filter based on admin scope
        // Scoped admins see only users who reported in their area
        // General admin (scope_level="all") sees all users
        // SuperAdmin sees all users
        const { data } = await apiClient.get<UserItem[]>('/api/users?include_admin=true');
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

  const adminCount = users.filter((u) => u.role === 'Admin' || u.role === 'SuperAdmin').length;
  const userCount = users.filter((u) => u.role === 'User').length;
  
  // Determine if current admin is scoped or general
  const isScopedAdmin = currentUser?.admin_scope_level && 
    currentUser.admin_scope_level !== 'all' && 
    currentUser.role !== 'SuperAdmin';
  const isSuperAdmin = currentUser?.role === 'SuperAdmin';

  const roleLabel = (role: string) => {
    if (role === 'SuperAdmin') return 'Super Admin';
    if (role === 'Admin') return p.roleAdmin;
    return p.roleUser;
  };

  const handleDelete = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this admin?')) return;
    setDeletingId(userId);
    try {
      await apiClient.delete(`/api/users/admin/${userId}`);
      setUsers(users.filter((u) => u.id !== userId));
    } catch (err: unknown) {
      const apiError = err as ApiError;
      alert(apiError.response?.data?.detail || 'Failed to delete admin');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateAdmin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreateError(null);

    if (formData.password !== formData.confirm_password) {
      setCreateError('Passwords do not match');
      return;
    }

    if (formData.admin_scope_level === 'cell' && (!formData.scope_district || !formData.scope_sector || !formData.scope_cell)) {
      setCreateError('Please fill in district, sector, and cell for cell-level admin');
      return;
    }

    setCreateLoading(true);
    try {
      const payload: CreateAdminPayload = {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        admin_scope_level: formData.admin_scope_level || 'all',
      };

      if (formData.admin_scope_level === 'cell') {
        payload.scope_district = formData.scope_district;
        payload.scope_sector = formData.scope_sector;
        payload.scope_cell = formData.scope_cell;
      }

      const { data } = await apiClient.post<UserItem>('/api/users/admin', payload);
      setUsers([...users, data]);
      setShowCreateForm(false);
      setFormData({
        full_name: '',
        email: '',
        password: '',
        confirm_password: '',
        admin_scope_level: 'cell',
        scope_district: '',
        scope_sector: '',
        scope_cell: '',
      });
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setCreateError(apiError.response?.data?.detail || 'Failed to create admin');
    } finally {
      setCreateLoading(false);
    }
  };

  const getScopeDisplay = (user: UserItem) => {
    // SuperAdmin always shows "All areas"
    if (user.role === 'SuperAdmin') {
      return 'All areas (System Manager)';
    }
    // Regular admin with scope
    if (user.role === 'Admin' && user.admin_scope_level && user.admin_scope_level !== 'all') {
      const parts = [user.scope_district, user.scope_sector, user.scope_cell].filter(Boolean);
      return parts.length > 0 ? parts.join(' → ') : user.admin_scope_level;
    }
    // Default: all areas
    return 'All areas';
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Shield className="w-4 h-4 text-[var(--color-primary)]" />
            <span>{t.admin.adminLabel}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            {p.title}
          </h1>
          <p className="text-slate-500 mt-0.5">
            {isSuperAdmin 
              ? 'All users and admins in the system (System Manager)'
              : isScopedAdmin
                ? `Only users who reported problems in your area: ${currentUser?.scope_district || ''} → ${currentUser?.scope_sector || ''} → ${currentUser?.scope_cell || ''}`
                : 'All users and admins'
            } · {users.length} {p.totalSummary} ({adminCount} {p.adminCount}, {userCount} {p.citizensCount})
          </p>
        </div>
        <div className="flex gap-2">
          {(isSuperAdmin || !isScopedAdmin) && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Plus size={16} />
              Create Cell Admin
            </button>
          )}
          <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] text-sm font-medium border border-[var(--color-primary)]/20">
            <Shield size={16} />
            {adminCount} {p.adminBadge}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium">
            <User size={16} />
            {userCount} {p.citizensBadge}
          </span>
        </div>
      </div>

      {showCreateForm && (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900">Create Cell Admin</h2>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setCreateError(null);
                setFormData({
                  full_name: '',
                  email: '',
                  password: '',
                  confirm_password: '',
                  admin_scope_level: 'cell',
                  scope_district: '',
                  scope_sector: '',
                  scope_cell: '',
                });
              }}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-slate-500" />
            </button>
          </div>
          <form onSubmit={handleCreateAdmin} className="space-y-4">
            {createError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
                {createError}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={formData.confirm_password}
                  onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
                />
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <MapPin size={16} />
                Cell Location
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 mb-2">District</label>
                  <input
                    type="text"
                    required
                    value={formData.scope_district}
                    onChange={(e) => setFormData({ ...formData, scope_district: e.target.value })}
                    placeholder="e.g., Gasabo"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-2">Sector</label>
                  <input
                    type="text"
                    required
                    value={formData.scope_sector}
                    onChange={(e) => setFormData({ ...formData, scope_sector: e.target.value })}
                    placeholder="e.g., Remera"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-2">Cell</label>
                  <input
                    type="text"
                    required
                    value={formData.scope_cell}
                    onChange={(e) => setFormData({ ...formData, scope_cell: e.target.value })}
                    placeholder="e.g., Gikondo"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={createLoading}
                className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {createLoading ? 'Creating...' : 'Create Admin'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setCreateError(null);
                }}
                className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 rounded-xl border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
          <p className="text-slate-500 text-sm">{p.loading}</p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-red-700 text-sm">
          {p.error}
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm p-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
            <UsersIcon size={40} className="text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">{p.emptyTitle}</h2>
          <p className="text-slate-500 max-w-sm mx-auto">{p.emptyHint}</p>
        </div>
      )}

      {!loading && !error && users.length > 0 && (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[40rem]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">{p.tableName}</th>
                  <th className="px-6 py-4">{p.tableEmail}</th>
                  <th className="px-6 py-4">{p.tableRole}</th>
                  <th className="px-6 py-4">Scope</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          u.role === 'Admin' || u.role === 'SuperAdmin'
                            ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {u.role === 'Admin' || u.role === 'SuperAdmin' ? <Shield size={18} /> : <User size={18} />}
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
                          u.role === 'Admin' || u.role === 'SuperAdmin'
                            ? u.role === 'SuperAdmin'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.role === 'Admin' || u.role === 'SuperAdmin' ? <Shield size={12} /> : <User size={12} />}
                        {u.role === 'SuperAdmin' ? 'Super Admin' : roleLabel(u.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {u.role === 'Admin' || u.role === 'SuperAdmin' ? (
                        <span className="text-xs text-slate-600 flex items-center gap-1">
                          <MapPin size={12} />
                          {u.role === 'SuperAdmin' ? 'All areas (System Manager)' : getScopeDisplay(u)}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {/* Show delete button for admins (not SuperAdmin, not yourself) */}
                      {/* SuperAdmin can delete regular admins, regular admins can delete other regular admins */}
                      {(u.role === 'Admin' || u.role === 'SuperAdmin') && 
                       u.id !== currentUser?.id && 
                       u.role !== 'SuperAdmin' && 
                       (isSuperAdmin || u.role === 'Admin') && (
                        <button
                          onClick={() => handleDelete(u.id)}
                          disabled={deletingId === u.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete admin"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      {u.role === 'SuperAdmin' && (
                        <span className="text-xs text-purple-600 font-medium">System Manager</span>
                      )}
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
