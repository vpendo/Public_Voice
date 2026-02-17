import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ArrowLeft, User, Megaphone, Eye, EyeOff, Home } from 'lucide-react';
import { LanguageSwitcher } from '../Components/LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const REGISTER_IMAGE = '/Image/home%203.jpg';

export default function Register() {
  const { t } = useLanguage();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validatePassword = (p: string): string | null => {
    if (p.length < 8) return 'Password must be at least 8 characters';
    if (!/\d/.test(p)) return 'Password must contain at least one number';
    if (!/[a-zA-Z]/.test(p)) return 'Password must contain at least one letter';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const pwdError = validatePassword(formData.password);
    if (pwdError) {
      setError(pwdError);
      return;
    }
    setLoading(true);
    const result = await registerUser(formData.fullName, formData.email, formData.password);
    setLoading(false);
    if (result.ok) {
      navigate('/login', { state: { message: 'Registration successful. Please login.' } });
    } else {
      setError(result.error ?? 'Registration failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-poppins">
      {/* Left panel - Image */}
      <div className="lg:w-[48%] relative min-h-[40vh] lg:min-h-screen overflow-hidden order-2 lg:order-1">
        <img src={REGISTER_IMAGE} alt="Public Voice" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-8 lg:px-12 bg-gradient-to-br from-[var(--color-primary)]/60 via-slate-900/60 to-slate-900/90">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg bg-white/20">
            <Megaphone className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl xl:text-4xl font-bold text-white mb-3">{t.register.overlayTitle}</h2>
          <p className="text-white/90 text-lg max-w-sm">{t.register.overlayTagline}</p>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex-1 flex flex-col bg-white lg:min-h-screen order-1 lg:order-2 relative">
        {/* Language + Home - top right */}
        <div className="absolute top-6 right-6 flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[var(--color-primary)] transition-colors"
            aria-label="Back to home"
          >
            <Home size={18} />
            Home
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center py-10 px-6 lg:px-14">
          <div className="w-full max-w-md">
            {/* Logo - click to go home */}
            <Link to="/" className="inline-block mb-1">
              <span className="text-2xl font-bold text-slate-900">Public</span>
              <span className="text-2xl font-bold text-[var(--color-primary)]">Voice</span>
              <span className="block h-0.5 rounded-full mt-0.5 w-full bg-[var(--color-primary)]" />
            </Link>

            {/* Headline */}
            <p className="text-sm mt-4 mb-8 text-slate-500">{t.register.signUpHeadline}</p>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 rounded-xl text-sm bg-red-50 border border-red-200 text-red-600">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">
                  {t.register.fullName}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <User size={18} />
                  </span>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] text-slate-900"
                    placeholder={t.register.fullNamePlaceholder}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">
                  {t.register.email}
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
                    placeholder={t.register.emailPlaceholder}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">
                  {t.register.password}
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
                    placeholder={t.register.passwordPlaceholder}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-slate-400">At least 8 characters, one letter and one number.</p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-white font-semibold rounded-xl transition-colors ${
                  loading ? 'bg-[var(--color-primary)] opacity-70' : 'bg-[var(--color-primary)] hover:opacity-95'
                }`}
              >
                {loading ? '...' : t.register.button}
                {!loading && <ArrowRight size={18} className="text-white" />}
              </button>
            </form>

            {/* Sign in link */}
            <p className="mt-8 text-center text-sm text-slate-500">
              {t.register.hasAccount}{' '}
              <Link to="/login" className="font-semibold text-[var(--color-primary)]">
                {t.register.signIn}
              </Link>
            </p>

            {/* Back to home - second way at bottom */}
            <p className="mt-6 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[var(--color-primary)] transition-colors"
              >
                <ArrowLeft size={14} />
                {t.register.backToHome.replace('← ', '')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
