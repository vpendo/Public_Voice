import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../../api/client';
import { FileText, ArrowRight, Inbox, PlusCircle } from 'lucide-react';

interface ReportItem {
  id: number;
  title: string | null;
  raw_description: string;
  category: string;
  status: string;
  created_at: string;
  admin_response: string | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  roads: 'Roads',
  water: 'Water',
  security: 'Security',
  sanitation: 'Sanitation',
  electricity: 'Electricity',
  health: 'Health',
  education: 'Education',
  other: 'Other',
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  const classes =
    s === 'resolved'
      ? 'bg-emerald-100 text-emerald-800'
      : s === 'rejected'
        ? 'bg-red-100 text-red-800'
        : 'bg-amber-100 text-amber-800';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${classes}`}>
      {status}
    </span>
  );
}

export function MyIssues() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchReports() {
      try {
        const { data } = await apiClient.get<ReportItem[]>('/api/reports/mine');
        if (!cancelled) setReports(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setError('Could not load your issues.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchReports();
    return () => { cancelled = true; };
  }, []);

  const pendingCount = reports.filter((r) => r.status === 'pending' || r.status === 'new').length;

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Issues</h1>
          <p className="text-slate-500 mt-0.5">
            Track your submitted reports and see responses · {reports.length} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 text-sm font-medium">
              <Inbox size={16} />
              {pendingCount} pending
            </span>
          )}
          <Link
            to="/user/submit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            <PlusCircle size={18} />
            New issue
          </Link>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-slate-400 text-sm">Loading your issues...</div>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && reports.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-[var(--color-primary-light)] flex items-center justify-center mx-auto mb-6">
            <FileText size={40} className="text-[var(--color-primary)]" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">No issues yet</h2>
          <p className="text-slate-500 max-w-sm mx-auto mb-6">
            Submit your first issue and authorities will review it. You can track status and read responses here.
          </p>
          <Link
            to="/user/submit"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            <PlusCircle size={20} />
            Submit your first issue
          </Link>
        </div>
      )}

      {!loading && !error && reports.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900">
                        {r.title || r.raw_description.slice(0, 50) || `#${r.id}`}
                        {!r.title && r.raw_description.length > 50 ? '...' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      {CATEGORY_LABELS[r.category] || r.category}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{formatDate(r.created_at)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/user/issues/${r.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:underline"
                      >
                        View details
                        <ArrowRight size={14} />
                      </Link>
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
