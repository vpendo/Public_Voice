import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { FileText } from 'lucide-react';
import { ReportForm } from '../../../Components/ReportForm';

export function SubmitIssue() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const u = t.user.submitIssue;

  const handleSuccess = (trackingId: string) => {
    navigate('/user/issues', { state: { submittedTrackingId: trackingId } });
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <span className="w-1 h-4 rounded-full bg-[var(--color-primary)]" />
            {u.citizenReport}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{u.title}</h1>
          <p className="text-slate-500 mt-0.5">{u.subtitle}</p>
        </div>
      </div>

      {/* Card: 11/12 of main area; max-w-3xl caps form width on huge monitors */}
      <div className="w-11/12 max-w-3xl mx-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="h-1 bg-[var(--color-primary)]" />
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-2">
            <FileText size={16} className="text-[var(--color-primary)]" />
            {u.reportForm}
          </h2>
        </div>
        <div className="p-6 md:p-8">
          <ReportForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}
