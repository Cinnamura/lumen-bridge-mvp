'use client';
import { useState } from 'react';
import Link from 'next/link';

const FAQ_PERSONAL = [
  { q: 'Кто может получить займ?', a: 'Займ могут получить совершеннолетние граждане, проживающие в ЕС, с действующим номером телефона.' },
  { q: 'Какая минимальная и максимальная сумма займа?', a: 'Для физических лиц: от 500 до 50 000 EUR. Для бизнеса: от 30 000 до 500 000 EUR.' },
  { q: 'На какой срок можно взять займ?', a: 'Для физических лиц: от 7 до 90 дней. Для бизнеса: от 1 до 12 месяцев.' },
  { q: 'Как рассчитывается сумма к возврату?', a: 'Применяется аннуитетная формула с ежедневной ставкой 0,8%. Итоговую сумму можно рассчитать в калькуляторе на главной странице.' },
  { q: 'Нужен ли залог?', a: 'Нет, залог не требуется ни для физических лиц, ни для бизнеса.' },
  { q: 'Как быстро придёт решение?', a: 'Заявка рассматривается нашими специалистами. В большинстве случаев решение принимается в течение рабочего дня.' },
  { q: 'Можно ли погасить займ досрочно?', a: 'Да. Вы можете погасить займ в любой момент. Штрафов за досрочное погашение нет.' },
  { q: 'Как подписать договор?', a: 'После одобрения заявки вы получите уведомление в личном кабинете. Договор подписывается онлайн с помощью кода из SMS.' },
  { q: 'Как внести платёж?', a: 'В личном кабинете создайте заявку на оплату — укажите сумму и реквизиты перевода. Оператор подтвердит получение.' },
  { q: 'Что делать, если я не могу вовремя внести платёж?', a: 'Обратитесь в поддержку как можно скорее. Мы рассмотрим ситуацию индивидуально.' },
];

const FAQ_BUSINESS = [
  { q: 'Какие документы нужны для бизнес-займа?', a: 'Учредительные документы, подтверждение деятельности от 6 месяцев, данные руководителя. Точный список зависит от формы бизнеса.' },
  { q: 'Как подать заявку на бизнес-займ?', a: 'Оставьте заявку через форму обратной связи. Менеджер свяжется с вами и уточнит все детали.' },
  { q: 'Есть ли требования к обороту?', a: 'Да, компания должна вести реальную деятельность не менее 6 месяцев. Требования к обороту уточняются индивидуально.' },
  { q: 'Доступны ли займы для ИП?', a: 'Да, индивидуальные предприниматели, зарегистрированные в ЕС, также могут подать заявку.' },
  { q: 'Каковы сроки рассмотрения бизнес-заявок?', a: 'Стандартный срок рассмотрения — 1–3 рабочих дня после получения полного пакета документов.' },
  { q: 'Нужно ли личное поручительство директора?', a: 'Это зависит от суммы и параметров сделки. Уточните у менеджера при рассмотрении заявки.' },
  { q: 'Можно ли получить несколько займов одновременно?', a: 'Каждая заявка рассматривается индивидуально с учётом текущей долговой нагрузки.' },
  { q: 'Как рассчитываются проценты для бизнеса?', a: 'Условия для бизнес-займов определяются индивидуально в зависимости от суммы, срока и профиля компании.' },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  return (
    <details style={{ borderBottom: '1px solid var(--color-silver)', padding: 'var(--space-4) 0' }}>
      <summary style={{ cursor: 'pointer', fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-base)', color: 'var(--color-text-primary)', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-4)' }}>
        <span>{q}</span>
        <span style={{ color: 'var(--color-accent)', fontSize: 'var(--text-xl)', fontWeight: 400, flexShrink: 0 }}>+</span>
      </summary>
      <p style={{ marginTop: 'var(--space-3)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)', paddingRight: 'var(--space-8)' }}>{a}</p>
    </details>
  );
}

export default function FaqPage() {
  const [tab, setTab] = useState<'personal' | 'business'>('personal');
  const items = tab === 'personal' ? FAQ_PERSONAL : FAQ_BUSINESS;

  return (
    <>
      <section style={{ background: 'var(--color-midnight)', padding: 'var(--space-20) var(--space-6)' }}>
        <div style={{ maxWidth: 'var(--container-xl)', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,var(--text-5xl))', color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>
            Часто задаваемые вопросы
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-lg)' }}>
            Ответы на самые популярные вопросы о наших услугах
          </p>
        </div>
      </section>

      <section style={{ background: 'var(--color-white)', padding: 'var(--space-20) var(--space-6)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-10)', background: 'var(--color-silver)', borderRadius: 'var(--radius-md)', padding: '4px' }}>
            {(['personal', 'business'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', fontWeight: 'var(--font-medium)', fontSize: 'var(--text-sm)', transition: 'all 150ms', background: tab === t ? 'var(--color-white)' : 'transparent', color: tab === t ? 'var(--color-accent)' : 'var(--color-text-secondary)', boxShadow: tab === t ? 'var(--shadow-sm)' : 'none' }}>
                {t === 'personal' ? 'Для физических лиц' : 'Для бизнеса'}
              </button>
            ))}
          </div>

          {items.map(({ q, a }) => <AccordionItem key={q} q={q} a={a} />)}

          <div style={{ marginTop: 'var(--space-10)', padding: 'var(--space-6)', background: 'var(--color-silver)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>Не нашли ответ на свой вопрос?</p>
            <Link href="/contacts" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>Напишите нам</Link>
          </div>
        </div>
      </section>
    </>
  );
}
