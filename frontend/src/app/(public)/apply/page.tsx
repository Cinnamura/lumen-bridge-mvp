'use client';

import type { InputHTMLAttributes } from 'react';
import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { createValibotResolver } from '@/shared/lib/valibot-resolver';
import * as v from 'valibot';
import { api } from '@/shared/lib/api';
import { saveToken } from '@/shared/lib/auth';
import { useAuth } from '@/shared/lib/auth-context';
import { LOAN_CONFIG, calcAnnuity } from '@/shared/config/loan';
import { formatCurrency } from '@/shared/lib/format';

const phoneRe = /^\+[1-9]\d{6,14}$/;
const currentYear = new Date().getFullYear();
const maxBirthYear = currentYear - 18;

const personalSchema = v.object({
  type: v.literal('personal'),
  firstName: v.string('Введите имя', [v.minLength(2, 'Введите имя (минимум 2 символа)'), v.maxLength(100)]),
  lastName: v.string('Введите фамилию', [v.minLength(2, 'Введите фамилию (минимум 2 символа)'), v.maxLength(100)]),
  dateOfBirth: v.string('Укажите дату рождения', [v.regex(/^\d{4}-\d{2}-\d{2}$/, 'Дата рождения должна быть в формате YYYY-MM-DD')]),
  email: v.string('Введите email', [v.email('Введите корректный email, например: ivan@mail.com')]),
  phone: v.string('Введите номер телефона', [v.regex(phoneRe, 'Введите номер в международном формате, например: +35312345678')]),
  amount: v.number('Введите сумму займа', [v.minValue(LOAN_CONFIG.personal.minAmount, `Сумма — от ${LOAN_CONFIG.personal.minAmount.toLocaleString('ru')} до ${LOAN_CONFIG.personal.maxAmount.toLocaleString('ru')} EUR`), v.maxValue(LOAN_CONFIG.personal.maxAmount, `Сумма — от ${LOAN_CONFIG.personal.minAmount.toLocaleString('ru')} до ${LOAN_CONFIG.personal.maxAmount.toLocaleString('ru')} EUR`)]),
  termDays: v.number('Введите срок займа', [v.minValue(LOAN_CONFIG.personal.minDays, `Срок — от ${LOAN_CONFIG.personal.minDays} до ${LOAN_CONFIG.personal.maxDays} дней`), v.maxValue(LOAN_CONFIG.personal.maxDays, `Срок — от ${LOAN_CONFIG.personal.minDays} до ${LOAN_CONFIG.personal.maxDays} дней`)]),
  termMonths: v.optional(v.number()),
  consent: v.literal(true, 'Необходимо принять условия для продолжения'),
  companyName: v.optional(v.string()),
  regNumber: v.optional(v.string()),
  repName: v.optional(v.string()),
  repPosition: v.optional(v.string()),
});

const businessSchema = v.object({
  type: v.literal('business'),
  companyName: v.string('Введите название компании', [v.minLength(2, 'Введите название компании (минимум 2 символа)'), v.maxLength(255)]),
  regNumber: v.string('Введите регистрационный номер компании', [v.minLength(2, 'Введите регистрационный номер компании'), v.maxLength(100)]),
  repName: v.string('Введите имя представителя', [v.minLength(2, 'Введите имя представителя'), v.maxLength(200)]),
  repPosition: v.string('Укажите должность представителя', [v.minLength(2, 'Укажите должность представителя'), v.maxLength(100)]),
  email: v.string('Введите email', [v.email('Введите корректный email, например: info@company.com')]),
  phone: v.string('Введите номер телефона', [v.regex(phoneRe, 'Введите номер в международном формате, например: +35312345678')]),
  amount: v.number('Введите сумму займа', [v.minValue(LOAN_CONFIG.business.minAmount, `Сумма — от ${LOAN_CONFIG.business.minAmount.toLocaleString('ru')} до ${LOAN_CONFIG.business.maxAmount.toLocaleString('ru')} EUR`), v.maxValue(LOAN_CONFIG.business.maxAmount, `Сумма — от ${LOAN_CONFIG.business.minAmount.toLocaleString('ru')} до ${LOAN_CONFIG.business.maxAmount.toLocaleString('ru')} EUR`)]),
  termMonths: v.number('Введите срок займа', [v.minValue(LOAN_CONFIG.business.minMonths, `Срок — от ${LOAN_CONFIG.business.minMonths} до ${LOAN_CONFIG.business.maxMonths} месяцев`), v.maxValue(LOAN_CONFIG.business.maxMonths, `Срок — от ${LOAN_CONFIG.business.minMonths} до ${LOAN_CONFIG.business.maxMonths} месяцев`)]),
  termDays: v.optional(v.number()),
  consent: v.literal(true, 'Необходимо принять условия для продолжения'),
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
  dateOfBirth: v.optional(v.string()),
});

