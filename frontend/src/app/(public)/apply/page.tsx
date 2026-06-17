'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/shared/lib/api';
import { saveToken } from '@/shared/lib/auth';
import { useAuth } from '@/shared/lib/auth-context';
import { LOAN_CONFIG, calcAnnuity } from '@/shared/config/loan';
import { formatCurrency } from '@/shared/lib/format';

/* ─── Validation ─── */
const phoneRe = /^\+[1-9]\d{6,14}$/;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
interface ValidationErrors { [key: string]: string }

function validatePersonal(f: Record<string, any>): ValidationErrors {
  const e: ValidationErrors = {};
  if (!f.firstName || String(f.firstName).trim().length < 2) e.firstName = 'Введите имя (минимум 2 символа)';
  if (!f.lastName  || String(f.lastName).trim().length < 2)  e.lastName  = 'Введите фамилию (минимум 2 символа)';
  if (!f.dateOfBirth) {
    e.dateOfBirth = 'Укажите дату рождения';
  } else {
    const dob = new Date(f.dateOfBirth);
    const year = dob.getFullYear();
    const maxYear = new Date().getFullYear() - 18;
    if (isNaN(dob.getTime()) || year < 1900 || year > maxYear) {
      e.dateOfBirth = `Укажите корректную дату рождения (от 1900 до ${maxYear})`;
    }
  }
  if (!f.email || !emailRe.test(f.email)) e.email = 'Введите корректный email, например: ivan@mail.com';
  if (!f.phone || !phoneRe.test(f.phone)) e.phone = 'Введите номер в международном формате, например: +35312345678';
  const amt = Number(f.amount);
  if (!amt || amt < LOAN_CONFIG.personal.minAmount || amt > LOAN_CONFIG.personal.maxAmount)
    e.amount = `Сумма — от ${LOAN_CONFIG.personal.minAmount.toLocaleString('ru')} до ${LOAN_CONFIG.personal.maxAmount.toLocaleString('ru')} EUR`;
  const days = Number(f.termDays);
  if (!days || days < LOAN_CONFIG.personal.minDays || days > LOAN_CONFIG.personal.maxDays)
    e.termDays = `Срок — от ${LOAN_CONFIG.personal.minDays} до ${LOAN_CONFIG.personal.maxDays} дней`;
  if (!f.consent) e.consent = 'Необходимо принять условия для продолжения';
  return e;
}

function validateBusiness(f: Record<string, any>): ValidationErrors {
  const e: ValidationErrors = {};
  if (!f.companyName || String(f.companyName).trim().length < 2) e.companyName = 'Введите название компании (минимум 2 символа)';
  if (!f.regNumber   || String(f.regNumber).trim().length < 2)   e.regNumber   = 'Введите регистрационный номер компании';
  if (!f.repName     || String(f.repName).trim().length < 2)     e.repName     = 'Введите имя представителя';
  if (!f.repPosition || String(f.repPosition).trim().length < 2) e.repPosition = 'Укажите должность представителя';
  if (!f.email || !emailRe.test(f.email)) e.email = 'Введите корректный email, например: info@company.com';
  if (!f.phone || !phoneRe.test(f.phone)) e.phone = 'Введите номер в международном формате, например: +35312345678';
  const amt = Number(f.amount);
  if (!amt || amt < LOAN_CONFIG.business.minAmount || amt > LOAN_CONFIG.business.maxAmount)
    e.amount = `Сумма — от ${LOAN_CONFIG.business.minAmount.toLocaleString('ru')} до ${LOAN_CONFIG.business.maxAmount.toLocaleString('ru')} EUR`;
  const months = Number(f.termMonths);
  if (!months || months < LOAN_CONFIG.business.minMonths || months > LOAN_CONFIG.business.maxMonths)
    e.termMonths = `Срок — от ${LOAN_CONFIG.business.minMonths} до ${LOAN_CONFIG.business.maxMonths} месяцев`;
  if (!f.consent) e.consent = 'Необходимо принять условия для продолжения';
  return e;
}

