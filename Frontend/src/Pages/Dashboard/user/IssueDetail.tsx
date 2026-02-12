import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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

export function IssueDetail() {
  const { id } = useParams<{ id: string }>();
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
        if (!cancelled) setError('Could not load this issue.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchReport();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-slate-400 text-sm">Loading issue...</div>
      </div>
    );
  }
  if (error || !report) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-red-700">
        {error || 'Not found'}
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <Link
        to="/user/issues"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[var(--color-primary)] transition-colors"
      >
        <ArrowLeft size={18} />
        Back to My Issues
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {report.title || `Issue #${report.id}`}
          </h1>
          <p className="text-slate-500 mt-0.5">Submitted {formatDate(report.created_at)}</p>
        </div>
        <StatusBadge status={report.status} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Tag size={16} />
          Your report
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

      {report.admin_response ? (
        <div className="rounded-2xl border-l-4 border-l-[var(--color-primary)] border border-slate-200 bg-[var(--color-primary-light)]/30 p-6">
          <h2 className="text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-3 flex items-center gap-2">
            <MessageSquare size={16} />
            Response from authorities
          </h2>
          <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">{report.admin_response}</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-slate-500 text-sm flex items-center gap-2">
            <MessageSquare size={18} className="text-slate-400" />
            No response yet. Authorities will review your report and respond here.
          </p>
        </div>
      )}
    </div>
  );
}