const applySchema = v.variant('type', [personalSchema, businessSchema]);

type ApplicantType = 'personal' | 'business';

interface ApplyFormValues {
  type: ApplicantType;
  amount: number;
  termDays: number;
  termMonths: number;
  consent: boolean;
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  companyName: string;
  regNumber: string;
  repName: string;
  repPosition: string;
}

interface SubmissionSuccess {
  kind: ApplicantType;
  id: string;
  message?: string;
}

function validateDateOfBirth(value: string) {
  const dob = new Date(value);
  const year = dob.getFullYear();
  return !Number.isNaN(dob.getTime()) && year >= 1900 && year <= maxBirthYear;
}

function InputField({
  label,
  registration,
  error,
  hint,
  locked,
  onSwitch,
  ...props
}: {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  hint?: string;
  locked?: boolean;
  onSwitch?: () => void;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>
        {locked && onSwitch && (
          <button
            type="button"
            onClick={onSwitch}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-indigo)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
            }}
          >
            Войти в другой аккаунт
          </button>
        )}
      </div>
      <input
        {...registration}
        {...props}
        className={props.type === 'date' ? 'lb-date-input' : undefined}
        readOnly={locked || props.readOnly}
        style={{
          width: '100%',
          border: `1.5px solid ${error ? 'var(--accent-crimson)' : locked ? 'var(--line-soft)' : 'var(--line-strong)'}`,
          borderRadius: '8px',
          padding: '10px 14px',
          fontSize: '1rem',
          color: locked ? 'var(--text-secondary)' : 'var(--text-primary)',
          background: 'var(--surface-2)',
          boxSizing: 'border-box',
          outline: 'none',
          cursor: locked ? 'not-allowed' : 'text',
        }}
      />
      {hint && !error && !locked && (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '3px' }}>{hint}</p>
      )}
      {error && <p style={{ color: 'var(--accent-crimson)', fontSize: '0.75rem', marginTop: '3px' }}>{error}</p>}
    </div>
  );
}

