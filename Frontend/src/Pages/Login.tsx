import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, Mail, ArrowLeft, Megaphone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const PRIMARY = '#0066CC';
const PRIMARY_HOVER = '#0052A3';
const SLATE_900 = '#1E293B';
const SLATE_500 = '#64748B';
const SLATE_100 = '#F1F5F9';
const BORDER = '#E2E8F0';
const ERROR = '#DC2626';

const LOGIN_IMAGE = '/Image/home%203.jpg';

export default function Login() {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [passwordTouched, setPasswordTouched] = useState(false);

  const passwordError = passwordTouched && !formData.password.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordTouched(true);
    if (!formData.password.trim()) return;
    alert(t.login.alertMessage);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'password') setPasswordTouched(true);
  };

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row"
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      {/* Left panel - Image with overlay */}
      <div className="lg:w-[48%] relative min-h-[40vh] lg:min-h-screen overflow-hidden order-2 lg:order-1">
        <img
          src={LOGIN_IMAGE}
          alt="Public Voice - Community and civic engagement"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 flex flex-col justify-center items-center text-center px-8 lg:px-12"
          style={{
            background: `linear-gradient(135deg, ${PRIMARY}88 0%, ${SLATE_900}99 50%, #0F172Aee 100%)`,
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <Megaphone className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl xl:text-4xl font-bold text-white mb-3">
            {t.login.overlayTitle}
          </h2>
          <p className="text-white/90 text-lg max-w-sm">
            {t.login.overlayTagline}
          </p>
        </div>
      </div>

      {/* Right panel - Sign in form */}
      <div className="flex-1 flex flex-col bg-white lg:min-h-screen order-1 lg:order-2">
        <div className="flex-1 flex items-center justify-center py-10 px-6 lg:px-14">
          <div className="w-full max-w-md">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-colors"
              style={{ color: SLATE_500 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = PRIMARY;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = SLATE_500;
              }}
            >
              <ArrowLeft size={18} />
              {t.login.backToHome.replace('← ', '')}
            </Link>

            <Link to="/" className="inline-block mb-1">
              <span className="text-2xl font-bold" style={{ color: SLATE_900 }}>
                Public
              </span>
              <span className="text-2xl font-bold" style={{ color: PRIMARY }}>
                Voice
              </span>
              <span
                className="block h-0.5 rounded-full mt-0.5"
                style={{ width: '100%', backgroundColor: PRIMARY }}
              />
            </Link>

            <p className="text-sm mt-4 mb-8" style={{ color: SLATE_500 }}>
              {t.login.signInHeadline}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: SLATE_500 }}
                >
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
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border bg-slate-50/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30 focus:border-[#0066CC]"
                    style={{ borderColor: BORDER, color: SLATE_900 }}
                    placeholder={t.login.emailPlaceholder}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold uppercase tracking-wider"
                    style={{ color: SLATE_500 }}
                  >
                    {t.login.password}
                  </label>
                  <button
                    type="button"
                    className="text-sm font-medium"
                    style={{ color: PRIMARY }}
                  >
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
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl border bg-slate-50/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30 focus:border-[#0066CC]"
                    style={{
                      borderColor: passwordError ? ERROR : BORDER,
                      color: SLATE_900,
                    }}
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
                {passwordError && (
                  <p className="mt-1.5 text-sm" style={{ color: ERROR }}>
                    {t.login.passwordRequired}
                  </p>
                )}
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#0066CC] focus:ring-[#0066CC]"
                />
                <span className="text-sm" style={{ color: SLATE_900 }}>
                  {t.login.rememberMe}
                </span>
              </label>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-white font-semibold rounded-xl transition-colors"
                style={{ backgroundColor: PRIMARY }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = PRIMARY_HOVER;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = PRIMARY;
                }}
              >
                {t.login.button}
                <ArrowRight size={18} className="text-white" />
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: BORDER }} />
              </div>
              <div className="relative flex justify-center">
                <span
                  className="px-3 text-sm bg-white"
                  style={{ color: SLATE_500 }}
                >
                  {t.login.orContinueWith}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-3 px-6 py-3.5 font-medium rounded-xl border transition-colors bg-white"
              style={{ borderColor: BORDER, color: SLATE_900 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = SLATE_100;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {t.login.continueWithGoogle}
            </button>

            <p className="mt-8 text-center text-sm" style={{ color: SLATE_500 }}>
              {t.login.noAccount}{' '}
              <Link to="/register" className="font-semibold" style={{ color: PRIMARY }}>
                {t.login.signUp}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
