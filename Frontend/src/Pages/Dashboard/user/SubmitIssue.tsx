import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { apiClient } from '../../../api/client';
import { Send } from 'lucide-react';

const CATEGORIES = [
  { value: 'roads', label: 'Roads & Infrastructure' },
  { value: 'water', label: 'Water Supply' },
  { value: 'security', label: 'Security & Safety' },
  { value: 'sanitation', label: 'Sanitation & Waste' },
  { value: 'electricity', label: 'Electricity' },
  { value: 'health', label: 'Health Services' },
  { value: 'education', label: 'Education' },
  { value: 'other', label: 'Other' },
];

export function SubmitIssue() {
  const { user } = useAuth();
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
      setError(typeof msg === 'string' ? msg : 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputClass =
    'w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30 focus:border-[#0066CC] bg-white';

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Submit Issue</h1>
      <p className="text-slate-500 mb-8">Report a community issue. Authorities will review and respond.</p>

      <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block font-medium text-slate-800 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={inputClass}
              placeholder="Short title for the issue"
            />
          </div>
          <div>
            <label htmlFor="description" className="block font-medium text-slate-800 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className={`${inputClass} resize-none`}
              placeholder="Describe the issue in detail (what, where, when)."
            />
          </div>
          <div>
            <label htmlFor="category" className="block font-medium text-slate-800 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="phone" className="block font-medium text-slate-800 mb-2">
              Phone *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="e.g. 0781234567"
            />
          </div>
          <div>
            <label htmlFor="location" className="block font-medium text-slate-800 mb-2">
              Location (optional)
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={inputClass}
              placeholder="District, sector, cell or landmark"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-70"
            style={{ backgroundColor: '#0066CC' }}
          >
            <Send size={18} />
            {submitting ? 'Submitting...' : 'Submit Issue'}
          </button>
        </form>
      </div>
    </div>
  );
}