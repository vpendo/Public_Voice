import { useState } from 'react';
import { Mail, MapPin, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t.contact.successMessage);
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Hero with image */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-slate-50" />
        <div className="relative z-10 w-11/12 mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">{t.contact.hero.title}</h1>
              <p className="text-xl text-slate-600 max-w-xl leading-relaxed">{t.contact.hero.description}</p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img src="/Image/home4.jpg" alt="Contact us" className="w-full aspect-video object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Form + info + image */}
      <section className="py-20 bg-white">
        <div className="w-11/12 mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-slate-50/50 p-8 md:p-10 rounded-2xl shadow-lg border border-slate-100">
              <h2 className="text-2xl font-bold mb-8 text-slate-900">{t.contact.form.title}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block font-medium mb-2 text-slate-800">{t.contact.form.name}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30 focus:border-[#0066CC] transition-colors"
                    placeholder={t.contact.form.namePlaceholder}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block font-medium mb-2 text-slate-800">{t.contact.form.email}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30 focus:border-[#0066CC] transition-colors"
                    placeholder={t.contact.form.emailPlaceholder}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block font-medium mb-2 text-slate-800">{t.contact.form.message}</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30 focus:border-[#0066CC] transition-colors resize-none"
                    placeholder={t.contact.form.messagePlaceholder}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-8 py-4 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:opacity-95"
                  style={{ backgroundColor: '#0066CC' }}
                >
                  <Send size={20} />
                  {t.contact.form.button}
                </button>
              </form>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-50/50 p-8 rounded-2xl shadow-lg border border-slate-100">
                <h2 className="text-2xl font-bold mb-6 text-slate-900">{t.contact.info.title}</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl flex-shrink-0" style={{ backgroundColor: '#0066CC' }}>
                      <Mail className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-slate-900">{t.contact.info.email}</h3>
                      <a href="mailto:contact@publicvoice.org" className="text-slate-600 hover:text-[#0066CC] transition-colors block">contact@publicvoice.org</a>
                      <a href="mailto:support@publicvoice.org" className="text-slate-600 hover:text-[#0066CC] transition-colors block">support@publicvoice.org</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl flex-shrink-0" style={{ backgroundColor: '#0066CC' }}>
                      <MapPin className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-slate-900">{t.contact.info.location}</h3>
                      <p className="text-slate-600">{t.contact.info.locationText}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img src="/Image/home%203.jpg" alt="Get in touch" className="w-full aspect-[4/3] object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
