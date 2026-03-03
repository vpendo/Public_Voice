import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../../api/client';
import { useLanguage } from '../../../contexts/LanguageContext';
import {
  Users,
  FileText,
  Clock,
  CheckCircle,
  ArrowRight,
  AlertCircle,
  BarChart3,
  PieChart,
  Shield,
  Bell,
} from 'lucide-react';

interface ReportItem {
  id: number;
  tracking_id?: string | null;
  status: string;
  category: string;
  created_at: string;
}

interface ReportStats {
  total: number;
  by_status: Record<string, number>;
  by_category: Record<string, number>;
  by_urgency: Record<string, number>;
  monthly_trend: { month: string; count: number }[];
}

function getCategoryLabels(t: typeof import('../../../i18n/content').content.English): Record<string, string> {
  const c = t.admin.categories as Record<string, string>;
  return {
    roads: c.roads,
    water: c.water,
    security: c.security,
    sanitation: c.sanitation,
    electricity: c.electricity,
    health: c.health,
    education: c.education,
    other: c.other,
    service_delivery: c.service_delivery ?? 'Service Delivery',
    land_property: c.land_property ?? 'Land & Property',
    infrastructure_utilities: c.infrastructure_utilities ?? 'Infrastructure',
    social_community: c.social_community ?? 'Social / Community',
    administrative: c.administrative ?? 'Administrative',
  };
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return iso;
  }
}

const URGENCY_LABELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  emergency: 'Emergency',
};

