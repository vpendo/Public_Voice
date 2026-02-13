import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { apiClient } from '../../../api/client';
import { ArrowLeft, Tag, MapPin, Calendar, MessageSquare } from 'lucide-react';

interface ReportItem {
  id: number;
  title: string | null;
  raw_description: string;
  category: string;
  status: string;
  created_at: string;
  admin_response: string | null;
  location: string;
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

export function IssueDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [report, setReport] = useState<ReportItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function fetchReport() {
      try {
        const { data } = await apiClient.get<ReportItem>(`/api/reports/${id}`);
        if (!cancelled) setReport(data);
      } catch {
        if (!cancelled) setError(t.user.issueDetail.error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchReport();
    return () => { cancelled = true; };
  }, [id, t]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 rounded-xl border-2 border-[var(--rwanda-blue)] border-t-transparent animate-spin" />
        <p className="text-slate-500 text-sm">{t.user.issueDetail.loading}</p>
      </div>
    );
  }
  if (error || !report) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-red-700">
        {error || t.user.issueDetail.error}
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <Link
        to="/user/issues"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[var(--rwanda-blue)] transition-colors"
      >
        <ArrowLeft size={18} />
        {t.user.issueDetail.backToIssues}
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <span className="w-1 h-4 rounded-full bg-[var(--rwanda-blue)]" />
            {t.user.issueDetail.issueDetail}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            {report.title || `Issue #${report.id}`}
          </h1>
          <p className="text-slate-500 mt-0.5">{formatDate(report.created_at)}</p>
        </div>
        <StatusBadge status={report.status} label={(t.user.statusLabels as Record<string, string>)[report.status]} />
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="h-1 flex">
          <div className="flex-1 bg-[var(--rwanda-blue)]" />
          <div className="flex-1 bg-[var(--rwanda-yellow)]" />
          <div className="flex-1 bg-[var(--rwanda-green)]" />
        </div>
        <div className="p-6">
        <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Tag size={16} className="text-[var(--rwanda-blue)]" />
          {t.user.issueDetail.yourReport}
        </h2>
        <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">{report.raw_description}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <Tag size={14} />
            {report.category}
          </span>
          {report.location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={14} />
              {report.location}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {formatDate(report.created_at)}
          </span>
        </div>
        </div>
      </div>

      {report.admin_response ? (
        <div className="rounded-2xl border-l-4 border-l-[var(--rwanda-green)] border border-slate-200/80 bg-[var(--rwanda-green-light)]/50 p-6">
          <h2 className="text-sm font-semibold text-[var(--rwanda-green)] uppercase tracking-wider mb-3 flex items-center gap-2">
            <MessageSquare size={16} />
            {t.user.issueDetail.responseFromAuthorities}
          </h2>
          <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">{report.admin_response}</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-6">
          <p className="text-slate-500 text-sm flex items-center gap-2">
            <MessageSquare size={18} className="text-slate-400" />
            {t.user.issueDetail.noResponseYet}
          </p>
        </div>
      )}
    </div>
  );
}
