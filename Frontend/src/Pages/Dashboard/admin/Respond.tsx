import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../../../api/client';
import { evidenceUrl } from '../../../api/config';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ArrowLeft, Send, MapPin, Tag, Calendar, Shield, MessageSquare, User, Phone, Building2, FileImage } from 'lucide-react';

interface ReportItem {
  id: number;
  tracking_id?: string | null;
  name?: string | null;
  phone: string;
  gender?: string | null;
  reporter_village?: string | null;
  reporter_cell?: string | null;
  reporter_sector?: string | null;
  reporter_district?: string | null;
  title: string | null;
  raw_description: string;
  structured_description: string | null;
  category: string;
  problem_type?: string | null;
  status: string;
  created_at: string;
  admin_response: string | null;
  admin_notes?: string | null;
  location?: string | null;
  district?: string | null;
  sector?: string | null;
  cell?: string | null;
  village?: string | null;
  landmark?: string | null;
  urgency?: string | null;
  institution?: string | null;
  consent?: boolean;
  evidence_photo?: string | null;
  evidence_video?: string | null;
  evidence_voice?: string | null;
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
  labels: { pending: string; in_review: string; resolved: string; rejected: string };
}) {
  const s = (status || '').toLowerCase();
  const classes =
    s === 'resolved'
      ? 'bg-emerald-100 text-emerald-800'
      : s === 'rejected'
        ? 'bg-red-100 text-red-800'
        : s === 'in_review'
          ? 'bg-blue-100 text-blue-800'
          : 'bg-amber-100 text-amber-800';
  const label =
    s === 'resolved' ? labels.resolved : s === 'rejected' ? labels.rejected : s === 'in_review' ? labels.in_review : labels.pending;
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
    in_review: (t.admin as { statusInReview?: string }).statusInReview ?? 'In Review',
    resolved: t.admin.statusResolved,
    rejected: t.admin.statusRejected,
  };
  const categoryLabels = t.admin.categories as Record<string, string>;
  const [report, setReport] = useState<ReportItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
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
          setAdminNotes(data.admin_notes ?? '');
          setStatus(data.status || 'pending');
        }
      } catch {
        if (!cancelled) setError(p.errorLoad);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchReport();
    return () => { cancelled = true; };
  }, [id, p.errorLoad]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSubmitting(true);
    setError(null);
    try {
      await apiClient.patch(`/api/reports/${id}`, {
        status: status || undefined,
        admin_response: response.trim() || undefined,
        admin_notes: adminNotes.trim() || undefined,
      });
      setSuccess(true);
      setReport((prev) =>
        prev ? { ...prev, status, admin_response: response.trim() || null, admin_notes: adminNotes.trim() || null } : null
      );
    } catch {
      setError(p.errorUpdate);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 font-sans animate-pulse">
        <div className="h-6 w-32 bg-slate-100 rounded" />
        <div className="h-24 bg-slate-100 rounded-2xl" />
        <div className="h-48 bg-slate-100 rounded-2xl" />
        <div className="h-40 bg-slate-100 rounded-2xl" />
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

  const locationParts = [report.district, report.sector, report.cell, report.village].filter(Boolean);
  const locationStr = locationParts.length ? locationParts.join(', ') : report.location;

  return (
    <div className="space-y-6 font-sans">
      <Link
        to="/admin/respond"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[var(--color-primary)] transition-colors"
      >
        <ArrowLeft size={18} />
        {p.backToList}
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Shield className="w-4 h-4 text-[var(--color-primary)]" />
            <span>{t.admin.adminLabel}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{p.title}</h1>
          <p className="text-slate-500 mt-0.5">
            {report.tracking_id && <span className="font-mono">{report.tracking_id}</span>}
            {report.tracking_id && ' · '}
            {report.title || `Report #${report.id}`} · {report.name || '—'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={report.status} labels={statusLabels} />
          {((report.urgency || '').toLowerCase() === 'emergency' || (report.urgency || '').toLowerCase() === 'high') && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 ring-1 ring-red-300">
              Urgent
            </span>
          )}
        </div>
      </div>

      {/* Reporter info */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <User size={16} />
          Reporter information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div><span className="text-slate-500">Name:</span> <span className="text-slate-800">{report.name || '—'}</span></div>
          <div className="flex items-center gap-1.5">
            <Phone size={14} className="text-slate-400" />
            <span className="text-slate-800">{report.phone}</span>
          </div>
          {(report.reporter_village || report.reporter_cell || report.reporter_sector || report.reporter_district) && (
            <div className="sm:col-span-2">
              <span className="text-slate-500">Location (reporter):</span>{' '}
              {[report.reporter_village, report.reporter_cell, report.reporter_sector, report.reporter_district].filter(Boolean).join(', ') || '—'}
            </div>
          )}
        </div>
      </div>

      {/* Citizen report + description */}
      <div className="rounded-2xl border-l-4 border-l-[var(--color-primary)] border border-slate-200/80 bg-white shadow-sm p-6">
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
            {report.problem_type && ` · ${report.problem_type}`}
          </span>
          {locationStr && (
            <span className="flex items-center gap-1.5">
              <MapPin size={14} />
              {locationStr}
              {report.landmark && ` (${report.landmark})`}
            </span>
          )}
          {report.urgency && (
            <span className={`capitalize font-medium ${(report.urgency || '').toLowerCase() === 'emergency' || (report.urgency || '').toLowerCase() === 'high' ? 'text-red-700' : ''}`}>
              Urgency: {report.urgency}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {formatDate(report.created_at)}
          </span>
        </div>
        {report.institution && (
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
            <Building2 size={14} />
            Responsible institution: {report.institution}
          </div>
        )}
        {report.consent !== undefined && (
          <p className="mt-2 text-xs text-slate-500">Consent for use: {report.consent ? 'Yes' : 'No'}</p>
        )}
      </div>

      {/* Evidence: thumbnail + links */}
      {(report.evidence_photo || report.evidence_video || report.evidence_voice) && (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <FileImage size={16} />
            Evidence
          </h2>
          <div className="flex flex-wrap items-start gap-6">
            {report.evidence_photo && evidenceUrl(report.evidence_photo) && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">Photo</p>
                <a href={evidenceUrl(report.evidence_photo)!} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden border border-slate-200 max-w-xs">
                  <img src={evidenceUrl(report.evidence_photo)!} alt="Evidence" className="w-full h-40 object-cover" />
                </a>
              </div>
            )}
            {report.evidence_video && evidenceUrl(report.evidence_video) && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">Video</p>
                <a href={evidenceUrl(report.evidence_video)!} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200">
                  Open video
                </a>
              </div>
            )}
            {report.evidence_voice && evidenceUrl(report.evidence_voice) && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">Voice recording</p>
                <audio src={evidenceUrl(report.evidence_voice)!} controls className="max-w-full" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status update + response + admin notes */}
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200/80 bg-white shadow-sm p-6 md:p-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <MessageSquare size={20} className="text-[var(--color-primary)]" />
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
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] bg-white"
            >
              <option value="pending">{t.admin.statusPending}</option>
              <option value="in_review">{(t.admin as { statusInReview?: string }).statusInReview ?? 'In Review'}</option>
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
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] resize-none bg-white"
              placeholder={p.responsePlaceholder}
            />
          </div>
          <div>
            <label htmlFor="admin_notes" className="block text-sm font-medium text-slate-700 mb-1.5">
              {(p as { adminNotesLabel?: string }).adminNotesLabel ?? 'Admin notes (internal)'}
            </label>
            <textarea
              id="admin_notes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] resize-none bg-slate-50"
              placeholder={(p as { adminNotesPlaceholder?: string }).adminNotesPlaceholder ?? 'Internal notes for follow-up…'}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:opacity-95 disabled:opacity-70 transition-opacity shadow-md"
          >
            <Send size={18} />
            {submitting ? p.saving : p.saveResponse}
          </button>
        </div>
      </form>
    </div>
  );
}
