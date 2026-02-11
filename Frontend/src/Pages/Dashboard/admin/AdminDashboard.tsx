import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../../Components/Card';
import { apiClient } from '../../../api/client';
import { Users, FileText, Clock, CheckCircle } from 'lucide-react';

interface Counts {
  users: number;
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
}

export function AdminDashboard() {
  const [counts, setCounts] = useState<Counts>({
    users: 0,
    totalReports: 0,
    pendingReports: 0,
    resolvedReports: 0,
  });

  useEffect(() => {
    let cancelled = false;
    async function fetchCounts() {
      try {
        const [usersRes, reportsRes] = await Promise.all([
          apiClient.get<{ id: number }[]>('/api/users'),
          apiClient.get<{ id: number; status: string }[]>('/api/reports'),
        ]);
        if (cancelled) return;
        const users = Array.isArray(usersRes.data) ? usersRes.data : [];
        const reports = Array.isArray(reportsRes.data) ? reportsRes.data : [];
        const pending = reports.filter((r) => r.status === 'pending' || r.status === 'new').length;
        const resolved = reports.filter((r) => r.status === 'resolved').length;
        setCounts({
          users: users.length,
          totalReports: reports.length,
          pendingReports: pending,
          resolvedReports: resolved,
        });
      } catch {
        if (!cancelled) setCounts({ users: 0, totalReports: 0, pendingReports: 0, resolvedReports: 0 });
      }
    }
    fetchCounts();
    return () => { cancelled = true; };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
      <p className="text-slate-500 mb-8">Overview of users and reports.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card title="Total users" value={counts.users} icon={<Users size={28} />} />
        <Card title="Total reports" value={counts.totalReports} icon={<FileText size={28} />} />
        <Card title="Pending reports" value={counts.pendingReports} icon={<Clock size={28} />} />
        <Card title="Resolved reports" value={counts.resolvedReports} icon={<CheckCircle size={28} />} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/issues"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white hover:opacity-90"
            style={{ backgroundColor: '#0066CC' }}
          >
            View all issues
          </Link>
          <Link
            to="/admin/respond"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            Respond to issues
          </Link>
        </div>
      </div>
    </div>
  );
}