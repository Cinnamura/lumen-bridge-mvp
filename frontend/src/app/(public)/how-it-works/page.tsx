import Link from 'next/link';

export default function HowItWorksPage() {
  const steps = [
    { n: '01', title: 'Регистрация', desc: 'Введите номер телефона — получите код подтверждения. Учётная запись создаётся автоматически при первой заявке. Никаких паролей, только телефон.' },
    { n: '02', title: 'Подача заявки', desc: 'Заполните форму: укажите нужную сумму, срок и персональные данные. Для физлиц — ФИО, дата рождения, контакты. Для бизнеса — реквизиты компании. Займёт не более 5 минут.' },
    { n: '03', title: 'Проверка', desc: 'Наш специалист рассматривает заявку и принимает решение. Мы можем уточнить дополнительные данные, если потребуется. Вы отслеживаете статус в личном кабинете.' },
    { n: '04', title: 'Получение', desc: 'После одобрения вы получаете уведомление и подписываете договор онлайн с помощью SMS-кода. Средства поступают на указанный банковский счёт.' },
    { n: '05', title: 'Погашение', desc: 'Вносите ежедневные платежи согласно графику. Можно погасить досрочно. При возникновении вопросов — обращайтесь в поддержку.' },
  ];

  return (
    <>
      <section style={{ background: 'var(--color-midnight)', padding: 'var(--space-20) var(--space-6)' }}>
        <div style={{ maxWidth: 'var(--container-xl)', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,var(--text-6xl))', color: 'var(--color-white)', marginBottom: 'var(--space-6)' }}>
            Как это работает
          </h1>
          <p style={{ fontSize: 'var(--text-lg)', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto', lineHeight: 'var(--leading-relaxed)' }}>
            От заявки до получения средств — пять простых шагов. Всё происходит онлайн, без визитов в офис.
          </p>
        </div>
      </section>

      <section style={{ background: 'var(--color-white)', padding: 'var(--space-20) var(--space-6)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {steps.map(({ n, title, desc }, i) => (
            <div key={n} style={{ display: 'flex', gap: 'var(--space-8)', paddingBottom: 'var(--space-10)', borderLeft: i < steps.length - 1 ? '2px solid var(--color-silver)' : '2px solid transparent', marginLeft: '20px', paddingLeft: 'var(--space-8)', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-21px', top: 0, width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--color-white)', flexShrink: 0 }}>{n}</div>
              <div>
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-semibold)', color: 'var(--color-midnight)', marginBottom: 'var(--space-3)' }}>{title}</h3>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)', margin: 0 }}>{desc}</p>
              </div>
            </div>
          ))}

          <div className="card" style={{ borderLeft: '4px solid var(--color-accent)', marginTop: 'var(--space-8)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--color-midnight)', marginBottom: 'var(--space-4)' }}>Важно знать</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', paddingLeft: 'var(--space-4)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
              <li>Займ предоставляется совершеннолетним гражданам</li>
              <li>Ставка 0,8% в день рассчитывается на остаток долга</li>
              <li>Никаких скрытых комиссий — все условия указаны в договоре</li>
              <li>Досрочное погашение — без штрафов</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-10)', flexWrap: 'wrap' }}>
            <Link href="/apply" className="btn-primary" style={{ textDecoration: 'none' }}>Подать заявку</Link>
            <Link href="/faq" className="btn-secondary" style={{ textDecoration: 'none' }}>Есть вопросы? FAQ</Link>
          </div>
        </div>
      </section>
    </>
  );
}
