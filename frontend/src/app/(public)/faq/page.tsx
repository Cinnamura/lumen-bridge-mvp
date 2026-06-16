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
      <button className="accordion-trigger" onClick={() => setOpen((o) => !o)}>
        <span>{q}</span>
        <span className={`accordion-icon${open ? ' open' : ''}`}>
          <ChevronDown size={18} />
        </span>
      </button>
      <div className={`accordion-body${open ? ' open' : ''}`}>
        <div className="accordion-body-inner">
          <p>{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FaqPage() {
  const [tab, setTab] = useState<'personal' | 'business'>('personal');
  const items = tab === 'personal' ? FAQ_PERSONAL : FAQ_BUSINESS;

  return (
    <>
      <section style={{ padding: '72px 24px 40px', position: 'relative' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#93C5FD', marginBottom: '0.85rem' }}>FAQ</p>
          <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(2.5rem,5vw,4rem)', color: '#F8FAFC', letterSpacing: '-0.04em', marginBottom: '1rem' }}>
            Часто задаваемые вопросы
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(154,164,182,0.9)', maxWidth: '50ch', margin: '0 auto', lineHeight: 1.75 }}>
            Здесь вы найдёте ответы на основные вопросы о займах, условиях и процессе оформления.
          </p>
        </div>
      </section>

      <section style={{ padding: '0 24px 56px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', gap: '4px', marginBottom: '1.75rem', background: 'rgba(18,18,20,0.74)', border: '1px solid rgba(140,144,159,0.18)', borderRadius: '14px', padding: '4px' }}>
            {(['personal', 'business'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  transition: 'all 200ms cubic-bezier(0.16,1,0.3,1)',
                  background: tab === t ? 'linear-gradient(135deg, rgba(59,130,246,0.24) 0%, rgba(139,92,246,0.16) 100%)' : 'transparent',
                  color: tab === t ? '#F8FAFC' : 'rgba(154,164,182,0.86)',
                  boxShadow: tab === t ? '0 12px 30px rgba(59,130,246,0.14)' : 'none',
                }}
              >
                {t === 'personal' ? 'Для физических лиц' : 'Для бизнеса'}
              </button>
            ))}
          </div>

          <div className="card aurora-blue" style={{ padding: '0 1.5rem' }}>
            {items.map(({ q, a }) => (
              <AccordionItem key={q} q={q} a={a} />
            ))}
          </div>

          <div className="surface-card aurora-violet" style={{ marginTop: '1.75rem', textAlign: 'center' }}>
            <p style={{ color: 'rgba(154,164,182,0.88)', marginBottom: '1rem', fontSize: '0.94rem' }}>
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
