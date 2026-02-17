import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, Mail, ArrowLeft, Megaphone } from 'lucide-react';
import { LanguageSwitcher } from '../Components/LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const LOGIN_IMAGE = '/Image/home%203.jpg';

export default function Login() {
  const { t } = useLanguage();
  const { login, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passwordError = passwordTouched && !formData.password.trim();

  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setPasswordTouched(true);
    const email = formData.email.trim();
    const password = formData.password;
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    if (!result.ok) {
      setLoading(false);
      setError(result.error ?? 'Login failed');
      return;
    }
    // Always fetch /me so context has the correct user/role before we navigate (backend is source of truth)
    const me = await refreshUser();
    const user = me ?? result.user;
    setLoading(false);
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
    // Use is_admin from login response first, then role from user (backend sends is_admin for redirect)
    const isAdmin = result.is_admin === true || (user?.role ?? '').trim().toLowerCase() === 'admin';
    const targetPath =
      from && (from.startsWith('/user') || from.startsWith('/admin') || from === '/report')
        ? from
        : isAdmin
          ? '/admin/dashboard'
          : '/user/dashboard';
    if (isAdmin) {
      sessionStorage.setItem('publicvoice_redirect_to_admin', '1');
    }
    navigate(targetPath, { replace: true });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'password') setPasswordTouched(true);
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
        <div className="flex-1 flex items-center justify-center py-10 px-6 lg:px-14">
          <div className="w-full max-w-md">
            {/* Logo */}
            <Link to="/" className="inline-block mb-1">
              <span className="text-2xl font-bold text-slate-900">Public</span>
              <span className="text-2xl font-bold text-[var(--color-primary)]">Voice</span>
              <span className="block h-0.5 rounded-full mt-0.5 w-full bg-[var(--color-primary)]" />
            </Link>

            {/* Headline */}
            <p className="text-sm mt-4 mb-8 text-slate-500">{t.login.signInHeadline}</p>

            {/* Success & Error messages */}
            {success && (
              <div className="mb-4 p-3 rounded-xl text-sm bg-green-50 border border-green-200 text-green-600">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 rounded-xl text-sm bg-red-50 border border-red-200 text-red-600">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">
                  {t.login.email}
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
                    placeholder={t.login.emailPlaceholder}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {t.login.password}
                  </label>
                  <button type="button" className="text-sm font-medium text-[var(--color-primary)]">
                    {t.login.forgotPassword}
                  </button>
                </div>
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
                    onBlur={() => setPasswordTouched(true)}
                    required
                    className={`w-full pl-11 pr-12 py-3.5 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] ${
                      passwordError ? 'border-red-600' : 'border-slate-200'
                    } text-slate-900 bg-slate-50/80`}
                    placeholder={t.login.passwordPlaceholder}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordError && <p className="mt-1.5 text-sm text-red-600">{t.login.passwordRequired}</p>}
              </div>

              {/* Remember Me */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                <span className="text-sm text-slate-900">{t.login.rememberMe}</span>
              </label>

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
            <p className="mt-8 text-center text-sm text-slate-500">
              {t.login.noAccount}{' '}
              <Link to="/register" className="font-semibold text-[var(--color-primary)]">
                {t.login.signUp}
              </Link>
            </p>

            {/* Back to home - bottom */}
            <p className="mt-6 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[var(--color-primary)] transition-colors"
              >
                <ArrowLeft size={14} />
                {t.login.backToHome.replace('← ', '')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
