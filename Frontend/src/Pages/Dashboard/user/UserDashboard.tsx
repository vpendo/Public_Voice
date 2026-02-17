import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { apiClient } from '../../../api/client';
import {
  FileText,
  Clock,
  CheckCircle,
  PlusCircle,
  ArrowRight,
  Megaphone,
  Sparkles,
} from 'lucide-react';

interface ReportItem {
  id: number;
  status: string;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  } catch {
    return iso;
  }
}

export function UserDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });

  useEffect(() => {
    let cancelled = false;
    async function fetchStats() {
      try {
        const { data } = await apiClient.get<ReportItem[]>('/api/reports/mine');
        if (cancelled) return;
        const list = Array.isArray(data) ? data : [];
        const pending = list.filter((r) => r.status === 'pending' || r.status === 'new').length;
        const resolved = list.filter((r) => r.status === 'resolved').length;
        setStats({ total: list.length, pending, resolved });
      } catch {
        if (!cancelled) setStats({ total: 0, pending: 0, resolved: 0 });
      }
    }
    fetchStats();
    return () => { cancelled = true; };
  }, []);

  const firstName = user?.full_name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome header – RGB blue */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="h-1.5 bg-[var(--color-primary)]" />
        <div className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-slate-500 text-sm font-medium flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-[var(--color-primary)]" />
                {formatDate(new Date().toISOString())}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                {t.user.dashboard.hello}, {firstName}
              </h1>
              <p className="text-slate-600 mt-1 max-w-md">
                {t.user.dashboard.tagline}
              </p>
            </div>
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)]">
              <Megaphone size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards – RGB blue */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{t.user.dashboard.totalReports}</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)]">
              <FileText size={24} />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{t.user.dashboard.pending}</p>
              <p className="mt-1 text-3xl font-bold text-slate-600">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <Clock size={24} />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{t.user.dashboard.resolved}</p>
              <p className="mt-1 text-3xl font-bold text-[var(--color-primary)]">{stats.resolved}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)]">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick action + How it works */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">{t.user.dashboard.quickAction}</h2>
          <p className="text-slate-500 text-sm mb-4">
            {t.user.dashboard.quickActionDesc}
          </p>
          <Link
            to="/user/submit"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:opacity-95 transition-opacity shadow-md"
          >
            <PlusCircle size={20} />
            {t.user.dashboard.submitNewIssue}
            <ArrowRight size={18} />
          </Link>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-[var(--color-primary)]" />
            {t.user.dashboard.howItWorks}
          </h3>
          <ol className="space-y-4 text-sm text-slate-600">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] font-bold flex items-center justify-center text-xs">
                1
              </span>
              <span>{t.user.dashboard.step1}</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs">
                2
              </span>
              <span>{t.user.dashboard.step2}</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] font-bold flex items-center justify-center text-xs">
                3
              </span>
              <span>{t.user.dashboard.step3}</span>
            </li>
          </ol>
        </div>
      </div>

      {/* Link to My Issues when they have reports */}
      {stats.total > 0 && (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-slate-600 text-sm">{t.user.dashboard.viewMyIssues}</p>
          <Link
            to="/user/issues"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:underline"
          >
            {t.user.dashboard.myIssues}
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