/* ─── Input components ─── */
function InputField({
  label, error, hint, locked, onSwitch, ...props
}: {
  label: string; error?: string; hint?: string;
  locked?: boolean; onSwitch?: () => void;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>
        {locked && onSwitch && (
          <button
            type="button"
            onClick={onSwitch}
            style={{ background: 'none', border: 'none', color: 'var(--accent-indigo)', fontSize: '0.75rem', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
          >
            Войти в другой аккаунт
          </button>
        )}
      </div>
      <input
        {...props}
        disabled={locked || props.disabled}
        style={{
          width: '100%',
          border: `1.5px solid ${error ? 'var(--accent-crimson)' : locked ? 'var(--line-soft)' : 'var(--line-strong)'}`,
          borderRadius: '8px',
          padding: '10px 14px',
          fontSize: '1rem',
          color: locked ? 'var(--text-secondary)' : 'var(--text-primary)',
          background: locked ? 'var(--surface-2)' : 'var(--surface-2)',
          boxSizing: 'border-box',
          outline: 'none',
          cursor: locked ? 'not-allowed' : 'text',
        }}
      />
      {hint && !error && !locked && <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '3px' }}>{hint}</p>}
      {error && <p style={{ color: 'var(--accent-crimson)', fontSize: '0.75rem', marginTop: '3px' }}>{error}</p>}
    </div>
  );
}

function NumericField({ label, error, value, min, max, onChange }: {
  label: string; error?: string; value: number;
  min: number; max: number; onChange: (v: number) => void;
}) {
  const [raw, setRaw] = useState(String(value));

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setRaw(e.target.value);
    const n = Number(e.target.value);
    if (!isNaN(n)) onChange(n);
  }

  function handleBlur() {
    const n = Math.min(max, Math.max(min, Number(raw) || min));
    setRaw(String(n)); onChange(n);
  }

  return (
    <InputField
      label={label} type="number" min={min} max={max}
      value={raw} onChange={handleChange} onBlur={handleBlur}
      error={error} hint={`${min.toLocaleString('ru')} — ${max.toLocaleString('ru')}`}
    />
  );
}

