import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { assetUrl } from '../../../api/config';
import { User, Lock, KeyRound, Camera } from 'lucide-react';

export function Profile() {
  const { user, updateProfile } = useAuth();
  const { t, lang } = useLanguage();
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFullName(user?.full_name ?? '');
  }, [user?.full_name]);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(lang === 'English' ? 'Password change will be available in a future update.' : 'Guhindura ijambobanga kuzasobanukirwa mu mihindagurikire y\'igihe kizaza.');
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    if (!fullName.trim()) {
      setProfileError(lang === 'English' ? 'Full name is required.' : 'Amazina yuzuye birakenewe.');
      return;
    }
    setProfileSaving(true);
    const result = await updateProfile({
      full_name: fullName.trim(),
      ...(selectedFile && { profile_image: selectedFile }),
    });
    setProfileSaving(false);
    if (!result.ok) {
      setProfileError(result.error ?? 'Update failed');
      return;
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setProfileSuccess(lang === 'English' ? 'Profile updated successfully.' : 'Porofayili yahinduwe neza.');
    setTimeout(() => setProfileSuccess(null), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setProfileError(t.user?.profile?.jpgPngOnly ?? 'JPG, PNG, GIF or WEBP. Max 5 MB.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setProfileError('Image must be under 5 MB.');
      return;
    }
    setProfileError(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const avatarUrl = previewUrl ?? (user?.profile_image ? assetUrl(user.profile_image) : null);
  const p = t.user?.profile ?? {} as Record<string, string>;

  return (
    <div className="space-y-6 font-sans">
      <div>
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
          <span className="w-1 h-4 rounded-full bg-[var(--color-primary)]" />
          {p.yourAccount}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{p.title}</h1>
        <p className="text-slate-500 mt-0.5">{p.subtitle}</p>
      </div>

      <div className="max-w-xl space-y-6">
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="h-1 bg-[var(--color-primary)]" />
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/80">
            <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-2">
              <User size={16} className="text-[var(--color-primary)]" />
              {p.account}
            </h2>
          </div>
          <div className="p-6">
            {profileSuccess && (
              <div className="mb-4 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
                {profileSuccess}
              </div>
            )}
            {profileError && (
              <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {profileError}
              </div>
            )}
            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative flex-shrink-0">
                  <label className="block cursor-pointer group">
                    <div className="w-24 h-24 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white overflow-hidden border-4 border-white shadow-lg ring-2 ring-slate-200 group-hover:ring-[var(--color-primary)]/40 transition-all">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User size={40} />
                      )}
                    </div>
                    <span className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow border-2 border-white">
                      <Camera size={14} />
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="text-xs text-slate-500 mt-2 text-center sm:text-left">
                    {selectedFile ? p.changePhoto : p.addPhoto}
                  </p>
                </div>
                <div className="flex-1 w-full min-w-0">
                  <label htmlFor="profile-fullName" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    {p.fullName}
                  </label>
                  <input
                    id="profile-fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] bg-white"
                    placeholder={p.fullName}
                  />
                  <p className="text-xs text-slate-500 mt-2">{p.jpgPngOnly}</p>
                </div>
              </div>
              <button
                type="submit"
                disabled={profileSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:opacity-95 transition-opacity disabled:opacity-70"
              >
                {profileSaving ? '...' : (p.saveChanges ?? 'Save changes')}
              </button>
            </form>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">{p.email}</dt>
                <dd className="mt-1 text-slate-900 font-medium">{user?.email ?? '—'}</dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">{p.role}</dt>
                <dd className="mt-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                    {user?.role ?? '—'}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center gap-2">
            <KeyRound size={18} className="text-[var(--color-primary)]" />
            <h3 className="text-sm font-semibold text-slate-700">{p.changePassword}</h3>
          </div>
          <div className="p-6">
            {message && (
              <div className="mb-4 p-4 rounded-xl bg-[var(--color-primary-light)] border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-sm">
                {message}
              </div>
            )}
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Lock size={14} />
                  {p.currentPassword}
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] bg-white"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Lock size={14} />
                  {p.newPassword}
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] bg-white"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:opacity-95 transition-opacity"
              >
                {p.updatePassword}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
