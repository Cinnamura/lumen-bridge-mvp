'use client';
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { api, authHeader } from '@/shared/lib/api';

interface AdminProfile {
  id: string;
  login: string;
  role: 'admin' | 'operator';
}

interface AdminAuthState {
  profile: AdminProfile | null;
  admin: AdminProfile | null;
  loading: boolean;
  login:  (token: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthState>({
  profile: null,
  admin: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

const TOKEN_KEY = 'lb_admin_token';

function saveAdminToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}
function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}
function clearAdminToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async (token: string): Promise<AdminProfile | null> => {
    try {
      return await api.get<AdminProfile>('/admin/me', authHeader(token));
    } catch {
      clearAdminToken();
      document.cookie = 'lb_admin=; path=/; max-age=0';
      return null;
    }
  }, []);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMe(token).then((p) => {
      setProfile(p);
      setLoading(false);
    });
  }, [fetchMe]);

  const login = useCallback(async (token: string) => {
    saveAdminToken(token);
    document.cookie = `lb_admin=1; path=/; max-age=${60 * 60 * 24 * 7}`;
    const p = await fetchMe(token);
    setProfile(p);
  }, [fetchMe]);

  const logout = useCallback(() => {
    clearAdminToken();
    document.cookie = 'lb_admin=; path=/; max-age=0';
    setProfile(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ profile, admin: profile, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

/**
 * Returns a handler for catch blocks in admin pages.
 * On 401 (expired/invalid token) it logs the admin out and sends them
 * to the login screen; otherwise it forwards the message to setError.
 */
export function useAdminErrorHandler(setError: (msg: string) => void) {
  const { logout } = useAdminAuth();
  return useCallback((e: any) => {
    if (e?.status === 401) {
      logout();
      if (typeof window !== 'undefined') window.location.href = '/admin/login';
      return;
    }
    setError(e?.message ?? 'Ошибка запроса');
  }, [logout, setError]);
}
