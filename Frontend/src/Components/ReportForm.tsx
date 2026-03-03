import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../api/client';
import { Send, MapPin, AlertCircle, Image, Video, Mic } from 'lucide-react';
import {
  REPORT_CATEGORIES,
  RESPONSIBLE_INSTITUTIONS,
  URGENCY_LEVELS,
  getProblemTypesForCategory,
  type ReportCategoryKey,
} from '../constants/categories';

const inputClass =
  'w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-colors';
const labelClass = 'block text-sm font-semibold text-slate-700 mb-2';

export type ReportFormSuccessHandler = (trackingId: string) => void;

export interface ReportFormProps {
  onSuccess: ReportFormSuccessHandler;
  /** Optional wrapper class (e.g. for dashboard card) */
  className?: string;
}

export function ReportForm({ onSuccess, className = '' }: ReportFormProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const r = t.report;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
    reporter_village: '',
    reporter_cell: '',
    reporter_sector: '',
    reporter_district: '',
    category: '' as ReportCategoryKey | '',
    problem_type: '',
    description: '',
    province: '',
    district: '',
    sector: '',
    cell: '',
    village: '',
    landmark: '',
    urgency: 'medium',
    institution: 'cell_office',
    consent: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [evidenceFiles, setEvidenceFiles] = useState<{ photo: File | null; video: File | null; voice: File | null }>({
    photo: null,
    video: null,
    voice: null,
  });

  useEffect(() => {
    if (user?.full_name) {
      setFormData((prev) => ({ ...prev, name: user.full_name }));
    }
  }, [user?.full_name]);

  const problemTypeOptions = getProblemTypesForCategory(formData.category);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!formData.consent) {
      setSubmitError(r.form.consentRequired);
      return;
    }
    setSubmitting(true);
    try {
      let evidence_photo: string | undefined;
      let evidence_video: string | undefined;
      let evidence_voice: string | undefined;
      if (evidenceFiles.photo || evidenceFiles.video || evidenceFiles.voice) {
        const formDataUpload = new FormData();
        if (evidenceFiles.photo) formDataUpload.append('photo', evidenceFiles.photo);
        if (evidenceFiles.video) formDataUpload.append('video', evidenceFiles.video);
        if (evidenceFiles.voice) formDataUpload.append('voice', evidenceFiles.voice);
        const uploadRes = await apiClient.post<{ evidence_photo?: string; evidence_video?: string; evidence_voice?: string }>(
          '/api/upload/evidence',
          formDataUpload,
          { timeout: 60000 }
        );
        evidence_photo = uploadRes.data?.evidence_photo ?? undefined;
        evidence_video = uploadRes.data?.evidence_video ?? undefined;
        evidence_voice = uploadRes.data?.evidence_voice ?? undefined;
      }
      const res = await apiClient.post<{ tracking_id?: string }>('/api/reports', {
        name: formData.name.trim() || undefined,
        phone: formData.phone.trim(),
        gender: formData.gender.trim() || undefined,
        reporter_village: formData.reporter_village.trim() || undefined,
        reporter_cell: formData.reporter_cell.trim() || undefined,
        reporter_sector: formData.reporter_sector.trim() || undefined,
        reporter_district: formData.reporter_district.trim() || undefined,
        category: formData.category,
        problem_type: formData.problem_type.trim() || undefined,
        description: formData.description.trim(),
        province: formData.province.trim() || undefined,
        district: formData.district.trim() || undefined,
        sector: formData.sector.trim() || undefined,
        cell: formData.cell.trim() || undefined,
        village: formData.village.trim() || undefined,
        landmark: formData.landmark.trim() || undefined,
        urgency: formData.urgency,
        institution: formData.institution,
        consent: true,
        evidence_photo,
        evidence_video,
        evidence_voice,
      });
      const trackingId = res.data?.tracking_id ?? '';
      if (trackingId) onSuccess(trackingId);
      setFormData({
        name: user?.full_name ?? '',
        phone: '',
        gender: '',
        reporter_village: '',
        reporter_cell: '',
        reporter_sector: '',
        reporter_district: '',
        category: '' as ReportCategoryKey | '',
        problem_type: '',
        description: '',
        province: '',
        district: '',
        sector: '',
        cell: '',
        village: '',
        landmark: '',
        urgency: 'medium',
        institution: 'cell_office',
        consent: false,
      });
      setEvidenceFiles({ photo: null, video: null, voice: null });
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement>
  ) => {
    const name = e.target.name;
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'category') {
      setFormData((prev) => ({ ...prev, problem_type: '' }));
    }
  };

  return (
    <div className={className}>
      <h2 className="text-2xl font-bold mb-2 text-slate-900">{r.form.title}</h2>
      <p className="text-slate-600 mb-8">
        {r.sections.reporterHint} {r.sections.locationHint}
      </p>
      {submitError && (
        <div role="alert" className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          {submitError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Reporter Information */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-[var(--color-primary)]" />
            {r.sections.reporter}
          </h3>
          <p className="text-slate-500 text-sm mb-4">{r.sections.reporterHint}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="report-form-name" className={labelClass}>
                {r.form.name} <span className="text-slate-400 font-normal">{r.form.nameOptional}</span>
              </label>
              <input
                type="text"
                id="report-form-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
                placeholder={r.form.namePlaceholder}
              />
            </div>
            <div>
              <label htmlFor="report-form-phone" className={labelClass}>{r.form.phone}</label>
              <input
                type="tel"
                id="report-form-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder={r.form.phonePlaceholder}
              />
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="report-form-gender" className={labelClass}>
              {r.form.gender} <span className="text-slate-400 font-normal">{r.form.genderOptional}</span>
            </label>
            <select
              id="report-form-gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">—</option>
              <option value="male">{r.form.genderMale}</option>
              <option value="female">{r.form.genderFemale}</option>
              <option value="other">{r.form.genderOther}</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="report-form-reporter_village" className={labelClass}>{r.form.village}</label>
              <input
                type="text"
                id="report-form-reporter_village"
                name="reporter_village"
                value={formData.reporter_village}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="report-form-reporter_cell" className={labelClass}>{r.form.cell}</label>
              <input
                type="text"
                id="report-form-reporter_cell"
                name="reporter_cell"
                value={formData.reporter_cell}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="report-form-reporter_sector" className={labelClass}>{r.form.sector}</label>
              <input
                type="text"
                id="report-form-reporter_sector"
                name="reporter_sector"
                value={formData.reporter_sector}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="report-form-reporter_district" className={labelClass}>{r.form.district}</label>
              <input
                type="text"
                id="report-form-reporter_district"
                name="reporter_district"
                value={formData.reporter_district}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* 2. Problem Category */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-[var(--color-primary)]" />
            {r.sections.category}
          </h3>
          <p className="text-slate-500 text-sm mb-4">{r.sections.categoryHint}</p>
          <select
            id="report-form-category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className={inputClass}
          >
            <option value="">{r.categories.select}</option>
            {REPORT_CATEGORIES.map((key) => (
              <option key={key} value={key}>
                {(r.categories as Record<string, string>)[key] ?? key}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Problem Type (dynamic) */}
        {formData.category && (
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-[var(--color-primary)]" />
              {r.sections.problemType}
            </h3>
            <select
              id="report-form-problem_type"
              name="problem_type"
              value={formData.problem_type}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">{r.form.problemTypePlaceholder}</option>
              {problemTypeOptions.map((key) => (
                <option key={key} value={key}>
                  {(r.problemTypes as Record<string, Record<string, string>>)?.[formData.category]?.[key] ?? key}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 4. Problem Description */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-[var(--color-primary)]" />
            {r.sections.description}
          </h3>
          <p className="text-slate-500 text-sm mb-4">{r.sections.descriptionHint}</p>
          <textarea
            id="report-form-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={5}
            className={`${inputClass} resize-none`}
            placeholder={r.form.descriptionPlaceholder}
          />
        </div>

        {/* 5. Location of Problem */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
            {r.sections.location}
          </h3>
          <p className="text-slate-500 text-sm mb-4">{r.sections.locationHint}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="report-form-province" className={labelClass}>{r.form.province}</label>
              <input
                type="text"
                id="report-form-province"
                name="province"
                value={formData.province}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="report-form-district" className={labelClass}>{r.form.district}</label>
              <input
                type="text"
                id="report-form-district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="report-form-sector" className={labelClass}>{r.form.sector}</label>
              <input
                type="text"
                id="report-form-sector"
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="report-form-cell" className={labelClass}>{r.form.cell}</label>
              <input
                type="text"
                id="report-form-cell"
                name="cell"
                value={formData.cell}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="report-form-village" className={labelClass}>{r.form.village}</label>
              <input
                type="text"
                id="report-form-village"
                name="village"
                value={formData.village}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="report-form-landmark" className={labelClass}>
                {r.form.landmark} <span className="text-slate-400 font-normal">{r.form.landmarkOptional}</span>
              </label>
              <input
                type="text"
                id="report-form-landmark"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                className={inputClass}
                placeholder={r.form.landmarkPlaceholder}
              />
            </div>
          </div>
        </div>

        {/* 6. Urgency */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-[var(--color-primary)]" />
            {r.sections.urgency}
          </h3>
          <select
            id="report-form-urgency"
            name="urgency"
            value={formData.urgency}
            onChange={handleChange}
            className={inputClass}
          >
            {URGENCY_LEVELS.map((key) => (
              <option key={key} value={key}>
                {(r.form as Record<string, string>)[`urgency${key.charAt(0).toUpperCase() + key.slice(1)}`] ?? key}
              </option>
            ))}
          </select>
        </div>

        {/* 7. Evidence (optional upload) */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-[var(--color-primary)]" />
            {r.sections.evidence}
          </h3>
          <p className="text-slate-500 text-sm mb-4">{r.sections.evidenceHint}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                <Image size={16} className="text-[var(--color-primary)]" />
                {r.form.evidencePhoto}
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={(e) => setEvidenceFiles((prev) => ({ ...prev, photo: e.target.files?.[0] ?? null }))}
                className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
              />
              {evidenceFiles.photo && <p className="mt-1 text-xs text-slate-500 truncate">{evidenceFiles.photo.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                <Video size={16} className="text-[var(--color-primary)]" />
                {r.form.evidenceVideo}
              </label>
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={(e) => setEvidenceFiles((prev) => ({ ...prev, video: e.target.files?.[0] ?? null }))}
                className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
              />
              {evidenceFiles.video && <p className="mt-1 text-xs text-slate-500 truncate">{evidenceFiles.video.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                <Mic size={16} className="text-[var(--color-primary)]" />
                {r.form.evidenceVoice}
              </label>
              <input
                type="file"
                accept="audio/mpeg,audio/mp4,audio/webm,audio/ogg,audio/wav"
                onChange={(e) => setEvidenceFiles((prev) => ({ ...prev, voice: e.target.files?.[0] ?? null }))}
                className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
              />
              {evidenceFiles.voice && <p className="mt-1 text-xs text-slate-500 truncate">{evidenceFiles.voice.name}</p>}
            </div>
          </div>
        </div>

        {/* 8. Responsible Institution */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-[var(--color-primary)]" />
            {r.sections.institution}
          </h3>
          <p className="text-slate-500 text-sm mb-4">{r.sections.institutionHint}</p>
          <select
            id="report-form-institution"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            required
            className={inputClass}
          >
            {RESPONSIBLE_INSTITUTIONS.map((key) => (
              <option key={key} value={key}>
                {(r.institutions as Record<string, string>)[key] ?? key}
              </option>
            ))}
          </select>
        </div>

        {/* 9. Consent */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-[var(--color-primary)]" />
            {r.sections.consent}
          </h3>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              className="mt-1 w-4 h-4 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
            <span className="text-slate-700">{r.form.consentLabel}</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="w-full px-8 py-4 bg-[var(--color-primary)] text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          {submitting ? (
            <>
              <span className="inline-block w-5 h-5 border-2 border-white/60 border-t-white rounded-full animate-spin" aria-hidden />
              {r.form.button}
            </>
          ) : (
            <>
              <Send size={20} aria-hidden />
              {r.form.button}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
