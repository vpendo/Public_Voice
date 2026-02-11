import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../api/client';
import { CheckCircle, Send } from 'lucide-react';

export default function Report() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    institution: '',
    category: '',
    description: ''
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
      const msg = err && typeof err === 'object' && 'response' in err
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
      [e.target.name]: e.target.value
    });
  };

  const inputClass = "w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30 focus:border-[#0066CC] transition-colors bg-white";
  const labelClass = "block font-medium mb-2 text-slate-800";

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="w-11/12 mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">{t.report.hero.title}</h1>
            <p className="text-xl text-slate-600 leading-relaxed">{t.report.hero.description}</p>
          </div>
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="py-16 bg-white">
        <div className="w-11/12 mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="bg-slate-50/80 p-8 md:p-10 rounded-2xl shadow-lg border border-slate-100">
                <h2 className="text-2xl font-bold mb-2 text-slate-900">{t.report.form.title}</h2>
                <p className="text-slate-600 mb-8">All fields help authorities respond faster. Your data is used only for this report.</p>
                {submitError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    {submitError}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className={labelClass}>{t.report.form.name}</label>
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
                      <label htmlFor="phone" className={labelClass}>{t.report.form.phone}</label>
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
                    <label htmlFor="location" className={labelClass}>{t.report.form.location}</label>
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
                    <label htmlFor="institution" className={labelClass}>{t.report.form.institution}</label>
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
                    <label htmlFor="category" className={labelClass}>{t.report.form.category}</label>
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
                    <label htmlFor="description" className={labelClass}>{t.report.form.description}</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={6}
                      className={`${inputClass} resize-none`}
                      placeholder={t.report.form.descriptionPlaceholder}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-8 py-4 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#0066CC' }}
                  >
                    <Send size={20} />
                    {submitting ? 'Submitting...' : t.report.form.button}
                  </button>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50/80 p-6 rounded-2xl shadow-lg border border-slate-100">
                <h3 className="text-lg font-bold mb-4 text-slate-900 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" style={{ color: '#0066CC' }} />
                  {t.report.whyReport.title}
                </h3>
                <ul className="space-y-3 text-slate-600 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0066CC] mt-0.5">•</span>
                    <span>{t.report.whyReport.reason1}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0066CC] mt-0.5">•</span>
                    <span>{t.report.whyReport.reason2}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0066CC] mt-0.5">•</span>
                    <span>{t.report.whyReport.reason3}</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 border-l-4" style={{ borderLeftColor: '#0066CC' }}>
                <h3 className="text-lg font-bold mb-4 text-slate-900">{t.report.howProcess.title}</h3>
                <ol className="space-y-3 text-slate-600 text-sm">
                  <li className="flex gap-2">
                    <span className="font-bold text-[#0066CC]">1.</span>
                    <span>{t.report.howProcess.step1}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-[#0066CC]">2.</span>
                    <span>{t.report.howProcess.step2}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-[#0066CC]">3.</span>
                    <span>{t.report.howProcess.step3}</span>
                  </li>
                </ol>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img src="/Image/home%202.jpg" alt="Report issues in your community" className="w-full aspect-[4/3] object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
