import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { isAxiosError } from 'axios';
import { apiClient } from '../api/client';

const TOKEN_KEY = 'publicvoice_token';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (fullName: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  getToken: () => string | null;
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
    if (err.response?.data?.detail) {
      const detail = err.response.data.detail;
      if (Array.isArray(detail)) {
        return detail.map((x: { msg?: string }) => x.msg).filter(Boolean).join(', ') || 'Request failed';
      }
      return typeof detail === 'string' ? detail : String(detail);
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

  const persistToken = useCallback((t: string | null) => {
    setToken(t);
    try {
      if (t) localStorage.setItem(TOKEN_KEY, t);
      else localStorage.removeItem(TOKEN_KEY);
    } catch {
      // ignore
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
      try {
        const { data } = await apiClient.post<{ access_token: string }>('/api/auth/login', {
          email: email.trim().toLowerCase(),
          password,
        });
        const accessToken = data.access_token;
        if (!accessToken) return { ok: false, error: 'Invalid response' };
        persistToken(accessToken);
        return { ok: true };
      } catch (err) {
        return { ok: false, error: getErrorMessage(err) };
      }
    },
    [persistToken]
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

  const logout = useCallback(() => {
    persistToken(null);
  }, [persistToken]);

  const getToken = useCallback(() => getStoredToken(), []);

  const value: AuthContextType = {
    token,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
