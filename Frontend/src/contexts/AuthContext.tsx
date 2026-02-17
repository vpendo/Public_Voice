import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { isAxiosError } from 'axios';
import { apiClient } from '../api/client';

const TOKEN_KEY = 'publicvoice_token';

export interface UserInfo {
  id: number;
  full_name: string;
  email: string;
  role: string;
  profile_image?: string | null;
}

interface AuthContextType {
  token: string | null;
  user: UserInfo | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoadingUser: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string; user?: UserInfo; is_admin?: boolean }>;
  register: (fullName: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ ok: boolean; error?: string; reset_token?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ ok: boolean; error?: string }>;
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
      return 'Cannot reach server. Is the backend running at http://127.0.0.1:8000?';
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
    } catch {
      // ignore
    }
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
    if (token) {
      fetchUser();
    } else {
      setUser(null);
      setIsLoadingUser(false);
    }
  }, [token, fetchUser]);

  const login = useCallback(
    async (email: string, password: string): Promise<{ ok: boolean; error?: string; user?: UserInfo; is_admin?: boolean }> => {
      try {
        const { data } = await apiClient.post<{
          access_token: string;
          user?: UserInfo;
          is_admin?: boolean;
        }>('/api/auth/login', {
          email: email.trim().toLowerCase(),
          password,
        });
        const accessToken = data.access_token;
        if (!accessToken) return { ok: false, error: 'Invalid response' };
        persistToken(accessToken);
        const isAdmin = data.is_admin === true;
        if (data.user) {
          setUser(data.user);
          return { ok: true, user: data.user, is_admin: isAdmin };
        }
        const me = await fetchUser();
        const userFromMe = me ?? undefined;
        return { ok: true, user: userFromMe, is_admin: isAdmin || (userFromMe && (userFromMe.role ?? '').trim().toLowerCase() === 'admin') };
      } catch (err) {
        return { ok: false, error: getErrorMessage(err) };
      }
    },
    [persistToken, fetchUser]
  );

  const register = useCallback(
    async (
      fullName: string,
      email: string,
      password: string
    ): Promise<{ ok: boolean; error?: string }> => {
      try {
        await apiClient.post('/api/auth/register', {
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
        });
        return login(email, password);
      } catch (err) {
        return { ok: false, error: getErrorMessage(err) };
      }
    },
    [login]
  );

  const requestPasswordReset = useCallback(
    async (email: string): Promise<{ ok: boolean; error?: string; reset_token?: string }> => {
      try {
        const { data } = await apiClient.post<{ message: string; reset_token?: string }>(
          '/api/auth/forgot-password',
          { email: email.trim().toLowerCase() }
        );
        return { ok: true, reset_token: data.reset_token };
      } catch (err) {
        return { ok: false, error: getErrorMessage(err) };
      }
    },
    []
  );

  const resetPassword = useCallback(
    async (token: string, newPassword: string): Promise<{ ok: boolean; error?: string }> => {
      try {
        await apiClient.post('/api/auth/reset-password', { token, new_password: newPassword });
        return { ok: true };
      } catch (err) {
        return { ok: false, error: getErrorMessage(err) };
      }
    },
    []
  );

  const updateProfile = useCallback(
    async (data: { full_name?: string; profile_image?: File }): Promise<{ ok: boolean; error?: string }> => {
      try {
        const formData = new FormData();
        if (data.full_name !== undefined) formData.append('full_name', data.full_name);
        if (data.profile_image) formData.append('profile_image', data.profile_image);
        const { data: updated } = await apiClient.patch<UserInfo>('/api/auth/me', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setUser(updated);
        return { ok: true };
      } catch (err) {
        return { ok: false, error: getErrorMessage(err) };
      }
    },
    []
  );

  const logout = useCallback(() => {
    persistToken(null);
    setUser(null);
  }, [persistToken]);

  const getToken = useCallback(() => getStoredToken(), []);

  const value: AuthContextType = {
    token,
    user,
    isAuthenticated: !!token,
    isAdmin: (user?.role ?? '').trim().toLowerCase() === 'admin',
    isLoadingUser,
    login,
    register,
    requestPasswordReset,
    resetPassword,
    updateProfile,
    logout,
    getToken,
    refreshUser: fetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
