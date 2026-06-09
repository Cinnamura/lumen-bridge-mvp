import Link from 'next/link';
import { LoanCalculator } from '@/features/loan-calculator/LoanCalculator';

/* ─── Иконки SVG ─── */
function IconCheck({ color = 'var(--color-accent)' }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="10" cy="10" r="10" fill={color} fillOpacity="0.12" />
      <path d="M6 10l3 3 5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconShield() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5">
      <path d="M12 2L3 7v6c0 5 4.5 9.3 9 10 4.5-.7 9-5 9-10V7L12 2z" />
    </svg>
  );
}
function IconChartUp() {
  return (
    <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
      <polyline points="5,55 20,40 35,45 55,20 75,10" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="75" cy="10" r="4" fill="var(--color-accent)" />
    </svg>
  );
}

/* ─── Accordion item для FAQ ─── */
function AccordionItem({ q, a }: { q: string; a: string }) {
  return (
    <details style={{ borderBottom: '1px solid var(--color-silver)', padding: 'var(--space-4) 0' }}>
      <summary style={{ cursor: 'pointer', fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-base)', color: 'var(--color-text-primary)', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {q}
        <span style={{ color: 'var(--color-accent)', fontSize: 'var(--text-xl)', fontWeight: 400 }}>+</span>
      </summary>
      <p style={{ marginTop: 'var(--space-3)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)' }}>{a}</p>
    </details>
  );
}

export default function HomePage() {
  return (
    <>
      {/* ─── 1. HERO ─── */}
      <section style={{ background: 'var(--color-midnight)', minHeight: '100vh', display: 'flex', alignItems: 'center', padding: 'var(--space-20) 0' }}>
        <div style={{ maxWidth: 'var(--container-xl)', margin: '0 auto', padding: '0 var(--space-6)', display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 'var(--space-16)', alignItems: 'center', width: '100%' }} className="hero-grid">
          {/* Left */}
          <div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent)', fontWeight: 'var(--font-semibold)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 'var(--space-4)' }}>
              Быстрые займы в Европе
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, var(--text-6xl))', color: 'var(--color-white)', lineHeight: 'var(--leading-tight)', margin: '0 0 var(--space-6)' }}>
              Получите деньги тогда, когда это действительно нужно
            </h1>
            <p style={{ fontSize: 'var(--text-lg)', color: 'rgba(255,255,255,0.7)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-5)', maxWidth: '52ch' }}>
              Краткосрочные займы для физических лиц и малого бизнеса. Простая заявка, быстрое решение, прозрачные условия.
            </p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)', marginBottom: 'var(--space-8)' }}>
              Без залога&nbsp;•&nbsp;Быстрое одобрение&nbsp;•&nbsp;Выплата на банковский счёт
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <Link href="/apply" className="btn-primary btn-lg" style={{ textDecoration: 'none' }}>Получить займ</Link>
              <Link href="/how-it-works" className="btn-ghost btn-lg" style={{ textDecoration: 'none' }}>Как это работает →</Link>
            </div>
          </div>
          {/* Right — Calculator */}
          <div className="card-dark" style={{ padding: 'var(--space-8)' }}>
            <LoanCalculator dark />
          </div>
        </div>
        <style>{`
          @media (max-width: 1023px) { .hero-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* ─── 2. КАЛЬКУЛЯТОР (отдельная секция) ─── */}
      <section style={{ background: 'var(--color-silver)', padding: 'var(--space-20) var(--space-6)' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <LoanCalculator />
        </div>
      </section>

      {/* ─── 3. УСЛОВИЯ ЗАЙМА ─── */}
      <section style={{ background: 'var(--color-white)', padding: 'var(--space-20) var(--space-6)' }}>
        <div style={{ maxWidth: 'var(--container-xl)', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-midnight)', marginBottom: 'var(--space-12)' }}>
            Условия займа
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--space-6)' }} className="grid-4">
            {[
              { icon: '💶', title: 'Сумма', value: '500 — 50 000 EUR' },
              { icon: '📅', title: 'Срок', value: '7 — 90 дней' },
              { icon: '📊', title: 'Ставка', value: 'Индивидуально' },
              { icon: '🔄', title: 'Погашение', value: 'Равными платежами' },
            ].map(({ icon, title, value }) => (
              <div key={title} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>{icon}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)' }}>{title}</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--color-midnight)' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:768px){.grid-4{grid-template-columns:repeat(2,1fr)!important}}`}</style>
      </section>

      {/* ─── 4. КОГДА ДЕНЬГИ НУЖНЫ ─── */}
      <section style={{ background: 'var(--color-silver)', padding: 'var(--space-20) var(--space-6)' }}>
        <div style={{ maxWidth: 'var(--container-xl)', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-midnight)', marginBottom: 'var(--space-12)' }}>
            Когда деньги нужны сейчас
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 'var(--space-6)' }} className="grid-2">
            {[
              { icon: '⚡', title: 'Срочные расходы', desc: 'Непредвиденный ремонт, медицинские расходы или срочная покупка — мы поможем быстро.' },
              { icon: '⏳', title: 'Задержка дохода', desc: 'Зарплата задерживается, а платежи не ждут. Займ поможет покрыть разрыв.' },
              { icon: '💼', title: 'Бизнес-задачи', desc: 'Оборотные средства, закупка товара, маркетинг — быстрое финансирование для роста.' },
              { icon: '🚀', title: 'Возможности', desc: 'Выгодная сделка или инвестиция, которую нельзя упустить из-за временного дефицита средств.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card card-interactive">
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>{icon}</div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--color-midnight)', marginBottom: 'var(--space-2)' }}>{title}</h3>
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)', margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:640px){.grid-2{grid-template-columns:1fr!important}}`}</style>
      </section>

      {/* ─── 5. КАК ЭТО РАБОТАЕТ ─── */}
      <section style={{ background: 'var(--color-white)', padding: 'var(--space-20) var(--space-6)' }}>
        <div style={{ maxWidth: 'var(--container-xl)', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-midnight)', marginBottom: 'var(--space-12)' }}>
            Как это работает
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-10)' }} className="grid-3">
            {[
              { n: '01', title: 'Регистрация', desc: 'Укажите номер телефона — получите код подтверждения. Никаких лишних данных на этом этапе.' },
              { n: '02', title: 'Заявка', desc: 'Заполните форму: сумма, срок, личные данные. Займет не более 5 минут.' },
              { n: '03', title: 'Получение средств', desc: 'После одобрения подпишите договор онлайн — деньги поступят на ваш счёт.' },
            ].map(({ n, title, desc }) => (
              <div key={n} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-5xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-accent)', marginBottom: 'var(--space-4)', opacity: 0.9 }}>{n}</div>
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-semibold)', color: 'var(--color-midnight)', marginBottom: 'var(--space-3)' }}>{title}</h3>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)', margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:768px){.grid-3{grid-template-columns:1fr!important}}`}</style>
      </section>

      {/* ─── 6. ПРОЗРАЧНЫЕ УСЛОВИЯ ─── */}
      <section style={{ background: 'var(--color-midnight)', padding: 'var(--space-20) var(--space-6)' }}>
        <div style={{ maxWidth: 'var(--container-xl)', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-white)', marginBottom: 'var(--space-10)', textAlign: 'center' }}>
            Прозрачные условия
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }} className="grid-2">
            {[
              'Полная стоимость займа показана до подписания',
              'Никаких скрытых комиссий и платежей',
              'Договор на понятном языке без мелкого шрифта',
              'Вы можете погасить займ досрочно',
              'Все данные защищены в соответствии с GDPR',
            ].map((text) => (
              <div key={text} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                <IconCheck color="var(--color-accent)" />
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-normal)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. О КОМПАНИИ ─── */}
      <section style={{ background: 'var(--color-white)', padding: 'var(--space-20) var(--space-6)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-midnight)', marginBottom: 'var(--space-8)' }}>
            О компании
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-4)' }}>
            LumenBridge Finance Ltd — европейский финтех-сервис краткосрочного кредитования, работающий в соответствии с применимым европейским законодательством.
          </p>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-4)' }}>
            Наша миссия — сделать доступ к краткосрочному финансированию простым, честным и быстрым. Мы не агрессивный кредитор, а надёжный партнёр, который помогает решить финансовый вопрос в нужный момент.
          </p>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
            Все условия раскрываются заранее, данные клиентов защищены, а наша команда доступна для поддержки на каждом этапе.
          </p>
        </div>
      </section>

      {/* ─── 8. УЛУЧШЕНИЕ КРЕДИТНОЙ ИСТОРИИ ─── */}
      <section style={{ background: 'var(--color-silver)', padding: 'var(--space-20) var(--space-6)' }}>
        <div style={{ maxWidth: 'var(--container-xl)', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)', alignItems: 'center' }} className="grid-2">
          <div>
            <h2 style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-midnight)', marginBottom: 'var(--space-6)' }}>
              Улучшение кредитной истории
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-6)' }}>
              Своевременное погашение займа — это не просто обязательство, это инвестиция в вашу финансовую репутацию.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
              {['Каждый вовремя погашенный платёж формирует положительную историю', 'Хорошая история открывает доступ к лучшим условиям в будущем', 'Мы предоставляем данные в кредитные бюро в соответствии с законом'].map(t => (
                <div key={t} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                  <IconCheck />
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)' }}>{t}</span>
                </div>
              ))}
            </div>
            <Link href="/apply" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
              Подать заявку
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-12)', boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
              <IconChartUp />
              <div style={{ fontWeight: 'var(--font-bold)', color: 'var(--color-midnight)', fontSize: 'var(--text-lg)', textAlign: 'center' }}>
                Ваш кредитный рейтинг растёт
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                с каждым своевременным платежом
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 9. ДЛЯ БИЗНЕСА ─── */}
      <section style={{ background: 'var(--color-midnight)', padding: 'var(--space-20) var(--space-6)' }}>
        <div style={{ maxWidth: 'var(--container-xl)', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-8)', marginBottom: 'var(--space-10)' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ fontSize: 'var(--text-sm)', color: '#C9923A', fontWeight: 'var(--font-semibold)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 'var(--space-3)' }}>
                Для бизнеса
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>
                Финансирование для компаний и ИП
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-6)' }}>
                Займы от 30 000 до 500 000 EUR на срок от 1 до 12 месяцев. Заявки принимаются через форму обратной связи.
              </p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }} className="grid-3">
            {[
              { icon: '⚡', title: 'Быстрое рассмотрение', desc: 'Решение по заявке в кратчайшие сроки' },
              { icon: '💰', title: 'До 500 000 EUR', desc: 'Финансирование под бизнес-задачи любого масштаба' },
              { icon: '📋', title: 'Без залога', desc: 'Оценка бизнеса, а не активов' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-3)' }}>{icon}</div>
                <h3 style={{ color: 'var(--color-white)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>{title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'var(--text-sm)', margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(201,146,58,0.1)', border: '1px solid rgba(201,146,58,0.3)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-sm)', margin: 0 }}>
              ℹ️ Заявки на бизнес-займы принимаются через форму обратной связи. Наш менеджер свяжется с вами в течение рабочего дня.
            </p>
          </div>
          <Link href="/business" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Узнать подробнее
          </Link>
        </div>
      </section>

      {/* ─── 10. БЛОК ДОВЕРИЯ ─── */}
      <section style={{ background: 'var(--color-white)', padding: 'var(--space-16) var(--space-6)' }}>
        <div style={{ maxWidth: 'var(--container-xl)', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--space-6)', textAlign: 'center' }} className="grid-4">
            {[
              { icon: <IconShield />, title: 'GDPR', desc: 'Ваши данные защищены по европейским стандартам' },
              { icon: <IconCheck color="var(--color-success)" />, title: 'Ответственный подход', desc: 'Мы оцениваем платёжеспособность перед выдачей займа' },
              { icon: <IconShield />, title: 'Защита данных', desc: 'Шифрование и безопасное хранение персональных данных' },
              { icon: <IconCheck color="var(--color-success)" />, title: 'Чёткие условия', desc: 'Все параметры займа известны до подписания договора' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div>{icon}</div>
                <div style={{ fontWeight: 'var(--font-semibold)', color: 'var(--color-midnight)' }}>{title}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 11. FAQ ПРЕВЬЮ ─── */}
      <section style={{ background: 'var(--color-silver)', padding: 'var(--space-20) var(--space-6)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-midnight)', marginBottom: 'var(--space-8)', textAlign: 'center' }}>
            Часто задаваемые вопросы
          </h2>
          <AccordionItem q="Как быстро я получу деньги?" a="После одобрения заявки и подписания договора средства поступают на ваш счёт в течение 1 рабочего дня. В большинстве случаев — значительно быстрее." />
          <AccordionItem q="Что нужно для получения займа?" a="Для физических лиц достаточно номера телефона, базовых персональных данных и согласия с условиями. Залог и поручители не требуются." />
          <AccordionItem q="Можно ли погасить займ досрочно?" a="Да, вы можете погасить займ в любой момент. Проценты начисляются только за фактический срок пользования средствами." />
          <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
            <Link href="/faq" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-block' }}>
              Смотреть все вопросы
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 12. БЕЗОПАСНОСТЬ ─── */}
      <section style={{ background: 'var(--color-midnight)', padding: 'var(--space-20) var(--space-6)' }}>
        <div style={{ maxWidth: 'var(--container-xl)', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-white)', marginBottom: 'var(--space-6)', textAlign: 'center' }}>
            Безопасность
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', maxWidth: '600px', margin: '0 auto var(--space-8)', lineHeight: 'var(--leading-relaxed)' }}>
            Мы используем банковские стандарты шифрования для защиты ваших данных. Вся коммуникация ведётся только через официальные каналы.
          </p>
          <div style={{ maxWidth: '640px', margin: '0 auto', background: 'rgba(201,57,43,0.1)', border: '1px solid rgba(201,57,43,0.3)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)' }}>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 'var(--font-semibold)', margin: '0 0 var(--space-2)' }}>
              ⚠️ Важно
            </p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)', margin: 0 }}>
              Мы не требуем предоплату и не запрашиваем конфиденциальные данные (пароли, CVV карты, PIN-коды) ни через какие каналы. Если вы получили подобный запрос — это мошенничество.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 13. ОБРАТНАЯ СВЯЗЬ ─── */}
      <section style={{ background: 'var(--color-white)', padding: 'var(--space-20) var(--space-6)' }}>
        <div style={{ maxWidth: 'var(--container-xl)', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)' }} className="grid-2">
          {/* Form */}
          <div>
            <h2 style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-midnight)', marginBottom: 'var(--space-8)' }}>
              Обратная связь
            </h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div>
                  <label className="input-label">Имя</label>
                  <input className="input" type="text" placeholder="Иван" />
                </div>
                <div>
                  <label className="input-label">Фамилия</label>
                  <input className="input" type="text" placeholder="Иванов" />
                </div>
              </div>
              <div>
                <label className="input-label">Email</label>
                <input className="input" type="email" placeholder="ivan@example.com" />
              </div>
              <div>
                <label className="input-label">Телефон</label>
                <input className="input" type="tel" placeholder="+353 1 234 5678" />
              </div>
              <div>
                <label className="input-label">Сообщение</label>
                <textarea className="input" rows={4} placeholder="Ваш вопрос или сообщение..." style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                <input type="checkbox" id="consent" style={{ marginTop: '2px', accentColor: 'var(--color-accent)' }} />
                <label htmlFor="consent" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                  Я соглашаюсь с <Link href="/privacy" style={{ color: 'var(--color-accent)' }}>политикой конфиденциальности</Link>
                </label>
              </div>
              <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
                Отправить
              </button>
            </form>
          </div>
          {/* Contacts */}
          <div>
            <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-semibold)', color: 'var(--color-midnight)', marginBottom: 'var(--space-6)' }}>
              Контактная информация
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {[
                { label: 'Email', value: 'info@lumenbridge.eu' },
                { label: 'Телефон', value: '+353 1 234 5678' },
                { label: 'Режим работы', value: 'Пн–Пт, 9:00–18:00 (GMT+1)' },
                { label: 'Адрес', value: 'Dublin, Ireland' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-1)' }}>{label}</div>
                  <div style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>{value}</div>
                </div>
              ))}
            </div>
            {/* Map placeholder */}
            <div style={{ marginTop: 'var(--space-6)', height: '180px', background: 'var(--color-silver)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-slate)', fontSize: 'var(--text-sm)' }}>
              📍 Dublin, Ireland
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
