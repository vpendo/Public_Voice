import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { isAxiosError } from 'axios';
import { apiClient } from '../api/client';

const TOKEN_KEY = 'publicvoice_token';

export interface UserInfo {
  id: number;
  full_name: string;
  phone?: string | null;
  national_id?: string | null;
  email?: string | null;
  role: string;
  phone_verified?: boolean;
  admin_category?: string | null;
  admin_scope_level?: string | null;
  scope_district?: string | null;
  scope_sector?: string | null;
  scope_cell?: string | null;
  profile_image?: string | null;
}

interface AuthContextType {
  token: string | null;
  user: UserInfo | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoadingUser: boolean;

  login: (phone: string, fullName: string) => Promise<{
    ok: boolean;
    error?: string;
    user?: UserInfo;
    is_admin?: boolean;
    requires_otp?: boolean;
    phone?: string;
    dev_otp?: string;
  }>;

  loginVerifyOtp: (phone: string, code: string) => Promise<{
    ok: boolean;
    error?: string;
    user?: UserInfo;
    is_admin?: boolean;
  }>;

  register: (fullName: string, phone: string, nationalId: string) => Promise<{
    ok: boolean;
    error?: string;
    phone?: string;
    dev_otp?: string;
  }>;

  requestPasswordReset: (email: string) => Promise<{ ok: boolean; error?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ ok: boolean; error?: string }>;
  resetPasswordWithOtp: (email: string, code: string, newPassword: string) => Promise<{ ok: boolean; error?: string }>;
  updateProfile: (data: { full_name?: string; profile_image?: File }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  getToken: () => string | null;
  refreshUser: () => Promise<UserInfo | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function getErrorMessage(err: unknown): string {
  if (isAxiosError(err)) {
    if (err.code === 'ECONNREFUSED' || err.message === 'Network Error') {
      return 'Cannot reach server. Is the backend running?';
    }
    if (err.response?.data?.detail !== undefined) {
      const detail = err.response.data.detail;
      if (typeof detail === 'string') return detail;
      if (Array.isArray(detail)) {
        const msg = detail.map((x: { msg?: string }) => x?.msg).filter(Boolean).join(', ');
        return msg || 'Invalid request';
      }
      return String(detail);
    }
    return err.response?.status === 401 ? 'Invalid email or password' : err.message || 'Request failed';
  }
  return err instanceof Error ? err.message : 'Network error';
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(getStoredToken);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const persistToken = useCallback((t: string | null) => {
    setToken(t);
    try {
      if (t) localStorage.setItem(TOKEN_KEY, t);
      else localStorage.removeItem(TOKEN_KEY);
    } catch {}
  }, []);

  const fetchUser = useCallback(async (): Promise<UserInfo | null> => {
    const t = getStoredToken();
    if (!t) {
      setUser(null);
      setIsLoadingUser(false);
      return null;
    }
    try {
      const { data } = await apiClient.get<UserInfo>('/api/auth/me');
      setUser(data);
      return data;
    } catch {
      setUser(null);
      persistToken(null);
      return null;
    } finally {
      setIsLoadingUser(false);
    }
  }, [persistToken]);

  useEffect(() => {
    if (token) fetchUser();
    else {
      setUser(null);
      setIsLoadingUser(false);
    }
  }, [token, fetchUser]);

  // ✅ LOGIN
  const login = useCallback(
    async (
      phone: string,
      fullName: string
    ): Promise<{
      ok: boolean;
      error?: string;
      user?: UserInfo;
      is_admin?: boolean;
      requires_otp?: boolean;
      phone?: string;
      dev_otp?: string;
    }> => {
      try {
        const { data } = await apiClient.post<{
          requires_otp?: boolean;
          phone?: string;
          dev_otp?: string;
        }>('/api/auth/login', {
          phone: phone.trim(),
          full_name: fullName.trim(),
        });

        // Debug logging
        console.log('[AuthContext] Login response:', {
          requires_otp: data.requires_otp,
          phone: data.phone,
          dev_otp: data.dev_otp,
        });

        if (data.requires_otp === true && data.phone) {
          return {
            ok: true,
            requires_otp: true,
            phone: data.phone,
            dev_otp: data.dev_otp,
          };
        }

        return { ok: false, error: 'Invalid response' };
      } catch (err) {
        console.error('[AuthContext] Login error:', err);
        return { ok: false, error: getErrorMessage(err) };
      }
    },
    []
  );

  // ✅ VERIFY LOGIN OTP
  const loginVerifyOtp = useCallback(
    async (phone: string, code: string) => {
      try {
        const { data } = await apiClient.post<{
          access_token: string;
          user?: UserInfo;
          is_admin?: boolean;
        }>('/api/auth/login/verify-otp', {
          phone: phone.trim(),
          code: code.trim(),
        });

        if (!data.access_token) return { ok: false, error: 'Invalid response' };

        persistToken(data.access_token);

        if (data.user) {
          setUser(data.user);
          return { ok: true, user: data.user, is_admin: data.is_admin === true };
        }

        const me = await fetchUser();
        return { ok: true, user: me ?? undefined, is_admin: data.is_admin === true };
      } catch (err) {
        return { ok: false, error: getErrorMessage(err) };
      }
    },
    [persistToken, fetchUser]
  );

  // ✅ REGISTER
  const register = useCallback(
    async (
      fullName: string,
      phone: string,
      nationalId: string
    ): Promise<{ ok: boolean; error?: string; phone?: string; dev_otp?: string }> => {
      try {
        const { data } = await apiClient.post<{
          message: string;
          phone: string;
          dev_otp?: string;
        }>('/api/auth/register', {
          full_name: fullName.trim(),
          phone: phone.trim(),
          national_id: nationalId.trim(),
        });

        return {
          ok: true,
          phone: data.phone ?? phone.trim(),
          dev_otp: data.dev_otp,
        };
      } catch (err) {
        return { ok: false, error: getErrorMessage(err) };
      }
    },
    []
  );

  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      await apiClient.post('/api/auth/forgot-password', { email: email.trim().toLowerCase() });
      return { ok: true };
    } catch (err) {
      return { ok: false, error: getErrorMessage(err) };
    }
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    try {
      await apiClient.post('/api/auth/reset-password', { token, new_password: newPassword });
      return { ok: true };
    } catch (err) {
      return { ok: false, error: getErrorMessage(err) };
    }
  }, []);

  const resetPasswordWithOtp = useCallback(async (email: string, code: string, newPassword: string) => {
    try {
      await apiClient.post('/api/auth/reset-password', {
        email: email.trim().toLowerCase(),
        code: code.trim(),
        new_password: newPassword,
      });
      return { ok: true };
    } catch (err) {
      return { ok: false, error: getErrorMessage(err) };
    }
  }, []);

  const updateProfile = useCallback(async (data: { full_name?: string; profile_image?: File }) => {
    try {
      const formData = new FormData();
      if (data.full_name) formData.append('full_name', data.full_name);
      if (data.profile_image) formData.append('profile_image', data.profile_image);

      const { data: updated } = await apiClient.patch<UserInfo>('/api/auth/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUser(updated);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: getErrorMessage(err) };
    }
  }, []);

  const logout = useCallback(() => {
    persistToken(null);
    setUser(null);
  }, [persistToken]);

  const value: AuthContextType = {
    token,
    user,
    isAuthenticated: !!token,
    isAdmin: (user?.role ?? '').trim().toLowerCase() === 'admin' || (user?.role ?? '').trim().toLowerCase() === 'superadmin',
    isLoadingUser,
    login,
    loginVerifyOtp,
    register,
    requestPasswordReset,
    resetPassword,
    resetPasswordWithOtp,
    updateProfile,
    logout,
    getToken: getStoredToken,
    refreshUser: fetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}