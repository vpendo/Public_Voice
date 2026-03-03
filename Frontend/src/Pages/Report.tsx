import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CheckCircle2, FileText, MapPin } from 'lucide-react';
import { ReportForm } from '../Components/ReportForm';

const IMG = {
  sidebar: '/Image/home%202.jpg',
};

export default function Report() {
  const { t } = useLanguage();
  const [submittedTrackingId, setSubmittedTrackingId] = useState<string | null>(null);
  const r = t.report;

  if (submittedTrackingId) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <section className="relative bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-hover)] to-slate-900 text-white py-16 md:py-24">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <CheckCircle2 className="w-16 h-16 mx-auto text-white/90 mb-6" aria-hidden />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{r.successMessage}</h1>
            <p className="mt-4 text-lg text-white/90">{r.trackingIdHint}</p>
            <div className="mt-8 p-6 bg-white/10 rounded-2xl backdrop-blur">
              <p className="text-sm font-medium text-white/80 uppercase tracking-wider">{r.trackingIdLabel}</p>
              <p className="mt-2 text-2xl md:text-3xl font-mono font-bold tracking-wider">{submittedTrackingId}</p>
            </div>
            <p className="mt-6 text-white/80 text-sm">
              Status: Pending. You can track this report in your dashboard.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <section className="relative bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-hover)] to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/svg%3E')]" aria-hidden />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 text-white/80 text-sm font-medium mb-4">
            <FileText className="w-4 h-4" />
            <span>Rwanda · Cell-level reports</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-3xl">
            {r.hero.title}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed">
            {r.hero.description}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
            <div className="lg:col-span-2">
              <div className="bg-white p-8 md:p-10 rounded-2xl shadow-md border border-slate-200/80">
                <ReportForm onSuccess={setSubmittedTrackingId} />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200/80">
                <h3 className="text-lg font-bold mb-4 text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
                  {r.whyReport.title}
                </h3>
                <ul className="space-y-3 text-slate-600 text-sm">
                  {[r.whyReport.reason1, r.whyReport.reason2, r.whyReport.reason3].map((text, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[var(--color-primary)] mt-0.5 font-bold">•</span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-l-[var(--color-primary)] border border-slate-200/80">
                <h3 className="text-lg font-bold mb-4 text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
                  {r.howProcess.title}
                </h3>
                <ol className="space-y-3 text-slate-600 text-sm">
                  <li className="flex gap-2">
                    <span className="font-bold text-[var(--color-primary)] shrink-0">1.</span>
                    <span>{r.howProcess.step1}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-[var(--color-primary)] shrink-0">2.</span>
                    <span>{r.howProcess.step2}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-[var(--color-primary)] shrink-0">3.</span>
                    <span>{r.howProcess.step3}</span>
                  </li>
                </ol>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md">
                <img src={IMG.sidebar} alt="" className="w-full aspect-[4/3] object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="h-4 bg-white" aria-hidden />
    </div>
  );
}
