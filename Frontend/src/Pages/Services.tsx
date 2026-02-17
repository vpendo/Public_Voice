import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { FileText, Cpu, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react';

const IMG = {
  report: '/Image/home.jpg',
  smart: '/Image/home1.jpg',
  track: '/Image/home%202.jpg',
};

const SERVICES: Array<{
  titleKey: 'service1' | 'service2' | 'service3';
  icon: typeof FileText;
  image: 'report' | 'smart' | 'track';
  color: 'blue' | 'yellow' | 'green';
}> = [
  { titleKey: 'service1', icon: FileText, image: 'report', color: 'blue' },
  { titleKey: 'service2', icon: Cpu, image: 'smart', color: 'yellow' },
  { titleKey: 'service3', icon: BarChart3, image: 'track', color: 'green' },
];

export default function Services() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero - Rwanda colors */}
      <section className="relative bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-hover)] to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/svg%3E')]" aria-hidden />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75 mb-4">
            Rwanda · PublicVoice
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-3xl">
            {t.services.hero.title}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed">
            {t.services.hero.description}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/report"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-[var(--color-primary)] font-semibold rounded-xl hover:bg-white/95 transition-colors shadow-lg"
            >
              {t.services.button}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 border-2 border-white/70 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              Contact us
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10 h-2 flex pointer-events-none">
        </div>
      </section>

      {/* Services grid - Rwanda colors per card */}
      <section className="py-20 md:py-28 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%232063d5\' fill-opacity=\'0.04\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 20V40H20M20 20h20v20\'/%3E%3C/g%3E%3C/svg%3E')]" aria-hidden />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-primary)] mb-3">
              What we offer
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Three ways we serve citizens
            </h2>
            <p className="mt-3 text-slate-600 text-lg">
              Report, route, and track—so local government can respond faster across Rwanda.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {SERVICES.map(({ titleKey, icon: Icon, image, color }, index) => (
              <article
                key={titleKey}
                className={`group bg-white rounded-2xl shadow-md border border-slate-200/80 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col border-t-4 ${
                  color === 'blue'
                    ? 'border-t-[var(--color-primary)]'
                    : color === 'yellow'
                      ? 'border-t-[var(--color-primary)]'
                      : 'border-t-[var(--color-primary)]'
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={IMG[image]}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    className={`absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg ${
                      color === 'blue'
                        ? 'bg-[var(--color-primary)]'
                        : color === 'yellow'
                          ? 'bg-[var(--color-primary)]'
                          : 'bg-[var(--color-primary)]'
                    }`}
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div
                    className={`inline-flex p-3 rounded-xl mb-5 w-fit ${
                      color === 'blue'
                        ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                        : color === 'yellow'
                          ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                          : 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                    }`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">
                    {t.services[titleKey].title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed flex-1">
                    {t.services[titleKey].description}
                  </p>
                  <Link
                    to="/report"
                    className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
                      color === 'blue'
                        ? 'text-[var(--color-primary)] hover:opacity-80'
                        : color === 'yellow'
                          ? 'text-[var(--color-primary)] hover:opacity-80'
                          : 'text-[var(--color-primary)] hover:opacity-80'
                    }`}
                  >
                    {t.services.button}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip - Rwanda green accents */}
      <section className="py-14 md:py-16 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                Built for citizens and local government
              </h2>
              <p className="mt-2 text-slate-600 max-w-xl">
                Transparent reporting, smart routing, and real-time updates—so every issue can be tracked from submission to resolution.
              </p>
            </div>
            <ul className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              {[
                { label: 'Transparent process', cn: 'text-[var(--color-primary)]' },
                { label: 'Faster resolution', cn: 'text-[var(--color-primary)]' },
                { label: 'Accountability', cn: 'text-[var(--color-primary)]' },
              ].map(({ label, cn }) => (
                <li key={label} className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className={`w-5 h-5 shrink-0 ${cn}`} />
                  <span className="font-medium">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA - Rwanda green like Home */}
      <section className="py-20 md:py-28 bg-[var(--color-primary)] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.06\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/svg%3E')]" aria-hidden />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to report an issue?
          </h2>
          <p className="mt-4 text-lg text-white/90">
            Submit your report in a few steps. We route it to the right department and keep you updated.
          </p>
          <Link
            to="/report"
            className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-white text-[var(--color-primary)] font-semibold rounded-xl hover:bg-white/95 transition-colors shadow-lg"
          >
            {t.services.button}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
