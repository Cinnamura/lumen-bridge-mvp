'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { api } from '@/shared/lib/api';
import { useAdminAuth } from '@/shared/lib/admin-auth-context';

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get('from') || '/admin/applications';
  const { login } = useAdminAuth();

  const [login_, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!login_.trim() || !password) { setError('Введите логин и пароль'); return; }
    setLoading(true);
    try {
      const res = await api.post<{ accessToken: string; admin: { role: string } }>('/auth/admin/login', { login: login_.trim(), password });
      await login(res.accessToken);
      router.push(from);
    } catch (e: any) {
      setError(e.message || 'Не удалось войти');
    } finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#E8ECF0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ fontFamily: 'var(--f-display)', fontSize: '1.5rem', color: '#0D1B2A', textDecoration: 'none' }}>
            LumenBridge
          </Link>
          <p style={{ fontSize: '0.75rem', color: '#4A6580', marginTop: '0.25rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Admin Panel
          </p>
        </div>

        <form onSubmit={submit} style={{ background: '#fff', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 8px rgba(13,27,42,0.06), 0 1px 2px rgba(13,27,42,0.04)', border: '1px solid #E8ECF0' }}>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.375rem' }}>
            Вход в админ-панель
          </h1>
          <p style={{ color: '#4A6580', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Введите учётные данные сотрудника
          </p>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#4A6580', marginBottom: '4px' }}>Логин</label>
            <input
              type="text" autoFocus value={login_}
              onChange={(e) => setLogin(e.target.value)}
              autoComplete="username"
              style={{ width: '100%', border: '1.5px solid #C8D0DA', borderRadius: '8px', padding: '10px 14px', fontSize: '1rem', color: '#0D1B2A', background: '#fff', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#4A6580', marginBottom: '4px' }}>Пароль</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'} value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{ width: '100%', border: '1.5px solid #C8D0DA', borderRadius: '8px', padding: '10px 44px 10px 14px', fontSize: '1rem', color: '#0D1B2A', background: '#fff', boxSizing: 'border-box', outline: 'none' }}
              />
              <button type="button" onClick={() => setShowPw((s) => !s)} aria-label="Показать пароль"
                style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#4A6580', padding: 6 }}>
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p style={{ color: '#C0392B', fontSize: '0.8125rem', marginBottom: '0.75rem' }}>{error}</p>}

          <button type="submit" disabled={loading}
            style={{ width: '100%', background: loading ? '#7AABF7' : '#2E7DF7', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '1rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Вход...' : 'Войти'}
          </button>

          <p style={{ marginTop: '1rem', padding: '0.625rem 0.875rem', background: '#FFFBCC', border: '1px solid #E6D200', borderRadius: '6px', fontSize: '0.75rem', color: '#5A4800', lineHeight: 1.5 }}>
            Учебный режим. Тестовые креды:<br />
            <code style={{ fontFamily: 'var(--f-mono)' }}>admin / admin123</code> (роль admin),<br />
            <code style={{ fontFamily: 'var(--f-mono)' }}>operator / operator123</code> (роль operator)
          </p>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#E8ECF0' }} />}>
      <LoginInner />
    </Suspense>
  );
}
