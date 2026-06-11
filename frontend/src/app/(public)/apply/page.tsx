'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/shared/lib/api';
import { LOAN_CONFIG, calcAnnuity } from '@/shared/config/loan';
import { formatCurrency } from '@/shared/lib/format';

/* ─── Human-readable validation ─── */
const phoneRe = /^\+[1-9]\d{6,14}$/;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ValidationErrors { [key: string]: string }

function validatePersonal(f: Record<string, any>): ValidationErrors {
  const e: ValidationErrors = {};
  if (!f.firstName || String(f.firstName).trim().length < 2) e.firstName = 'Введите имя (минимум 2 символа)';
  if (!f.lastName  || String(f.lastName).trim().length < 2)  e.lastName  = 'Введите фамилию (минимум 2 символа)';
  if (!f.dateOfBirth) e.dateOfBirth = 'Укажите дату рождения';
  if (!f.email || !emailRe.test(f.email)) e.email = 'Введите корректный email, например: ivan@mail.com';
  if (!f.phone || !phoneRe.test(f.phone)) e.phone = 'Введите номер в международном формате, например: +35312345678';
  const amt = Number(f.amount);
  if (!amt || amt < LOAN_CONFIG.personal.minAmount || amt > LOAN_CONFIG.personal.maxAmount)
    e.amount = `Сумма должна быть от ${LOAN_CONFIG.personal.minAmount.toLocaleString('ru')} до ${LOAN_CONFIG.personal.maxAmount.toLocaleString('ru')} EUR`;
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

/* ─── Input field component ─── */
function InputField({
  label, error, hint, ...props
}: { label: string; error?: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#4A6580', marginBottom: '4px' }}>
        {label}
      </label>
      <input
        {...props}
        style={{
          width: '100%',
          border: `1.5px solid ${error ? '#C0392B' : '#C8D0DA'}`,
          borderRadius: '8px',
          padding: '10px 14px',
          fontSize: '1rem',
          color: '#0D1B2A',
          background: '#fff',
          boxSizing: 'border-box',
          outline: 'none',
        }}
      />
      {hint && !error && <p style={{ color: '#4A6580', fontSize: '0.75rem', marginTop: '3px' }}>{hint}</p>}
      {error && <p style={{ color: '#C0392B', fontSize: '0.75rem', marginTop: '3px' }}>{error}</p>}
    </div>
  );
}

/* Numeric input that clamps on blur */
function NumericField({
  label, error, value, min, max, onChange,
}: {
  label: string; error?: string; value: number;
  min: number; max: number;
  onChange: (v: number) => void;
}) {
  const [raw, setRaw] = useState(String(value));

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setRaw(e.target.value);
    const n = Number(e.target.value);
    if (!isNaN(n)) onChange(n);
  }

  function handleBlur() {
    const n = Math.min(max, Math.max(min, Number(raw) || min));
    setRaw(String(n));
    onChange(n);
  }

  return (
    <InputField
      label={label}
      type="number"
      min={min}
      max={max}
      value={raw}
      onChange={handleChange}
      onBlur={handleBlur}
      error={error}
      hint={`${min.toLocaleString('ru')} — ${max.toLocaleString('ru')}`}
    />
  );
}

