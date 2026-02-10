import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, Mail, ArrowLeft, Megaphone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const PRIMARY = '#0066CC';
const PRIMARY_HOVER = '#0052A3';
const SLATE_900 = '#1E293B';
const SLATE_500 = '#64748B';
const SLATE_100 = '#F1F5F9';
const BORDER = '#E2E8F0';
const ERROR = '#DC2626';
const SUCCESS = '#16A34A';

const LOGIN_IMAGE = '/Image/home%203.jpg';

export default function Login() {
  const { t } = useLanguage();
  const { login } = useAuth();
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
    // Show success message if redirected from registration
    if (location.state?.message) {
      setSuccess(location.state.message);
      // Clear the state so message doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setPasswordTouched(true);
    if (!formData.password.trim()) return;
    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);
    if (result.ok) {
      navigate('/dashboard');
    } else {
      setError(result.error ?? 'Login failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'password') setPasswordTouched(true);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Left panel */}
      <div className="lg:w-[48%] relative min-h-[40vh] lg:min-h-screen overflow-hidden order-2 lg:order-1">
        <img src={LOGIN_IMAGE} alt="Public Voice - Community and civic engagement" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-8 lg:px-12"
          style={{ background: `linear-gradient(135deg, ${PRIMARY}88 0%, ${SLATE_900}99 50%, #0F172Aee 100%)` }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <Megaphone className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl xl:text-4xl font-bold text-white mb-3">{t.login.overlayTitle}</h2>
          <p className="text-white/90 text-lg max-w-sm">{t.login.overlayTagline}</p>
        </div>
      </div>

      {/* Right panel - Login form */}
      <div className="flex-1 flex flex-col bg-white lg:min-h-screen order-1 lg:order-2">
        <div className="flex-1 flex items-center justify-center py-10 px-6 lg:px-14">
          <div className="w-full max-w-md">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-colors"
              style={{ color: SLATE_500 }}
              onMouseEnter={(e) => { e.currentTarget.style.color = PRIMARY; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = SLATE_500; }}>
              <ArrowLeft size={18} />
              {t.login.backToHome.replace('← ', '')}
            </Link>

            <Link to="/" className="inline-block mb-1">
              <span className="text-2xl font-bold" style={{ color: SLATE_900 }}>Public</span>
              <span className="text-2xl font-bold" style={{ color: PRIMARY }}>Voice</span>
              <span className="block h-0.5 rounded-full mt-0.5" style={{ width: '100%', backgroundColor: PRIMARY }} />
            </Link>

            <p className="text-sm mt-4 mb-8" style={{ color: SLATE_500 }}>{t.login.signInHeadline}</p>

            {/* Show success message if exists */}
            {success && (
              <div className="mb-4 p-3 rounded-xl text-sm bg-green-50 border border-green-200" style={{ color: SUCCESS }}>
                {success}
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 rounded-xl text-sm bg-red-50 border border-red-200" style={{ color: ERROR }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email input */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: SLATE_500 }}>
                  {t.login.email}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={18} /></span>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border bg-slate-50/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30 focus:border-[#0066CC]"
                    style={{ borderColor: BORDER, color: SLATE_900 }} placeholder={t.login.emailPlaceholder} />
                </div>
              </div>

              {/* Password input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider" style={{ color: SLATE_500 }}>
                    {t.login.password}
                  </label>
                  <button type="button" className="text-sm font-medium" style={{ color: PRIMARY }}>
                    {t.login.forgotPassword}
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={18} /></span>
                  <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} onBlur={() => setPasswordTouched(true)} required
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl border bg-slate-50/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30 focus:border-[#0066CC]"
                    style={{ borderColor: passwordError ? ERROR : BORDER, color: SLATE_900 }}
                    placeholder={t.login.passwordPlaceholder} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordError && <p className="mt-1.5 text-sm" style={{ color: ERROR }}>{t.login.passwordRequired}</p>}
              </div>

              {/* Remember Me */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#0066CC] focus:ring-[#0066CC]" />
                <span className="text-sm" style={{ color: SLATE_900 }}>{t.login.rememberMe}</span>
              </label>

              {/* Submit button */}
              <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-white font-semibold rounded-xl transition-colors disabled:opacity-70"
                style={{ backgroundColor: PRIMARY }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = PRIMARY_HOVER; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = PRIMARY; }}>
                {loading ? '...' : t.login.button}
                {!loading && <ArrowRight size={18} className="text-white" />}
              </button>
            </form>

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
