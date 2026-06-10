'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import * as v from 'valibot';
import Link from 'next/link';
import { api } from '@/shared/lib/api';
import { LOAN_CONFIG, calcAnnuity } from '@/shared/config/loan';
import { formatCurrency } from '@/shared/lib/format';

/* ─── Valibot schemas ─── */
const phoneRe = /^\+[1-9]\d{6,14}$/;

const str2 = (max = 255) => v.string([v.minLength(2), v.maxLength(max)]);

const PersonalSchema = v.object({
  firstName:   str2(100),
  lastName:    str2(100),
  dateOfBirth: v.string([v.minLength(8)]),
  email:       v.string([v.email()]),
  phone:       v.string([v.regex(phoneRe, 'Формат: +35312345678')]),
  amount:      v.number([v.minValue(LOAN_CONFIG.personal.minAmount), v.maxValue(LOAN_CONFIG.personal.maxAmount)]),
  termDays:    v.number([v.minValue(LOAN_CONFIG.personal.minDays), v.maxValue(LOAN_CONFIG.personal.maxDays)]),
  consent:     v.literal(true),
});

const BusinessSchema = v.object({
  companyName: str2(255),
  regNumber:   str2(100),
  repName:     str2(200),
  repPosition: str2(100),
  email:       v.string([v.email()]),
  phone:       v.string([v.regex(phoneRe, 'Формат: +35312345678')]),
  amount:      v.number([v.minValue(LOAN_CONFIG.business.minAmount), v.maxValue(LOAN_CONFIG.business.maxAmount)]),
  termMonths:  v.number([v.minValue(LOAN_CONFIG.business.minMonths), v.maxValue(LOAN_CONFIG.business.maxMonths)]),
  consent:     v.literal(true),
});

function InputField({ label, error, ...props }: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#4A6580', marginBottom: '4px' }}>{label}</label>
      <input {...props} style={{ width: '100%', border: `1.5px solid ${error ? '#C0392B' : '#C8D0DA'}`, borderRadius: '8px', padding: '10px 14px', fontSize: '1rem', color: '#0D1B2A', background: '#fff', boxSizing: 'border-box', outline: 'none' }} />
      {error && <p style={{ color: '#C0392B', fontSize: '0.75rem', marginTop: '3px' }}>{error}</p>}
    </div>
  );
}

function ApplyInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initAmount  = Number(searchParams.get('amount'))  || 10000;
  const initTermDays = Number(searchParams.get('termDays')) || 30;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [type, setType] = useState<'personal' | 'business'>('personal');
  const [fields, setFields] = useState<Record<string, any>>({
    amount: initAmount, termDays: initTermDays, termMonths: 3,
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [createdId, setCreatedId] = useState('');

  function set(key: string, val: any) {
    setFields((f) => ({ ...f, [key]: val }));
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  }

  function validate(): boolean {
    const schema = type === 'personal' ? PersonalSchema : BusinessSchema;
    const result = v.safeParse(schema, { ...fields, type });
    if (result.success) { setErrors({}); return true; }
    const errs: Record<string, string> = {};
    result.issues?.forEach((issue) => {
      const key = String(issue.path?.[0]?.key ?? 'unknown');
      errs[key] = issue.message;
    });
    setErrors(errs);
    return false;
  }

  async function submit() {
    if (!validate()) return;
    setLoading(true);
    setServerError('');
    try {
      const payload: any = {
        type,
        amount:    fields.amount,
        phone:     fields.phone,
        email:     fields.email,
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
      setServerError(e.message || 'Не удалось отправить заявку');
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
  });

  /* Шаг 3 — успех */
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
          Мы уведомим вас о статусе по указанному телефону.
        </p>
        <Link href="/login" style={{ display: 'inline-block', background: '#2E7DF7', color: '#fff', borderRadius: '8px', padding: '12px 32px', fontWeight: 600, textDecoration: 'none', fontSize: '1rem' }}>
          Перейти в личный кабинет
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '0' }}>
        {(['Тип', 'Данные', 'Подтверждение'] as const).map((label, idx) => {
          const num = idx + 1;
          const done = step > num;
          const active = step === num;
          return (
            <div key={num} style={{ display: 'flex', alignItems: 'center', flex: num < 3 ? '1' : undefined }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: done ? '#1E8A5E' : active ? '#2E7DF7' : '#E8ECF0',
                  color: done || active ? '#fff' : '#4A6580',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.875rem', fontWeight: 700,
                }}>
                  {done ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg> : num}
                </div>
                <span style={{ fontSize: '0.75rem', color: active ? '#0D1B2A' : '#4A6580', fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>{label}</span>
              </div>
              {num < 3 && <div style={{ flex: 1, height: '2px', background: done ? '#1E8A5E' : '#E8ECF0', margin: '0 0.5rem', marginBottom: '1.25rem' }} />}
            </div>
          );
        })}
      </div>

      {/* Шаг 1 — Тип заявителя */}
      {step === 1 && (
        <>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '1.25rem' }}>Тип заявителя</h2>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={cardStyle(type === 'personal')} onClick={() => setType('personal')}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2E7DF7" strokeWidth="1.5"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
              </div>
              <div style={{ fontWeight: 600, color: '#0D1B2A', marginBottom: '0.25rem' }}>Физическое лицо</div>
              <div style={{ fontSize: '0.8125rem', color: '#4A6580' }}>500 — 50 000 EUR, 7–90 дней</div>
            </div>
            <div style={cardStyle(type === 'business')} onClick={() => setType('business')}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2E7DF7" strokeWidth="1.5"><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
              </div>
              <div style={{ fontWeight: 600, color: '#0D1B2A', marginBottom: '0.25rem' }}>Бизнес</div>
              <div style={{ fontSize: '0.8125rem', color: '#4A6580' }}>30 000 — 500 000 EUR, 1–12 мес.</div>
            </div>
          </div>
          <button onClick={() => setStep(2)} style={{ width: '100%', background: '#2E7DF7', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>
            Далее
          </button>
        </>
      )}

      {/* Шаг 2 — Данные */}
      {step === 2 && (
        <>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '1.25rem' }}>
            {type === 'personal' ? 'Ваши данные' : 'Данные компании'}
          </h2>

          {type === 'personal' ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <InputField label="Имя" value={fields.firstName || ''} onChange={(e) => set('firstName', e.target.value)} error={errors.firstName} />
                <InputField label="Фамилия" value={fields.lastName || ''} onChange={(e) => set('lastName', e.target.value)} error={errors.lastName} />
              </div>
              <InputField label="Дата рождения" type="date" value={fields.dateOfBirth || ''} onChange={(e) => set('dateOfBirth', e.target.value)} error={errors.dateOfBirth} />
              <InputField label="Email" type="email" value={fields.email || ''} onChange={(e) => set('email', e.target.value)} error={errors.email} />
              <InputField label="Телефон (E.164)" placeholder="+353..." value={fields.phone || ''} onChange={(e) => set('phone', e.target.value)} error={errors.phone} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <InputField label="Сумма (EUR)" type="number" min={500} max={50000} value={fields.amount} onChange={(e) => set('amount', Number(e.target.value))} error={errors.amount} />
                <InputField label="Срок (дней)" type="number" min={7} max={90} value={fields.termDays} onChange={(e) => set('termDays', Number(e.target.value))} error={errors.termDays} />
              </div>
              {/* Мини-preview расчёта */}
              <div style={{ background: '#0D1B2A', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1rem', display: 'flex', gap: '2rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '3px' }}>Ежедневный платёж</p>
                  <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: '#fff', fontSize: '1.125rem' }}>{formatCurrency(payment)} EUR</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '3px' }}>Итого к возврату</p>
                  <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: '#2E7DF7', fontSize: '1.125rem' }}>{formatCurrency(total)} EUR</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <InputField label="Название компании" value={fields.companyName || ''} onChange={(e) => set('companyName', e.target.value)} error={errors.companyName} />
              <InputField label="Регистрационный номер" value={fields.regNumber || ''} onChange={(e) => set('regNumber', e.target.value)} error={errors.regNumber} />
              <InputField label="Имя представителя" value={fields.repName || ''} onChange={(e) => set('repName', e.target.value)} error={errors.repName} />
              <InputField label="Должность" value={fields.repPosition || ''} onChange={(e) => set('repPosition', e.target.value)} error={errors.repPosition} />
              <InputField label="Email" type="email" value={fields.email || ''} onChange={(e) => set('email', e.target.value)} error={errors.email} />
              <InputField label="Телефон (E.164)" placeholder="+353..." value={fields.phone || ''} onChange={(e) => set('phone', e.target.value)} error={errors.phone} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <InputField label="Сумма (EUR)" type="number" min={30000} max={500000} value={fields.amount} onChange={(e) => set('amount', Number(e.target.value))} error={errors.amount} />
                <InputField label="Срок (месяцев)" type="number" min={1} max={12} value={fields.termMonths} onChange={(e) => set('termMonths', Number(e.target.value))} error={errors.termMonths} />
              </div>
            </>
          )}

          {/* Согласие */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', marginBottom: '1.25rem' }}>
            <input type="checkbox" id="consent" checked={!!fields.consent} onChange={(e) => set('consent', e.target.checked)} style={{ marginTop: '3px', cursor: 'pointer' }} />
            <label htmlFor="consent" style={{ fontSize: '0.8125rem', color: '#4A6580', cursor: 'pointer' }}>
              Я ознакомлен(-а) с{' '}
              <Link href="/terms" target="_blank" style={{ color: '#2E7DF7' }}>условиями использования</Link>{' '}
              и{' '}
              <Link href="/privacy" target="_blank" style={{ color: '#2E7DF7' }}>политикой конфиденциальности</Link>
            </label>
          </div>
          {errors.consent && <p style={{ color: '#C0392B', fontSize: '0.75rem', marginBottom: '0.75rem' }}>Необходимо согласие с условиями</p>}

          {serverError && (
            <div style={{ background: '#FAD7D4', borderLeft: '4px solid #C0392B', borderRadius: '6px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.875rem', color: '#6B1A14' }}>
              {serverError}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, background: '#fff', border: '1.5px solid #2E7DF7', color: '#2E7DF7', borderRadius: '8px', padding: '11px', fontWeight: 600, cursor: 'pointer' }}>
              Назад
            </button>
            <button onClick={submit} disabled={loading} style={{ flex: 2, background: loading ? '#7AABF7' : '#2E7DF7', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
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
    <div style={{ minHeight: '100vh', background: '#E8ECF0', padding: '3rem 1rem' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', background: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 8px rgba(13,27,42,0.06)' }}>
        <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: '#4A6580' }}>Загрузка...</div>}>
          <ApplyInner />
        </Suspense>
      </div>
    </div>
  );
}
