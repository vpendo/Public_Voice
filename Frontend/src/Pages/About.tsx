import { useLanguage } from '../contexts/LanguageContext';

export default function About() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <section className="bg-white py-20">
        <div className="w-11/12 mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#1E293B' }}>{t.about.hero.title}</h1>
          <p className="text-xl max-w-2xl" style={{ color: '#64748B' }}>
            {t.about.hero.description}
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="w-11/12 mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img
                src="/home.jpg"
                alt="Community engagement"
                className="w-full rounded-xl shadow-2xl object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold" style={{ color: '#1E293B' }}>{t.about.whoWeAre.title}</h2>
              <p className="leading-relaxed text-lg" style={{ color: '#64748B' }}>
                {t.about.whoWeAre.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6 order-2 lg:order-1">
              <h2 className="text-3xl font-bold" style={{ color: '#1E293B' }}>{t.about.problem.title}</h2>
              <ul className="space-y-4" style={{ color: '#64748B' }}>
                <li className="flex items-start gap-3">
                  <span className="text-xl" style={{ color: '#0066CC' }}>✗</span>
                  <span>{t.about.problem.issue1}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl" style={{ color: '#0066CC' }}>✗</span>
                  <span>{t.about.problem.issue2}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl" style={{ color: '#0066CC' }}>✗</span>
                  <span>{t.about.problem.issue3}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl" style={{ color: '#0066CC' }}>✗</span>
                  <span>{t.about.problem.issue4}</span>
                </li>
              </ul>
            </div>
            <div className="order-1 lg:order-2">
              <img
                src="/home.jpg"
                alt="Community challenges"
                className="w-full rounded-xl shadow-2xl object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-xl shadow-xl border border-slate-200" style={{ borderLeft: '4px solid #0066CC' }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1E293B' }}>{t.about.mission.title}</h2>
              <p className="leading-relaxed" style={{ color: '#64748B' }}>
                {t.about.mission.description}
              </p>
            </div>
            <div className="bg-white p-10 rounded-xl shadow-xl border border-slate-200" style={{ borderLeft: '4px solid #0066CC' }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1E293B' }}>{t.about.vision.title}</h2>
              <p className="leading-relaxed" style={{ color: '#64748B' }}>
                {t.about.vision.description}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