function ApplyInner() {
  const searchParams = useSearchParams();
  const { user, logout, login } = useAuth();

  const initAmount = Number(searchParams.get('amount')) || 10_000;
  const initTermDays = Number(searchParams.get('termDays')) || 30;
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [serverError, setServerError] = useState('');
  const [successState, setSuccessState] = useState<SubmissionSuccess | null>(null);

  const phoneLocked = Boolean(user);
  const nameLocked = Boolean(user && (user.firstName || user.lastName));

  const defaultValues = useMemo<ApplyFormValues>(() => ({
    type: 'personal',
    amount: initAmount,
    termDays: initTermDays,
    termMonths: 3,
    consent: false,
    phone: user?.phone ?? '',
    email: '',
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    dateOfBirth: '',
    companyName: '',
    regNumber: '',
    repName: '',
    repPosition: '',
  }), [initAmount, initTermDays, user?.firstName, user?.lastName, user?.phone]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ApplyFormValues>({
    resolver: createValibotResolver(applySchema),
    mode: 'onBlur',
    defaultValues,
  });

  const applicantType = watch('type');
  const amount = watch('amount');
  const termDays = watch('termDays');

  useEffect(() => {
    if (!user) return;
    setValue('phone', user.phone, { shouldValidate: false });
    if (user.firstName) setValue('firstName', user.firstName, { shouldValidate: false });
    if (user.lastName) setValue('lastName', user.lastName, { shouldValidate: false });
  }, [setValue, user]);

  const personalPreview = useMemo(() => {
    return calcAnnuity(amount || 0, LOAN_CONFIG.personal.dailyRate, termDays || 1);
  }, [amount, termDays]);

  const cardStyle = (selected: boolean) => ({
    flex: 1,
    border: `2px solid ${selected ? 'var(--accent-indigo)' : 'var(--line-strong)'}`,
    borderRadius: '10px',
    padding: '1rem',
    cursor: 'pointer',
    background: selected ? 'rgba(79,70,229,0.12)' : 'var(--surface-2)',
    textAlign: 'center' as const,
    transition: 'border-color 150ms, background 150ms',
  });

  function handleSwitchAccount() {
    logout();
    setValue('phone', '');
    clearErrors(['phone', 'firstName', 'lastName']);
  }

  const onSubmit = handleSubmit(async (data) => {
    if (data.type === 'personal' && !validateDateOfBirth(data.dateOfBirth)) {
      setError('dateOfBirth', {
        message: `Укажите корректную дату рождения (от 1900 до ${maxBirthYear})`,
      });
      return;
    }

    setServerError('');

    try {
      if (data.type === 'business') {
        const response = await api.post<{ id: string; message: string }>('/contact-requests', {
          firstName: data.repName,
          email: data.email,
          phone: phoneLocked ? (user?.phone ?? data.phone) : data.phone,
          message: [
            'Запрос на бизнес-финансирование',
            `Компания: ${data.companyName}`,
            `Регистрационный номер: ${data.regNumber}`,
            `Представитель: ${data.repName}`,
            `Должность: ${data.repPosition}`,
            `Сумма: ${formatCurrency(data.amount)}`,
            `Срок: ${data.termMonths} мес.`,
            'Онлайн-кабинет для бизнеса пока недоступен. Запрос принят через форму обратной связи.',
          ].join('\n'),
          consent: data.consent,
        });

        setSuccessState({
          kind: 'business',
          id: response.id,
          message: response.message,
        });
        setStep(3);
        return;
      }

      const res = await api.post<{ id: string; status: string; accessToken: string }>('/applications', {
        type: 'personal',
        amount: data.amount,
        termDays: data.termDays,
        firstName: nameLocked ? (user?.firstName ?? data.firstName) : data.firstName,
        lastName: nameLocked ? (user?.lastName ?? data.lastName) : data.lastName,
        dateOfBirth: data.dateOfBirth,
        email: data.email,
        phone: phoneLocked ? (user?.phone ?? data.phone) : data.phone,
      });

      saveToken(res.accessToken);
      document.cookie = `lb_session=1; path=/; max-age=${60 * 60 * 24 * 7}`;
      await login(res.accessToken);

      setSuccessState({ kind: 'personal', id: res.id });
      setStep(3);
    } catch (error: any) {
      setServerError(error.message || 'Не удалось отправить заявку. Проверьте данные и попробуйте снова.');
    }
  });

  if (step === 3 && successState) {
    const isBusinessSubmission = successState.kind === 'business';

    return (
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-mint)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          {isBusinessSubmission ? 'Запрос принят' : 'Заявка принята'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
          {isBusinessSubmission ? 'Номер обращения:' : 'Номер заявки:'}
        </p>
        <p style={{ fontFamily: 'var(--f-mono)', fontSize: '0.875rem', color: 'var(--accent-indigo)', marginBottom: '1.5rem', wordBreak: 'break-all' }}>{successState.id}</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: '0.75rem' }}>
          {isBusinessSubmission
            ? 'Запрос на бизнес-финансирование отправлен через форму обратной связи.'
            : 'Мы уведомим вас о статусе по указанному номеру телефона.'}
        </p>
        {isBusinessSubmission && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            {successState.message ?? 'Онлайн-кабинет для бизнеса будет доступен позже.'}
          </p>
        )}
        {!isBusinessSubmission && (
          <Link href="/cabinet/applications" style={{ display: 'inline-block', background: 'var(--accent-indigo)', color: '#fff', borderRadius: '8px', padding: '10px 18px', fontWeight: 600, textDecoration: 'none', fontSize: '1rem' }}>
            Перейти в личный кабинет
          </Link>
        )}
        {isBusinessSubmission && (
          <Link href="/contacts" style={{ display: 'inline-block', background: 'var(--accent-indigo)', color: '#fff', borderRadius: '8px', padding: '10px 18px', fontWeight: 600, textDecoration: 'none', fontSize: '1rem' }}>
            Открыть контакты
          </Link>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        {(['Тип заявителя', 'Ваши данные', 'Отправка'] as const).map((label, idx) => {
          const num = idx + 1;
          const done = step > num;
          const active = step === num;
          return (
            <div key={num} style={{ display: 'flex', alignItems: 'center', flex: num < 3 ? 1 : undefined }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: done ? 'var(--accent-mint)' : active ? 'var(--accent-indigo)' : 'var(--surface-2)',
                    color: done || active ? '#fff' : 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                  }}
                >
                  {done ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg> : num}
                </div>
                <span style={{ fontSize: '0.6875rem', color: active ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>{label}</span>
              </div>
              {num < 3 && <div style={{ flex: 1, height: '2px', background: done ? 'var(--accent-mint)' : 'var(--surface-2)', margin: '0 0.5rem', marginBottom: '1.25rem' }} />}
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>Выберите тип заявителя</h2>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <button type="button" style={cardStyle(applicantType === 'personal')} onClick={() => { setValue('type', 'personal'); clearErrors(); }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-indigo)" strokeWidth="1.5"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
              </div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Физическое лицо</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>500 — 50 000 EUR, 7–90 дней</div>
            </button>
            <button type="button" style={cardStyle(applicantType === 'business')} onClick={() => { setValue('type', 'business'); clearErrors(); }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-indigo)" strokeWidth="1.5"><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
              </div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Бизнес</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>30 000 — 500 000 EUR, 1–12 мес.</div>
            </button>
          </div>
          <button type="button" onClick={() => setStep(2)} style={{ width: '100%', background: 'var(--accent-indigo)', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>
            Далее
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            {applicantType === 'personal' ? 'Личные данные' : 'Данные компании'}
          </h2>

          {applicantType === 'personal' ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <InputField label="Имя" registration={register('firstName')} error={errors.firstName?.message} placeholder="Иван" locked={nameLocked} />
                <InputField label="Фамилия" registration={register('lastName')} error={errors.lastName?.message} placeholder="Иванов" locked={nameLocked} />
              </div>
              <InputField label="Дата рождения" registration={register('dateOfBirth')} error={errors.dateOfBirth?.message} type="date" min="1900-01-01" max={`${maxBirthYear}-12-31`} />
              <InputField label="Email" registration={register('email')} error={errors.email?.message} type="email" placeholder="ivan@example.com" />
              <InputField
                label="Номер телефона"
                registration={register('phone')}
                error={errors.phone?.message}
                placeholder="+353..."
                hint="Международный формат: +35312345678"
                locked={phoneLocked}
                onSwitch={handleSwitchAccount}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <InputField
                  label="Сумма займа (EUR)"
                  registration={register('amount', { valueAsNumber: true })}
                  error={errors.amount?.message}
                  type="number"
                  min={LOAN_CONFIG.personal.minAmount}
                  max={LOAN_CONFIG.personal.maxAmount}
                />
                <InputField
                  label="Срок (дней)"
                  registration={register('termDays', { valueAsNumber: true })}
                  error={errors.termDays?.message}
                  type="number"
                  min={LOAN_CONFIG.personal.minDays}
                  max={LOAN_CONFIG.personal.maxDays}
                />
              </div>
              <div style={{ background: 'var(--surface-0)', borderRadius: '10px', padding: '0.875rem 1rem', marginBottom: '1rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '3px' }}>Ежедневный платёж</p>
                  <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: '#fff', fontSize: '1.125rem' }}>{formatCurrency(personalPreview.payment)}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '3px' }}>Итого к возврату</p>
                  <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: 'var(--accent-indigo)', fontSize: '1.125rem' }}>{formatCurrency(personalPreview.total)}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ background: 'rgba(201,146,58,0.14)', border: '1px solid rgba(201,146,58,0.26)', borderRadius: '10px', padding: '0.875rem 1rem', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                На данный момент заявки для бизнеса принимаются через форму обратной связи. Онлайн-кабинет для бизнеса будет доступен позже.
              </div>
              <InputField label="Название компании" registration={register('companyName')} error={errors.companyName?.message} placeholder="LumenBridge OU" />
              <InputField label="Регистрационный номер" registration={register('regNumber')} error={errors.regNumber?.message} placeholder="EE123456789" />
              <InputField label="Имя представителя" registration={register('repName')} error={errors.repName?.message} placeholder="Иван Иванов" />
              <InputField label="Должность представителя" registration={register('repPosition')} error={errors.repPosition?.message} placeholder="Генеральный директор" />
              <InputField label="Email" registration={register('email')} error={errors.email?.message} type="email" placeholder="info@company.com" />
              <InputField
                label="Номер телефона"
                registration={register('phone')}
                error={errors.phone?.message}
                placeholder="+353..."
                hint="Международный формат: +35312345678"
                locked={phoneLocked}
                onSwitch={handleSwitchAccount}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <InputField
                  label="Сумма займа (EUR)"
                  registration={register('amount', { valueAsNumber: true })}
                  error={errors.amount?.message}
                  type="number"
                  min={LOAN_CONFIG.business.minAmount}
                  max={LOAN_CONFIG.business.maxAmount}
                />
                <InputField
                  label="Срок (месяцев)"
                  registration={register('termMonths', { valueAsNumber: true })}
                  error={errors.termMonths?.message}
                  type="number"
                  min={LOAN_CONFIG.business.minMonths}
                  max={LOAN_CONFIG.business.maxMonths}
                />
              </div>
            </>
          )}

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', marginBottom: '0.5rem' }}>
            <input type="checkbox" id="consent" {...register('consent')} style={{ marginTop: '3px', cursor: 'pointer', accentColor: 'var(--accent-indigo)' }} />
            <label htmlFor="consent" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', cursor: 'pointer', lineHeight: 1.5 }}>
              Я ознакомлен(-а) с{' '}
              <Link href="/terms" target="_blank" style={{ color: 'var(--accent-indigo)' }}>условиями использования</Link>{' '}
              и{' '}
              <Link href="/privacy" target="_blank" style={{ color: 'var(--accent-indigo)' }}>политикой конфиденциальности</Link>
            </label>
          </div>
          {errors.consent?.message && <p style={{ color: 'var(--accent-crimson)', fontSize: '0.75rem', marginBottom: '0.875rem' }}>{errors.consent.message}</p>}

          {serverError && (
            <div style={{ background: 'rgba(239, 71, 111, 0.16)', borderLeft: '4px solid var(--accent-crimson)', borderRadius: '6px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.875rem', color: '#fecdd3' }}>
              {serverError}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setStep(1)} style={{ flex: 1, background: 'var(--surface-1)', border: '1.5px solid var(--accent-indigo)', color: 'var(--accent-indigo)', borderRadius: '8px', padding: '11px', fontWeight: 600, cursor: 'pointer' }}>
              Назад
            </button>
            <button type="submit" disabled={isSubmitting} style={{ flex: 2, background: isSubmitting ? 'rgba(79, 70, 229, 0.55)' : 'var(--accent-indigo)', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
              {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
            </button>
          </div>
        </>
      )}
    </form>
  );
}

export default function ApplyPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-0)', padding: '3rem 1rem 2rem' }}>
      <div
        style={{
          maxWidth: '640px',
          margin: '0 auto',
          background: 'var(--surface-1)',
          borderRadius: '12px',
          padding: '1rem',
          boxShadow: '0 4px 24px rgba(13,27,42,0.08), 0 1px 3px rgba(13,27,42,0.04)',
        }}
      >
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
