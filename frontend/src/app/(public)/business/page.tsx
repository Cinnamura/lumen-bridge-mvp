import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const whenItems = [
  'временный кассовый разрыв',
  'закупка товаров или материалов',
  'покрытие операционных расходов',
  'запуск или расширение бизнеса',
];

const conditions = [
  { label: 'Сумма займа', value: 'от 30 000 до 500 000 EUR' },
  { label: 'Срок', value: 'от 1 до 12 месяцев' },
  { label: 'Формат', value: 'краткосрочное финансирование' },
  { label: 'Залог', value: 'не требуется (в стандартных случаях)' },
];

const benefitsItems = [
  { title: 'Быстрый доступ к средствам', desc: 'Решение принимается в короткие сроки, что позволяет оперативно закрывать финансовые задачи' },
  { title: 'Простая процедура', desc: 'Минимальный пакет документов и понятный процесс подачи заявки' },
  { title: 'Прозрачные условия', desc: 'Все параметры займа согласовываются заранее, без скрытых платежей' },
  { title: 'Поддержка бизнеса', desc: 'Финансирование адаптировано под потребности малого и среднего бизнеса' },
];

const requirementsCompany = [
  'Certificate of Incorporation',
  'Регистрационный номер компании',
  'Удостоверение личности директора или уполномоченного лица',
  'Банковская выписка за последние месяцы',
];

const requirementsIP = [
  'Сертификат регистрации бизнеса',
  'Регистрационный номер предпринимателя',
  'Удостоверение личности владельца',
  'Выписка по банковскому счёту',
];

const StitchTokenScene = dynamic(() => import('@/shared/ui/animations/StitchTokenScene'), { ssr: false });

function LightLinesVisual({ style }: { style?: CSSProperties }) {
  return (
    <div
      className="light-lines"
      style={{
        minHeight: '340px',
        borderRadius: '24px',
        border: '1px solid rgba(140,144,159,0.18)',
        background: 'linear-gradient(180deg, rgba(49,27,90,0.5) 0%, rgba(18,18,20,0.82) 100%)',
        position: 'relative',
        ...style,
      }}
    >
      <span style={{ width: '76%', top: '22%', left: '10%', animationDelay: '0s' }} />
      <span style={{ width: '54%', top: '36%', left: '20%', animationDelay: '1.2s' }} />
      <span style={{ width: '82%', top: '50%', left: '8%', animationDelay: '0.6s' }} />
      <span style={{ width: '44%', top: '64%', left: '32%', animationDelay: '1.6s' }} />
      <span style={{ width: '68%', top: '78%', left: '16%', animationDelay: '0.9s' }} />
      <div style={{ position: 'absolute', width: '240px', height: '240px', right: '-40px', top: '-30px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.26), transparent 70%)' }} />
      <div style={{ position: 'absolute', width: '180px', height: '180px', left: '-20px', bottom: '-20px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.2), transparent 70%)' }} />
    </div>
  );
}

