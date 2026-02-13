import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
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

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

function StatusBadge({ status, label }: { status: string; label?: string }) {
  const s = status.toLowerCase();
  const classes =
    s === 'resolved'
      ? 'bg-[var(--rwanda-green-light)] text-[var(--rwanda-green)]'
      : s === 'rejected'
        ? 'bg-red-100 text-red-800'
        : 'bg-[var(--rwanda-yellow-light)] text-[var(--rwanda-yellow)]';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${classes}`}>
      {label ?? status}
    </span>
  );
}

export function MyIssues() {
  const { t } = useLanguage();
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
        if (!cancelled) setError(t.user.myIssues.error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchReports();
    return () => { cancelled = true; };
  }, [t]);

  const pendingCount = reports.filter((r) => r.status === 'pending' || r.status === 'new').length;

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <span className="w-1 h-4 rounded-full bg-[var(--rwanda-blue)]" />
            {t.user.myIssues.yourReports}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{t.user.myIssues.title}</h1>
          <p className="text-slate-500 mt-0.5">
            {t.user.myIssues.subtitle} · {reports.length} {t.user.myIssues.total}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {pendingCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--rwanda-yellow-light)] text-[var(--rwanda-yellow)] text-sm font-medium">
              <Inbox size={16} />
              {pendingCount} {t.user.myIssues.pending}
            </span>
          )}
          <Link
            to="/user/submit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--rwanda-green)] text-white text-sm font-semibold rounded-xl hover:opacity-95 transition-opacity shadow-sm"
          >
            <PlusCircle size={18} />
            {t.user.myIssues.newIssue}
          </Link>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 rounded-xl border-2 border-[var(--rwanda-blue)] border-t-transparent animate-spin" />
          <p className="text-slate-500 text-sm">{t.user.myIssues.loading}</p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && reports.length === 0 && (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm p-12 sm:p-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-[var(--rwanda-blue-light)] flex items-center justify-center mx-auto mb-6">
            <FileText size={40} className="text-[var(--rwanda-blue)]" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">{t.user.myIssues.noIssues}</h2>
          <p className="text-slate-500 max-w-sm mx-auto mb-6">
            {t.user.myIssues.noIssuesHint}
          </p>
          <Link
            to="/user/submit"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--rwanda-green)] text-white font-semibold rounded-xl hover:opacity-95 transition-opacity shadow-md"
          >
            <PlusCircle size={20} />
            {t.user.myIssues.submitFirst}
          </Link>
        </div>
      )}

      {!loading && !error && reports.length > 0 && (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[32rem]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.user.myIssues.titleHeader}</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.user.myIssues.categoryHeader}</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.user.myIssues.dateHeader}</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.user.myIssues.statusHeader}</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">{t.user.myIssues.actionHeader}</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900">
                        {r.title || r.raw_description.slice(0, 50) || `#${r.id}`}
                        {!r.title && r.raw_description.length > 50 ? '...' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      {(t.user.categories as Record<string, string>)[r.category] || r.category}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{formatDate(r.created_at)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={r.status} label={(t.user.statusLabels as Record<string, string>)[r.status]} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/user/issues/${r.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--rwanda-blue)] hover:underline"
                      >
                        {t.user.myIssues.viewDetails}
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
