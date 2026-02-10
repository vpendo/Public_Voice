import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { FileText, ArrowLeft, LogOut } from 'lucide-react';

const PRIMARY = '#0066CC';
const SLATE_900 = '#1E293B';
const SLATE_500 = '#64748B';

export default function Dashboard() {
  const { t } = useLanguage();

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
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-medium"
            style={{ color: PRIMARY }}
          >
            <LogOut size={18} />
            {t.dashboard.signOut}
          </Link>
        </div>
      </header>

      <main className="w-11/12 mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-2" style={{ color: SLATE_900 }}>
          {t.dashboard.title}
        </h1>
        <p className="mb-10" style={{ color: SLATE_500 }}>
          {t.dashboard.subtitle}
        </p>

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
      </main>
    </div>
  );
}