export default function BusinessPage() {
  return (
    <>
      <section style={{ padding: '56px 24px 44px', position: 'relative' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div
            className="surface-card aurora-violet"
            style={{
              overflow: 'hidden',
              minHeight: '380px',
              padding: 'clamp(1.5rem,3vw,2.5rem)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div aria-hidden className="absolute inset-0 z-0" style={{ pointerEvents: 'none', opacity: 0.75 }}>
              <LightLinesVisual style={{ minHeight: '100%', height: '100%', border: 'none', borderRadius: '0', background: 'linear-gradient(180deg, rgba(49,27,90,0.34) 0%, rgba(18,18,20,0.1) 100%)' }} />
            </div>
            <div aria-hidden className="absolute inset-0 z-0" style={{ pointerEvents: 'none', opacity: 0.3, mixBlendMode: 'screen' }}>
              <StitchTokenScene />
            </div>
            <div className="relative z-10" style={{ maxWidth: '700px' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C4B5FD', marginBottom: '0.65rem' }}>Для бизнеса</p>
              <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(2.5rem,5vw,4.2rem)', color: '#F8FAFC', letterSpacing: '-0.04em', lineHeight: 1.02, marginBottom: '1rem', maxWidth: '13ch' }}>
                Займы для бизнеса в Европе
              </h1>
              <p style={{ fontSize: '1.0625rem', color: 'rgba(216,227,251,0.84)', lineHeight: 1.8, marginBottom: '0.75rem' }}>
                Компания предлагает краткосрочные финансовые решения для предпринимателей и компаний, которым важно быстро получить доступ к средствам.
              </p>
              <p style={{ fontSize: '0.95rem', color: 'rgba(154,164,182,0.9)', lineHeight: 1.75, marginBottom: '1.5rem' }}>
                Финансирование может использоваться для покрытия текущих расходов, поддержания оборотного капитала или решения операционных задач.
              </p>
              <Link href="/contacts" className="btn btn-primary btn-lg" style={{ gap: '8px' }}>
                Оставить заявку <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '56px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="grid-2-resp" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="surface-card aurora-blue">
              <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#93C5FD', marginBottom: '0.65rem' }}>Применение</p>
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.9rem,3vw,2.6rem)', color: '#F8FAFC', letterSpacing: '-0.03em', marginBottom: '1rem' }}>Когда это актуально</h2>
              <div style={{ display: 'grid', gap: '0.7rem' }}>
                {whenItems.map((item) => (
                  <div key={item} style={{ display: 'flex', gap: '0.7rem', alignItems: 'center' }}>
                    <CheckCircle2 size={15} color="#93C5FD" />
                    <span style={{ color: '#E2E8F0', fontSize: '0.92rem' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="surface-card aurora-violet">
              <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C4B5FD', marginBottom: '0.65rem' }}>Преимущества</p>
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.9rem,3vw,2.6rem)', color: '#F8FAFC', letterSpacing: '-0.03em', marginBottom: '1rem' }}>Почему выбирают нас</h2>
              <div style={{ display: 'grid', gap: '0.95rem' }}>
                {benefitsItems.map(({ title, desc }) => (
                  <div key={title} style={{ padding: '0.95rem 1rem', borderRadius: '16px', border: '1px solid rgba(140,144,159,0.16)', background: 'rgba(18,18,20,0.42)' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.3rem' }}>{title}</h3>
                    <p style={{ fontSize: '0.86rem', color: 'rgba(154,164,182,0.88)', lineHeight: 1.6 }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '56px 24px', background: 'linear-gradient(180deg, rgba(18,18,20,0.3) 0%, rgba(11,15,25,0.18) 100%)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#93C5FD', marginBottom: '0.65rem' }}>Параметры</p>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.9rem,3vw,2.6rem)', color: '#F8FAFC', letterSpacing: '-0.03em' }}>Условия финансирования</h2>
          </div>
          <div className="grid-4-resp" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1rem' }}>
            {conditions.map(({ label, value }) => (
              <div key={label} className="surface-card">
                <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#93C5FD', marginBottom: '0.75rem' }}>{label}</p>
                <p style={{ fontFamily: 'var(--f-mono)', fontSize: '0.95rem', fontWeight: 700, color: '#F8FAFC', lineHeight: 1.45 }}>{value}</p>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: 'rgba(154,164,182,0.84)' }}>
            Итоговые условия определяются индивидуально после рассмотрения заявки и предоставленных документов.
          </p>
        </div>
      </section>

      <section style={{ padding: '56px 24px' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#93C5FD', marginBottom: '0.65rem' }}>Требования</p>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.9rem,3vw,2.6rem)', color: '#F8FAFC', letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
              Требования к заёмщикам
            </h2>
            <p style={{ color: 'rgba(154,164,182,0.88)', fontSize: '0.94rem' }}>
              Финансирование доступно для зарегистрированных европейских компаний и предпринимателей.
            </p>
          </div>
          <div className="grid-2-resp" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { title: 'Для компаний (PVT, LTD)', items: requirementsCompany, tone: '#93C5FD' },
              { title: 'Для индивидуальных предпринимателей', items: requirementsIP, tone: '#C4B5FD' },
            ].map(({ title, items, tone }) => (
              <div key={title} className="surface-card">
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '1rem' }}>{title}</h3>
                <div style={{ display: 'grid', gap: '0.7rem' }}>
                  {items.map((item) => (
                    <div key={item} style={{ display: 'flex', gap: '0.6rem', alignItems: 'start' }}>
                      <CheckCircle2 size={15} color={tone} style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.88rem', color: 'rgba(154,164,182,0.9)', lineHeight: 1.55 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px 56px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div className="surface-card aurora-violet" style={{ textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.25rem)', color: '#F8FAFC', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
              Порядок оформления
            </h2>
            <div style={{ display: 'grid', gap: '0.8rem', textAlign: 'left', marginBottom: '1.5rem' }}>
              {[
                'На текущем этапе заявки на финансирование для бизнеса принимаются через форму обратной связи.',
                'После получения заявки с вами свяжется специалист для уточнения деталей и дальнейшего оформления.',
                'Онлайн-кабинет для бизнеса находится в разработке и будет доступен позже.',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', gap: '0.7rem', alignItems: 'start' }}>
                  <CheckCircle2 size={15} color="#C4B5FD" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <p style={{ color: 'rgba(216,227,251,0.88)', lineHeight: 1.65, fontSize: '0.9rem' }}>{item}</p>
                </div>
              ))}
            </div>
            <p style={{ color: 'rgba(154,164,182,0.88)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
              Мы понимаем, что бизнесу важны скорость, предсказуемость и понятные условия.
            </p>
            <p style={{ color: 'rgba(154,164,182,0.88)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Компания предоставляет решения, которые позволяют сосредоточиться на развитии, не отвлекаясь на сложные финансовые процессы.
            </p>
            <Link href="/contacts" className="btn btn-primary btn-lg" style={{ gap: '8px' }}>
              Оставить заявку <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
