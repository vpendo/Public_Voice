import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { apiClient } from '../../../api/client';
import { REPORT_CATEGORIES } from '../../../constants/categories';
import { FileText, MapPin, Phone, Tag, ArrowLeft } from 'lucide-react';

const inputClass =
  'w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] bg-white';

interface ReportItem {
  id: number;
  title: string | null;
  name: string;
  phone: string;
  location: string;
  institution: string;
  category: string;
  raw_description: string;
  status: string;
}

export function EditIssue() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [report, setReport] = useState<ReportItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    phone: '',
    location: '',
    category: '',
    description: '',
  });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function fetchReport() {
      try {
        const { data } = await apiClient.get<ReportItem>(`/api/reports/${id}`);
        if (!cancelled) {
          setReport(data);
          setFormData({
            title: data.title ?? '',
            name: data.name ?? '',
            phone: data.phone ?? '',
            location: data.location ?? '',
            category: data.category ?? '',
            description: data.raw_description ?? '',
          });
        }
      } catch {
        if (!cancelled) setError(t.user.editIssue.error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchReport();
    return () => { cancelled = true; };
  }, [id, t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError(null);
    setSubmitting(true);
    try {
      await apiClient.patch(`/api/reports/mine/${id}`, {
        title: formData.title.trim() || null,
        name: formData.name.trim() || null,
        phone: formData.phone.trim() || null,
        location: formData.location.trim() || null,
        category: formData.category.trim() || null,
        description: formData.description.trim() || null,
      });
      navigate(`/user/issues/${id}`);
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : null;
      setError(typeof msg === 'string' ? msg : t.user.editIssue.error);
    } finally {
      setSubmitting(false);
    }
  };

  const u = t.user.editIssue;
  const cats = t.user.categories as Record<string, string>;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 rounded-xl border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
        <p className="text-slate-500 text-sm">{u.loading}</p>
      </div>
    );
  }
  if (error && !report) {
    return (
      <div className="space-y-4">
        <Link to="/user/issues" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:underline">
          <ArrowLeft size={18} />
          {t.user.issueDetail.backToIssues}
        </Link>
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-red-700">{error}</div>
      </div>
    );
  }
  if (!report) return null;

  return (
    <div className="space-y-6 font-sans">
      <Link
        to={`/user/issues/${id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[var(--color-primary)] transition-colors"
      >
        <ArrowLeft size={18} />
        {t.user.issueDetail.backToIssues}
      </Link>
      <div>
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
          <span className="w-1 h-4 rounded-full bg-[var(--color-primary)]" />
          {u.title}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{u.title}</h1>
        <p className="text-slate-500 mt-0.5">{u.subtitle}</p>
      </div>

      <div className="max-w-2xl rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="h-1 bg-[var(--color-primary)]" />
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-2">
            <FileText size={16} className="text-[var(--color-primary)]" />
            {t.user.submitIssue.reportForm}
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
                {t.user.submitIssue.titleLabel}
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={inputClass}
                placeholder={t.user.submitIssue.titlePlaceholder}
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">
                {t.user.submitIssue.description} <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                className={`${inputClass} resize-none`}
                placeholder={t.user.submitIssue.descriptionPlaceholder}
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Tag size={14} />
                {t.user.submitIssue.category} <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">{t.user.submitIssue.categoryPlaceholder}</option>
                {REPORT_CATEGORIES.map((key) => (
                  <option key={key} value={key}>
                    {cats[key]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
                {t.user.profile.fullName}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Phone size={14} />
                {t.user.submitIssue.phone} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder={t.user.submitIssue.phonePlaceholder}
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                <MapPin size={14} />
                {t.user.submitIssue.locationOptional}
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={inputClass}
                placeholder={t.user.submitIssue.locationPlaceholder}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:opacity-95 disabled:opacity-70 transition-opacity shadow-md"
              >
                {submitting ? '...' : u.saveChanges}
              </button>
              <Link
                to={`/user/issues/${id}`}
                className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
              >
                {u.cancel}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
