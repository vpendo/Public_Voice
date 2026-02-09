import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { FileText, Cpu, BarChart3 } from 'lucide-react';

const IMG = {
  report: '/Image/home.jpg',
  smart: '/Image/home1.jpg',
  track: '/Image/home%202.jpg',
};

export default function Services() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Hero with image */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-slate-50" />
        <div className="relative z-10 w-11/12 mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">{t.services.hero.title}</h1>
              <p className="text-xl text-slate-600 max-w-xl leading-relaxed">{t.services.hero.description}</p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img src={IMG.report} alt="Our services" className="w-full aspect-video object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Service cards with images */}
      <section className="py-20 bg-white">
        <div className="w-11/12 mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden border-t-4" style={{ borderTopColor: '#0066CC' }}>
              <img src={IMG.report} alt="Report problems" className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="p-8">
                <div className="inline-flex p-3 rounded-xl mb-4" style={{ backgroundColor: 'rgba(0, 102, 204, 0.1)' }}>
                  <FileText className="w-8 h-8" style={{ color: '#0066CC' }} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">{t.services.service1.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">{t.services.service1.description}</p>
              </div>
            </div>
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden border-t-4" style={{ borderTopColor: '#0066CC' }}>
              <img src={IMG.smart} alt="Smart categorization" className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="p-8">
                <div className="inline-flex p-3 rounded-xl mb-4" style={{ backgroundColor: 'rgba(0, 102, 204, 0.1)' }}>
                  <Cpu className="w-8 h-8" style={{ color: '#0066CC' }} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">{t.services.service2.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">{t.services.service2.description}</p>
              </div>
            </div>
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden border-t-4" style={{ borderTopColor: '#0066CC' }}>
              <img src={IMG.track} alt="Track progress" className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="p-8">
                <div className="inline-flex p-3 rounded-xl mb-4" style={{ backgroundColor: 'rgba(0, 102, 204, 0.1)' }}>
                  <BarChart3 className="w-8 h-8" style={{ color: '#0066CC' }} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">{t.services.service3.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">{t.services.service3.description}</p>
              </div>
            </div>
          </div>
          <div className="text-center mt-16">
            <Link
              to="/report"
              className="inline-block px-10 py-4 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
              style={{ backgroundColor: '#0066CC' }}
            >
              {t.services.button}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
