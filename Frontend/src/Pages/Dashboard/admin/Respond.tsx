import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../../../api/client';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ArrowLeft, Send, MapPin, Tag, Calendar, Shield, MessageSquare } from 'lucide-react';

interface ReportItem {
  id: number;
  name: string;
  title: string | null;
  raw_description: string;
  structured_description: string | null;
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

export function Respond() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const p = t.admin.respondPage;
  const statusLabels = {
    pending: t.admin.statusPending,
    resolved: t.admin.statusResolved,
    rejected: t.admin.statusRejected,
  };
  const categoryLabels = t.admin.categories;
  const [report, setReport] = useState<ReportItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function fetchReport() {
      try {
        const { data } = await apiClient.get<ReportItem>(`/api/reports/${id}`);
        if (!cancelled) {
          setReport(data);
          setResponse(data.admin_response ?? '');
          setStatus(data.status);
        }
      } catch {
        if (!cancelled) setError(p.errorLoad);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchReport();
    return () => { cancelled = true; };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSubmitting(true);
    setError(null);
    try {
      await apiClient.patch(`/api/reports/${id}`, {
        status: status || undefined,
        admin_response: response.trim() || undefined,
      });
      setSuccess(true);
      setReport((prev) =>
        prev ? { ...prev, status, admin_response: response.trim() || null } : null
      );
    } catch {
      setError(p.errorUpdate);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 rounded-xl border-2 border-[var(--rwanda-blue)] border-t-transparent animate-spin" />
        <p className="text-slate-500 text-sm">{p.loading}</p>
      </div>
    );
  }
  if (error && !report) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-red-700">
        {error}
      </div>
    );
  }
  if (!report) return null;

  return (
    <div className="space-y-6 font-sans">
      <Link
        to="/admin/respond"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[var(--rwanda-blue)] transition-colors"
      >
        <ArrowLeft size={18} />
        {p.backToList}
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Shield className="w-4 h-4 text-[var(--rwanda-blue)]" />
            <span>{t.admin.adminLabel}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{p.title}</h1>
          <p className="text-slate-500 mt-0.5">
            {report.title || `Report #${report.id}`} · {report.name}
          </p>
        </div>
        <StatusBadge status={report.status} labels={statusLabels} />
      </div>

      <div className="rounded-2xl border-l-4 border-l-[var(--rwanda-blue)] border border-slate-200/80 bg-white shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Tag size={16} />
          {p.citizenReport}
        </h2>
        <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">{report.raw_description}</p>
        {report.structured_description && (
          <div className="mt-6 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {t.dashboard?.structuredReport || 'Structured report (AI)'}
            </h3>
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 rounded-lg p-4">
              {report.structured_description}
            </p>
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <Tag size={14} />
            {categoryLabels[report.category] || report.category}
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

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200/80 bg-white shadow-sm p-6 md:p-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <MessageSquare size={20} className="text-[var(--rwanda-blue)]" />
          {p.yourResponse}
        </h2>
        {success && (
          <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
            {p.responseSaved}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1.5">
              {p.statusLabel}
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--rwanda-blue)]/30 focus:border-[var(--rwanda-blue)] bg-white"
            >
              <option value="pending">{t.admin.statusPending}</option>
              <option value="resolved">{t.admin.statusResolved}</option>
              <option value="rejected">{t.admin.statusRejected}</option>
            </select>
          </div>
          <div>
            <label htmlFor="response" className="block text-sm font-medium text-slate-700 mb-1.5">
              {p.responseToCitizen}
            </label>
            <textarea
              id="response"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={5}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--rwanda-blue)]/30 focus:border-[var(--rwanda-blue)] resize-none bg-white"
              placeholder={p.responsePlaceholder}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--rwanda-green)] text-white font-semibold rounded-xl hover:opacity-95 disabled:opacity-70 transition-opacity shadow-md"
          >
            <Send size={18} />
            {submitting ? p.saving : p.saveResponse}
          </button>
        </div>
      </form>
    </div>
  );
}
