import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../../api/client';
import { useLanguage } from '../../../contexts/LanguageContext';
import { FileText, ArrowRight, Inbox, Shield } from 'lucide-react';

function getCategoryLabels(t: { admin: { categories: Record<string, string> } }) {
  return t.admin.categories;
}

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

function StatusBadge({
  status,
  labels,
}: {
  status: string;
  labels: { pending: string; resolved: string; rejected: string };
}) {
  const s = status.toLowerCase();
  const classes =
    s === 'resolved'
      ? 'bg-emerald-100 text-emerald-800'
      : s === 'rejected'
        ? 'bg-red-100 text-red-800'
        : 'bg-amber-100 text-amber-800';
  const label =
    s === 'resolved' ? labels.resolved : s === 'rejected' ? labels.rejected : labels.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
}

export function AllIssues() {
  const { t } = useLanguage();
  const CATEGORY_LABELS = getCategoryLabels(t);
  const statusLabels = {
    pending: t.admin.statusPending,
    resolved: t.admin.statusResolved,
    rejected: t.admin.statusRejected,
  };
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

  const p = t.admin.allIssuesPage;
  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Shield className="w-4 h-4 text-[var(--color-primary)]" />
            <span>{t.admin.adminLabel}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{p.title}</h1>
          <p className="text-slate-500 mt-0.5">
            {p.subtitle} · {reports.length} {p.total}
          </p>
        </div>
        {pendingCount > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 text-amber-800 text-sm font-medium border border-amber-200/80">
            <Inbox size={16} />
            {pendingCount} {t.admin.pendingCount}
          </span>
        )}
      </div>

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

      {!loading && !error && reports.length === 0 && (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm p-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
            <FileText size={40} className="text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">{p.emptyTitle}</h2>
          <p className="text-slate-500 max-w-sm mx-auto">{p.emptyHint}</p>
        </div>
      )}

      {!loading && !error && reports.length > 0 && (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[32rem]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">{t.admin.tableUser}</th>
                  <th className="px-6 py-4">{t.admin.tableTitle}</th>
                  <th className="px-6 py-4">{t.admin.tableCategory}</th>
                  <th className="px-6 py-4">{t.admin.tableStatus}</th>
                  <th className="px-6 py-4">{t.admin.tableDate}</th>
                  <th className="px-6 py-4 text-right">{t.admin.tableAction}</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{r.name}</td>
                    <td className="px-6 py-4 text-slate-700">{r.title || `#${r.id}`}</td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600">{CATEGORY_LABELS[r.category] || r.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={r.status} labels={statusLabels} />
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{formatDate(r.created_at)}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/admin/respond/${r.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:underline"
                      >
                        {t.admin.viewRespond}
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
