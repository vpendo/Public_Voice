import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import {
  FileText,
  Cpu,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Shield,
  Zap,
} from 'lucide-react';

const IMG = {
  hero: '/Image/home%203.jpg',
  report: '/Image/home.jpg',
  smart: '/Image/home1.jpg',
  track: '/Image/home%202.jpg',
  cta: '/Image/home4.jpg',
};

const SERVICES: Array<{
  titleKey: 'service1' | 'service2' | 'service3';
  icon: typeof FileText;
  image: 'report' | 'smart' | 'track';
  step: number;
}> = [
  { titleKey: 'service1', icon: FileText, image: 'report', step: 1 },
  { titleKey: 'service2', icon: Cpu, image: 'smart', step: 2 },
  { titleKey: 'service3', icon: BarChart3, image: 'track', step: 3 },
];

export default function Services() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero - full background image (Rwanda citizen-focused) */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={IMG.hero}
            alt=""
            className="w-full h-full object-cover"
            aria-hidden
          />
          <div className="absolute inset-0 bg-slate-900/70" aria-hidden />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90 mb-4">
            {t.services.hero.badge}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
            {t.services.hero.title}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/95 max-w-2xl mx-auto leading-relaxed">
            {t.services.hero.description}
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link
              to="/report"
              className="inline-flex items-center gap-2 px-7 py-4 bg-white text-[var(--color-primary)] font-semibold rounded-xl hover:bg-white/95 transition-all shadow-lg hover:shadow-xl"
            >
              {t.services.button}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              {t.services.contactUs}
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* What we offer - clear section header */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <header className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-3">
              {t.services.whatWeOffer}
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-800 tracking-tight">
              {t.services.threeWays}
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              {t.services.threeWaysDesc}
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {SERVICES.map(({ titleKey, icon: Icon, image, step }) => (
              <article
                key={titleKey}
                className="group flex flex-col bg-white rounded-2xl shadow-md border border-slate-200/80 overflow-hidden hover:shadow-xl hover:border-[var(--color-primary)]/30 transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={IMG[image]}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 w-11 h-11 rounded-full bg-[var(--color-primary)] text-white font-bold text-base flex items-center justify-center shadow-lg ring-4 ring-white">
                    {step}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" aria-hidden />
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div className="inline-flex p-3 rounded-xl mb-4 w-fit bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                    <Icon className="w-7 h-7" strokeWidth={1.8} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-3">
                    {t.services[titleKey].title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed flex-1">
                    {t.services[titleKey].description}
                  </p>
                  <Link
                    to="/report"
                    className="mt-6 inline-flex items-center gap-2 text-[var(--color-primary)] font-semibold hover:opacity-90 transition-opacity"
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

      {/* Trust / benefits - visual strip with icons */}
      <section className="py-16 md:py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                {t.services.trustTitle}
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed max-w-lg">
                {t.services.trustDesc}
              </p>
            </div>
            <ul className="flex flex-col sm:flex-row gap-5 sm:gap-8 flex-wrap">
              {[
                { labelKey: 'trust1' as const, Icon: Shield },
                { labelKey: 'trust2' as const, Icon: Zap },
                { labelKey: 'trust3' as const, Icon: CheckCircle2 },
              ].map(({ labelKey, Icon }) => (
                <li
                  key={labelKey}
                  className="flex items-center gap-3 text-slate-700 font-medium"
                >
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span>{t.services[labelKey]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA - report area with image (like Home) */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-3">
                <MapPin className="w-4 h-4 inline mr-1" />
                Nationwide
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 tracking-tight mb-4">
                {t.services.ctaTitle}
              </h2>
              <p className="text-slate-600 mb-8 max-w-lg leading-relaxed">
                {t.services.ctaDesc}
              </p>
              <Link
                to="/report"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:opacity-95 hover:shadow-lg transition-all"
              >
                {t.services.button}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 aspect-[4/3] lg:aspect-auto lg:min-h-[320px]">
              <img
                src={IMG.cta}
                alt=""
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/40 via-transparent to-transparent"
                aria-hidden
              />
            </div>
          </div>
        </div>
      </section>

      <div className="h-4 bg-white" aria-hidden />
    </div>
  );
}
