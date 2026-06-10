'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/shared/lib/api';
import { saveToken } from '@/shared/lib/auth';

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get('from') || '/cabinet/applications';

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [mockCode, setMockCode] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  async function requestCode() {
    setError('');
    if (!/^\+[1-9]\d{6,14}$/.test(phone)) {
      setError('Введите телефон в формате +35312345678');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post<{ mockCode: string }>('/auth/otp/request', { phone });
      setMockCode(res.mockCode);
      setStep('otp');
      setCountdown(60);
    } catch (e: any) {
      setError(e.message || 'Ошибка при отправке кода');
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode() {
    const code = otp.join('');
    if (code.length < 6) { setError('Введите 6-значный код'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await api.post<{ accessToken: string; user: any }>('/auth/otp/verify', { phone, code });
      saveToken(res.accessToken);
      localStorage.setItem('lb_phone', phone);
      // Set presence cookie for middleware
      document.cookie = `lb_session=1; path=/; max-age=${60 * 60 * 24}`;
      router.push(from);
    } catch (e: any) {
      setError(e.message || 'Неверный или просроченный код');
    } finally {
      setLoading(false);
    }
  }

  function handleOtpInput(i: number, val: string) {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[i] = digit;
    setOtp(next);
    if (digit && i < 5) inputRefs.current[i + 1]?.focus();
  }

  function handleOtpKey(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#E8ECF0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ fontFamily: 'var(--f-display)', fontSize: '1.5rem', color: '#0D1B2A', textDecoration: 'none' }}>
            LumenBridge
          </Link>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 8px rgba(13,27,42,0.06), 0 1px 2px rgba(13,27,42,0.04)', border: '1px solid #E8ECF0' }}>
          {step === 'phone' ? (
            <>
              <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.375rem' }}>
                Вход в личный кабинет
              </h1>
              <p style={{ color: '#4A6580', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Введите номер телефона для получения кода
              </p>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#4A6580', marginBottom: '4px' }}>
                  Номер телефона
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && requestCode()}
                  placeholder="+353..."
                  style={{ width: '100%', border: '1.5px solid #C8D0DA', borderRadius: '8px', padding: '10px 14px', fontSize: '1rem', color: '#0D1B2A', background: '#fff', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>

              {error && (
                <p style={{ color: '#C0392B', fontSize: '0.8125rem', marginBottom: '0.75rem' }}>{error}</p>
              )}

              <button
                onClick={requestCode}
                disabled={loading}
                style={{ width: '100%', background: loading ? '#7AABF7' : '#2E7DF7', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '1rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? 'Отправка...' : 'Получить код'}
              </button>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.375rem' }}>
                Введите код из SMS
              </h1>
              <p style={{ color: '#4A6580', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Код отправлен на {phone.slice(0, 4)}***{phone.slice(-4)}
              </p>

              {/* OTP cells */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', justifyContent: 'center' }}>
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleOtpInput(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKey(i, e)}
                    style={{ width: '48px', height: '52px', textAlign: 'center', fontSize: '1.375rem', fontWeight: 700, fontFamily: 'var(--f-mono)', border: '1.5px solid #C8D0DA', borderRadius: '8px', outline: 'none', color: '#0D1B2A' }}
                  />
                ))}
              </div>

              {error && (
                <p style={{ color: '#C0392B', fontSize: '0.8125rem', marginBottom: '0.75rem', textAlign: 'center' }}>{error}</p>
              )}

              <button
                onClick={verifyCode}
                disabled={loading}
                style={{ width: '100%', background: loading ? '#7AABF7' : '#2E7DF7', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '1rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '0.75rem' }}
              >
                {loading ? 'Проверка...' : 'Подтвердить'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#4A6580' }}>
                {countdown > 0 ? (
                  <>Отправить снова через {countdown} с.</>
                ) : (
                  <button
                    onClick={() => { setStep('phone'); setOtp(['','','','','','']); setError(''); }}
                    style={{ background: 'none', border: 'none', color: '#2E7DF7', cursor: 'pointer', fontSize: '0.8125rem', padding: 0 }}
                  >
                    Не получили код? Попробовать снова
                  </button>
                )}
              </p>
            </>
          )}
        </div>

        {/* Mock-banner */}
        {step === 'otp' && mockCode && (
          <div style={{ marginTop: '1rem', background: '#FFFBCC', border: '1px solid #E6D200', color: '#5A4800', padding: '10px 16px', borderRadius: '8px', fontSize: '0.8125rem' }}>
            Учебный режим — SMS не отправляется. Тестовый код: <strong style={{ fontFamily: 'var(--f-mono)' }}>{mockCode}</strong>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#E8ECF0' }} />}>
      <LoginInner />
    </Suspense>
  );
}
