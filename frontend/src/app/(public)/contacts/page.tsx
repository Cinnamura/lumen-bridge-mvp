'use client';
import Link from 'next/link';
import { MapPin, Mail, Phone, ArrowRight, AlertTriangle } from 'lucide-react';

export default function ContactsPage() {
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
            {/* Form */}
            <div>
              <div style={{ width: '32px', height: '2px', background: 'var(--accent-indigo)', borderRadius: '999px', marginBottom: '1.5rem' }} />
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: '0.75rem' }}>
                Форма обратной связи
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7, fontSize: '0.9375rem' }}>
                Если у вас есть вопросы или вам нужна помощь — наша команда готова помочь.
              </p>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="input-label">Имя *</label>
                    <input className="input" type="text" required placeholder="Иван" />
                  </div>
                  <div>
                    <label className="input-label">Фамилия</label>
                    <input className="input" type="text" placeholder="Иванов" />
                  </div>
                </div>
                <div>
                  <label className="input-label">Email *</label>
                  <input className="input" type="email" required placeholder="ivan@example.com" />
                </div>
                <div>
                  <label className="input-label">Телефон</label>
                  <input className="input" type="tel" placeholder="+353 1 531 8420" />
                </div>
                <div>
                  <label className="input-label">Сообщение *</label>
                  <textarea className="input" rows={5} required placeholder="Ваш вопрос или сообщение..." style={{ resize: 'vertical' }} />
                </div>
                <div>
                  <label className="input-label">Прикрепить файл</label>
                  <input type="file" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <input type="checkbox" id="c" required style={{ marginTop: '3px', accentColor: 'var(--accent-indigo)', width: '15px', height: '15px' }} />
                  <label htmlFor="c" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', cursor: 'pointer', lineHeight: 1.6 }}>
                    Согласен с обработкой персональных данных в соответствии с{' '}
                    <Link href="/privacy" style={{ color: 'var(--accent-indigo)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>политикой конфиденциальности</Link>
                  </label>
                </div>
                <div>
                  <button type="submit" className="btn btn-primary" style={{ gap: '8px' }}>
                    Отправить <ArrowRight size={15} />
                  </button>
                </div>
              </form>
            </div>

            {/* Info */}
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
                  { icon: <MapPin size={16} />,  label: 'Адрес',   value: '18 Lower Baggot Street, Dublin 2, Ireland', href: null },
                  { icon: <Mail size={16} />,    label: 'Email',   value: 'support@lumenbridge.example', href: 'mailto:support@lumenbridge.example' },
                  { icon: <Phone size={16} />,   label: 'Телефон', value: '+353 1 531 8420', href: 'tel:+35315318420' },
                ].map(({ icon, label, value, href }) => (
                  <div key={label} style={{ display: 'flex', gap: '1rem', padding: '1.25rem 0', borderBottom: '1px solid rgba(13,27,42,0.06)', alignItems: 'flex-start' }}>
                    <div style={{ width: '38px', height: '38px', background: 'var(--surface-2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-indigo)', flexShrink: 0 }}>
                      {icon}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '3px' }}>{label}</p>
                      {href
                        ? <a href={href} style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9375rem', transition: 'color 150ms' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-indigo)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}>{value}</a>
                        : <p style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9375rem' }}>{value}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Security notice */}
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
