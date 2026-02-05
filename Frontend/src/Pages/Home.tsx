import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Section 1: Hero */}
      <section className="relative bg-white py-24">
        <div className="w-11/12 mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight" style={{ color: '#1E293B' }}>
              {t.home.hero.title}
            </h1>
            <p className="text-xl leading-relaxed" style={{ color: '#64748B' }}>
              {t.home.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/services"
                className="px-8 py-4 text-white font-bold rounded-lg transition duration-300 text-center shadow-md hover:shadow-lg"
                style={{ backgroundColor: '#0066CC' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0052A3'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0066CC'}
              >
                {t.home.hero.exploreServices}
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 border-2 font-bold rounded-lg transition duration-300 text-center"
                style={{ 
                  borderColor: '#0066CC',
                  color: '#0066CC',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0066CC';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#0066CC';
                }}
              >
                {t.home.hero.getInTouch}
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src="/home.jpg"
              alt="Citizens engaging with PublicVoice"
              className="w-full max-w-lg rounded-xl shadow-2xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* Section 2: How PublicVoice Works */}
      <section className="py-20 bg-white">
        <div className="w-11/12 mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-slate-900">{t.home.howItWorks.title}</h2>
          <p className="text-center text-slate-600 mb-16 max-w-2xl mx-auto text-lg">
            {t.home.howItWorks.subtitle}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 text-center border border-slate-200" style={{ borderTop: '4px solid #0066CC' }}>
              <div className="text-6xl mb-6">📝</div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: '#1E293B' }}>{t.home.howItWorks.step1.title}</h3>
              <p style={{ color: '#64748B' }}>
                {t.home.howItWorks.step1.description}
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 text-center border border-slate-200" style={{ borderTop: '4px solid #0066CC' }}>
              <div className="text-6xl mb-6">🤖</div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: '#1E293B' }}>{t.home.howItWorks.step2.title}</h3>
              <p style={{ color: '#64748B' }}>
                {t.home.howItWorks.step2.description}
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 text-center border border-slate-200" style={{ borderTop: '4px solid #0066CC' }}>
              <div className="text-6xl mb-6">🏛</div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: '#1E293B' }}>{t.home.howItWorks.step3.title}</h3>
              <p style={{ color: '#64748B' }}>
                {t.home.howItWorks.step3.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Why PublicVoice Matters */}
      <section className="py-20 bg-white">
        <div className="w-11/12 mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16" style={{ color: '#1E293B' }}>{t.home.whyMatters.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-xl border border-slate-200" style={{ borderLeft: '4px solid #0066CC' }}>
              <h3 className="text-2xl font-bold mb-3" style={{ color: '#1E293B' }}>{t.home.whyMatters.transparency.title}</h3>
              <p style={{ color: '#64748B' }}>
                {t.home.whyMatters.transparency.description}
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-xl border border-slate-200" style={{ borderLeft: '4px solid #0066CC' }}>
              <h3 className="text-2xl font-bold mb-3" style={{ color: '#1E293B' }}>{t.home.whyMatters.fasterResponse.title}</h3>
              <p style={{ color: '#64748B' }}>
                {t.home.whyMatters.fasterResponse.description}
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-xl border border-slate-200" style={{ borderLeft: '4px solid #0066CC' }}>
              <h3 className="text-2xl font-bold mb-3" style={{ color: '#1E293B' }}>{t.home.whyMatters.citizenPower.title}</h3>
              <p style={{ color: '#64748B' }}>
                {t.home.whyMatters.citizenPower.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Call to Action */}
      <section className="py-20 bg-white">
        <div className="w-11/12 mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6" style={{ color: '#1E293B' }}>{t.home.cta.title}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: '#64748B' }}>
            {t.home.cta.description}
          </p>
          <Link
            to="/report"
            className="inline-block px-10 py-4 text-white font-bold rounded-lg transition duration-300 text-lg shadow-xl"
            style={{ backgroundColor: '#0066CC' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0052A3'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0066CC'}
          >
            {t.home.cta.button}
          </Link>
        </div>
      </section>
    </div>
  );
}
