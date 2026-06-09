import Link from 'next/link';

export default function BusinessPage() {
  return (
    <>
      <section style={{ background: 'var(--color-midnight)', padding: 'var(--space-20) var(--space-6)' }}>
        <div style={{ maxWidth: 'var(--container-xl)', margin: '0 auto' }}>
          <div style={{ fontSize: 'var(--text-sm)', color: '#C9923A', fontWeight: 'var(--font-semibold)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 'var(--space-3)' }}>Для бизнеса</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,var(--text-6xl))', color: 'var(--color-white)', marginBottom: 'var(--space-6)', maxWidth: '700px' }}>
            Финансирование для компаний и предпринимателей
          </h1>
          <p style={{ fontSize: 'var(--text-lg)', color: 'rgba(255,255,255,0.7)', maxWidth: '580px', lineHeight: 'var(--leading-relaxed)' }}>
            Займы от 30 000 до 500 000 EUR для малого и среднего бизнеса. Быстрое рассмотрение, без залога.
          </p>
        </div>
      </section>

      <section style={{ background: 'var(--color-silver)', padding: 'var(--space-20) var(--space-6)' }}>
        <div style={{ maxWidth: 'var(--container-xl)', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-midnight)', marginBottom: 'var(--space-10)', textAlign: 'center' }}>Когда это актуально</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 'var(--space-6)' }} className="grid-2">
            {[
              { icon: '📦', title: 'Закупка товара', desc: 'Пополните склад под сезон или выгодный контракт без ожидания оборота' },
              { icon: '📈', title: 'Маркетинг и рост', desc: 'Запустите рекламную кампанию или выйдите на новый рынок' },
              { icon: '🔧', title: 'Оборудование', desc: 'Обновите оборудование без отвлечения оборотных средств' },
              { icon: '🤝', title: 'Контракт под исполнение', desc: 'Получите финансирование под уже заключённый договор' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card card-interactive">
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>{icon}</div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--color-midnight)', marginBottom: 'var(--space-2)' }}>{title}</h3>
                <p style={{ color: 'var(--color-text-secondary)', margin: 0, lineHeight: 'var(--leading-relaxed)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:640px){.grid-2{grid-template-columns:1fr!important}}`}</style>
      </section>

      <section style={{ background: 'var(--color-white)', padding: 'var(--space-20) var(--space-6)' }}>
        <div style={{ maxWidth: 'var(--container-xl)', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-midnight)', marginBottom: 'var(--space-10)', textAlign: 'center' }}>Условия финансирования</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--space-6)' }} className="grid-4">
            {[
              { label: 'Сумма', value: '30 000 — 500 000 EUR' },
              { label: 'Срок', value: '1 — 12 месяцев' },
              { label: 'Залог', value: 'Не требуется' },
              { label: 'Рассмотрение', value: 'В кратчайшие сроки' },
            ].map(({ label, value }) => (
              <div key={label} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>{label}</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--color-midnight)' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:768px){.grid-4{grid-template-columns:repeat(2,1fr)!important}}`}</style>
      </section>

      <section style={{ background: 'var(--color-silver)', padding: 'var(--space-20) var(--space-6)' }}>
        <div style={{ maxWidth: 'var(--container-xl)', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)' }} className="grid-2">
          {[
            { title: 'Для ООО / АО', items: ['Зарегистрированы в ЕС', 'Деятельность от 6 месяцев', 'Наличие оборота', 'Учредительные документы'] },
            { title: 'Для ИП', items: ['Зарегистрированы в ЕС', 'Деятельность от 6 месяцев', 'Подтверждение дохода', 'Документ удостоверяющий личность'] },
          ].map(({ title, items }) => (
            <div key={title} className="card">
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-semibold)', color: 'var(--color-midnight)', marginBottom: 'var(--space-4)' }}>{title}</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', paddingLeft: 0, listStyle: 'none', margin: 0 }}>
                {items.map(i => (
                  <li key={i} style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)' }}>
                    <span style={{ color: 'var(--color-success)', fontWeight: 'var(--font-bold)' }}>✓</span> {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: 'var(--color-midnight)', padding: 'var(--space-16) var(--space-6)', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ background: 'rgba(201,146,58,0.12)', border: '1px solid rgba(201,146,58,0.3)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-sm)', margin: 0 }}>
              Заявки на бизнес-займы принимаются через форму обратной связи. Менеджер свяжется с вами в течение рабочего дня.
            </p>
          </div>
          <Link href="/contacts" className="btn-primary btn-lg" style={{ textDecoration: 'none', display: 'inline-block' }}>Оставить заявку</Link>
        </div>
      </section>
    </>
  );
}
