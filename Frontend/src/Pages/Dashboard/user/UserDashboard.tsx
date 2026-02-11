import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../../Components/Card';
import { apiClient } from '../../../api/client';
import { FileText, Clock, CheckCircle } from 'lucide-react';

interface ReportItem {
  id: number;
  status: string;
}

export function UserDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });

  useEffect(() => {
    let cancelled = false;
    async function fetchStats() {
      try {
        const { data } = await apiClient.get<ReportItem[]>('/api/reports/mine');
        if (cancelled) return;
        const list = Array.isArray(data) ? data : [];
        const pending = list.filter((r) => r.status === 'pending' || r.status === 'new').length;
        const resolved = list.filter((r) => r.status === 'resolved').length;
        setStats({ total: list.length, pending, resolved });
      } catch {
        if (!cancelled) setStats({ total: 0, pending: 0, resolved: 0 });
      }
    }
    fetchStats();
    return () => { cancelled = true; };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Dashboard</h1>
      <p className="text-slate-500 mb-8">Overview of your reported issues.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card title="Total reports" value={stats.total} icon={<FileText size={28} />} />
        <Card title="Pending" value={stats.pending} icon={<Clock size={28} />} />
        <Card title="Resolved" value={stats.resolved} icon={<CheckCircle size={28} />} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Quick actions</h2>
        <Link
          to="/user/submit"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white hover:opacity-90"
          style={{ backgroundColor: '#0066CC' }}
        >
          Submit a new issue
        </Link>
      </div>
    </div>
  );
}
