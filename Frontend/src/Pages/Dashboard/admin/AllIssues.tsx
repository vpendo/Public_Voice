import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../../api/client';
import { FileText, ArrowRight, Inbox } from 'lucide-react';

const CATEGORY_LABELS: Record<string, string> = {
  roads: 'Roads & Infrastructure',
  water: 'Water',
  security: 'Security',
  sanitation: 'Sanitation',
  electricity: 'Electricity',
  health: 'Health',
  education: 'Education',
  other: 'Other',
};

interface ReportItem {
  id: number;
  name: string;
  title: string | null;
  category: string;
  status: string;
  created_at: string;
}

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

export function AllIssues() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchReports() {
      try {
        const { data } = await apiClient.get<ReportItem[]>('/api/reports');
        if (!cancelled) setReports(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setError('Could not load reports.');
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">All Issues</h1>
          <p className="text-slate-500 mt-0.5">
            View and respond to citizen reports · {reports.length} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 text-sm font-medium">
              <Inbox size={16} />
              {pendingCount} pending
            </span>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-slate-400 text-sm">Loading issues...</div>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && reports.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
            <FileText size={40} className="text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">No reports yet</h2>
          <p className="text-slate-500 max-w-sm mx-auto">
            Reports submitted by citizens will appear here. Share the report link with your community to get started.
          </p>
        </div>
      )}

      {!loading && !error && reports.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{r.name}</td>
                    <td className="px-6 py-4 text-slate-700">{r.title || `#${r.id}`}</td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600">{CATEGORY_LABELS[r.category] || r.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{formatDate(r.created_at)}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/admin/respond/${r.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:underline"
                      >
                        View / Respond
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
