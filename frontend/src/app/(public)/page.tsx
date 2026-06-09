import Link from 'next/link';
import { LoanCalculator } from '@/features/loan-calculator/LoanCalculator';

/* ── Мелкие SVG-иконки ── */
function IconCheck({ color = '#2E7DF7' }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
      <circle cx="10" cy="10" r="10" fill={color} fillOpacity="0.12" />
      <path d="M6 10l3 3 5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function AccordionItem({ q, a }: { q: string; a: string }) {
  return (
    <details style={{ borderBottom: '1px solid #E8ECF0' }}>
      <summary style={{
        cursor: 'pointer', listStyle: 'none', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
        padding: '1.25rem 0', fontWeight: 600, fontSize: '1rem',
        color: '#0D1B2A', gap: '1rem',
      }}>
        <span>{q}</span>
        <span style={{ color: '#2E7DF7', fontSize: '1.5rem', lineHeight: 1, flexShrink: 0 }}>+</span>
      </summary>
      <p style={{ paddingBottom: '1.25rem', color: '#4A6580', lineHeight: 1.7, fontSize: '0.9375rem' }}>{a}</p>
    </details>
  );
}

/* ── Секция: контейнер ── */
const C = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', ...style }}>
    {children}
  </div>
);

export default function HomePage() {
  return (
    <>
      {/* ══ 1. HERO ══ */}
      <section style={{ background: '#0D1B2A', minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '5rem 0' }}>
        <C>
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '4rem', alignItems: 'center' }}>
            {/* Left */}
            <div>
              <p style={{ fontSize: '0.875rem', color: '#2E7DF7', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                Быстрые займы в Европе
              </p>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem,4.5vw,3.75rem)', color: '#fff', lineHeight: 1.15, marginBottom: '1.5rem' }}>
                Получите деньги тогда, когда это действительно нужно
              </h1>
              <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, marginBottom: '0.75rem', maxWidth: '50ch' }}>
                Простые и прозрачные займы для частных лиц и бизнеса в Европе — быстрое решение и безопасное оформление
              </p>
              <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '52ch' }}>
                Неожиданные расходы или срочные возможности не должны вас останавливать. Сервис помогает быстро получить финансирование — без сложных процедур и скрытых условий.
              </p>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', marginBottom: '2rem' }}>
                Без залога&nbsp;•&nbsp;Быстрое одобрение&nbsp;•&nbsp;Выплата на банковский счёт
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href="/apply" className="btn-primary btn-lg" style={{ textDecoration: 'none' }}>Получить займ</Link>
                <Link href="/how-it-works" className="btn-ghost btn-lg" style={{ textDecoration: 'none' }}>Как это работает →</Link>
              </div>
            </div>
            {/* Right — Calculator */}
            <div className="card-dark" style={{ padding: '2rem' }}>
              <LoanCalculator dark />
            </div>
          </div>
        </C>
      </section>

      {/* ══ 2. КАЛЬКУЛЯТОР (отдельная секция) ══ */}
      <section style={{ background: '#E8ECF0', padding: '5rem 24px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <LoanCalculator />
        </div>
      </section>

      {/* ══ 3. ОСНОВНЫЕ УСЛОВИЯ ══ */}
      <section style={{ background: '#fff', padding: '5rem 24px' }}>
        <C>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.75rem,3vw,2.25rem)', fontWeight: 700, color: '#0D1B2A', marginBottom: '3rem' }}>
            Основные условия
          </h2>
          <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.5rem' }}>
            {[
              { label: 'Сумма', value: 'от 500 до 50 000 EUR' },
              { label: 'Срок', value: 'от 7 до 90 дней' },
              { label: 'Процентная ставка', value: 'определяется индивидуально' },
              { label: 'Погашение', value: 'равными платежами' },
            ].map(({ label, value }) => (
              <div key={label} className="card" style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.8125rem', color: '#4A6580', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>{label}</p>
                <p style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0D1B2A' }}>{value}</p>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#4A6580' }}>
            Итоговые условия зависят от результатов проверки клиента и предоставленных данных.
          </p>
        </C>
      </section>

      {/* ══ 4. КОГДА ДЕНЬГИ НУЖНЫ ══ */}
      <section style={{ background: '#E8ECF0', padding: '5rem 24px' }}>
        <C>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.75rem,3vw,2.25rem)', fontWeight: 700, color: '#0D1B2A', marginBottom: '1rem' }}>
            Когда деньги нужны сейчас
          </h2>
          <p style={{ textAlign: 'center', color: '#4A6580', maxWidth: '56ch', margin: '0 auto 3rem', lineHeight: 1.7 }}>
            Не все финансовые вопросы можно отложить. Иногда важно принять решение быстро — без сложных процедур и ожиданий.
          </p>
          <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1.5rem' }}>
            {[
              { icon: '⚡', title: 'Срочные расходы', desc: 'Неожиданные платежи, которые нельзя перенести' },
              { icon: '⏳', title: 'Задержка дохода', desc: 'Когда деньги нужны сейчас, а поступления позже' },
              { icon: '💼', title: 'Бизнес-задачи', desc: 'Кассовые разрывы или операционные расходы' },
              { icon: '🚀', title: 'Возможности', desc: 'Ситуации, где важно действовать без промедления' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card card-interactive">
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{icon}</div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#0D1B2A', marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ color: '#4A6580', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </C>
      </section>

      {/* ══ 5. КАК ЭТО РАБОТАЕТ ══ */}
      <section style={{ background: '#fff', padding: '5rem 24px' }}>
        <C>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.75rem,3vw,2.25rem)', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.75rem' }}>
            Как всё происходит
          </h2>
          <p style={{ textAlign: 'center', color: '#4A6580', maxWidth: '56ch', margin: '0 auto 3rem', lineHeight: 1.7 }}>
            Оформление займа занимает всего несколько минут и полностью проходит онлайн, без визитов в офис и сложных процедур.
          </p>
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2.5rem' }}>
            {[
              { n: '01', title: 'Регистрация', desc: 'Введите номер телефона и подтвердите его с помощью SMS-кода.' },
              { n: '02', title: 'Заявка', desc: 'Выберите сумму и срок займа и отправьте заявку на рассмотрение.' },
              { n: '03', title: 'Получение средств', desc: 'После одобрения деньги поступают на ваш банковский счёт.' },
            ].map(({ n, title, desc }) => (
              <div key={n} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '3rem', fontWeight: 700, color: '#2E7DF7', marginBottom: '1rem', opacity: 0.9 }}>{n}</div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0D1B2A', marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ color: '#4A6580', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </C>
      </section>

      {/* ══ 6. ПРОЗРАЧНЫЕ УСЛОВИЯ ══ */}
      <section style={{ background: '#0D1B2A', padding: '5rem 24px' }}>
        <C>
          <h2 style={{ fontSize: 'clamp(1.75rem,3vw,2.25rem)', fontWeight: 700, color: '#fff', marginBottom: '2.5rem', textAlign: 'center' }}>
            Вы заранее знаете все условия
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem', maxWidth: '800px', margin: '0 auto' }} className="grid-2">
            {[
              { title: 'Никаких скрытых комиссий', desc: 'Полная стоимость займа известна до оформления' },
              { title: 'Быстрое рассмотрение', desc: 'Заявки обрабатываются в течение нескольких минут' },
              { title: 'Безопасность данных', desc: 'Ваши данные защищены современными технологиями' },
              { title: 'Гибкое погашение', desc: 'Выбирайте удобный срок и погашайте без лишнего давления' },
              { title: 'Улучшение условий со временем', desc: 'При повторных займах могут быть доступны более выгодные параметры' },
            ].map(({ title, desc }) => (
              <div key={title} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <IconCheck color="#2E7DF7" />
                <div>
                  <p style={{ fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: '0.25rem' }}>{title}</p>
                  <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </C>
      </section>

      {/* ══ 7. О КОМПАНИИ ══ */}
      <section style={{ background: '#fff', padding: '5rem 24px' }}>
        <C>
          <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem,3vw,2.25rem)', fontWeight: 700, color: '#0D1B2A', marginBottom: '2rem' }}>
              О LumenBridge Finance Ltd
            </h2>
            <p style={{ color: '#4A6580', lineHeight: 1.75, marginBottom: '1rem' }}>
              LumenBridge Finance Ltd — финансовая организация, предоставляющая быстрые и доступные решения в сфере кредитования в Европе.
              Наша цель — упростить доступ к финансированию за счёт прозрачных условий и современных технологий.
            </p>
            <p style={{ color: '#4A6580', lineHeight: 1.75 }}>
              Мы работаем в соответствии с действующим законодательством и уделяем особое внимание защите данных клиентов и ответственному кредитованию.
            </p>
          </div>
        </C>
      </section>

      {/* ══ 8. УЛУЧШЕНИЕ КРЕДИТНОЙ ИСТОРИИ ══ */}
      <section style={{ background: '#E8ECF0', padding: '5rem 24px' }}>
        <C>
          <div className="grid-2-resp" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(1.75rem,3vw,2.25rem)', fontWeight: 700, color: '#0D1B2A', marginBottom: '1rem' }}>
                Займ — это не только деньги сейчас
              </h2>
              <p style={{ color: '#4A6580', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Своевременное погашение займа помогает улучшить кредитный рейтинг и открывает доступ к более выгодным условиям в будущем.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {[
                  'Возможность начать с небольшой суммы',
                  'Формирование положительной кредитной истории',
                  'Улучшение условий при повторных обращениях',
                ].map(t => (
                  <div key={t} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <IconCheck />
                    <span style={{ color: '#4A6580', lineHeight: 1.6 }}>{t}</span>
                  </div>
                ))}
              </div>
              <Link href="/apply" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                Начать с небольшого займа
              </Link>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ background: '#fff', borderRadius: '1rem', padding: '3rem', boxShadow: '0 8px 24px rgba(13,27,42,0.12)', textAlign: 'center' }}>
                <svg width="80" height="60" viewBox="0 0 80 60" fill="none" style={{ display: 'block', margin: '0 auto 1rem' }}>
                  <polyline points="5,55 20,40 35,45 55,20 75,10" stroke="#2E7DF7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <circle cx="75" cy="10" r="4" fill="#2E7DF7"/>
                </svg>
                <p style={{ fontWeight: 700, color: '#0D1B2A', marginBottom: '0.25rem' }}>Ваш кредитный рейтинг растёт</p>
                <p style={{ fontSize: '0.875rem', color: '#4A6580' }}>с каждым своевременным платежом</p>
              </div>
            </div>
          </div>
        </C>
      </section>

      {/* ══ 9. ДЛЯ БИЗНЕСА ══ */}
      <section style={{ background: '#0D1B2A', padding: '5rem 24px' }}>
        <C>
          <div style={{ marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#C9923A', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Для бизнеса
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem,3vw,2.25rem)', color: '#fff', marginBottom: '1rem', maxWidth: '540px' }}>
              Финансирование для бизнеса
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: '52ch', marginBottom: '1.5rem' }}>
              Решения для компаний и предпринимателей, которым важна скорость и предсказуемость.
            </p>
          </div>
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { icon: '💰', title: 'Займы от 30 000 до 500 000 EUR', desc: 'Финансирование под задачи любого масштаба' },
              { icon: '📅', title: 'Срок от 1 до 12 месяцев', desc: 'Гибкие сроки под ваш бизнес-цикл' },
              { icon: '✅', title: 'Без залога', desc: 'В стандартных случаях залог не требуется' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{icon}</div>
                <h3 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9375rem' }}>{title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(201,146,58,0.1)', border: '1px solid rgba(201,146,58,0.3)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', maxWidth: '640px' }}>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              На данный момент заявки принимаются через форму обратной связи. Онлайн-кабинет для бизнеса будет доступен позже.
            </p>
          </div>
          <Link href="/contacts" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Оставить заявку
          </Link>
        </C>
      </section>

      {/* ══ 10. БЛОК ДОВЕРИЯ ══ */}
      <section style={{ background: '#fff', padding: '4rem 24px' }}>
        <C>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 700, color: '#0D1B2A', marginBottom: '2.5rem' }}>
            Работаем прозрачно и в рамках закона
          </h2>
          <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.5rem', textAlign: 'center' }}>
            {[
              { title: 'Соответствие GDPR', desc: 'Данные клиентов обрабатываются по европейским стандартам' },
              { title: 'Ответственный подход', desc: 'Ответственный подход к проверке каждой заявки' },
              { title: 'Защита данных', desc: 'Защита персональных данных на всех уровнях' },
              { title: 'Чёткие условия', desc: 'Чёткие и понятные условия без мелкого шрифта' },
            ].map(({ title, desc }) => (
              <div key={title}>
                <div style={{ width: '44px', height: '44px', background: '#EBF1FE', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2E7DF7" strokeWidth="2"><path d="M12 2L3 7v6c0 5 4.5 9.3 9 10 4.5-.7 9-5 9-10V7L12 2z"/></svg>
                </div>
                <p style={{ fontWeight: 600, color: '#0D1B2A', marginBottom: '0.25rem' }}>{title}</p>
                <p style={{ fontSize: '0.875rem', color: '#4A6580', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </C>
      </section>

      {/* ══ 11. FAQ ПРЕВЬЮ ══ */}
      <section style={{ background: '#E8ECF0', padding: '5rem 24px' }}>
        <C>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem,3vw,2.25rem)', fontWeight: 700, color: '#0D1B2A', marginBottom: '2.5rem', textAlign: 'center' }}>
              Часто задаваемые вопросы
            </h2>
            <AccordionItem q="Кто может получить займ?" a="Любой совершеннолетний резидент страны присутствия сервиса с действующим удостоверением личности и зарегистрированным номером телефона." />
            <AccordionItem q="Как быстро я получу деньги?" a="Заявки рассматриваются в течение нескольких минут. После одобрения деньги переводятся сразу." />
            <AccordionItem q="Есть ли скрытые комиссии?" a="Нет. Все условия и платежи отображаются до оформления займа." />
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link href="/faq" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                Смотреть все вопросы
              </Link>
            </div>
          </div>
        </C>
      </section>

      {/* ══ 12. БЕЗОПАСНОСТЬ ══ */}
      <section style={{ background: '#0D1B2A', padding: '5rem 24px' }}>
        <C>
          <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem,3vw,2.25rem)', fontWeight: 700, color: '#fff', marginBottom: '1.5rem' }}>
              Безопасность клиентов
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Мы уделяем особое внимание защите данных и безопасности наших клиентов. Все операции выполняются через защищённые каналы, а обработка информации осуществляется в соответствии с применимым европейским законодательством.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Используйте только официальный сайт и проверенные контактные данные компании при взаимодействии с сервисом.
            </p>
            <div style={{ background: 'rgba(192,57,43,0.12)', border: '1px solid rgba(192,57,43,0.3)', borderRadius: '8px', padding: '1.25rem', maxWidth: '560px', margin: '0 auto' }}>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600, marginBottom: '0.5rem' }}>⚠️ Важно</p>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem', lineHeight: 1.65 }}>
                Мы не требуем предоплату и не запрашиваем конфиденциальные данные (пароли, CVV карты, PIN-коды) ни через какие каналы.
              </p>
            </div>
          </div>
        </C>
      </section>

      {/* ══ 13. ОБРАТНАЯ СВЯЗЬ ══ */}
      <section style={{ background: '#fff', padding: '5rem 24px' }}>
        <C>
          <div className="grid-2-resp" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
            {/* Form */}
            <div>
              <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.5rem' }}>
                Свяжитесь с нами
              </h2>
              <p style={{ color: '#4A6580', lineHeight: 1.7, marginBottom: '2rem' }}>
                Если у вас есть вопросы или вам нужна помощь — наша команда готова помочь.
              </p>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><label className="input-label">Имя</label><input className="input" type="text" placeholder="Иван" /></div>
                  <div><label className="input-label">Email</label><input className="input" type="email" placeholder="ivan@example.com" /></div>
                </div>
                <div><label className="input-label">Телефон</label><input className="input" type="tel" placeholder="+353 1 531 8420" /></div>
                <div><label className="input-label">Сообщение</label><textarea className="input" rows={4} placeholder="Ваш вопрос..." style={{ resize: 'vertical' }} /></div>
                <div><label className="input-label">Прикрепить файл</label><input type="file" style={{ fontSize: '0.875rem', color: '#4A6580' }} /></div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <input type="checkbox" id="consent" style={{ marginTop: '3px', accentColor: '#2E7DF7' }} />
                  <label htmlFor="consent" style={{ fontSize: '0.875rem', color: '#4A6580', cursor: 'pointer', lineHeight: 1.6 }}>
                    Согласен с обработкой персональных данных в соответствии с <a href="/privacy" style={{ color: '#2E7DF7' }}>политикой конфиденциальности</a>
                  </label>
                </div>
                <div><button type="submit" className="btn-primary">Отправить</button></div>
              </form>
            </div>
            {/* Contacts */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0D1B2A', marginBottom: '1.5rem' }}>
                Контактная информация
              </h3>
              <p style={{ color: '#4A6580', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Вы можете связаться с нами по любым вопросам, связанным с оформлением займа, условиями или обслуживанием.
              </p>
              <p style={{ color: '#4A6580', lineHeight: 1.7, marginBottom: '2rem', fontSize: '0.875rem' }}>
                Служба поддержки работает в рабочие часы. Онлайн-заявки принимаются круглосуточно и обрабатываются автоматически.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { label: 'Адрес', value: '18 Lower Baggot Street, Dublin 2, Ireland' },
                  { label: 'Email', value: 'support@lumenbridge.example' },
                  { label: 'Телефон', value: '+353 1 531 8420' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p style={{ fontSize: '0.75rem', color: '#4A6580', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px', fontWeight: 500 }}>{label}</p>
                    <p style={{ color: '#0D1B2A', fontWeight: 500 }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </C>
      </section>
    </>
  );
}
