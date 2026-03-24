/** Contact form → POST /api/contact; team reads messages at publicvoicerwanda@gmail.com */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Send, ArrowRight } from 'lucide-react';
import { isAxiosError } from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { apiClient } from '../api/client';

const TEAM_INBOX = 'publicvoicerwanda@gmail.com';

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
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      await apiClient.post('/api/contact', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      });
      setSent(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      const msg =
        isAxiosError(err) && typeof err.response?.data?.detail === 'string'
          ? err.response.data.detail
          : t.contact.formError;
      setError(msg);
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const c = t.contact as typeof t.contact & {
    formSending?: string;
    formError?: string;
    info?: { inboxLine?: string };
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Section shells: 11/12 + centered */}
      {/* Hero - RGB blue */}
      <section className="relative bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-hover)] to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/svg%3E')]" aria-hidden />
        <div className="relative z-10 w-11/12 mx-auto px-4 sm:px-6 py-20 md:py-28">
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
      </section>

      {/* Hero image */}
      <section className="relative bg-white">
        <div className="w-11/12 mx-auto px-4 sm:px-6 -mt-1">
          <div className="rounded-2xl overflow-hidden shadow-xl ring-2 ring-slate-200/50">
            <img src={IMG.hero} alt="" className="w-full aspect-[21/9] object-cover" />
          </div>
        </div>
      </section>

      {/* Form + info */}
      <section className="py-20 md:py-28 bg-slate-50/50">
        <div className="w-11/12 mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Form */}
            <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-md border border-slate-200/80">
              <h2 className="text-2xl font-bold mb-8 text-slate-900">
                {t.contact.form.title}
              </h2>
              {sent && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
                  {t.contact.successMessage}
                </div>
              )}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}
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
                    disabled={sending}
                    className="w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-colors disabled:opacity-60"
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
                    disabled={sending}
                    className="w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-colors disabled:opacity-60"
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
                    disabled={sending}
                    rows={5}
                    minLength={3}
                    className="w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-colors resize-none disabled:opacity-60"
                    placeholder={t.contact.form.messagePlaceholder}
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full px-8 py-4 bg-[var(--color-primary)] text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:opacity-95 shadow-lg disabled:opacity-60"
                >
                  <Send size={20} />
                  {sending ? (c.formSending ?? 'Sending…') : t.contact.form.button}
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
                    <div className="p-3 rounded-xl flex-shrink-0 bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-slate-900">
                        {c.info?.inboxLine ?? t.contact.info.email}
                      </h3>
                      <a
                        href={`mailto:${TEAM_INBOX}`}
                        className="text-[var(--color-primary)] font-medium hover:underline break-all"
                      >
                        {TEAM_INBOX}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl flex-shrink-0 bg-[var(--color-primary-light)] text-[var(--color-primary)]">
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
                className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:opacity-95 transition-opacity"
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
