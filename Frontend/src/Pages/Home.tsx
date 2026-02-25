import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import {
  FileText,
  Cpu,
  BarChart3,
  Shield,
  Zap,
  Users,
  Megaphone,
  ArrowRight,
  MapPin,
} from 'lucide-react';

const IMG = {
  hero: '/Image/home%203.jpg',
  hero2: '/Image/home1.jpg',
  citizens: '/Image/home4.jpg',
  steps: '/Image/home1.jpg',
};

const HERO_SLIDES = [IMG.hero, IMG.hero2];
const HERO_SLIDE_SECONDS = 6;
const HERO_INTERVAL_MS = HERO_SLIDE_SECONDS * 1000;

const STEPS = [
  { key: 'step1' as const, icon: FileText },
  { key: 'step2' as const, icon: Cpu },
  { key: 'step3' as const, icon: BarChart3 },
];

const WHY_ITEMS = [
  { key: 'transparency' as const, icon: Shield, color: 'blue' as const },
  { key: 'fasterResponse' as const, icon: Zap, color: 'yellow' as const },
  { key: 'citizenPower' as const, icon: Users, color: 'green' as const },
];

export default function Home() {
  const { t } = useLanguage();
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, HERO_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero with sliding background images */}
      <section
        className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
        aria-label="Hero"
      >
        {HERO_SLIDES.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 animate-slow-zoom transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `url(${src})`,
              opacity: i === heroIndex ? 1 : 0,
              zIndex: i === heroIndex ? 0 : -1,
            }}
            aria-hidden={i !== heroIndex}
          />
        ))}
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
        {/* Slide indicators */}
        <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setHeroIndex(i)}
              className="h-2.5 w-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              style={{
                backgroundColor: i === heroIndex ? 'white' : 'rgba(255,255,255,0.4)',
                transform: i === heroIndex ? 'scale(1.2)' : 'scale(1)',
              }}
              aria-label={`Slide ${i + 1} of ${HERO_SLIDES.length}`}
              aria-current={i === heroIndex ? 'true' : undefined}
            />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* For Rwandan citizens - image + text */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200/60 aspect-[4/3] lg:aspect-auto lg:min-h-[380px]">
              <img
                src={IMG.citizens}
                alt="Rwandan community"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="inline-flex items-center gap-2 text-[var(--color-primary)] font-semibold text-xs uppercase tracking-[0.15em] mb-4">
                <MapPin className="w-4 h-4" />
                <span>Nationwide</span>
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 tracking-tight mb-5">
                {t.home.forCitizens.title}
              </h2>
              <p className="text-slate-600 leading-relaxed mb-8 max-w-lg">
                {t.home.forCitizens.body}
              </p>
              <Link
                to="/report"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:opacity-95 transition-opacity text-sm"
              >
                {t.home.forCitizens.reportCta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - full background image like Why it matters */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={IMG.steps}
            alt=""
            className="w-full h-full object-cover"
            aria-hidden
          />
          <div className="absolute inset-0 bg-slate-900/75" aria-hidden />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <header className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90 mb-3">
              Process
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              {t.home.howItWorks.title}
            </h2>
            <p className="mt-4 text-base md:text-lg text-white/90 max-w-xl mx-auto">
              {t.home.howItWorks.subtitle}
            </p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {STEPS.map(({ key, icon: Icon }, index) => (
              <article
                key={key}
                className="relative bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 border-l-4 border-l-[var(--color-primary)] p-8 pt-10 hover:bg-white hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className="absolute top-0 left-0 right-0 flex justify-center -translate-y-1/2">
                  <span className="relative z-10 w-10 h-10 rounded-full bg-[var(--color-primary)] text-white text-sm font-bold flex items-center justify-center shadow-md ring-4 ring-white">
                    {index + 1}
                  </span>
                </div>
                <div className="absolute top-5 left-6 right-6 h-px bg-slate-200" aria-hidden />
                <div className="inline-flex p-4 rounded-xl mb-5 bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <Icon className="w-9 h-9" strokeWidth={1.8} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  {t.home.howItWorks[key].title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t.home.howItWorks[key].description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why it matters - with background image */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={IMG.citizens}
            alt=""
            className="w-full h-full object-cover"
            aria-hidden
          />
          <div className="absolute inset-0 bg-slate-900/75" aria-hidden />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <header className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90 mb-3">
              For citizens & government
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              {t.home.whyMatters.title}
            </h2>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {WHY_ITEMS.map(({ key, icon: Icon }) => (
              <article
                key={key}
                className="bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/20 border-l-4 border-l-[var(--color-primary)] hover:bg-white hover:shadow-xl transition-all duration-300"
              >
                <div className="inline-flex p-3 rounded-lg mb-5 bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <Icon className="w-8 h-8" strokeWidth={1.8} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  {t.home.whyMatters[key].title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t.home.whyMatters[key].description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Report area / CTA - image + call to action */}
      <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-3">
                Get started
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 tracking-tight mb-4">
                {t.home.cta.title}
              </h2>
              <p className="text-slate-600 mb-8 max-w-lg leading-relaxed">
                {t.home.cta.description}
              </p>
              <Link
                to="/report"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--color-primary)] text-white font-semibold rounded-xl transition-all duration-200 hover:opacity-95 hover:shadow-lg"
              >
                {t.home.cta.button}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="order-1 lg:order-2 relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 aspect-[4/3] lg:aspect-auto lg:min-h-[320px]">
              <img
                src={IMG.hero}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/40 via-transparent to-transparent" aria-hidden />
            </div>
          </div>
        </div>
      </section>
      {/* Light strip above footer so footer is clearly separate (like Contact) */}
      <div className="h-4 bg-white" aria-hidden />
    </div>
  );
}
