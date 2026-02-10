import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ArrowLeft, User, Megaphone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const PRIMARY = '#0066CC';
const PRIMARY_HOVER = '#0052A3';
const SLATE_900 = '#1E293B';
const SLATE_500 = '#64748B';
const SLATE_100 = '#F1F5F9';
const BORDER = '#E2E8F0';
const ERROR = '#DC2626';

const REGISTER_IMAGE = '/Image/home%203.jpg';

export default function Register() {
  const { t } = useLanguage();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'Admin'
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await registerUser(formData.fullName, formData.email, formData.password);
    setLoading(false);

    if (result.ok) {
      // Redirect to login after registration with success message
      navigate('/login', { state: { message: 'Registration successful. Please login.' } });
    } else {
      setError(result.error ?? 'Registration failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Left panel - Image */}
      <div className="lg:w-[48%] relative min-h-[40vh] lg:min-h-screen overflow-hidden order-2 lg:order-1">
        <img src={REGISTER_IMAGE} alt="Public Voice" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-8 lg:px-12"
          style={{ background: `linear-gradient(135deg, ${PRIMARY}88 0%, ${SLATE_900}99 50%, #0F172Aee 100%)` }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <Megaphone className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl xl:text-4xl font-bold text-white mb-3">{t.register.overlayTitle}</h2>
          <p className="text-white/90 text-lg max-w-sm">{t.register.overlayTagline}</p>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex-1 flex flex-col bg-white lg:min-h-screen order-1 lg:order-2">
        <div className="flex-1 flex items-center justify-center py-10 px-6 lg:px-14">
          <div className="w-full max-w-md">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-colors"
              style={{ color: SLATE_500 }}
              onMouseEnter={(e) => { e.currentTarget.style.color = PRIMARY; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = SLATE_500; }}>
              <ArrowLeft size={18} />
              {t.register.backToHome.replace('← ', '')}
            </Link>

            <Link to="/" className="inline-block mb-1">
              <span className="text-2xl font-bold" style={{ color: SLATE_900 }}>Public</span>
              <span className="text-2xl font-bold" style={{ color: PRIMARY }}>Voice</span>
              <span className="block h-0.5 rounded-full mt-0.5" style={{ width: '100%', backgroundColor: PRIMARY }} />
            </Link>

            <p className="text-sm mt-4 mb-8" style={{ color: SLATE_500 }}>{t.register.signUpHeadline}</p>

            {error && (
              <div className="mb-4 p-3 rounded-xl text-sm bg-red-50 border border-red-200" style={{ color: ERROR }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: SLATE_500 }}>
                  {t.register.fullName}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><User size={18} /></span>
                  <input
                    type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border bg-slate-50/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30 focus:border-[#0066CC]"
                    style={{ borderColor: BORDER, color: SLATE_900 }}
                    placeholder={t.register.fullNamePlaceholder}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: SLATE_500 }}>
                  {t.register.email}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={18} /></span>
                  <input
                    type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border bg-slate-50/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30 focus:border-[#0066CC]"
                    style={{ borderColor: BORDER, color: SLATE_900 }}
                    placeholder={t.register.emailPlaceholder}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: SLATE_500 }}>
                  {t.register.password}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={18} /></span>
                  <input
                    type="password" id="password" name="password" value={formData.password} onChange={handleChange} required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border bg-slate-50/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30 focus:border-[#0066CC]"
                    style={{ borderColor: BORDER, color: SLATE_900 }}
                    placeholder={t.register.passwordPlaceholder}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-white font-semibold rounded-xl transition-colors disabled:opacity-70"
                style={{ backgroundColor: PRIMARY }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = PRIMARY_HOVER; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = PRIMARY; }}
              >
                {loading ? '...' : t.register.button}
                {!loading && <ArrowRight size={18} className="text-white" />}
              </button>
            </form>

            <p className="mt-8 text-center text-sm" style={{ color: SLATE_500 }}>
              {t.register.hasAccount}{' '}
              <Link to="/login" className="font-semibold" style={{ color: PRIMARY }}>
                {t.register.signIn}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
