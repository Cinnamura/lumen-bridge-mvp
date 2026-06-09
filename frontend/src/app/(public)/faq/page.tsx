'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';

const FAQ_PERSONAL = [
  { q: 'Кто может получить займ?', a: 'Займ доступен для совершеннолетних пользователей с действующим удостоверением личности и зарегистрированным номером телефона.' },
  { q: 'Какие документы необходимы?', a: 'Для подачи заявки требуется минимальный набор данных. В большинстве случаев достаточно удостоверения личности и активного номера телефона.' },
  { q: 'Как подать заявку?', a: 'Выберите сумму и срок займа, заполните форму и отправьте заявку на рассмотрение. Весь процесс проходит онлайн.' },
  { q: 'Как быстро принимается решение?', a: 'Заявки рассматриваются автоматически и обрабатываются в течение нескольких минут.' },
  { q: 'Когда я получу деньги?', a: 'После одобрения средства переводятся сразу на указанный банковский счёт.' },
  { q: 'Есть ли скрытые комиссии?', a: 'Нет. Все условия и платежи отображаются до оформления займа.' },
  { q: 'Как погасить займ?', a: 'Погашение осуществляется через доступные платёжные способы. Подробная информация предоставляется после оформления займа.' },
  { q: 'Можно ли погасить займ досрочно?', a: 'Да, вы можете погасить займ раньше установленного срока без дополнительных комиссий.' },
  { q: 'Что произойдет при просрочке?', a: 'В случае просрочки могут начисляться дополнительные платежи. Это также влияет на внутреннюю оценку клиента и будущие условия.' },
  { q: 'Как улучшить кредитную историю?', a: 'Своевременно погашайте займы — это помогает формировать положительную кредитную историю и повышает шансы на более выгодные условия в будущем.' },
];

const FAQ_BUSINESS = [
  { q: 'Кто может получить финансирование?', a: 'Финансирование доступно для зарегистрированных европейских компаний и индивидуальных предпринимателей.' },
  { q: 'Какие документы требуются?', a: 'Требуется базовый пакет документов: регистрационные данные бизнеса, удостоверение личности и финансовая информация.' },
  { q: 'Какой размер займа доступен?', a: 'Сумма займа составляет от 30 000 до 500 000 EUR в зависимости от оценки бизнеса и предоставленных документов.' },
  { q: 'На какой срок предоставляется финансирование?', a: 'Срок займа — от 1 до 12 месяцев.' },
  { q: 'Как рассчитываются условия?', a: 'Условия определяются индивидуально на основе анализа финансового состояния бизнеса и уровня риска.' },
  { q: 'Как происходит выплата средств?', a: 'Средства могут быть переведены на корпоративный счёт или через доступные платёжные системы.' },
  { q: 'Можно ли погасить займ досрочно?', a: 'Да, досрочное погашение возможно без дополнительных штрафов.' },
  { q: 'Что происходит при просрочке?', a: 'Могут начисляться дополнительные платежи, а информация о задолженности учитывается при дальнейшей оценке клиента.' },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="accordion-item">
      <button className="accordion-trigger" onClick={() => setOpen(o => !o)}>
        <span>{q}</span>
        <span className={`accordion-icon${open ? ' open' : ''}`}>
          <ChevronDown size={18} />
        </span>
      </button>
      <div className={`accordion-body${open ? ' open' : ''}`}>
        <p>{a}</p>
      </div>
    </div>
  );
}

export default function FaqPage() {
  const [tab, setTab] = useState<'personal' | 'business'>('personal');
  const items = tab === 'personal' ? FAQ_PERSONAL : FAQ_BUSINESS;

  return (
    <>
      <section style={{ background: '#0D1B2A', padding: '100px 32px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 50% 60%, rgba(46,125,247,0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '1rem' }}>FAQ</p>
          <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(2.5rem,5vw,4rem)', color: '#fff', letterSpacing: '-0.02em', marginBottom: '1.25rem' }}>
            Часто задаваемые вопросы
          </h1>
          <p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.5)', maxWidth: '50ch', margin: '0 auto', lineHeight: 1.75 }}>
            Здесь вы найдёте ответы на основные вопросы о займах, условиях и процессе оформления.
          </p>
        </div>
      </section>

      <section style={{ background: '#fff', padding: '100px 32px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '2.5rem', background: '#F2F5F8', borderRadius: '12px', padding: '4px' }}>
            {(['personal', 'business'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: '10px 16px', borderRadius: '9px', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--f-sans)', fontWeight: 600, fontSize: '0.875rem',
                transition: 'all 200ms cubic-bezier(0.16,1,0.3,1)',
                background: tab === t ? '#fff' : 'transparent',
                color: tab === t ? '#0D1B2A' : '#4A6580',
                boxShadow: tab === t ? '0 1px 3px rgba(13,27,42,0.08), 0 2px 8px rgba(13,27,42,0.05)' : 'none',
              }}>
                {t === 'personal' ? 'Для физических лиц' : 'Для бизнеса'}
              </button>
            ))}
          </div>

          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid rgba(13,27,42,0.06)', padding: '0 1.5rem', boxShadow: '0 1px 3px rgba(13,27,42,0.04), 0 8px 24px rgba(13,27,42,0.05)' }}>
            {items.map(({ q, a }) => <AccordionItem key={q} q={q} a={a} />)}
          </div>

          <div style={{ marginTop: '2.5rem', background: '#F2F5F8', borderRadius: '16px', padding: '2rem', textAlign: 'center', border: '1px solid rgba(13,27,42,0.06)' }}>
            <p style={{ color: '#4A6580', marginBottom: '1.25rem', fontSize: '0.9375rem' }}>
              Если у вас остались вопросы, свяжитесь с нами через форму обратной связи.
            </p>
            <Link href="/contacts" className="btn btn-primary" style={{ gap: '8px' }}>
              Написать нам <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
