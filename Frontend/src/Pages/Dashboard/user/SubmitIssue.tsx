import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { apiClient } from '../../../api/client';
import { Send, FileText, MapPin, Phone, Tag } from 'lucide-react';

const CATEGORY_KEYS = ['roads', 'water', 'security', 'sanitation', 'electricity', 'health', 'education', 'other'] as const;

const inputClass =
  'w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--rwanda-blue)]/30 focus:border-[var(--rwanda-blue)] bg-white';

export function SubmitIssue() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await apiClient.post('/api/reports', {
        title: formData.title.trim() || undefined,
        name: user?.full_name ?? '',
        phone: formData.phone.trim(),
        location: formData.location.trim() || 'Not specified',
        institution: 'other',
        category: formData.category.trim(),
        description: formData.description.trim(),
      });
      navigate('/user/issues');
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : null;
      setError(typeof msg === 'string' ? msg : t.user.submitIssue.submitError);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const u = t.user.submitIssue;
  const cats = t.user.categories;

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <span className="w-1 h-4 rounded-full bg-[var(--rwanda-blue)]" />
            {u.citizenReport}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{u.title}</h1>
          <p className="text-slate-500 mt-0.5">{u.subtitle}</p>
        </div>
      </div>

      <div className="max-w-2xl rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="h-1 flex">
          <div className="flex-1 bg-[var(--rwanda-blue)]" />
          <div className="flex-1 bg-[var(--rwanda-yellow)]" />
          <div className="flex-1 bg-[var(--rwanda-green)]" />
        </div>
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-2">
            <FileText size={16} className="text-[var(--rwanda-blue)]" />
            {u.reportForm}
          </h2>
        </div>
        <div className="p-6 md:p-8">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1.5">
                {u.titleLabel}
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={inputClass}
                placeholder={u.titlePlaceholder}
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">
                {u.description} <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                className={`${inputClass} resize-none`}
                placeholder={u.descriptionPlaceholder}
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Tag size={14} />
                {u.category} <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">{u.categoryPlaceholder}</option>
                {CATEGORY_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {cats[key]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Phone size={14} />
                {u.phone} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder={u.phonePlaceholder}
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                <MapPin size={14} />
                {u.locationOptional}
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={inputClass}
                placeholder={u.locationPlaceholder}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--rwanda-green)] text-white font-semibold rounded-xl hover:opacity-95 disabled:opacity-70 transition-opacity shadow-md"
            >
              <Send size={18} />
              {submitting ? u.submitting : u.submitButton}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
