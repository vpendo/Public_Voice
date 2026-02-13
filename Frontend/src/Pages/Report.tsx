import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../api/client';
import { CheckCircle2, Send, MapPin, FileText } from 'lucide-react';

const IMG = {
  sidebar: '/Image/home%202.jpg',
};

export default function Report() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    institution: '',
    category: '',
    description: '',
  });

  useEffect(() => {
    if (user?.full_name) {
      setFormData((prev) => ({ ...prev, name: user.full_name }));
    }
  }, [user?.full_name]);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      await apiClient.post('/api/reports', {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        institution: formData.institution.trim(),
        category: formData.category.trim(),
        description: formData.description.trim(),
      });
      alert(t.report.successMessage);
      setFormData({ name: '', phone: '', location: '', institution: '', category: '', description: '' });
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : null;
      setSubmitError(typeof msg === 'string' ? msg : 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const inputClass =
    'w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--rwanda-blue)]/30 focus:border-[var(--rwanda-blue)] transition-colors';
  const labelClass = 'block text-sm font-semibold text-slate-700 mb-2';

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero - Rwanda colors */}
      <section className="relative bg-gradient-to-br from-[var(--rwanda-blue)] via-slate-800 to-[var(--rwanda-green)] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/svg%3E')]" aria-hidden />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 text-white/80 text-sm font-medium mb-4">
            <FileText className="w-4 h-4" />
            <span>Rwanda · Citizen reports</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-3xl">
            {t.report.hero.title}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed">
            {t.report.hero.description}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10 h-2 flex pointer-events-none">
          <div className="flex-1 bg-[var(--rwanda-blue)]" />
          <div className="flex-1 bg-[var(--rwanda-yellow)]" />
          <div className="flex-1 bg-[var(--rwanda-green)]" />
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="py-16 md:py-24 bg-slate-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 md:p-10 rounded-2xl shadow-md border border-slate-200/80">
                <h2 className="text-2xl font-bold mb-2 text-slate-900">
                  {t.report.form.title}
                </h2>
                <p className="text-slate-600 mb-8">
                  All fields help authorities respond faster. Your data is used only for this report.
                </p>
                {submitError && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    {submitError}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className={labelClass}>
                        {t.report.form.name}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={inputClass}
                        placeholder={t.report.form.namePlaceholder}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className={labelClass}>
                        {t.report.form.phone}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className={inputClass}
                        placeholder={t.report.form.phonePlaceholder}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="location" className={labelClass}>
                      {t.report.form.location}
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder={t.report.form.locationPlaceholder}
                    />
                  </div>
                  <div>
                    <label htmlFor="institution" className={labelClass}>
                      {t.report.form.institution}
                    </label>
                    <select
                      id="institution"
                      name="institution"
                      value={formData.institution}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    >
                      <option value="">{t.report.institutions.select}</option>
                      <option value="district">{t.report.institutions.district}</option>
                      <option value="sector">{t.report.institutions.sector}</option>
                      <option value="cell">{t.report.institutions.cell}</option>
                      <option value="village">{t.report.institutions.village}</option>
                      <option value="mininfra">{t.report.institutions.mininfra}</option>
                      <option value="mineduc">{t.report.institutions.mineduc}</option>
                      <option value="minisante">{t.report.institutions.minisante}</option>
                      <option value="localGov">{t.report.institutions.localGov}</option>
                      <option value="other">{t.report.institutions.other}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="category" className={labelClass}>
                      {t.report.form.category}
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    >
                      <option value="">{t.report.categories.select}</option>
                      <option value="roads">{t.report.categories.roads}</option>
                      <option value="water">{t.report.categories.water}</option>
                      <option value="security">{t.report.categories.security}</option>
                      <option value="sanitation">{t.report.categories.sanitation}</option>
                      <option value="electricity">{t.report.categories.electricity}</option>
                      <option value="health">{t.report.categories.health}</option>
                      <option value="education">{t.report.categories.education}</option>
                      <option value="other">{t.report.categories.other}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="description" className={labelClass}>
                      {t.report.form.description}
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={5}
                      className={`${inputClass} resize-none`}
                      placeholder={t.report.form.descriptionPlaceholder}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-8 py-4 bg-[var(--rwanda-green)] text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                  >
                    <Send size={20} />
                    {submitting ? 'Submitting...' : t.report.form.button}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200/80">
                <h3 className="text-lg font-bold mb-4 text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[var(--rwanda-green)] shrink-0" />
                  {t.report.whyReport.title}
                </h3>
                <ul className="space-y-3 text-slate-600 text-sm">
                  {[
                    t.report.whyReport.reason1,
                    t.report.whyReport.reason2,
                    t.report.whyReport.reason3,
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[var(--rwanda-green)] mt-0.5 font-bold">•</span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-l-[var(--rwanda-blue)] border border-slate-200/80">
                <h3 className="text-lg font-bold mb-4 text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[var(--rwanda-blue)] shrink-0" />
                  {t.report.howProcess.title}
                </h3>
                <ol className="space-y-3 text-slate-600 text-sm">
                  <li className="flex gap-2">
                    <span className="font-bold text-[var(--rwanda-blue)] shrink-0">1.</span>
                    <span>{t.report.howProcess.step1}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-[var(--rwanda-blue)] shrink-0">2.</span>
                    <span>{t.report.howProcess.step2}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-[var(--rwanda-blue)] shrink-0">3.</span>
                    <span>{t.report.howProcess.step3}</span>
                  </li>
                </ol>
              </div>

              <div className="rounded-2xl overflow-hidden shadow-md">
                <img src={IMG.sidebar} alt="" className="w-full aspect-[4/3] object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
