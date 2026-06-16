import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    n: '01',
    title: 'Регистрация',
    desc: 'Введите номер телефона и подтвердите его с помощью SMS-кода. После этого вы получаете доступ к личному кабинету, где можно управлять заявками и отслеживать статус займа.',
  },
  {
    n: '02',
    title: 'Подача заявки',
    desc: 'Выберите сумму и срок займа, укажите необходимую информацию и отправьте заявку на рассмотрение. Все условия отображаются заранее.',
  },
  {
    n: '03',
    title: 'Проверка и одобрение',
    desc: 'Заявка анализируется автоматически на основе предоставленных данных. Решение принимается в короткие сроки. При повторных обращениях могут быть доступны более выгодные условия. В некоторых случаях может потребоваться дополнительная информация.',
  },
  {
    n: '04',
    title: 'Получение средств',
    desc: 'После одобрения деньги переводятся на указанный банковский счёт. Перевод осуществляется сразу после подтверждения условий.',
  },
  {
    n: '05',
    title: 'Погашение',
    desc: 'Погашение осуществляется удобным для вас способом в установленный срок. Вы можете внести платеж заранее без дополнительных комиссий.',
  },
];

const facts = [
  'Все условия займа отображаются до его оформления',
  'Мы не взимаем скрытые комиссии',
  'Данные клиентов обрабатываются в соответствии с требованиями законодательства',
  'Информация о погашении учитывается во внутренней истории клиента',
];

export default function HowItWorksPage() {
  return (
    <>
      <section style={{ background: 'var(--surface-0)', padding: '72px 24px 40px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 60%, rgba(46,125,247,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-indigo)', marginBottom: '1rem' }}>Процесс</p>
          <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(2.5rem,5vw,4rem)', color: '#fff', letterSpacing: '-0.02em', marginBottom: '1.25rem', maxWidth: '14ch', lineHeight: 1.1 }}>
            Как работает сервис
          </h1>
          <p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.55)', maxWidth: '56ch', lineHeight: 1.75 }}>
            Мы сделали процесс получения займа максимально простым и понятным. Вам не нужно посещать офис или собирать сложный пакет документов — всё оформляется онлайн за несколько минут.
          </p>
        </div>
      </section>

      <section style={{ background: 'var(--surface-1)', padding: '72px 24px 40px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>

          {/* Timeline */}
          <div style={{ position: 'relative', paddingLeft: '2.25rem' }}>
            <div aria-hidden style={{ position: 'absolute', left: '19px', top: '20px', bottom: '20px', width: '1px', background: 'linear-gradient(to bottom,rgba(46,125,247,0.3),rgba(46,125,247,0.05))' }} />
            {steps.map(({ n, title, desc }, i) => (
              <div key={n} style={{ position: 'relative', marginBottom: i < steps.length - 1 ? '1.75rem' : 0 }}>
                <div style={{ position: 'absolute', left: '-2.25rem', top: '2px', width: '38px', height: '38px', borderRadius: '50%', background: 'var(--surface-0)', border: '2px solid rgba(46,125,247,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-mono)', fontSize: '0.6875rem', fontWeight: 700, color: 'var(--accent-indigo)', flexShrink: 0 }}>
                  {n}
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.625rem', letterSpacing: '-0.01em' }}>{title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.9375rem' }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* Важно знать */}
          <div style={{ marginTop: '2rem', background: 'var(--surface-2)', borderRadius: '12px', padding: '1rem', border: '1px solid rgba(13,27,42,0.06)', borderLeft: '3px solid var(--accent-indigo)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>Важно знать</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {facts.map(f => (
                <div key={f} style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={15} color="var(--accent-indigo)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={{ marginTop: '2rem', fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
            Весь процесс — от подачи заявки до получения средств — проходит дистанционно, что позволяет сэкономить время и получить доступ к финансированию тогда, когда это действительно нужно.
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <Link href="/apply" className="btn btn-primary" style={{ gap: '8px' }}>Подать заявку <ArrowRight size={15} /></Link>
            <Link href="/faq"   className="btn btn-secondary">Есть вопросы? FAQ</Link>
          </div>
        </div>
      </section>
    </>
  );
}
