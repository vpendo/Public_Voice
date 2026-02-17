import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import {
  FileText,
  Cpu,
  Building2,
  Shield,
  Zap,
  Users,
  Megaphone,
  ArrowRight,
  MapPin,
} from 'lucide-react';

const IMG = {
  hero: '/Image/home%203.jpg',
  citizens: '/Image/home4.jpg',
  steps: '/Image/home1.jpg',
};

const STEPS = [
  { key: 'step1' as const, icon: FileText },
  { key: 'step2' as const, icon: Cpu },
  { key: 'step3' as const, icon: Building2 },
];

const WHY_ITEMS = [
  { key: 'transparency' as const, icon: Shield, color: 'blue' as const },
  { key: 'fasterResponse' as const, icon: Zap, color: 'yellow' as const },
  { key: 'citizenPower' as const, icon: Users, color: 'green' as const },
];

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero with image */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 animate-slow-zoom"
          style={{ backgroundImage: `url(${IMG.hero})` }}
        />
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/45 via-black/35 to-black/55" aria-hidden />
        <div className="relative z-10 w-11/12 max-w-6xl mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm text-white/95 text-sm font-medium mb-8 animate-fade-up">
            <Megaphone className="w-4 h-4" />
            <span>Rwanda · Civic engagement</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] text-white tracking-tight drop-shadow-2xl mb-6 animate-fade-up">
            {t.home.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-white/95 max-w-2xl mx-auto mb-12 drop-shadow-md leading-relaxed animate-fade-up animation-delay-100">
            {t.home.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up animation-delay-200">
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--color-primary)] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:opacity-95 hover:scale-[1.02] active:scale-[0.98]"
            >
              {t.home.hero.exploreServices}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-xl transition-all duration-300 hover:bg-white/15 backdrop-blur-sm"
            >
              {t.home.hero.getInTouch}
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* For Rwandan citizens - image + text */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] lg:aspect-auto lg:min-h-[400px]">
              <img
                src={IMG.citizens}
                alt="Rwandan community"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 ring-4 ring-inset ring-[var(--color-primary)]/30 rounded-2xl pointer-events-none" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 text-[var(--color-primary)] font-semibold text-sm uppercase tracking-wider mb-4">
                <MapPin className="w-4 h-4" />
                <span>Nationwide</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                {t.home.forCitizens.title}
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                {t.home.forCitizens.body}
              </p>
              <Link
                to="/report"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:opacity-95 transition-opacity"
              >
                {t.home.forCitizens.reportCta}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - with image strip */}
      <section className="py-20 md:py-28 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%232063d5\' fill-opacity=\'0.04\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 20V40H20M20 20h20v20\'/%3E%3C/g%3E%3C/svg%3E')]" aria-hidden />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl overflow-hidden shadow-lg mb-16 max-w-4xl mx-auto">
            <img src={IMG.steps} alt="" className="w-full aspect-[21/9] object-cover" />
          </div>
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-primary)] mb-3">
              Process
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
              {t.home.howItWorks.title}
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              {t.home.howItWorks.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {STEPS.map(({ key, icon: Icon }, index) => (
              <div
                key={key}
                className="group relative bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 text-center border border-slate-100 border-t-4 border-t-[var(--color-primary)]"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[var(--color-primary)] text-white text-sm font-bold flex items-center justify-center shadow">
                  {index + 1}
                </div>
                <div className="inline-flex p-4 rounded-2xl mb-6 bg-[var(--color-primary-light)] text-[var(--color-primary)] group-hover:scale-105 transition-transform duration-300">
                  <Icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900">
                  {t.home.howItWorks[key].title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {t.home.howItWorks[key].description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why it matters - Rwanda flag colors */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-primary)] mb-3">
              For citizens & government
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
              {t.home.whyMatters.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WHY_ITEMS.map(({ key, icon: Icon }) => (
              <div
                key={key}
                className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl border border-slate-100 border-l-4 border-l-[var(--color-primary)] transition-all duration-300 flex flex-col items-start text-left"
              >
                <div className="inline-flex p-3 rounded-xl mb-5 bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                  <Icon className="w-9 h-9" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">
                  {t.home.whyMatters[key].title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t.home.whyMatters[key].description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - RGB blue */}
      <section className="py-20 md:py-28 bg-[var(--color-primary)] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.06\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/svg%3E')]" aria-hidden />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t.home.cta.title}
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t.home.cta.description}
          </p>
          <Link
            to="/report"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-[var(--color-primary)] font-semibold rounded-xl text-lg transition-all duration-300 shadow-xl hover:bg-white/95 hover:scale-[1.02] active:scale-[0.98]"
          >
            {t.home.cta.button}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
