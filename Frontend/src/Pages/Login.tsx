import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Megaphone, Phone, User, Mail, Lock } from 'lucide-react';
import { LanguageSwitcher } from '../Components/LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../api/client';

const LOGIN_IMAGE = '/Image/home%203.jpg';

export default function Login() {
  const { t } = useLanguage();
  const { login, loginVerifyOtp, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [formData, setFormData] = useState({ phone: '', fullName: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [devOtpFromLogin, setDevOtpFromLogin] = useState<string | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('session') === 'expired') {
      setError('Your session expired. Please log in again.');
      window.history.replaceState({}, document.title, '/login');
    }
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Admin login with email + password
    if (isAdminLogin) {
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
      try {
        const { data } = await apiClient.post<{
          access_token: string;
          token_type?: string;
          expires_in_minutes?: number;
          user?: {
            id: number;
            full_name: string;
            email?: string;
            role: string;
            is_admin?: boolean;
          };
          is_admin?: boolean;
        }>('/api/auth/login', {
          email: email.toLowerCase(),
          password: password,
        });
        
        if (data.access_token) {
          // Store token first
          localStorage.setItem('publicvoice_token', data.access_token);
          
          // Determine if admin from login response (most reliable)
          // Check data.is_admin first, then data.user?.role
          const userRoleLower = (data.user?.role ?? '').trim().toLowerCase();
          const isAdminFromResponse = data.is_admin === true || 
            userRoleLower === 'admin' || userRoleLower === 'superadmin';
          
          // Determine redirect path based on user role from login response
          const from = location.state?.from?.pathname;
          let targetPath: string;
          
          if (isAdminFromResponse) {
            // Admin: Always go to admin dashboard (or specific admin page if coming from one)
            if (from && from.startsWith('/admin')) {
              targetPath = from;
            } else {
              targetPath = '/admin/dashboard';
            }
            sessionStorage.setItem('publicvoice_redirect_to_admin', '1');
            console.log('[Admin Login] Redirecting to:', targetPath, { is_admin: data.is_admin, role: data.user?.role });
          } else {
            // Regular users: Go to user dashboard
            if (from && (from.startsWith('/user') || from === '/report')) {
              targetPath = from;
            } else {
              targetPath = '/user/dashboard';
            }
            console.log('[User Login] Redirecting to:', targetPath);
          }
          
          // For admin login, use hard redirect to ensure AuthContext state is fully synced
          // This ensures ProtectedRoute sees the updated token and user
          if (isAdminFromResponse) {
            // Hard redirect for admin to ensure clean state
            window.location.href = targetPath;
          } else {
            // For regular users, refresh user and navigate normally
            try {
              await refreshUser();
            } catch (err) {
              console.error('Failed to refresh user:', err);
            }
            navigate(targetPath, { replace: true });
          }
        } else {
          setError('Invalid response from server');
        }
      } catch (err: any) {
        // Handle network errors (backend not running)
        if (err?.code === 'ERR_NETWORK' || err?.message?.includes('Network Error') || err?.message?.includes('ERR_CONNECTION_REFUSED')) {
          setError('Cannot connect to server. Please make sure the backend is running on http://127.0.0.1:8000');
          return;
        }
        
        // Handle HTTP errors
        const status = err?.response?.status;
        const detail = err?.response?.data?.detail || err?.message || 'Login failed';
        
        if (status === 401) {
          // Provide specific error messages for admin login
          if (detail.includes('No account found')) {
            setError('No admin account found with this email address. Please check your email.');
          } else if (detail.includes('no password set')) {
            setError('This admin account has no password. Please reset it using: python -m scripts.reset_admin_password');
          } else if (detail.includes('Invalid password')) {
            setError('Incorrect password. Please try again or reset your password.');
          } else {
            setError('Invalid email or password. Please check your credentials.');
          }
        } else {
          setError(detail);
        }
      } finally {
        setLoading(false);
      }
      return;
    }
    
    // User login with phone + full name
    const phone = formData.phone.trim();
    const fullName = formData.fullName.trim();
    if (!phone) {
      setError('Please enter your phone number.');
      return;
    }
    if (!fullName) {
      setError('Please enter your full name.');
      return;
    }
    setLoading(true);
    const result = await login(phone, fullName);
    setLoading(false);
    
    // Debug logging
    console.log('[Login] Result:', {
      ok: result.ok,
      requires_otp: result.requires_otp,
      phone: result.phone,
      dev_otp: result.dev_otp,
      error: result.error,
    });
    
    if (!result.ok) {
      setError(result.error ?? 'Login failed');
      return;
    }
    if (result.requires_otp && result.phone) {
      console.log('[Login] Setting OTP step with dev_otp:', result.dev_otp);
      // Set OTP state first
      const otpValue = result.dev_otp ?? null;
      setDevOtpFromLogin(otpValue);
      setOtpCode(otpValue ?? '');
      setOtpPhone(result.phone);
      setShowOtpStep(true);
      setOtpError(null);
      setError(null);
      
      // Log for debugging
      if (otpValue) {
        console.log('[Login] OTP code to display:', otpValue);
      } else {
        console.warn('[Login] No OTP received in response');
      }
      return;
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    const code = otpCode.trim();
    if (!code || code.length !== 6) {
      setOtpError('Enter the 6-digit code from your phone.');
      return;
    }
    setOtpLoading(true);
    const result = await loginVerifyOtp(otpPhone, code);
    setOtpLoading(false);
    if (!result.ok) {
      setOtpError(result.error ?? 'Invalid or expired code.');
      return;
    }
    const me = await refreshUser();
    const user = me ?? result.user;
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
    const roleLower = (user?.role ?? '').trim().toLowerCase();
    const isAdmin = result.is_admin === true || roleLower === 'admin' || roleLower === 'superadmin';
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
            <p className="text-sm mt-4 mb-8 text-slate-500">
              {showOtpStep
                ? 'Enter verification code'
                : isAdminLogin
                  ? 'Admin Login'
                  : t.login.signInHeadline}
            </p>

            {/* Admin/User Toggle */}
            {!showOtpStep && (
              <div className="mb-6 flex items-center justify-center gap-2 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdminLogin(false);
                    setError(null);
                    setFormData({ phone: '', fullName: '', email: '', password: '' });
                  }}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    !isAdminLogin
                      ? 'bg-white text-[var(--color-primary)] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  User Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdminLogin(true);
                    setError(null);
                    setFormData({ phone: '', fullName: '', email: '', password: '' });
                  }}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isAdminLogin
                      ? 'bg-white text-[var(--color-primary)] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Admin Login
                </button>
              </div>
            )}

            {showOtpStep ? (
              <>
                <p className="text-sm text-slate-500 mb-4">We sent a 6-digit code to your phone. Enter it below.</p>
                {devOtpFromLogin ? (
                  <div className="mb-4 p-4 rounded-xl text-sm bg-amber-50 border-2 border-amber-300 text-amber-900">
                    <div className="flex items-start gap-2">
                      <Phone className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-semibold mb-1">Development Mode - OTP Code:</p>
                        <p className="text-base">
                          <span className="font-medium">Your verification code is:</span>{' '}
                          <strong className="font-mono text-2xl tracking-widest text-amber-900 bg-amber-100 px-3 py-1 rounded inline-block">
                            {devOtpFromLogin}
                          </strong>
                        </p>
                        <p className="text-xs mt-2 text-amber-700">
                          (Use this code to verify your phone number)
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 p-3 rounded-xl text-sm bg-blue-50 border border-blue-200 text-blue-800">
                    <p className="font-medium">Check your phone for the 6-digit verification code.</p>
                    <p className="text-xs mt-1 text-blue-700">
                      If you don't receive the code, check the browser console or try again.
                    </p>
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
                      Phone Number
                    </label>
                    <p className="text-slate-700 font-medium">{otpPhone}</p>
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
                {(error.toLowerCase().includes('not verified') || error.toLowerCase().includes('verification')) && formData.phone.trim() && (
                  <p className="mt-2">
                    <Link
                      to="/verify-phone"
                      state={{ phone: formData.phone.trim() }}
                      className="font-semibold text-[var(--color-primary)] hover:underline"
                    >
                      Enter verification code →
                    </Link>
                  </p>
                )}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {isAdminLogin ? (
                <>
                  {/* Admin Login: Email */}
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
                        placeholder="admin@example.com"
                      />
                    </div>
                  </div>

                  {/* Admin Login: Password */}
                  <div>
                    <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Lock size={18} />
                      </span>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] text-slate-900"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* User Login: Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">
                      Full Name
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
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* User Login: Phone Number */}
                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">
                      Phone Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Phone size={18} />
                      </span>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] text-slate-900"
                        placeholder="+250788123456"
                      />
                    </div>
                  </div>
                </>
              )}

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
