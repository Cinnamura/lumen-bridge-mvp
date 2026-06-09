import Link from 'next/link';

export default function ContactsPage() {
  return (
    <>
      <section style={{ background: 'var(--color-midnight)', padding: 'var(--space-20) var(--space-6)' }}>
        <div style={{ maxWidth: 'var(--container-xl)', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,var(--text-5xl))', color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>
            Контакты
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-lg)', maxWidth: '520px' }}>
            Мы готовы ответить на ваши вопросы. Выберите удобный способ связи.
          </p>
        </div>
      </section>

      <section style={{ background: 'var(--color-white)', padding: 'var(--space-20) var(--space-6)' }}>
        <div style={{ maxWidth: 'var(--container-xl)', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)' }} className="grid-2">
          <div>
            <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-midnight)', marginBottom: 'var(--space-8)' }}>Форма обратной связи</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div><label className="input-label">Имя *</label><input className="input" type="text" required /></div>
                <div><label className="input-label">Фамилия</label><input className="input" type="text" /></div>
              </div>
              <div><label className="input-label">Email *</label><input className="input" type="email" required /></div>
              <div><label className="input-label">Телефон</label><input className="input" type="tel" placeholder="+353..." /></div>
              <div><label className="input-label">Сообщение *</label><textarea className="input" rows={5} required style={{ resize: 'vertical' }} /></div>
              <div><label className="input-label">Прикрепить файл</label><input type="file" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }} /></div>
              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                <input type="checkbox" id="c" required style={{ marginTop: '3px', accentColor: 'var(--color-accent)' }} />
                <label htmlFor="c" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  Согласен с <Link href="/privacy" style={{ color: 'var(--color-accent)' }}>политикой конфиденциальности</Link>
                </label>
              </div>
              <button className="btn-primary" style={{ alignSelf: 'flex-start' }}>Отправить</button>
            </form>
          </div>
          <div>
            <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-midnight)', marginBottom: 'var(--space-8)' }}>Как с нами связаться</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
              {[
                { label: 'Email', value: 'info@lumenbridge.eu', href: 'mailto:info@lumenbridge.eu' },
                { label: 'Телефон', value: '+353 1 234 5678', href: 'tel:+35312345678' },
                { label: 'Режим работы', value: 'Пн–Пт, 9:00–18:00 (GMT+1)', href: null },
                { label: 'Адрес', value: 'Dublin, Ireland', href: null },
              ].map(({ label, value, href }) => (
                <div key={label}>
                  <div style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)' }}>{label}</div>
                  {href ? (
                    <a href={href} style={{ fontSize: 'var(--text-base)', color: 'var(--color-accent)', fontWeight: 'var(--font-medium)', textDecoration: 'none' }}>{value}</a>
                  ) : (
                    <div style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>{value}</div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ background: '#FFF8E1', border: '1px solid #F59E0B', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)' }}>
              <p style={{ fontSize: 'var(--text-sm)', color: '#92400E', margin: 0, lineHeight: 'var(--leading-relaxed)' }}>
                ⚠️ Мы не требуем предоплату и не запрашиваем конфиденциальные данные (пароли, CVV, PIN-коды) ни через какие каналы.
              </p>
            </div>
          </div>
        </div>
      </section>
      <style>{`@media(max-width:768px){.grid-2{grid-template-columns:1fr!important}}`}</style>
    </>
  );
}
