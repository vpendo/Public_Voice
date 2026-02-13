import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Send, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const IMG = {
  hero: '/Image/home4.jpg',
  side: '/Image/home%203.jpg',
};

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t.contact.successMessage);
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero - Rwanda colors */}
      <section className="relative bg-gradient-to-br from-[var(--rwanda-blue)] via-slate-800 to-[var(--rwanda-green)] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/svg%3E')]" aria-hidden />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75 mb-4">
            Rwanda · Get in touch
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-3xl">
            {t.contact.hero.title}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed">
            {t.contact.hero.description}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10 h-2 flex pointer-events-none">
          <div className="flex-1 bg-[var(--rwanda-blue)]" />
          <div className="flex-1 bg-[var(--rwanda-yellow)]" />
          <div className="flex-1 bg-[var(--rwanda-green)]" />
        </div>
      </section>

      {/* Hero image */}
      <section className="relative bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-1">
          <div className="rounded-2xl overflow-hidden shadow-xl ring-2 ring-slate-200/50">
            <img src={IMG.hero} alt="" className="w-full aspect-[21/9] object-cover" />
          </div>
        </div>
      </section>

      {/* Form + info */}
      <section className="py-20 md:py-28 bg-slate-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Form */}
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-md border border-slate-200/80">
              <h2 className="text-2xl font-bold mb-8 text-slate-900">
                {t.contact.form.title}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                    {t.contact.form.name}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--rwanda-blue)]/30 focus:border-[var(--rwanda-blue)] transition-colors"
                    placeholder={t.contact.form.namePlaceholder}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    {t.contact.form.email}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--rwanda-blue)]/30 focus:border-[var(--rwanda-blue)] transition-colors"
                    placeholder={t.contact.form.emailPlaceholder}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                    {t.contact.form.message}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--rwanda-blue)]/30 focus:border-[var(--rwanda-blue)] transition-colors resize-none"
                    placeholder={t.contact.form.messagePlaceholder}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-[var(--rwanda-blue)] text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:opacity-95 shadow-lg"
                >
                  <Send size={20} />
                  {t.contact.form.button}
                </button>
              </form>
            </div>

            {/* Contact info + image */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200/80">
                <h2 className="text-2xl font-bold mb-6 text-slate-900">
                  {t.contact.info.title}
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl flex-shrink-0 bg-[var(--rwanda-blue-light)] text-[var(--rwanda-blue)]">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-slate-900">
                        {t.contact.info.email}
                      </h3>
                      <a
                        href="mailto:contact@publicvoice.org"
                        className="text-slate-600 hover:text-[var(--rwanda-blue)] transition-colors block"
                      >
                        contact@publicvoice.org
                      </a>
                      <a
                        href="mailto:support@publicvoice.org"
                        className="text-slate-600 hover:text-[var(--rwanda-blue)] transition-colors block"
                      >
                        support@publicvoice.org
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl flex-shrink-0 bg-[var(--rwanda-green-light)] text-[var(--rwanda-green)]">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-slate-900">
                        {t.contact.info.location}
                      </h3>
                      <p className="text-slate-600">{t.contact.info.locationText}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img src={IMG.side} alt="" className="w-full aspect-[4/3] object-cover" />
              </div>

              <Link
                to="/report"
                className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-[var(--rwanda-green)] text-white font-semibold rounded-xl hover:opacity-95 transition-opacity"
              >
                Report a problem
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
