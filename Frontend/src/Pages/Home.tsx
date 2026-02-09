import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { FileText, Cpu, Building2, Shield, Zap, Users } from 'lucide-react';

const IMG = {
  hero: '/Image/home%203.jpg',
};

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white home-page" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Hero: full-bleed image with overlay */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 animate-slow-zoom"
          style={{ backgroundImage: `url(${IMG.hero})` }}
        />
        <div
          className="absolute inset-0 z-[1]"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.35)' }}
          aria-hidden
        />
        <div className="relative z-10 w-11/12 mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-white tracking-tight drop-shadow-2xl mb-6 animate-fade-up">
            {t.home.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-white/95 max-w-2xl mx-auto mb-12 drop-shadow-md leading-relaxed animate-fade-up animation-delay-100">
            {t.home.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up animation-delay-200">
            <Link
              to="/services"
              className="px-8 py-4 text-white font-semibold rounded-xl transition-all duration-300 text-center shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: 'var(--color-primary, #0066CC)' }}
            >
              {t.home.hero.exploreServices}
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl transition-all duration-300 text-center hover:bg-white/15 backdrop-blur-sm"
            >
              {t.home.hero.getInTouch}
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* How it works */}
      <section className="py-24 bg-white">
        <div className="w-11/12 mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-slate-900">
            {t.home.howItWorks.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-slate-100 border-t-4"
              style={{ borderTopColor: 'var(--color-primary, #0066CC)' }}>
              <div className="inline-flex p-4 rounded-2xl mb-6 group-hover:scale-110 transition-transform" style={{ backgroundColor: 'rgba(0, 102, 204, 0.1)' }}>
                <FileText className="w-10 h-10" style={{ color: '#0066CC' }} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">{t.home.howItWorks.step1.title}</h3>
              <p className="text-slate-600 leading-relaxed">{t.home.howItWorks.step1.description}</p>
            </div>
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-slate-100 border-t-4"
              style={{ borderTopColor: 'var(--color-primary, #0066CC)' }}>
              <div className="inline-flex p-4 rounded-2xl mb-6 group-hover:scale-110 transition-transform" style={{ backgroundColor: 'rgba(0, 102, 204, 0.1)' }}>
                <Cpu className="w-10 h-10" style={{ color: '#0066CC' }} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">{t.home.howItWorks.step2.title}</h3>
              <p className="text-slate-600 leading-relaxed">{t.home.howItWorks.step2.description}</p>
            </div>
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-slate-100 border-t-4"
              style={{ borderTopColor: 'var(--color-primary, #0066CC)' }}>
              <div className="inline-flex p-4 rounded-2xl mb-6 group-hover:scale-110 transition-transform" style={{ backgroundColor: 'rgba(0, 102, 204, 0.1)' }}>
                <Building2 className="w-10 h-10" style={{ color: '#0066CC' }} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">{t.home.howItWorks.step3.title}</h3>
              <p className="text-slate-600 leading-relaxed">{t.home.howItWorks.step3.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why PublicVoice Matters */}
      <section className="py-24 bg-slate-50">
        <div className="w-11/12 mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-slate-900">
            {t.home.whyMatters.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4"
              style={{ borderLeftColor: '#0066CC' }}>
              <Shield className="w-10 h-10 mb-4" style={{ color: '#0066CC' }} />
              <h3 className="text-xl font-bold mb-2 text-slate-900">{t.home.whyMatters.transparency.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{t.home.whyMatters.transparency.description}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4"
              style={{ borderLeftColor: '#0066CC' }}>
              <Zap className="w-10 h-10 mb-4" style={{ color: '#0066CC' }} />
              <h3 className="text-xl font-bold mb-2 text-slate-900">{t.home.whyMatters.fasterResponse.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{t.home.whyMatters.fasterResponse.description}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4"
              style={{ borderLeftColor: '#0066CC' }}>
              <Users className="w-10 h-10 mb-4" style={{ color: '#0066CC' }} />
              <h3 className="text-xl font-bold mb-2 text-slate-900">{t.home.whyMatters.citizenPower.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{t.home.whyMatters.citizenPower.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="w-11/12 mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">{t.home.cta.title}</h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t.home.cta.description}
          </p>
          <Link
            to="/report"
            className="inline-block px-10 py-4 text-white font-semibold rounded-xl transition-all duration-300 text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: 'var(--color-primary, #0066CC)' }}
          >
            {t.home.cta.button}
          </Link>
        </div>
      </section>
    </div>
  );
}