/* ─── Main form component ─── */
function ApplyInner() {
  const searchParams = useSearchParams();

  const initAmount   = Number(searchParams.get('amount'))   || 10000;
  const initTermDays = Number(searchParams.get('termDays')) || 30;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [type, setType] = useState<'personal' | 'business'>('personal');
  const [fields, setFields] = useState<Record<string, any>>({
    amount: initAmount, termDays: initTermDays, termMonths: 3,
    consent: false,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [createdId, setCreatedId] = useState('');

  function set(key: string, val: any) {
    setFields((f) => ({ ...f, [key]: val }));
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  }

  function validate(): boolean {
    const errs = type === 'personal' ? validatePersonal(fields) : validateBusiness(fields);
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function submit() {
    if (!validate()) return;
    setLoading(true);
    setServerError('');
    try {
      const payload: any = {
        type,
        amount: fields.amount,
        phone:  fields.phone,
        email:  fields.email,
        ...(type === 'personal' ? {
          termDays:    fields.termDays,
          firstName:   fields.firstName,
          lastName:    fields.lastName,
          dateOfBirth: fields.dateOfBirth,
        } : {
          termMonths:  fields.termMonths,
          companyName: fields.companyName,
          regNumber:   fields.regNumber,
          repName:     fields.repName,
          repPosition: fields.repPosition,
        }),
      };
      const res = await api.post<{ id: string }>('/applications', payload);
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
    flex: 1,
    border: `2px solid ${selected ? '#2E7DF7' : '#C8D0DA'}`,
    borderRadius: '12px',
    padding: '1rem',
    cursor: 'pointer',
    background: selected ? 'rgba(46,125,247,0.05)' : '#fff',
    textAlign: 'center',
    transition: 'border-color 150ms, background 150ms',
  });

  /* ── Шаг 3: успех ── */
  if (step === 3 && createdId) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#D4EDDA', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1E8A5E" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.5rem' }}>Заявка принята</h2>
        <p style={{ color: '#4A6580', marginBottom: '0.5rem' }}>Номер заявки:</p>
        <p style={{ fontFamily: 'var(--f-mono)', fontSize: '0.875rem', color: '#2E7DF7', marginBottom: '1.5rem', wordBreak: 'break-all' }}>{createdId}</p>
        <p style={{ color: '#4A6580', fontSize: '0.9375rem', marginBottom: '2rem' }}>
          Мы уведомим вас о статусе по указанному номеру телефона.
        </p>
        <Link href="/cabinet/applications" style={{ display: 'inline-block', background: '#2E7DF7', color: '#fff', borderRadius: '8px', padding: '12px 32px', fontWeight: 600, textDecoration: 'none', fontSize: '1rem' }}>
          Перейти в личный кабинет
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* ── Stepper ── */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        {(['Тип заявителя', 'Ваши данные', 'Отправка'] as const).map((label, idx) => {
          const num = idx + 1;
          const done   = step > num;
          const active = step === num;
          return (
            <div key={num} style={{ display: 'flex', alignItems: 'center', flex: num < 3 ? 1 : undefined }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: done ? '#1E8A5E' : active ? '#2E7DF7' : '#E8ECF0',
                  color: (done || active) ? '#fff' : '#4A6580',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.875rem', fontWeight: 700,
                }}>
                  {done
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    : num}
                </div>
                <span style={{ fontSize: '0.6875rem', color: active ? '#0D1B2A' : '#4A6580', fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>
                  {label}
                </span>
              </div>
              {num < 3 && (
                <div style={{ flex: 1, height: '2px', background: done ? '#1E8A5E' : '#E8ECF0', margin: '0 0.5rem', marginBottom: '1.25rem' }} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Шаг 1: тип заявителя ── */}
      {step === 1 && (
        <>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '1.25rem' }}>
            Выберите тип заявителя
          </h2>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={cardStyle(type === 'personal')} onClick={() => setType('personal')}>
              <div style={{ marginBottom: '0.5rem' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2E7DF7" strokeWidth="1.5"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
              </div>
              <div style={{ fontWeight: 600, color: '#0D1B2A', marginBottom: '0.25rem' }}>Физическое лицо</div>
              <div style={{ fontSize: '0.8125rem', color: '#4A6580' }}>500 — 50 000 EUR, 7–90 дней</div>
            </div>
            <div style={cardStyle(type === 'business')} onClick={() => setType('business')}>
              <div style={{ marginBottom: '0.5rem' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2E7DF7" strokeWidth="1.5"><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
              </div>
              <div style={{ fontWeight: 600, color: '#0D1B2A', marginBottom: '0.25rem' }}>Бизнес</div>
              <div style={{ fontSize: '0.8125rem', color: '#4A6580' }}>30 000 — 500 000 EUR, 1–12 мес.</div>
            </div>
          </div>
          <button
            onClick={() => setStep(2)}
            style={{ width: '100%', background: '#2E7DF7', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}
          >
            Далее
          </button>
        </>
      )}

      {/* ── Шаг 2: данные ── */}
      {step === 2 && (
        <>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '1.25rem' }}>
            {type === 'personal' ? 'Личные данные' : 'Данные компании'}
          </h2>

          {type === 'personal' ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <InputField
                  label="Имя" value={fields.firstName || ''}
                  onChange={(e) => set('firstName', e.target.value)}
                  error={errors.firstName} placeholder="Иван"
                />
                <InputField
                  label="Фамилия" value={fields.lastName || ''}
                  onChange={(e) => set('lastName', e.target.value)}
                  error={errors.lastName} placeholder="Иванов"
                />
              </div>
              <InputField
                label="Дата рождения" type="date"
                value={fields.dateOfBirth || ''}
                onChange={(e) => set('dateOfBirth', e.target.value)}
                error={errors.dateOfBirth}
              />
              <InputField
                label="Email" type="email"
                value={fields.email || ''}
                onChange={(e) => set('email', e.target.value)}
                error={errors.email} placeholder="ivan@example.com"
              />
              <InputField
                label="Номер телефона" placeholder="+353..."
                value={fields.phone || ''}
                onChange={(e) => set('phone', e.target.value)}
                error={errors.phone}
                hint="Международный формат: +35312345678"
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <NumericField
                  label="Сумма займа (EUR)"
                  value={fields.amount} min={LOAN_CONFIG.personal.minAmount} max={LOAN_CONFIG.personal.maxAmount}
                  onChange={(v) => set('amount', v)} error={errors.amount}
                />
                <NumericField
                  label="Срок (дней)"
                  value={fields.termDays} min={LOAN_CONFIG.personal.minDays} max={LOAN_CONFIG.personal.maxDays}
                  onChange={(v) => set('termDays', v)} error={errors.termDays}
                />
              </div>

              {/* Мини-preview */}
              <div style={{ background: '#0D1B2A', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '3px' }}>Ежедневный платёж</p>
                  <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: '#fff', fontSize: '1.125rem' }}>{formatCurrency(payment)}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '3px' }}>Итого к возврату</p>
                  <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: '#2E7DF7', fontSize: '1.125rem' }}>{formatCurrency(total)}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <InputField
                label="Название компании" value={fields.companyName || ''}
                onChange={(e) => set('companyName', e.target.value)}
                error={errors.companyName} placeholder="LumenBridge OU"
              />
              <InputField
                label="Регистрационный номер" value={fields.regNumber || ''}
                onChange={(e) => set('regNumber', e.target.value)}
                error={errors.regNumber} placeholder="EE123456789"
              />
              <InputField
                label="Имя представителя" value={fields.repName || ''}
                onChange={(e) => set('repName', e.target.value)}
                error={errors.repName} placeholder="Иван Иванов"
              />
              <InputField
                label="Должность представителя" value={fields.repPosition || ''}
                onChange={(e) => set('repPosition', e.target.value)}
                error={errors.repPosition} placeholder="Генеральный директор"
              />
              <InputField
                label="Email" type="email" value={fields.email || ''}
                onChange={(e) => set('email', e.target.value)}
                error={errors.email} placeholder="info@company.com"
              />
              <InputField
                label="Номер телефона" placeholder="+353..."
                value={fields.phone || ''}
                onChange={(e) => set('phone', e.target.value)}
                error={errors.phone}
                hint="Международный формат: +35312345678"
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <NumericField
                  label="Сумма займа (EUR)"
                  value={fields.amount} min={LOAN_CONFIG.business.minAmount} max={LOAN_CONFIG.business.maxAmount}
                  onChange={(v) => set('amount', v)} error={errors.amount}
                />
                <NumericField
                  label="Срок (месяцев)"
                  value={fields.termMonths} min={LOAN_CONFIG.business.minMonths} max={LOAN_CONFIG.business.maxMonths}
                  onChange={(v) => set('termMonths', v)} error={errors.termMonths}
                />
              </div>
            </>
          )}

          {/* Согласие */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', marginBottom: '0.5rem' }}>
            <input
              type="checkbox" id="consent" checked={!!fields.consent}
              onChange={(e) => set('consent', e.target.checked)}
              style={{ marginTop: '3px', cursor: 'pointer', accentColor: '#2E7DF7' }}
            />
            <label htmlFor="consent" style={{ fontSize: '0.8125rem', color: '#4A6580', cursor: 'pointer', lineHeight: 1.5 }}>
              Я ознакомлен(-а) с{' '}
              <Link href="/terms" target="_blank" style={{ color: '#2E7DF7' }}>условиями использования</Link>{' '}
              и{' '}
              <Link href="/privacy" target="_blank" style={{ color: '#2E7DF7' }}>политикой конфиденциальности</Link>
            </label>
          </div>
          {errors.consent && (
            <p style={{ color: '#C0392B', fontSize: '0.75rem', marginBottom: '0.875rem' }}>{errors.consent}</p>
          )}

          {serverError && (
            <div style={{ background: '#FAD7D4', borderLeft: '4px solid #C0392B', borderRadius: '6px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.875rem', color: '#6B1A14' }}>
              {serverError}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              onClick={() => setStep(1)}
              style={{ flex: 1, background: '#fff', border: '1.5px solid #2E7DF7', color: '#2E7DF7', borderRadius: '8px', padding: '11px', fontWeight: 600, cursor: 'pointer' }}
            >
              Назад
            </button>
            <button
              onClick={submit} disabled={loading}
              style={{ flex: 2, background: loading ? '#7AABF7' : '#2E7DF7', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
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
    /* Отступ сверху 5rem — форма не прилипает к капсульному хедеру */
    <div style={{ minHeight: '100vh', background: '#E8ECF0', padding: '5rem 1rem 3rem' }}>
      <div style={{
        maxWidth: '640px',
        margin: '0 auto',
        background: '#fff',
        borderRadius: '16px',        /* гладкие скругления со всех сторон */
        padding: '2rem',
        boxShadow: '0 4px 24px rgba(13,27,42,0.08), 0 1px 3px rgba(13,27,42,0.04)',
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.375rem' }}>
            Оформление займа
          </p>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 700, color: '#0D1B2A', letterSpacing: '-0.01em' }}>
            Подать заявку
          </h1>
        </div>
        <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: '#4A6580' }}>Загрузка...</div>}>
          <ApplyInner />
        </Suspense>
      </div>
    </div>
  );
}
