import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
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
      {/* Welcome header */}
      <div className="rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] p-6 md:p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-white/90 text-sm font-medium flex items-center gap-2 mb-1">
              <Sparkles size={16} />
              {formatDate(new Date().toISOString())}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Hello, {firstName}</h1>
            <p className="text-white/90 mt-1 max-w-md">
              Use your voice. Report community issues and track how authorities respond.
            </p>
          </div>
          <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
            <Megaphone size={32} />
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total reports</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)]">
              <FileText size={24} />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Pending</p>
              <p className="mt-1 text-3xl font-bold text-amber-600">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock size={24} />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Resolved</p>
              <p className="mt-1 text-3xl font-bold text-emerald-600">{stats.resolved}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick action + tip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Quick action</h2>
          <p className="text-slate-500 text-sm mb-4">
            Spotted a problem in your community? Submit a report so authorities can take action.
          </p>
          <Link
            to="/user/submit"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-sm"
          >
            <PlusCircle size={20} />
            Submit a new issue
            <ArrowRight size={18} />
          </Link>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">How it works</h3>
          <ol className="space-y-2 text-sm text-slate-600">
            <li className="flex gap-2">
              <span className="font-bold text-[var(--color-primary)]">1.</span>
              Submit your issue with details and location.
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-[var(--color-primary)]">2.</span>
              Authorities review and may contact you.
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-[var(--color-primary)]">3.</span>
              Track status and read responses here.
            </li>
          </ol>
        </div>
      </div>

      {/* Link to My Issues when they have reports */}
      {stats.total > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 flex items-center justify-between">
          <p className="text-slate-600 text-sm">View and track all your submitted issues.</p>
          <Link
            to="/user/issues"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:underline"
          >
            My Issues
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
