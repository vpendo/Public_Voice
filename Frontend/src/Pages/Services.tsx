import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export default function Services() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <section className="bg-white py-20">
        <div className="w-11/12 mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#1E293B' }}>{t.services.hero.title}</h1>
          <p className="text-xl max-w-2xl" style={{ color: '#64748B' }}>
            {t.services.hero.description}
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="w-11/12 mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 border border-slate-200" style={{ borderTop: '4px solid #0066CC' }}>
              <div className="text-5xl mb-6">📋</div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#1E293B' }}>{t.services.service1.title}</h3>
              <p className="mb-6" style={{ color: '#64748B' }}>
                {t.services.service1.description}
              </p>
              <img
                src="/home.jpg"
                alt="Reporting issues"
                className="w-full h-48 object-cover rounded-lg mt-4"
              />
            </div>
            <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 border border-slate-200" style={{ borderTop: '4px solid #0066CC' }}>
              <div className="text-5xl mb-6">🤖</div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#1E293B' }}>{t.services.service2.title}</h3>
              <p className="mb-6" style={{ color: '#64748B' }}>
                {t.services.service2.description}
              </p>
              <img
                src="/home.jpg"
                alt="Smart categorization"
                className="w-full h-48 object-cover rounded-lg mt-4"
              />
            </div>
            <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 border border-slate-200" style={{ borderTop: '4px solid #0066CC' }}>
              <div className="text-5xl mb-6">📊</div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#1E293B' }}>{t.services.service3.title}</h3>
              <p className="mb-6" style={{ color: '#64748B' }}>
                {t.services.service3.description}
              </p>
              <img
                src="/home.jpg"
                alt="Tracking progress"
                className="w-full h-48 object-cover rounded-lg mt-4"
              />
            </div>
          </div>
          <div className="text-center">
            <Link
              to="/report"
              className="inline-block px-10 py-4 text-white font-bold rounded-lg transition duration-300 shadow-xl"
              style={{ backgroundColor: '#0066CC' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0052A3'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0066CC'}
            >
              {t.services.button}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
