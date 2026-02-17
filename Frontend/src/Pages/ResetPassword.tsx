import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Megaphone } from 'lucide-react';
import { LanguageSwitcher } from '../Components/LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const RESET_IMAGE = '/Image/home%203.jpg';

export default function ResetPassword() {
  const { t } = useLanguage();
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError(t.resetPassword?.invalidToken ?? 'Invalid or expired reset link. Please request a new one from the login page.');
    }
  }, [token, t.resetPassword?.invalidToken]);

  const validatePassword = (p: string): string | null => {
    if (p.length < 8) return 'Password must be at least 8 characters';
    if (!/\d/.test(p)) return 'Password must contain at least one number';
    if (!/[a-zA-Z]/.test(p)) return 'Password must contain at least one letter';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!token) {
      setError(t.resetPassword?.invalidToken ?? 'Invalid or expired reset link.');
      return;
    }
    const pwdError = validatePassword(newPassword);
    if (pwdError) {
      setError(pwdError);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const result = await resetPassword(token, newPassword);
    setLoading(false);
    if (!result.ok) {
      setError(result.error ?? 'Failed to reset password');
      return;
    }
    setSuccess(true);
  };

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row font-poppins">
        <div className="lg:w-[48%] relative min-h-[40vh] lg:min-h-screen overflow-hidden order-2 lg:order-1">
          <img src={RESET_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/60 via-slate-900/60 to-slate-900/90" />
        </div>
        <div className="flex-1 flex flex-col bg-white lg:min-h-screen order-1 lg:order-2 relative">
          <div className="absolute top-6 right-6 z-10">
            <LanguageSwitcher />
          </div>
          <div className="flex-1 flex items-center justify-center py-10 px-6 lg:px-14">
            <div className="w-full max-w-md">
              <Link to="/" className="inline-block mb-6">
                <span className="text-2xl font-bold text-slate-900">Public</span>
                <span className="text-2xl font-bold text-[var(--color-primary)]">Voice</span>
              </Link>
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {t.resetPassword?.invalidToken ?? 'Invalid or expired reset link. Please request a new one from the login page.'}
              </div>
              <Link
                to="/login"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)]"
              >
                <ArrowLeft size={16} />
                {t.resetPassword?.backToLogin ?? 'Back to sign in'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-poppins">
      <div className="lg:w-[48%] relative min-h-[40vh] lg:min-h-screen overflow-hidden order-2 lg:order-1">
        <img src={RESET_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-8 lg:px-12 bg-gradient-to-br from-[var(--color-primary)]/60 via-slate-900/60 to-slate-900/90">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg bg-white/20">
            <Megaphone className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl xl:text-4xl font-bold text-white mb-3">{t.resetPassword?.title ?? 'Set new password'}</h2>
          <p className="text-white/90 text-lg max-w-sm">{t.resetPassword?.subtitle ?? 'Enter your new password below.'}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white lg:min-h-screen order-1 lg:order-2 relative">
        <div className="absolute top-6 right-6 z-10">
          <LanguageSwitcher />
        </div>
        <div className="flex-1 flex items-center justify-center py-10 px-6 lg:px-14">
          <div className="w-full max-w-md">
            <Link to="/" className="inline-block mb-6">
              <span className="text-2xl font-bold text-slate-900">Public</span>
              <span className="text-2xl font-bold text-[var(--color-primary)]">Voice</span>
            </Link>

            {success ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
                  {t.resetPassword?.success ?? 'Password has been reset. You can sign in with your new password.'}
                </div>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:opacity-95 transition-opacity"
                >
                  {t.resetPassword?.backToLogin ?? 'Back to sign in'}
                  <ArrowRight size={18} />
                </Link>
              </div>
            ) : (
              <>
                <p className="text-sm text-slate-500 mb-6">{t.resetPassword?.subtitle ?? 'Enter your new password below.'}</p>
                {error && (
                  <div className="mb-4 p-3 rounded-xl text-sm bg-red-50 border border-red-200 text-red-600">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="new-password" className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">
                      {t.resetPassword?.newPassword ?? 'New password'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Lock size={18} />
                      </span>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        id="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-slate-200 bg-slate-50/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] text-slate-900"
                        placeholder={t.resetPassword?.newPasswordPlaceholder ?? 'Enter new password'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirm-password" className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">
                      {t.resetPassword?.confirmPassword ?? 'Confirm password'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Lock size={18} />
                      </span>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-slate-200 bg-slate-50/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] text-slate-900"
                        placeholder={t.resetPassword?.confirmPlaceholder ?? 'Confirm new password'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-400">At least 8 characters, one letter and one number.</p>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-white font-semibold rounded-xl transition-colors ${
                      loading ? 'bg-[var(--color-primary)] opacity-70' : 'bg-[var(--color-primary)] hover:opacity-95'
                    }`}
                  >
                    {loading ? '...' : (t.resetPassword?.button ?? 'Reset password')}
                    {!loading && <ArrowRight size={18} className="text-white" />}
                  </button>
                </form>
              </>
            )}

            <p className="mt-8 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[var(--color-primary)] transition-colors"
              >
                <ArrowLeft size={14} />
                {t.resetPassword?.backToLogin ?? 'Back to sign in'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