export function AdminDashboard() {
  const { t } = useLanguage();
  const CATEGORY_LABELS = getCategoryLabels(t);
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [usersCount, setUsersCount] = useState(0);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const [usersRes, statsRes, reportsRes] = await Promise.all([
          apiClient.get<{ id: number }[]>('/api/users'),
          apiClient.get<ReportStats>('/api/reports/stats'),
          apiClient.get<ReportItem[]>('/api/reports', { params: { limit: 10 } }),
        ]);
        if (cancelled) return;
        const usersList = Array.isArray(usersRes.data) ? usersRes.data : [];
        setUsersCount(usersList.length);
        setStats(statsRes.data ?? null);
        setReports(Array.isArray(reportsRes.data) ? reportsRes.data : []);
        setError(null);
      } catch {
        if (!cancelled) {
          setError(t.admin.loading ? 'Could not load dashboard.' : '');
          setStats(null);
          setReports([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  const byStatus = stats?.by_status ?? {};
  const pending = byStatus.pending ?? 0;
  const inReview = byStatus.in_review ?? 0;
  const resolved = byStatus.resolved ?? 0;
  const rejected = byStatus.rejected ?? 0;
  const totalReports = stats?.total ?? 0;

  const categoryData = stats?.by_category
    ? Object.entries(stats.by_category)
        .map(([key, value]) => ({ name: CATEGORY_LABELS[key] || key, value, key }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8)
    : [];
  const maxCategory = Math.max(1, ...categoryData.map((d) => d.value));

  const statusData = [
    { label: t.admin.statusPending, value: pending, strokeClass: 'stroke-amber-500', dotClass: 'bg-amber-500' },
    { label: (t.admin as { statusInReview?: string }).statusInReview ?? 'In Review', value: inReview, strokeClass: 'stroke-blue-500', dotClass: 'bg-blue-500' },
    { label: t.admin.statusResolved, value: resolved, strokeClass: 'stroke-emerald-500', dotClass: 'bg-emerald-500' },
    { label: t.admin.statusRejected, value: rejected, strokeClass: 'stroke-red-500', dotClass: 'bg-red-500' },
  ].filter((d) => d.value > 0);
  const totalStatus = statusData.reduce((s, d) => s + d.value, 0) || 1;

  const urgencyData = stats?.by_urgency
    ? Object.entries(stats.by_urgency)
        .map(([key, value]) => ({ label: URGENCY_LABELS[key] || key, value, key }))
        .filter((d) => d.value > 0)
        .sort((a, b) => b.value - a.value)
    : [];
  const monthlyTrend = stats?.monthly_trend ?? [];
  const maxTrend = Math.max(1, ...monthlyTrend.map((d) => d.count));

  const urgentCount = (stats?.by_urgency?.emergency ?? 0) + (stats?.by_urgency?.high ?? 0);
  const showNotificationBanner = pending > 0 || urgentCount > 0;

  const recentReports = [...reports]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-8 font-sans animate-pulse">
        <div className="h-24 bg-slate-100 rounded-2xl w-3/4 max-w-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-100 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-slate-100 rounded-2xl" />
          <div className="h-64 bg-slate-100 rounded-2xl" />
        </div>
        <div className="h-72 bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-red-700 text-center">
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* In-app notification banner when there are pending or urgent reports */}
      {showNotificationBanner && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/90 px-6 py-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <Bell size={20} />
            </div>
            <div>
              <p className="font-semibold text-amber-900">
                {pending > 0 && urgentCount > 0
                  ? `${pending} pending report(s) · ${urgentCount} urgent need attention`
                  : pending > 0
                    ? `${pending} report(s) pending review`
                    : `${urgentCount} urgent report(s) need attention`}
              </p>
              <p className="text-sm text-amber-800">Review and update status from the reports table.</p>
            </div>
          </div>
          <Link
            to="/admin/issues"
            className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 text-white text-sm font-medium hover:bg-amber-700"
          >
            View reports
            <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Shield className="w-4 h-4 text-[var(--color-primary)]" />
            <span>{t.admin.overview}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            {t.admin.dashboardTitle}
          </h1>
          <p className="text-slate-500 mt-0.5">
            {formatDate(new Date().toISOString())} · {t.admin.dateReports}
          </p>
        </div>
        <Link
          to="/admin/issues"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[var(--color-primary)] hover:opacity-95 transition-opacity shadow-md"
        >
          {t.admin.viewAllIssues}
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{t.admin.totalReports}</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{totalReports}</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100 text-slate-600">
              <FileText size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{t.admin.pending}</p>
              <p className="mt-1 text-3xl font-bold text-amber-600">{pending}</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-50 text-amber-600">
              <Clock size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{(t.admin as { statusInReview?: string }).statusInReview ?? 'In Review'}</p>
              <p className="mt-1 text-3xl font-bold text-blue-600">{inReview}</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
              <FileText size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{t.admin.resolved}</p>
              <p className="mt-1 text-3xl font-bold text-emerald-600">{resolved}</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)]">
              <PieChart size={18} />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">{t.admin.reportsByStatus}</h2>
          </div>
          {statusData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <AlertCircle size={40} className="mb-2" />
              <p className="text-sm">{t.admin.noReportData}</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-6">
              <div className="relative w-40 h-40 mx-auto flex-shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  {statusData.map((d, i) => {
                    const pct = (d.value / totalStatus) * 100;
                    const dash = (pct / 100) * 100;
                    const offset = statusData
                      .slice(0, i)
                      .reduce((s, x) => s + (x.value / totalStatus) * 100, 0);
                    return (
                      <circle
                        key={d.label}
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="none"
                        className={d.strokeClass}
                        strokeWidth="3"
                        strokeDasharray={`${dash} ${100 - dash}`}
                        strokeDashoffset={-offset}
                      />
                    );
                  })}
                </svg>
              </div>
              <div className="flex-1 min-w-0 space-y-3">
                {statusData.map((d) => (
                  <div key={d.label} className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full flex-shrink-0 ${d.dotClass}`} />
                    <span className="text-sm text-slate-600">{d.label}</span>
                    <span className="text-sm font-semibold text-slate-900 ml-auto">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)]">
              <BarChart3 size={18} />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">{t.admin.reportsByCategory}</h2>
          </div>
          {categoryData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <BarChart3 size={40} className="mb-2" />
              <p className="text-sm">{t.admin.noCategoriesYet}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categoryData.map((d) => (
                <Link
                  key={d.key}
                  to={`/admin/issues?category=${encodeURIComponent(d.key)}`}
                  className="block rounded-lg p-2 -m-2 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700 font-medium">{d.name}</span>
                    <span className="text-slate-500">{d.value}</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500"
                      style={{ width: `${(d.value / maxCategory) * 100}%` }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Urgency + Monthly trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)]">
              <BarChart3 size={18} />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">{t.admin.tableUrgency}</h2>
          </div>
          {urgencyData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-sm">{t.admin.noReportData}</div>
          ) : (
            <div className="space-y-4">
              {urgencyData.map((d) => (
                <div key={d.key} className="flex justify-between text-sm">
                  <span className="text-slate-700 font-medium">{d.label}</span>
                  <span className="text-slate-500">{d.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)]">
              <BarChart3 size={18} />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Monthly report trend</h2>
          </div>
          {monthlyTrend.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-sm">{t.admin.noReportData}</div>
          ) : (
            <div className="space-y-2">
              {monthlyTrend.slice(-6).map((d) => (
                <div key={d.month} className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 w-16">{d.month}</span>
                  <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500"
                      style={{ width: `${(d.count / maxTrend) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-700 w-8">{d.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent reports + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">{t.admin.recentReports}</h2>
            <Link
              to="/admin/issues"
              className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              {t.admin.viewAll}
            </Link>
          </div>
          <div className="overflow-x-auto">
            {recentReports.length === 0 ? (
              <div className="px-6 py-12 text-center text-slate-500 text-sm">{t.admin.noReportsYet}</div>
            ) : (
              <table className="w-full text-left min-w-[32rem]">
                <thead>
                  <tr className="bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-3">{t.admin.tableId}</th>
                    <th className="px-6 py-3">{t.admin.tableCategory}</th>
                    <th className="px-6 py-3">{t.admin.tableStatus}</th>
                    <th className="px-6 py-3">{t.admin.tableDate}</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentReports.map((r) => (
                    <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                      <td className="px-6 py-3 font-medium text-slate-900">{r.tracking_id || `#${r.id}`}</td>
                      <td className="px-6 py-3 text-slate-600">
                        {CATEGORY_LABELS[r.category] || r.category}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            r.status === 'resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : r.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : r.status === 'in_review'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {r.status === 'resolved' ? t.admin.statusResolved : r.status === 'rejected' ? t.admin.statusRejected : r.status === 'in_review' ? ((t.admin as { statusInReview?: string }).statusInReview ?? 'In Review') : t.admin.statusPending}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-slate-500 text-sm">{formatDate(r.created_at)}</td>
                      <td className="px-6 py-3">
                        <Link
                          to={`/admin/respond/${r.id}`}
                          className="text-sm font-medium text-[var(--color-primary)] hover:underline"
                        >
                          {t.admin.respondLink}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">{t.admin.quickActions}</h2>
            <div className="space-y-2">
              <Link
                to="/admin/respond"
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-amber-50/50 hover:border-amber-200 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                  <Clock size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900">{t.admin.respondToIssues}</p>
                  <p className="text-xs text-slate-500">{pending} {t.admin.pendingCount}</p>
                </div>
                <ArrowRight size={18} className="text-slate-400" />
              </Link>
              <Link
                to="/admin/issues"
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900">{t.admin.allIssues}</p>
                  <p className="text-xs text-slate-500">{totalReports} {t.admin.totalCount}</p>
                </div>
                <ArrowRight size={18} className="text-slate-400" />
              </Link>
              <Link
                to="/admin/users"
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-[var(--color-primary-light)]/50 hover:border-[var(--color-primary)]/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)]">
                  <Users size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900">{t.admin.usersLabel}</p>
                  <p className="text-xs text-slate-500">{usersCount} {t.admin.registered}</p>
                </div>
                <ArrowRight size={18} className="text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
