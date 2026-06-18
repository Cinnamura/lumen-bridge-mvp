'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { createValibotResolver } from '@/shared/lib/valibot-resolver';
import * as v from 'valibot';
import { MapPin, Mail, Phone, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { api } from '@/shared/lib/api';

const phoneRe = /^$|^\+[1-9]\d{6,14}$/;

const contactSchema = v.object({
  firstName: v.string('Введите имя', [v.minLength(2, 'Введите имя (минимум 2 символа)'), v.maxLength(100)]),
  lastName: v.optional(v.string()),
  email: v.string('Введите email', [v.email('Введите корректный email')]),
  phone: v.string([v.regex(phoneRe, 'Введите номер в международном формате, например: +35312345678')]),
  message: v.string('Введите сообщение', [v.minLength(10, 'Сообщение должно содержать минимум 10 символов'), v.maxLength(5000)]),
  consent: v.literal(true, 'Необходимо согласие на обработку персональных данных'),
});

interface ContactFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
}

export default function ContactsPage() {
  const [attachment, setAttachment] = useState<File | null>(null);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState<{ id: string; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: createValibotResolver(contactSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
      consent: false,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    setServerError('');
    setSuccess(null);

    try {
      const response = await api.post<{ id: string; message: string }>('/contact-requests', {
        ...data,
        lastName: data.lastName || undefined,
        phone: data.phone || undefined,
        attachmentName: attachment?.name,
        attachmentType: attachment?.type || undefined,
        attachmentSize: attachment ? `${Math.max(1, Math.round(attachment.size / 1024))} KB` : undefined,
      });

      setSuccess({ id: response.id, message: response.message });
      reset();
      setAttachment(null);
    } catch (error: any) {
      setServerError(error.message ?? 'Не удалось отправить сообщение. Попробуйте позже.');
    }
  });

  return (
    <>
      <section style={{ background: 'var(--surface-0)', padding: '56px 24px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-indigo)', marginBottom: '1rem' }}>Поддержка</p>
          <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(2.5rem,5vw,4rem)', color: '#fff', letterSpacing: '-0.02em', marginBottom: '1.25rem', maxWidth: '14ch', lineHeight: 1.1 }}>
            Контакты
          </h1>
          <p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.55)', maxWidth: '46ch', lineHeight: 1.75 }}>
            Мы готовы ответить на ваши вопросы. Выберите удобный способ связи.
          </p>
        </div>
      </section>

      <section style={{ background: 'var(--surface-1)', padding: '72px 24px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="grid-2-resp" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <div style={{ width: '32px', height: '2px', background: 'var(--accent-indigo)', borderRadius: '999px', marginBottom: '1.5rem' }} />
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: '0.75rem' }}>
                Форма обратной связи
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7, fontSize: '0.9375rem' }}>
                Если у вас есть вопросы или вам нужна помощь — наша команда готова помочь.
              </p>

              {success && (
                <div style={{ marginBottom: '1rem', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.22)', borderRadius: '10px', padding: '0.9rem 1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} color="var(--accent-mint)" style={{ flexShrink: 0, marginTop: '1px' }} />
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3px' }}>Запрос отправлен</p>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{success.message}</p>
                    <p style={{ fontFamily: 'var(--f-mono)', fontSize: '0.75rem', color: 'var(--accent-indigo)', marginTop: '4px' }}>{success.id}</p>
                  </div>
                </div>
              )}

              {serverError && (
                <div style={{ marginBottom: '1rem', borderLeft: '4px solid var(--accent-crimson)', background: 'rgba(239, 71, 111, 0.12)', borderRadius: '8px', padding: '0.875rem 1rem', color: '#fecdd3', fontSize: '0.875rem' }}>
                  {serverError}
                </div>
              )}

              <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="input-label">Имя *</label>
                    <input className="input" type="text" placeholder="Иван" {...register('firstName')} />
                    {errors.firstName?.message && <p className="input-error-msg">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="input-label">Фамилия</label>
                    <input className="input" type="text" placeholder="Иванов" {...register('lastName')} />
                  </div>
                </div>
                <div>
                  <label className="input-label">Email *</label>
                  <input className="input" type="email" placeholder="ivan@example.com" {...register('email')} />
                  {errors.email?.message && <p className="input-error-msg">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="input-label">Телефон</label>
                  <input className="input" type="tel" placeholder="+35315318420" {...register('phone')} />
                  {errors.phone?.message && <p className="input-error-msg">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="input-label">Сообщение *</label>
                  <textarea className="input" rows={5} placeholder="Ваш вопрос или сообщение..." style={{ resize: 'vertical' }} {...register('message')} />
                  {errors.message?.message && <p className="input-error-msg">{errors.message.message}</p>}
                </div>
                <div>
                  <label className="input-label">Прикрепить файл</label>
                  <input
                    type="file"
                    style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}
                    onChange={(event) => setAttachment(event.target.files?.[0] ?? null)}
                  />
                  {attachment && <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{attachment.name}</p>}
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <input type="checkbox" id="c" {...register('consent')} style={{ marginTop: '3px', accentColor: 'var(--accent-indigo)', width: '15px', height: '15px' }} />
                  <label htmlFor="c" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', cursor: 'pointer', lineHeight: 1.6 }}>
                    Согласен с обработкой персональных данных в соответствии с{' '}
                    <Link href="/privacy" style={{ color: 'var(--accent-indigo)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>политикой конфиденциальности</Link>
                  </label>
                </div>
                {errors.consent?.message && <p className="input-error-msg" style={{ marginTop: '-0.5rem' }}>{errors.consent.message}</p>}
                <div>
                  <button type="submit" className="btn btn-primary" style={{ gap: '8px', opacity: isSubmitting ? 0.7 : 1 }} disabled={isSubmitting}>
                    {isSubmitting ? 'Отправка...' : 'Отправить'} <ArrowRight size={15} />
                  </button>
                </div>
              </form>
            </div>

            <div>
              <div style={{ width: '32px', height: '2px', background: 'var(--accent-indigo)', borderRadius: '999px', marginBottom: '1.5rem' }} />
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: '0.75rem' }}>
                Контактная информация
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '0.75rem', fontSize: '0.9375rem' }}>
                Вы можете связаться с нами по любым вопросам, связанным с оформлением займа, условиями или обслуживанием.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem', fontSize: '0.875rem' }}>
                Служба поддержки работает в рабочие часы. Онлайн-заявки принимаются круглосуточно.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {[
                  { icon: <MapPin size={16} />, label: 'Адрес', value: '18 Lower Baggot Street, Dublin 2, Ireland', href: null },
                  { icon: <Mail size={16} />, label: 'Email', value: 'support@lumenbridge.example', href: 'mailto:support@lumenbridge.example' },
                  { icon: <Phone size={16} />, label: 'Телефон', value: '+353 1 531 8420', href: 'tel:+35315318420' },
                ].map(({ icon, label, value, href }) => (
                  <div key={label} style={{ display: 'flex', gap: '1rem', padding: '1.25rem 0', borderBottom: '1px solid rgba(13,27,42,0.06)', alignItems: 'flex-start' }}>
                    <div style={{ width: '38px', height: '38px', background: 'var(--surface-2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-indigo)', flexShrink: 0 }}>
                      {icon}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '3px' }}>{label}</p>
                      {href ? (
                        <a href={href} style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9375rem', transition: 'color 150ms' }}>{value}</a>
                      ) : (
                        <p style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9375rem' }}>{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '2rem', background: 'rgba(245, 158, 11, 0.14)', border: '1px solid rgba(201,146,58,0.25)', borderRadius: '10px', padding: '0.9rem 1rem', display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                <AlertTriangle size={16} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '0.8125rem', color: '#fde68a', lineHeight: 1.65 }}>
                  Мы не требуем предоплату и не запрашиваем конфиденциальные данные (пароли, CVV, PIN-коды) ни через какие каналы.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
