import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Target, Eye, CheckCircle2, MapPin, ArrowRight } from 'lucide-react';

const IMG = {
  hero: '/Image/home.jpg',
  whoWeAre: '/Image/home1.jpg',
  problem: '/Image/home%202.jpg',
};

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero - RGB blue */}
      <section className="relative bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-hover)] to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/svg%3E')]" aria-hidden />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75 mb-4">
            Rwanda · Civic-tech
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-3xl">
            {t.about.hero.title}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed">
            {t.about.hero.description}
          </p>
        </div>
      </section>

      {/* Hero image strip */}
      <section className="relative -mt-1 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl overflow-hidden shadow-xl -translate-y-0 ring-2 ring-slate-200/50">
            <img src={IMG.hero} alt="" className="w-full aspect-[21/9] object-cover" />
          </div>
        </div>
      </section>

      {/* Serving all of Rwanda */}
      <section className="py-16 md:py-20 bg-[var(--color-primary)]/5 border-y border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 text-[var(--color-primary)] font-semibold text-sm uppercase tracking-wider mb-4">
            <MapPin className="w-4 h-4" />
            <span>Nationwide</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            {t.about.rwandaReach.title}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            {t.about.rwandaReach.description}
          </p>
        </div>
      </section>

      {/* Who we are + image */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] lg:aspect-auto lg:min-h-[360px]">
              <img src={IMG.whoWeAre} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 ring-4 ring-inset ring-[var(--color-primary)]/20 rounded-2xl pointer-events-none" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-primary)] mb-3">
                Our story
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                {t.about.whoWeAre.title}
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                {t.about.whoWeAre.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The problem we solve + image */}
      <section className="py-20 md:py-28 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%2300a651\' fill-opacity=\'0.04\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 20V40H20M20 20h20v20\'/%3E%3C/g%3E%3C/svg%3E')]" aria-hidden />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-primary)] mb-3">
                Why we exist
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
                {t.about.problem.title}
              </h2>
              <ul className="space-y-4">
                {[
                  t.about.problem.issue1,
                  t.about.problem.issue2,
                  t.about.problem.issue3,
                  t.about.problem.issue4,
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5 text-[var(--color-primary)]" />
                    <span className="text-slate-600 leading-relaxed">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img src={IMG.problem} alt="" className="w-full aspect-[4/3] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision - Rwanda blue & green */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            <div className="bg-slate-50 p-8 md:p-10 rounded-2xl shadow-md border-l-4 border-l-[var(--color-primary)] hover:shadow-lg transition-shadow">
              <div className="inline-flex p-3 rounded-xl mb-5 bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                <Target className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-slate-900">
                {t.about.mission.title}
              </h2>
              <p className="leading-relaxed text-slate-600">
                {t.about.mission.description}
              </p>
            </div>
            <div className="bg-slate-50 p-8 md:p-10 rounded-2xl shadow-md border-l-4 border-l-[var(--color-primary)] hover:shadow-lg transition-shadow">
              <div className="inline-flex p-3 rounded-xl mb-5 bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                <Eye className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-slate-900">
                {t.about.vision.title}
              </h2>
              <p className="leading-relaxed text-slate-600">
                {t.about.vision.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Rwanda green */}
      <section className="py-20 md:py-28 bg-[var(--color-primary)] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.06\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/svg%3E')]" aria-hidden />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to make an impact?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Report an issue in your area or get in touch with our team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/report"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[var(--color-primary)] font-semibold rounded-xl hover:bg-white/95 transition-colors shadow-lg"
            >
              Report a problem
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/80 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