/* ─── Main form ─── */
function ApplyInner() {
  const searchParams = useSearchParams();
  const { user, logout, login } = useAuth();

  const initAmount   = Number(searchParams.get('amount'))   || 10000;
  const initTermDays = Number(searchParams.get('termDays')) || 30;

  // Pre-fill phone from auth context if logged in
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [type, setType] = useState<'personal' | 'business'>('personal');
  const [fields, setFields] = useState<Record<string, any>>({
    amount: initAmount, termDays: initTermDays, termMonths: 3,
    consent: false,
    phone: user?.phone ?? '',
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [createdId, setCreatedId] = useState('');

  const phoneLocked = !!user;
  // Lock name fields only when the user already has a name on file
  const nameLocked = !!user && !!(user.firstName || user.lastName);

  function set(key: string, val: any) {
    setFields((f) => ({ ...f, [key]: val }));
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  }

  function handleSwitchAccount() {
    logout();
    set('phone', '');
  }

  function validate(): boolean {
    const effective = {
      ...fields,
      phone:     phoneLocked ? user!.phone         : fields.phone,
      firstName: nameLocked  ? user!.firstName ?? '' : fields.firstName,
      lastName:  nameLocked  ? user!.lastName  ?? '' : fields.lastName,
    };
    const errs = type === 'personal' ? validatePersonal(effective) : validateBusiness(effective);
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function submit() {
    if (!validate()) return;
    setLoading(true); setServerError('');
    try {
      const payload: any = {
        type,
        amount: fields.amount,
        phone:     phoneLocked ? user!.phone         : fields.phone,
        email:     fields.email,
        ...(type === 'personal' ? {
          termDays:    fields.termDays,
          firstName:   nameLocked ? (user!.firstName ?? '') : fields.firstName,
          lastName:    nameLocked ? (user!.lastName  ?? '') : fields.lastName,
          dateOfBirth: fields.dateOfBirth,
        } : {
          termMonths:  fields.termMonths,
          companyName: fields.companyName,
          regNumber:   fields.regNumber,
          repName:     fields.repName,
          repPosition: fields.repPosition,
        }),
      };

      const res = await api.post<{ id: string; status: string; accessToken: string }>('/applications', payload);

      // Always overwrite the stored token with the one returned for this
      // phone number — covers the guest case (new token for new number)
      // and keeps the auth user's session fresh.
      saveToken(res.accessToken);
      document.cookie = `lb_session=1; path=/; max-age=${60 * 60 * 24 * 7}`;
      await login(res.accessToken);

      setCreatedId(res.id);
      setStep(3);
    } catch (e: any) {
      setServerError(e.message || 'Не удалось отправить заявку. Проверьте данные и попробуйте снова.');
    } finally {
      setLoading(false);
    }
  }

  const { payment, total } = type === 'personal'
    ? calcAnnuity(fields.amount || 0, LOAN_CONFIG.personal.dailyRate, fields.termDays || 1)
    : { payment: 0, total: 0 };

  const cardStyle = (selected: boolean): React.CSSProperties => ({
    flex: 1, border: `2px solid ${selected ? 'var(--accent-indigo)' : 'var(--line-strong)'}`,
    borderRadius: '10px', padding: '1rem', cursor: 'pointer',
    background: selected ? 'rgba(79,70,229,0.12)' : 'var(--surface-2)',
    textAlign: 'center', transition: 'border-color 150ms, background 150ms',
  });

  /* Step 3 — success */
  if (step === 3 && createdId) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-mint)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Заявка принята</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Номер заявки:</p>
        <p style={{ fontFamily: 'var(--f-mono)', fontSize: '0.875rem', color: 'var(--accent-indigo)', marginBottom: '1.5rem', wordBreak: 'break-all' }}>{createdId}</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: '2rem' }}>
          Мы уведомим вас о статусе по указанному номеру телефона.
        </p>
        <Link href="/cabinet/applications" style={{ display: 'inline-block', background: 'var(--accent-indigo)', color: '#fff', borderRadius: '8px', padding: '10px 18px', fontWeight: 600, textDecoration: 'none', fontSize: '1rem' }}>
          Перейти в личный кабинет
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        {(['Тип заявителя', 'Ваши данные', 'Отправка'] as const).map((label, idx) => {
          const num = idx + 1;
          const done = step > num; const active = step === num;
          return (
            <div key={num} style={{ display: 'flex', alignItems: 'center', flex: num < 3 ? 1 : undefined }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: done ? 'var(--accent-mint)' : active ? 'var(--accent-indigo)' : 'var(--surface-2)',
                  color: (done || active) ? '#fff' : 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.875rem', fontWeight: 700,
                }}>
                  {done ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg> : num}
                </div>
                <span style={{ fontSize: '0.6875rem', color: active ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>{label}</span>
              </div>
              {num < 3 && <div style={{ flex: 1, height: '2px', background: done ? 'var(--accent-mint)' : 'var(--surface-2)', margin: '0 0.5rem', marginBottom: '1.25rem' }} />}
            </div>
          );
        })}
      </div>

      {/* Step 1 — type */}
      {step === 1 && (
        <>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>Выберите тип заявителя</h2>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={cardStyle(type === 'personal')} onClick={() => setType('personal')}>
              <div style={{ marginBottom: '0.5rem' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-indigo)" strokeWidth="1.5"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
              </div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Физическое лицо</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>500 — 50 000 EUR, 7–90 дней</div>
            </div>
            <div style={cardStyle(type === 'business')} onClick={() => setType('business')}>
              <div style={{ marginBottom: '0.5rem' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-indigo)" strokeWidth="1.5"><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
              </div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Бизнес</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>30 000 — 500 000 EUR, 1–12 мес.</div>
            </div>
          </div>
          <button onClick={() => setStep(2)} style={{ width: '100%', background: 'var(--accent-indigo)', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>
            Далее
          </button>
        </>
      )}

      {/* Step 2 — data */}
      {step === 2 && (
        <>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            {type === 'personal' ? 'Личные данные' : 'Данные компании'}
          </h2>

          {type === 'personal' ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <InputField label="Имя" value={nameLocked ? (user!.firstName ?? '') : (fields.firstName || '')} onChange={(e) => !nameLocked && set('firstName', e.target.value)} error={errors.firstName} placeholder="Иван" locked={nameLocked} />
                <InputField label="Фамилия" value={nameLocked ? (user!.lastName ?? '') : (fields.lastName || '')} onChange={(e) => !nameLocked && set('lastName', e.target.value)} error={errors.lastName} placeholder="Иванов" locked={nameLocked} />
              </div>
              <InputField label="Дата рождения" type="date" value={fields.dateOfBirth || ''} onChange={(e) => set('dateOfBirth', e.target.value)} error={errors.dateOfBirth} min="1900-01-01" max={`${new Date().getFullYear() - 18}-12-31`} />
              <InputField label="Email" type="email" value={fields.email || ''} onChange={(e) => set('email', e.target.value)} error={errors.email} placeholder="ivan@example.com" />
              <InputField
                label="Номер телефона"
                placeholder="+353..."
                value={phoneLocked ? user!.phone : (fields.phone || '')}
                onChange={(e) => !phoneLocked && set('phone', e.target.value)}
                error={errors.phone}
                hint="Международный формат: +35312345678"
                locked={phoneLocked}
                onSwitch={handleSwitchAccount}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <NumericField label="Сумма займа (EUR)" value={fields.amount} min={LOAN_CONFIG.personal.minAmount} max={LOAN_CONFIG.personal.maxAmount} onChange={(v) => set('amount', v)} error={errors.amount} />
                <NumericField label="Срок (дней)" value={fields.termDays} min={LOAN_CONFIG.personal.minDays} max={LOAN_CONFIG.personal.maxDays} onChange={(v) => set('termDays', v)} error={errors.termDays} />
              </div>
              <div style={{ background: 'var(--surface-0)', borderRadius: '10px', padding: '0.875rem 1rem', marginBottom: '1rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '3px' }}>Ежедневный платёж</p>
                  <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: '#fff', fontSize: '1.125rem' }}>{formatCurrency(payment)}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '3px' }}>Итого к возврату</p>
                  <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: 'var(--accent-indigo)', fontSize: '1.125rem' }}>{formatCurrency(total)}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <InputField label="Название компании" value={fields.companyName || ''} onChange={(e) => set('companyName', e.target.value)} error={errors.companyName} placeholder="LumenBridge OU" />
              <InputField label="Регистрационный номер" value={fields.regNumber || ''} onChange={(e) => set('regNumber', e.target.value)} error={errors.regNumber} placeholder="EE123456789" />
              <InputField label="Имя представителя" value={fields.repName || ''} onChange={(e) => set('repName', e.target.value)} error={errors.repName} placeholder="Иван Иванов" />
              <InputField label="Должность представителя" value={fields.repPosition || ''} onChange={(e) => set('repPosition', e.target.value)} error={errors.repPosition} placeholder="Генеральный директор" />
              <InputField label="Email" type="email" value={fields.email || ''} onChange={(e) => set('email', e.target.value)} error={errors.email} placeholder="info@company.com" />
              <InputField
                label="Номер телефона"
                placeholder="+353..."
                value={phoneLocked ? user!.phone : (fields.phone || '')}
                onChange={(e) => !phoneLocked && set('phone', e.target.value)}
                error={errors.phone}
                hint="Международный формат: +35312345678"
                locked={phoneLocked}
                onSwitch={handleSwitchAccount}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <NumericField label="Сумма займа (EUR)" value={fields.amount} min={LOAN_CONFIG.business.minAmount} max={LOAN_CONFIG.business.maxAmount} onChange={(v) => set('amount', v)} error={errors.amount} />
                <NumericField label="Срок (месяцев)" value={fields.termMonths} min={LOAN_CONFIG.business.minMonths} max={LOAN_CONFIG.business.maxMonths} onChange={(v) => set('termMonths', v)} error={errors.termMonths} />
              </div>
            </>
          )}

          {/* Consent */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', marginBottom: '0.5rem' }}>
            <input type="checkbox" id="consent" checked={!!fields.consent} onChange={(e) => set('consent', e.target.checked)} style={{ marginTop: '3px', cursor: 'pointer', accentColor: 'var(--accent-indigo)' }} />
            <label htmlFor="consent" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', cursor: 'pointer', lineHeight: 1.5 }}>
              Я ознакомлен(-а) с{' '}
              <Link href="/terms" target="_blank" style={{ color: 'var(--accent-indigo)' }}>условиями использования</Link>{' '}
              и{' '}
              <Link href="/privacy" target="_blank" style={{ color: 'var(--accent-indigo)' }}>политикой конфиденциальности</Link>
            </label>
          </div>
          {errors.consent && <p style={{ color: 'var(--accent-crimson)', fontSize: '0.75rem', marginBottom: '0.875rem' }}>{errors.consent}</p>}

          {serverError && (
            <div style={{ background: 'rgba(239, 71, 111, 0.16)', borderLeft: '4px solid var(--accent-crimson)', borderRadius: '6px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.875rem', color: '#fecdd3' }}>
              {serverError}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, background: 'var(--surface-1)', border: '1.5px solid var(--accent-indigo)', color: 'var(--accent-indigo)', borderRadius: '8px', padding: '11px', fontWeight: 600, cursor: 'pointer' }}>
              Назад
            </button>
            <button onClick={submit} disabled={loading} style={{ flex: 2, background: loading ? 'rgba(79, 70, 229, 0.55)' : 'var(--accent-indigo)', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Отправка...' : 'Отправить заявку'}
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default function ApplyPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-0)', padding: '3rem 1rem 2rem' }}>
      <div style={{
        maxWidth: '640px', margin: '0 auto', background: 'var(--surface-1)',
        borderRadius: '12px', padding: '1rem',
        boxShadow: '0 4px 24px rgba(13,27,42,0.08), 0 1px 3px rgba(13,27,42,0.04)',
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-indigo)', marginBottom: '0.375rem' }}>
            Оформление займа
          </p>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Подать заявку
          </h1>
        </div>
        <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Загрузка...</div>}>
          <ApplyInner />
        </Suspense>
      </div>
    </div>
  );
}
