'use client';
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { api, authHeader } from '@/shared/lib/api';
import { getToken, clearToken } from '@/shared/lib/auth';

interface UserProfile {
  id: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface AuthState {
  user: UserProfile | null;
  /** true while /auth/me is in-flight on initial load */
  loading: boolean;
  /** Call after successful OTP verify — stores token, fetches profile */
  login: (token: string) => Promise<void>;
  /** Clears token + in-memory profile, redirects handled by callers */
  logout: () => void;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async (token: string): Promise<UserProfile | null> => {
    try {
      return await api.get<UserProfile>('/auth/me', authHeader(token));
    } catch {
      // 401 — token invalid/expired: clean up
      clearToken();
      document.cookie = 'lb_session=; path=/; max-age=0';
      return null;
    }
  }, []);

  // On mount: restore session from persisted token (no lb_phone needed)
  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    fetchMe(token).then((profile) => {
      setUser(profile);
      setLoading(false);
    });
  }, [fetchMe]);

  const login = useCallback(async (token: string) => {
    // Token was already stored by the login page — just fetch profile
    const profile = await fetchMe(token);
    setUser(profile);
  }, [fetchMe]);

  const logout = useCallback(() => {
    clearToken();
    document.cookie = 'lb_session=; path=/; max-age=0';
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
