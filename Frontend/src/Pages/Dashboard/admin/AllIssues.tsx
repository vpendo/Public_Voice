import { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiClient } from '../../../api/client';
import { apiUrl, evidenceUrl } from '../../../api/config';
import { useLanguage } from '../../../contexts/LanguageContext';
import { FileText, ArrowRight, Inbox, Shield, Search, Download } from 'lucide-react';
import { REPORT_CATEGORIES, URGENCY_LEVELS, isReportCategory } from '../../../constants/categories';

function getCategoryLabels(t: { admin: { categories: Record<string, string>; filterAllCategories: string } }): Record<string, string> {
  return { ...t.admin.categories, all: t.admin.filterAllCategories };
}

interface ReportItem {
  id: number;
  tracking_id?: string | null;
  name?: string | null;
  title: string | null;
  category: string;
  problem_type?: string | null;
  urgency?: string | null;
  status: string;
  created_at: string;
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

function UrgencyBadge({ urgency }: { urgency?: string | null }) {
  const u = (urgency || 'medium').toLowerCase();
  const isUrgent = u === 'emergency' || u === 'high';
  const classes =
    u === 'emergency' ? 'bg-red-100 text-red-800 ring-1 ring-red-300' : u === 'high' ? 'bg-orange-100 text-orange-800 ring-1 ring-orange-300' : u === 'low' ? 'bg-slate-100 text-slate-700' : 'bg-sky-100 text-sky-800';
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${classes} ${isUrgent ? 'font-semibold' : ''}`}>{u}</span>;
}

function EvidenceThumb({ evidence_photo }: { evidence_photo?: string | null }) {
  const src = evidenceUrl(evidence_photo);
  if (!src) return <span className="text-slate-400 text-xs">—</span>;
  return (
    <a href={src} target="_blank" rel="noopener noreferrer" className="block w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
      <img src={src} alt="" className="w-full h-full object-cover" />
    </a>
  );
}

export function AllIssues() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const categoryFilter = isReportCategory(categoryParam) ? categoryParam : '';
  const statusFilter = searchParams.get('status') || '';
  const urgencyFilter = searchParams.get('urgency') || '';
  const dateFrom = searchParams.get('date_from') || '';
  const dateTo = searchParams.get('date_to') || '';
  const searchQ = searchParams.get('search') || '';
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<'date' | 'status' | 'urgency'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const params = useMemo(() => {
    const p: Record<string, string> = {};
    if (categoryFilter) p.category_filter = categoryFilter;
    if (statusFilter) p.status_filter = statusFilter;
    if (urgencyFilter) p.urgency_filter = urgencyFilter;
    if (dateFrom) p.date_from = dateFrom;
    if (dateTo) p.date_to = dateTo;
    if (searchQ.trim()) p.search = searchQ.trim();
    return p;
  }, [categoryFilter, statusFilter, urgencyFilter, dateFrom, dateTo, searchQ]);

  useEffect(() => {
    let cancelled = false;
    async function fetchReports() {
      try {
        const { data } = await apiClient.get<ReportItem[]>('/api/reports', { params });
        if (!cancelled) setReports(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setError('Could not load reports.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchReports();
    return () => { cancelled = true; };
  }, [categoryFilter, statusFilter, urgencyFilter, dateFrom, dateTo, searchQ]);

  const statusLabels = {
    pending: t.admin.statusPending,
    in_review: (t.admin as { statusInReview?: string }).statusInReview ?? 'In Review',
    resolved: t.admin.statusResolved,
    rejected: t.admin.statusRejected,
  };
  const CATEGORY_LABELS = getCategoryLabels(t);
  const pendingCount = reports.filter((r) => r.status === 'pending' || r.status === 'new').length;

  const sortedReports = useMemo(() => {
    const list = [...reports];
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'date') {
        cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortKey === 'status') {
        cmp = (a.status || '').localeCompare(b.status || '');
      } else if (sortKey === 'urgency') {
        const order = { emergency: 0, high: 1, medium: 2, low: 3 };
        cmp = (order[(a.urgency as keyof typeof order) ?? 'medium'] ?? 2) - (order[(b.urgency as keyof typeof order) ?? 'medium'] ?? 2);
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [reports, sortKey, sortDir]);

  const handleExport = () => {
    const q = new URLSearchParams(params);
    q.set('format', 'csv');
    const url = apiUrl(`/api/reports/export?${q.toString()}`);
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('publicvoice_token') : null;
    const headers: RequestInit['headers'] = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(url, { headers })
      .then((res) => res.blob())
      .then((blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'publicvoice_reports.csv';
        a.click();
        URL.revokeObjectURL(a.href);
      })
      .catch(() => {});
  };

  const toggleSort = (key: 'date' | 'status' | 'urgency') => {
    setSortKey(key);
    setSortDir((d) => (sortKey === key ? (d === 'asc' ? 'desc' : 'asc') : 'desc'));
  };

  const p = t.admin.allIssuesPage;
  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <Shield className="w-4 h-4 text-[var(--color-primary)]" />
              <span>{t.admin.adminLabel}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{p.title}</h1>
            <p className="text-slate-500 mt-0.5">
              {p.subtitle} · {reports.length} {p.total}
              {categoryFilter ? ` · ${CATEGORY_LABELS[categoryFilter] || categoryFilter}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 text-amber-800 text-sm font-medium border border-amber-200/80">
                <Inbox size={16} />
                {pendingCount} {t.admin.pendingCount}
              </span>
            )}
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50"
            >
              <Download size={16} />
              {(t.admin as { exportReports?: string }).exportReports ?? 'Export CSV'}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQ}
              onChange={(e) => {
                const v = e.target.value;
                setSearchParams((prev) => {
                  const p = new URLSearchParams(prev);
                  if (v.trim()) p.set('search', v.trim());
                  else p.delete('search');
                  return p;
                });
              }}
              placeholder={(t.admin as { searchPlaceholder?: string }).searchPlaceholder ?? 'Search by Tracking ID or name…'}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setSearchParams((prev) => { const p = new URLSearchParams(prev); if (e.target.value) p.set('status', e.target.value); else p.delete('status'); return p; })}
            className="px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white"
          >
            <option value="">{(t.admin as { filterByStatus?: string }).filterByStatus ?? 'Status'} — All</option>
            <option value="pending">{t.admin.statusPending}</option>
            <option value="in_review">{(t.admin as { statusInReview?: string }).statusInReview ?? 'In Review'}</option>
            <option value="resolved">{t.admin.statusResolved}</option>
            <option value="rejected">{t.admin.statusRejected}</option>
          </select>
          <select
            value={urgencyFilter}
            onChange={(e) => setSearchParams((prev) => { const p = new URLSearchParams(prev); if (e.target.value) p.set('urgency', e.target.value); else p.delete('urgency'); return p; })}
            className="px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white"
          >
            <option value="">{(t.admin as { filterByUrgency?: string }).filterByUrgency ?? 'Urgency'} — All</option>
            {URGENCY_LEVELS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setSearchParams((prev) => { const p = new URLSearchParams(prev); if (e.target.value) p.set('date_from', e.target.value); else p.delete('date_from'); return p; })}
            className="px-3 py-2 border border-slate-200 rounded-xl text-sm"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setSearchParams((prev) => { const p = new URLSearchParams(prev); if (e.target.value) p.set('date_to', e.target.value); else p.delete('date_to'); return p; })}
            className="px-3 py-2 border border-slate-200 rounded-xl text-sm"
          />
        </div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSearchParams((prev) => { const p = new URLSearchParams(prev); p.delete('category'); return p; })}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${!categoryFilter ? 'bg-[var(--color-primary)] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {CATEGORY_LABELS.all}
          </button>
          {REPORT_CATEGORIES.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setSearchParams((prev) => { const p = new URLSearchParams(prev); p.set('category', key); return p; })}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${categoryFilter === key ? 'bg-[var(--color-primary)] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {CATEGORY_LABELS[key] || key}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden">
          <div className="animate-pulse space-y-4 p-6">
            <div className="h-10 bg-slate-100 rounded w-3/4" />
            <div className="h-64 bg-slate-100 rounded" />
          </div>
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
            <table className="w-full text-left min-w-[48rem]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">{t.admin.tableUser}</th>
                  <th className="px-6 py-4">{(t.admin as { tableTrackingId?: string }).tableTrackingId ?? 'Tracking ID'}</th>
                  <th className="px-6 py-4">{t.admin.tableCategory}</th>
                  <th className="px-6 py-4">{(t.admin as { tableProblemType?: string }).tableProblemType ?? 'Problem Type'}</th>
                  <th className="px-6 py-4">
                    <button type="button" onClick={() => toggleSort('urgency')} className="flex items-center gap-1 hover:text-slate-700">
                      {(t.admin as { tableUrgency?: string }).tableUrgency ?? 'Urgency'}
                      {sortKey === 'urgency' && (sortDir === 'asc' ? ' ↑' : ' ↓')}
                    </button>
                  </th>
                  <th className="px-6 py-4">
                    <button type="button" onClick={() => toggleSort('status')} className="flex items-center gap-1 hover:text-slate-700">
                      {t.admin.tableStatus}
                      {sortKey === 'status' && (sortDir === 'asc' ? ' ↑' : ' ↓')}
                    </button>
                  </th>
                  <th className="px-6 py-4">
                    <button type="button" onClick={() => toggleSort('date')} className="flex items-center gap-1 hover:text-slate-700">
                      {t.admin.tableDate}
                      {sortKey === 'date' && (sortDir === 'asc' ? ' ↑' : ' ↓')}
                    </button>
                  </th>
                  <th className="px-6 py-4">Evidence</th>
                  <th className="px-6 py-4 text-right">{t.admin.tableAction}</th>
                </tr>
              </thead>
              <tbody>
                {sortedReports.map((r) => {
                  const isUrgent = (r.urgency || '').toLowerCase() === 'emergency' || (r.urgency || '').toLowerCase() === 'high';
                  return (
                  <tr
                    key={r.id}
                    className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${isUrgent ? 'bg-red-50/50' : ''}`}
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">{r.name || '—'}</td>
                    <td className="px-6 py-4 font-mono text-sm text-slate-700">{r.tracking_id || `#${r.id}`}</td>
                    <td className="px-6 py-4 text-slate-600">{CATEGORY_LABELS[r.category] || r.category}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{r.problem_type || '—'}</td>
                    <td className="px-6 py-4"><UrgencyBadge urgency={r.urgency} /></td>
                    <td className="px-6 py-4"><StatusBadge status={r.status} labels={statusLabels} /></td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{formatDate(r.created_at)}</td>
                    <td className="px-6 py-4"><EvidenceThumb evidence_photo={r.evidence_photo} /></td>
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
                );})}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
