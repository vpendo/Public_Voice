import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, Home } from 'lucide-react';
import { LanguageSwitcher } from '../Components/LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';
import { apiClient } from '../api/client';

const REGISTER_IMAGE = '/Image/home%203.jpg';

export default function VerifyEmail() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { email?: string; dev_otp?: string } | null;
  const emailFromState = state?.email ?? '';
  const initialOtp = state?.dev_otp ?? '';
  const [email, setEmail] = useState(emailFromState || '');
  const [code, setCode] = useState(initialOtp || '');
  const [displayOtp, setDisplayOtp] = useState(initialOtp || '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !code.trim()) {
      setError('Please enter your email and the 6-digit code.');
      return;
    }
    if (code.trim().length !== 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }
    setLoading(true);
    try {
      await apiClient.post('/api/auth/verify-email', {
        email: trimmedEmail,
        code: code.trim(),
      });
      setSuccess('Email verified successfully. You can now log in.');
      setTimeout(() => {
        navigate('/login', { state: { message: 'Email verified successfully. You can now log in.' } });
      }, 1500);
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : null;
      setError(typeof msg === 'string' ? msg : 'Invalid or expired code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError('Enter your email first.');
      return;
    }
    setError(null);
    setResendSent(false);
    setResendLoading(true);
    try {
      const response = await apiClient.post<{ message: string; dev_otp?: string }>('/api/auth/resend-otp', { email: trimmedEmail });
      setResendSent(true);
      if (response.data.dev_otp) {
        setCode(response.data.dev_otp);
        setDisplayOtp(response.data.dev_otp);
        setSuccess('Email could not be sent. Use the code below to verify.');
      } else {
        setSuccess(response.data.message ?? 'A new code was sent to your email. Check your inbox.');
      }
    } catch (err: unknown) {
      let errorMsg = 'Failed to resend code.';
      if (err && typeof err === 'object') {
        if (('code' in err && err.code === 'ERR_NETWORK') || ('message' in err && typeof (err as { message?: string }).message === 'string' && (err as { message: string }).message.includes('ERR_CONNECTION_REFUSED'))) {
          errorMsg = 'Cannot connect to server. Please make sure the backend is running.';
        } else if ('response' in err) {
          const response = (err as { response?: { data?: { detail?: string }; status?: number } }).response;
          if (response?.status === 403) errorMsg = 'Access forbidden.';
          else if (response?.data?.detail) errorMsg = response.data.detail;
        }
      }
      setError(errorMsg);
    } finally {
      setResendLoading(false);
    }
  };

  const v = t.verifyEmail;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-poppins">
      <div className="lg:w-[48%] relative min-h-[40vh] lg:min-h-screen overflow-hidden order-2 lg:order-1">
        <img src={REGISTER_IMAGE} alt="Public Voice" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-8 lg:px-12 bg-gradient-to-br from-[var(--color-primary)]/60 via-slate-900/60 to-slate-900/90">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg bg-white/20">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl xl:text-4xl font-bold text-white mb-3">Verify Email</h2>
          <p className="text-white/90 text-lg max-w-sm">Enter the verification code sent to your email</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white lg:min-h-screen order-1 lg:order-2 relative">
        <div className="absolute top-6 right-6 flex items-center gap-3">
          <LanguageSwitcher />
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[var(--color-primary)] transition-colors" aria-label="Back to home">
            <Home size={18} />
            Home
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center py-10 px-6 lg:px-14">
          <div className="w-full max-w-md">
            <Link to="/" className="inline-block mb-1">
              <span className="text-2xl font-bold text-slate-900">Public</span>
              <span className="text-2xl font-bold text-[var(--color-primary)]">Voice</span>
              <span className="block h-0.5 rounded-full mt-0.5 w-full bg-[var(--color-primary)]" />
            </Link>

            <h1 className="text-xl font-bold text-slate-900 mt-6 mb-2">Verify Email</h1>
            <p className="text-slate-500 text-sm mb-6">Enter the verification code sent to your email. Check your inbox (and spam folder).</p>

            {displayOtp ? (
              <div className="mb-4 p-4 rounded-xl text-sm bg-amber-50 border-2 border-amber-300 text-amber-900">
                <p className="font-semibold mb-1">Email could not be sent — use this code:</p>
                <p className="text-base font-mono text-2xl tracking-widest bg-amber-100 px-3 py-2 rounded inline-block">{displayOtp}</p>
                <p className="text-xs mt-2 text-amber-700">Enter it below and click Verify.</p>
              </div>
            ) : (
              <div className="mb-4 p-3 rounded-xl text-sm bg-blue-50 border border-blue-200 text-blue-800">
                <p className="font-medium">Check your email for the 6-digit verification code.</p>
                <p className="text-xs mt-1 text-blue-700">If you don’t receive it, click &quot;Resend code&quot; below.</p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 rounded-xl text-sm bg-red-50 border border-red-200 text-red-600">{error}</div>
            )}
            {success && (
              <div className="mb-4 p-3 rounded-xl text-sm bg-green-50 border border-green-200 text-green-700">{success}</div>
            )}
            {resendSent && (
              <div className="mb-4 p-3 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-700">{v?.resendSent ?? 'Code sent.'}</div>
            )}

            <form onSubmit={handleVerify} className="space-y-5">
              <div>
                <label htmlFor="verify-email" className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    id="verify-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/80 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] text-slate-900"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="verify-code" className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">
                  Verification Code
                </label>
                <input
                  type="text"
                  id="verify-code"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/80 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] text-slate-900 text-center text-2xl tracking-widest font-mono"
                  placeholder="000000"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-white font-semibold rounded-xl bg-[var(--color-primary)] hover:opacity-95 disabled:opacity-70 transition-opacity"
              >
                {loading ? '...' : 'Verify Email'}
                {!loading && <ArrowRight size={18} className="text-white" />}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="font-semibold text-[var(--color-primary)] hover:underline disabled:opacity-70"
              >
                {resendLoading ? '...' : 'Resend Code'}
              </button>
            </p>

            <p className="mt-6 text-center">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[var(--color-primary)] transition-colors">
                <ArrowLeft size={14} />
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
