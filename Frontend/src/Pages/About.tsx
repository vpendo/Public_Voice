import { useLanguage } from '../contexts/LanguageContext';
import { Target, Eye, CheckCircle } from 'lucide-react';

const IMG = {
  community: '/Image/home.jpg',
  challenge: '/Image/home%202.jpg',
};

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Hero with image */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-slate-50" />
        <div className="relative z-10 w-11/12 mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">{t.about.hero.title}</h1>
              <p className="text-xl text-slate-600 max-w-xl leading-relaxed">{t.about.hero.description}</p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img src={IMG.community} alt="Community engagement" className="w-full aspect-[16/10] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Serving all of Rwanda */}
      <section className="py-16 bg-[#0066CC]/5 border-y border-slate-100">
        <div className="w-11/12 mx-auto px-4 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">{t.about.rwandaReach.title}</h2>
          <p className="text-lg text-slate-600 leading-relaxed">{t.about.rwandaReach.description}</p>
        </div>
      </section>

      {/* Who we are + image */}
      <section className="py-20 bg-white">
        <div className="w-11/12 mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <img src="/Image/home1.jpg" alt="Who we are" className="w-full rounded-2xl shadow-xl object-cover aspect-[4/3]" />
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{t.about.whoWeAre.title}</h2>
              <p className="leading-relaxed text-lg text-slate-600">{t.about.whoWeAre.description}</p>
            </div>
          </div>

          {/* Problem we solve */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-24">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{t.about.problem.title}</h2>
              <ul className="space-y-4 text-slate-600">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#0066CC' }} />
                  <span>{t.about.problem.issue1}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#0066CC' }} />
                  <span>{t.about.problem.issue2}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#0066CC' }} />
                  <span>{t.about.problem.issue3}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#0066CC' }} />
                  <span>{t.about.problem.issue4}</span>
                </li>
              </ul>
            </div>
            <div>
              <img src={IMG.challenge} alt="Community challenges" className="w-full rounded-2xl shadow-xl object-cover aspect-[4/3]" />
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-24">
            <div className="bg-slate-50 p-10 rounded-2xl shadow-lg border-l-4" style={{ borderLeftColor: '#0066CC' }}>
              <Target className="w-12 h-12 mb-4" style={{ color: '#0066CC' }} />
              <h2 className="text-2xl font-bold mb-4 text-slate-900">{t.about.mission.title}</h2>
              <p className="leading-relaxed text-slate-600">{t.about.mission.description}</p>
            </div>
            <div className="bg-slate-50 p-10 rounded-2xl shadow-lg border-l-4" style={{ borderLeftColor: '#0066CC' }}>
              <Eye className="w-12 h-12 mb-4" style={{ color: '#0066CC' }} />
              <h2 className="text-2xl font-bold mb-4 text-slate-900">{t.about.vision.title}</h2>
              <p className="leading-relaxed text-slate-600">{t.about.vision.description}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
