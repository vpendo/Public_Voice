import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../api/client';
import { FileText, ArrowLeft, LogOut } from 'lucide-react';

const PRIMARY = '#0066CC';
const SLATE_900 = '#1E293B';
const SLATE_500 = '#64748B';

interface ReportItem {
  id: number;
  name: string;
  phone: string;
  location: string;
  institution: string;
  category: string;
  raw_description: string;
  structured_description: string | null;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const { t } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchReports() {
      setLoading(true);
      setError(null);
      try {
        const { data } = await apiClient.get<ReportItem[]>('/api/reports');
        if (!cancelled) setReports(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        if (cancelled) return;
        const status = err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { status?: number } }).response?.status
          : 0;
        setError(status === 403 ? t.dashboard.adminRequired : t.dashboard.error);
        setReports([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchReports();
    return () => { cancelled = true; };
  }, [t.dashboard.adminRequired, t.dashboard.error]);

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString(undefined, {
        dateStyle: 'short',
        timeStyle: 'short',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <header className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="w-11/12 mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium"
            style={{ color: SLATE_500 }}
          >
            <ArrowLeft size={18} />
            {t.login.backToHome.replace('← ', '')}
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 text-sm font-medium"
            style={{ color: PRIMARY }}
          >
            <LogOut size={18} />
            {t.dashboard.signOut}
          </button>
        </div>
      </header>

      <main className="w-11/12 mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-2" style={{ color: SLATE_900 }}>
          {t.dashboard.title}
        </h1>
        <p className="mb-10" style={{ color: SLATE_500 }}>
          {t.dashboard.subtitle}
        </p>

        {loading && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center" style={{ color: SLATE_500 }}>
            {t.dashboard.loading}
          </div>
        )}

        {!loading && error && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && reports.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: PRIMARY }} />
            <h2 className="text-xl font-semibold mb-2" style={{ color: SLATE_900 }}>
              {t.dashboard.noReports}
            </h2>
            <p className="max-w-lg mx-auto" style={{ color: SLATE_500 }}>
              {t.dashboard.noReportsHint}
            </p>
            <p className="mt-6 text-sm" style={{ color: SLATE_500 }}>
              {t.dashboard.rawReport} → {t.dashboard.structuredReport}
            </p>
          </div>
        )}

        {!loading && !error && reports.length > 0 && (
          <div className="space-y-4">
            {reports.map((r) => (
              <article
                key={r.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-left"
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100" style={{ color: SLATE_900 }}>
                    #{r.id}
                  </span>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50" style={{ color: PRIMARY }}>
                    {r.category}
                  </span>
                  <span className="text-xs text-slate-500">{formatDate(r.created_at)}</span>
                </div>
                <h3 className="font-semibold mb-1" style={{ color: SLATE_900 }}>{r.name}</h3>
                <p className="text-sm mb-2" style={{ color: SLATE_500 }}>{r.location} · {r.institution}</p>
                <p className="text-slate-700 text-sm whitespace-pre-wrap">{r.raw_description}</p>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
