import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Mail, ShieldCheck } from 'lucide-react';
import { LanguageSwitcher } from '../Components/LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const RESET_IMAGE = '/Image/home%203.jpg';

type Step = 1 | 2 | 3;

export default function ResetPassword() {
  const { t } = useLanguage();
  const { requestPasswordReset, resetPassword, resetPasswordWithOtp } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [userFound, setUserFound] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Legacy: token-based reset (link with ?token=...)
  const useTokenFlow = !!token?.trim();

  const validatePassword = (p: string): string | null => {
    if (p.length < 8) return 'Password must be at least 8 characters';
    if (!/\d/.test(p)) return 'Password must contain at least one number';
    if (!/[a-zA-Z]/.test(p)) return 'Password must contain at least one letter';
    return null;
  };

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setError('Please enter your email.');
      return;
    }
    setLoading(true);
    const result = await requestPasswordReset(trimmed);
    setLoading(false);
    if (!result.ok) {
      setError(result.error ?? 'Something went wrong.');
      return;
    }
    setEmail(trimmed);
    setUserFound(result.user_found ?? false);
    setStep(2);
  };

  const handleVerifyCodeNext = () => {
    setError(null);
    if (otpCode.trim().length !== 6) {
      setError(t.resetPassword?.enterCode ?? 'Enter the 6-digit code from your email.');
      return;
    }
    setStep(3);
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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
    const result = useTokenFlow
      ? await resetPassword(token, newPassword)
      : await resetPasswordWithOtp(email, otpCode.trim(), newPassword);
    setLoading(false);
    if (!result.ok) {
      setError(result.error ?? 'Failed to reset password');
      return;
    }
    setSuccess(true);
  };

  const cardClass = 'bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-8';
  const inputClass =
    'w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/80 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] text-slate-900 placeholder:text-slate-400';
  const labelClass = 'block text-sm font-medium text-slate-700 mb-2';
  const btnPrimary =
    'w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:opacity-95 transition-opacity disabled:opacity-70';

  // ——— Legacy token-based reset: single form (new password + confirm) ———
  if (useTokenFlow) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row font-poppins bg-[#f5f0f8]">
        <div className="lg:w-[48%] relative min-h-[40vh] lg:min-h-screen overflow-hidden order-2 lg:order-1">
          <img src={RESET_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/60 via-slate-900/60 to-slate-900/90" />
        </div>
        <div className="flex-1 flex flex-col bg-[#f5f0f8] lg:min-h-screen order-1 lg:order-2 relative">
          <div className="absolute top-6 right-6 z-10">
            <LanguageSwitcher />
          </div>
          <div className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-14">
            {/* 11/12 + max-w-md: token reset form */}
            <div className="w-11/12 max-w-md mx-auto">
              <Link to="/login" className="inline-flex items-center gap-2 text-slate-600 hover:text-[var(--color-primary)] text-sm font-medium mb-4">
                <ArrowLeft size={18} />
                {t.resetPassword?.backToLogin ?? 'Back to sign in'}
              </Link>
              {success ? (
                <div className={cardClass}>
                  <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm mb-6">
                    {t.resetPassword?.success}
                  </div>
                  <Link to="/login" className={`${btnPrimary} no-underline`}>
                    {t.resetPassword?.backToLogin}
                    <ArrowRight size={18} />
                  </Link>
                </div>
              ) : (
                <div className={cardClass}>
                  <h1 className="text-xl font-bold text-slate-900 mb-2">{t.resetPassword?.title}</h1>
                  <p className="text-slate-600 text-sm mb-6">{t.resetPassword?.subtitle}</p>
                  {error && (
                    <div className="mb-4 p-3 rounded-xl text-sm bg-red-50 border border-red-200 text-red-600">{error}</div>
                  )}
                  <form onSubmit={handleResetSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="new-password-token" className={labelClass}>{t.resetPassword?.newPassword}</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={18} /></span>
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          id="new-password-token"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className={inputClass}
                          placeholder={t.resetPassword?.newPasswordPlaceholder}
                        />
                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="confirm-password-token" className={labelClass}>{t.resetPassword?.confirmPassword}</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={18} /></span>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="confirm-password-token"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={inputClass}
                          placeholder={t.resetPassword?.confirmPlaceholder}
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <p className="mt-1.5 text-xs text-slate-400">At least 8 characters, one letter and one number.</p>
                    </div>
                    <button type="submit" disabled={loading} className={btnPrimary}>
                      {loading ? '...' : t.resetPassword?.button}
                      {!loading && <ArrowRight size={18} className="text-white" />}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ——— Forgot password flow: Step 1 (email), Step 2 (code), Step 3 (new password) ———
  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-poppins bg-[#f5f0f8]">
      <div className="lg:w-[48%] relative min-h-[40vh] lg:min-h-screen overflow-hidden order-2 lg:order-1">
        <img src={RESET_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/60 via-slate-900/60 to-slate-900/90" />
      </div>

      <div className="flex-1 flex flex-col bg-[#f5f0f8] lg:min-h-screen order-1 lg:order-2 relative">
        <div className="absolute top-6 right-6 z-10">
          <LanguageSwitcher />
        </div>
        <div className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-14">
          {/* 11/12 + max-w-md: forgot-password steps */}
          <div className="w-11/12 max-w-md mx-auto space-y-4">
            <Link to="/login" className="inline-flex items-center gap-2 text-slate-600 hover:text-[var(--color-primary)] text-sm font-medium">
              <ArrowLeft size={18} />
              {t.resetPassword?.backToLogin ?? 'Back to sign in'}
            </Link>

            {success ? (
              <div className={cardClass}>
                <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm mb-6">
                  {t.resetPassword?.success ?? 'Password has been reset. You can sign in with your new password.'}
                </div>
                <Link
                  to="/login"
                  className={`${btnPrimary} no-underline`}
                >
                  {t.resetPassword?.backToLogin ?? 'Back to sign in'}
                  <ArrowRight size={18} />
                </Link>
              </div>
            ) : (
              <>
                {/* Step 1: Email — Check Email */}
                {step === 1 && (
                  <div className={cardClass}>
                    <h1 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                      <ArrowLeft size={20} className="text-slate-500" />
                      {t.resetPassword?.forgotPasswordTitle ?? 'Forgot Password?'}
                    </h1>
                    <p className="text-slate-600 text-sm mb-6">
                      {t.resetPassword?.checkEmailInstructions ?? 'Enter your email address to check if an account exists'}
                    </p>
                    {error && (
                      <div className="mb-4 p-3 rounded-xl text-sm bg-red-50 border border-red-200 text-red-600">
                        {error}
                      </div>
                    )}
                    <form onSubmit={handleCheckEmail} className="space-y-5">
                      <div>
                        <label htmlFor="forgot-email" className={labelClass}>
                          {t.login?.email ?? 'Email'}
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <Mail size={18} />
                          </span>
                          <input
                            type="email"
                            id="forgot-email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputClass}
                            placeholder={t.resetPassword?.emailPlaceholder ?? 'Enter your email'}
                            autoComplete="email"
                          />
                        </div>
                      </div>
                      <button type="submit" disabled={loading} className={btnPrimary}>
                        {loading ? '...' : (t.resetPassword?.checkEmailButton ?? 'Check Email')}
                      </button>
                    </form>
                  </div>
                )}

                {/* Step 2: Verification code — Verify Code / Back */}
                {step === 2 && (
                  <div className="space-y-4">
                    {userFound && (
                      <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
                        {t.resetPassword?.userFoundMessage ?? 'User found! A verification code has been sent to your email'}
                      </div>
                    )}
                    <div className={cardClass}>
                      <h1 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <ArrowLeft size={20} className="text-slate-500" />
                        {t.resetPassword?.forgotPasswordTitle ?? 'Forgot Password?'}
                      </h1>
                      <p className="text-slate-600 text-sm mb-6">
                        {t.resetPassword?.verifyCodeInstructions ?? 'Enter the verification code sent to your email'}
                      </p>
                      {error && (
                        <div className="mb-4 p-3 rounded-xl text-sm bg-red-50 border border-red-200 text-red-600">
                          {error}
                        </div>
                      )}
                      <div className="space-y-5">
                        <div>
                          <label htmlFor="reset-otp-code" className={labelClass}>
                            {t.resetPassword?.verificationCodeLabel ?? 'Verification Code'}
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                              <ShieldCheck size={18} />
                            </span>
                            <input
                              type="text"
                              id="reset-otp-code"
                              inputMode="numeric"
                              maxLength={6}
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                              className={inputClass}
                              placeholder={t.resetPassword?.verificationCodePlaceholder ?? 'Enter 6-digit code'}
                            />
                          </div>
                        </div>
                        <button type="button" onClick={handleVerifyCodeNext} className={btnPrimary}>
                          {t.resetPassword?.verifyCodeButton ?? 'Verify Code'}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setStep(1); setError(null); setOtpCode(''); }}
                          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-300 transition-colors"
                        >
                          {t.resetPassword?.backButton ?? 'Back'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: New password — Reset password */}
                {step === 3 && (
                  <div className={cardClass}>
                    <h1 className="text-xl font-bold text-slate-900 mb-1">
                      {t.resetPassword?.title ?? 'Set new password'}
                    </h1>
                    <p className="text-slate-600 text-sm mb-6">
                      {t.resetPassword?.otpSubtitle ?? 'Enter the code we sent to your email and choose a new password.'}
                    </p>
                    {error && (
                      <div className="mb-4 p-3 rounded-xl text-sm bg-red-50 border border-red-200 text-red-600">
                        {error}
                      </div>
                    )}
                    <form onSubmit={handleResetSubmit} className="space-y-5">
                      <div>
                        <label className={labelClass}>{t.login?.email ?? 'Email'}</label>
                        <div className="flex items-center gap-2 text-slate-700 font-medium py-2">
                          <Mail size={18} className="text-slate-500" />
                          {email}
                        </div>
                      </div>
                      <div>
                        <label htmlFor="reset-otp-code-step3" className={labelClass}>
                          {t.resetPassword?.verificationCodeLabel ?? 'Verification Code'}
                        </label>
                        <input
                          type="text"
                          id="reset-otp-code-step3"
                          inputMode="numeric"
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                          className={inputClass}
                          placeholder="000000"
                        />
                      </div>
                      <div>
                        <label htmlFor="new-password" className={labelClass}>
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
                            className={inputClass}
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
                        <label htmlFor="confirm-password" className={labelClass}>
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
                            className={inputClass}
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
                      <button type="submit" disabled={loading} className={btnPrimary}>
                        {loading ? '...' : (t.resetPassword?.button ?? 'Reset password')}
                        {!loading && <ArrowRight size={18} className="text-white" />}
                      </button>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
