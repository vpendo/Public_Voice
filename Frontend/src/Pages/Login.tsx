/** Email + password + OTP step; redirects to user or admin dashboard */
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Megaphone, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { LanguageSwitcher } from '../Components/LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const LOGIN_IMAGE = '/Image/home%203.jpg';

export default function Login() {
  const { t } = useLanguage();
  const { login, loginVerifyOtp, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { message?: string; from?: { pathname: string } } | null;
  const hasExpiredSession = new URLSearchParams(location.search).get('session') === 'expired';
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(() =>
    hasExpiredSession ? 'Your session expired. Please log in again.' : null
  );
  const [success, setSuccess] = useState<string | null>(() => locationState?.message ?? null);
  const [loading, setLoading] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [devOtpFromLogin, setDevOtpFromLogin] = useState<string | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (locationState?.message) {
      window.history.replaceState({}, document.title);
    }
    if (hasExpiredSession) {
      window.history.replaceState({}, document.title, '/login');
    }
  }, [locationState?.message, hasExpiredSession]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const email = formData.email.trim();
    const password = formData.password.trim();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.ok) {
      setError(result.error ?? 'Login failed');
      return;
    }
    // If backend returned token directly (e.g. future use)
    if (result.user && !result.requires_otp) {
      try {
        await refreshUser();
      } catch {
        // Ignore refresh failure; fallback to login result below.
      }
      const from = locationState?.from?.pathname;
      const isAdmin = (result.user?.role ?? '').toLowerCase() === 'admin' || (result.user?.role ?? '').toLowerCase() === 'superadmin';
      const targetPath = from && (from.startsWith('/admin') || from.startsWith('/user')) ? from : isAdmin ? '/admin/dashboard' : '/user/dashboard';
      if (isAdmin) sessionStorage.setItem('publicvoice_redirect_to_admin', '1');
      navigate(targetPath, { replace: true });
      return;
    }
    if (result.requires_otp && result.email) {
      setDevOtpFromLogin(result.dev_otp ?? null);
      setOtpCode(result.dev_otp ?? '');
      setOtpEmail(result.email);
      setShowOtpStep(true);
      setOtpError(null);
      setError(null);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    const code = otpCode.trim();
    if (!code || code.length !== 6) {
      setOtpError('Enter the 6-digit code sent to your email.');
      return;
    }
    setOtpLoading(true);
    const result = await loginVerifyOtp(otpEmail, code);
    setOtpLoading(false);
    if (!result.ok) {
      setOtpError(result.error ?? 'Invalid or expired code.');
      return;
    }
    const me = await refreshUser();
    const user = me ?? result.user;
    const from = locationState?.from?.pathname;
    const roleLower = (user?.role ?? '').trim().toLowerCase();
    const isAdmin = result.is_admin === true || roleLower === 'admin' || roleLower === 'superadmin';
    const targetPath =
      from && (from.startsWith('/user') || from.startsWith('/admin') || from === '/report')
        ? from
        : isAdmin
          ? '/admin/dashboard'
          : '/user/dashboard';
    if (isAdmin) sessionStorage.setItem('publicvoice_redirect_to_admin', '1');
    navigate(targetPath, { replace: true });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-poppins">
      {/* Left panel */}
      <div className="lg:w-[48%] relative min-h-[40vh] lg:min-h-screen overflow-hidden order-2 lg:order-1">
        <img
          src={LOGIN_IMAGE}
          alt="Public Voice - Community and civic engagement"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 flex flex-col justify-center items-center text-center px-8 lg:px-12 bg-gradient-to-br from-[var(--color-primary)]/60 via-slate-900/60 to-slate-900/90"
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg bg-white/20">
            <Megaphone className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl xl:text-4xl font-bold text-white mb-3">{t.login.overlayTitle}</h2>
          <p className="text-white/90 text-lg max-w-sm">{t.login.overlayTagline}</p>
        </div>
      </div>

      {/* Right panel - Login form */}
      <div className="flex-1 flex flex-col bg-white lg:min-h-screen order-1 lg:order-2 relative">
        <div className="absolute top-6 right-6 z-10">
          <LanguageSwitcher />
        </div>
        <div className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-14">
          {/* Auth card: 11/12 on small screens, max-w-md caps width */}
          <div className="w-11/12 max-w-md mx-auto">
            {/* Logo */}
            <Link to="/" className="inline-block mb-1">
              <span className="text-2xl font-bold text-slate-900">Public</span>
              <span className="text-2xl font-bold text-[var(--color-primary)]">Voice</span>
              <span className="block h-0.5 rounded-full mt-0.5 w-full bg-[var(--color-primary)]" />
            </Link>

            {/* Headline */}
            <p className="text-sm mt-4 mb-8 text-slate-500">
              {showOtpStep ? 'Enter verification code' : t.login.signInHeadline}
            </p>

            {showOtpStep ? (
              <>
                <p className="text-sm text-slate-500 mb-4">We sent a 6-digit code to your email. Check your inbox and enter it below.</p>
                {devOtpFromLogin ? (
                  <div className="mb-4 p-4 rounded-xl text-sm bg-amber-50 border-2 border-amber-300 text-amber-900">
                    <p className="font-semibold mb-1">Email could not be sent — use this code:</p>
                        <p className="text-base">
                          <span className="font-medium">If you didn’t get the email, you can use:</span>{' '}
                          <strong className="font-mono text-2xl tracking-widest text-amber-900 bg-amber-100 px-3 py-1 rounded inline-block">
                            {devOtpFromLogin}
                          </strong>
                        </p>
                    <p className="text-base font-mono text-2xl tracking-widest bg-amber-100 px-3 py-2 rounded inline-block">{devOtpFromLogin}</p>
                    <p className="text-xs mt-2 text-amber-700">Enter it below to sign in.</p>
                  </div>
                ) : (
                  <div className="mb-4 p-3 rounded-xl text-sm bg-blue-50 border border-blue-200 text-blue-800">
                    <p className="font-medium">Check your email for the 6-digit verification code.</p>
                    <p className="text-xs mt-1 text-blue-700">If you don’t receive it, try again or check spam.</p>
                  </div>
                )}
                {otpError && (
                  <div className="mb-4 p-3 rounded-xl text-sm bg-red-50 border border-red-200 text-red-600">
                    {otpError}
                  </div>
                )}
                <form onSubmit={handleOtpSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">
                      Email
                    </label>
                    <p className="text-slate-700 font-medium">{otpEmail}</p>
                  </div>
                  <div>
                    <label htmlFor="login-otp-code" className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">
                      {t.login.otpCodeLabel ?? 'Verification code'}
                    </label>
                    <input
                      type="text"
                      id="login-otp-code"
                      inputMode="numeric"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/80 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] text-slate-900 text-center text-2xl tracking-widest font-mono"
                      placeholder="000000"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={otpLoading}
                    className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-white font-semibold rounded-xl transition-colors ${
                      otpLoading ? 'bg-[var(--color-primary)] opacity-70' : 'bg-[var(--color-primary)] hover:opacity-95'
                    }`}
                  >
                    {otpLoading ? '...' : (t.login.verifyAndSignIn ?? 'Verify and sign in')}
                    {!otpLoading && <ArrowRight size={18} className="text-white" />}
                  </button>
                </form>
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpStep(false);
                    setOtpError(null);
                    setOtpCode('');
                    setDevOtpFromLogin(null);
                  }}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-[var(--color-primary)] transition-colors"
                >
                  <ArrowLeft size={16} />
                  {t.login.backToSignIn}
                </button>
              </>
            ) : (
              <>
            {/* Success & Error messages */}
            {success && (
              <div className="mb-4 p-3 rounded-xl text-sm bg-green-50 border border-green-200 text-green-600">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 rounded-xl text-sm bg-red-50 border border-red-200 text-red-600">
                {error}
                {(error.toLowerCase().includes('not verified') || error.toLowerCase().includes('verification')) && formData.email.trim() && (
                  <p className="mt-2">
                    <Link
                      to="/verify-email"
                      state={{ email: formData.email.trim() }}
                      className="font-semibold text-[var(--color-primary)] hover:underline"
                    >
                      Enter verification code →
                    </Link>
                  </p>
                )}
              </div>
            )}

            {/* Form: Email + Password */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] text-slate-900"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-slate-200 bg-slate-50/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] text-slate-900"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus:text-[var(--color-primary)]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <p className="text-right -mt-2">
                <Link to="/reset-password" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
                  Forgot password?
                </Link>
              </p>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-white font-semibold rounded-xl transition-colors ${
                  loading ? 'bg-[var(--color-primary)] opacity-70' : 'bg-[var(--color-primary)] hover:opacity-95'
                }`}
              >
                {loading ? '...' : t.login.button}
                {!loading && <ArrowRight size={18} className="text-white" />}
              </button>
            </form>

            {/* Sign Up */}
            </>
            )}

            {!showOtpStep && (
              <>
                <p className="mt-8 text-center text-sm text-slate-500">
                  {t.login.noAccount}{' '}
                  <Link to="/register" className="font-semibold text-[var(--color-primary)]">
                    {t.login.signUp}
                  </Link>
                </p>
                <p className="mt-6 text-center">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[var(--color-primary)] transition-colors"
                  >
                    <ArrowLeft size={14} />
                    {t.login.backToHome.replace('← ', '')}
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
