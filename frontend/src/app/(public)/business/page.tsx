import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const advantages = [
  { icon: <CheckCircle2 size={15} color="#C9923A" />, text: 'Займы от 30 000 до 500 000 EUR' },
  { icon: <CheckCircle2 size={15} color="#C9923A" />, text: 'Срок: от 1 до 12 месяцев' },
  { icon: <CheckCircle2 size={15} color="#C9923A" />, text: 'Без залога' },
  { icon: <CheckCircle2 size={15} color="#C9923A" />, text: 'Быстрое рассмотрение' },
  { icon: <CheckCircle2 size={15} color="#C9923A" />, text: 'Подходит для малого и среднего бизнеса' },
];

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

export default function BusinessPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: '#0D1B2A', padding: '100px 32px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 40%, rgba(201,146,58,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(201,146,58,0.1)', border: '1px solid rgba(201,146,58,0.2)', borderRadius: '100px', padding: '5px 14px', marginBottom: '2rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C9923A', display: 'block' }} />
            <span style={{ fontSize: '0.6875rem', color: '#C9923A', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Для бизнеса</span>
          </div>
          <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(2.5rem,5vw,4rem)', color: '#fff', letterSpacing: '-0.02em', marginBottom: '1.25rem', maxWidth: '18ch', lineHeight: 1.1 }}>
            Займы для бизнеса в Европе
          </h1>
          <p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.55)', maxWidth: '56ch', lineHeight: 1.75, marginBottom: '0.75rem' }}>
            Компания предлагает краткосрочные финансовые решения для предпринимателей и компаний, которым важно быстро получить доступ к средствам.
          </p>
          <p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.55)', maxWidth: '56ch', lineHeight: 1.75 }}>
            Финансирование может использоваться для покрытия текущих расходов, поддержания оборотного капитала или решения операционных задач.
          </p>
        </div>
      </section>

      {/* Когда это актуально */}
      <section style={{ background: '#F2F5F8', padding: '100px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'start' }} className="grid-2-resp">
            <div>
              <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.75rem' }}>Применение</p>
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.375rem)', color: '#0D1B2A', letterSpacing: '-0.01em', marginBottom: '1.5rem' }}>
                Когда это актуально
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {whenItems.map(item => (
                  <div key={item} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2E7DF7', flexShrink: 0 }} />
                    <span style={{ color: '#4A6580', fontSize: '0.9375rem' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.75rem' }}>Преимущества</p>
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.375rem)', color: '#0D1B2A', letterSpacing: '-0.01em', marginBottom: '1.5rem' }}>
                Почему выбирают нас
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {benefitsItems.map(({ title, desc }) => (
                  <div key={title} className="bento-card" style={{ cursor: 'default', padding: '1.125rem 1.25rem' }}>
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.25rem' }}>{title}</h3>
                    <p style={{ fontSize: '0.875rem', color: '#4A6580', lineHeight: 1.6 }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Условия финансирования */}
      <section style={{ background: '#fff', padding: '100px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.75rem' }}>Параметры</p>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.375rem)', color: '#0D1B2A', letterSpacing: '-0.01em' }}>
              Условия финансирования
            </h2>
          </div>
          <div className="grid-4-resp" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem' }}>
            {conditions.map(({ label, value }) => (
              <div key={label} className="bento-card" style={{ textAlign: 'center', cursor: 'default' }}>
                <p style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.875rem' }}>{label}</p>
                <p style={{ fontFamily: 'var(--f-mono)', fontSize: '0.9375rem', fontWeight: 700, color: '#0D1B2A', lineHeight: 1.4 }}>{value}</p>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#4A6580' }}>
            Итоговые условия определяются индивидуально после рассмотрения заявки и предоставленных документов.
          </p>
        </div>
      </section>

      {/* Требования к заёмщикам */}
      <section style={{ background: '#F2F5F8', padding: '100px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.75rem' }}>Требования</p>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.375rem)', color: '#0D1B2A', letterSpacing: '-0.01em', marginBottom: '0.75rem' }}>
              Требования к заёмщикам
            </h2>
            <p style={{ color: '#4A6580', fontSize: '0.9375rem' }}>
              Финансирование доступно для зарегистрированных европейских компаний и предпринимателей.
            </p>
          </div>
          <div className="grid-2-resp" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: '860px', margin: '0 auto' }}>
            {[
              { title: 'Для компаний (PVT, LTD)', items: requirementsCompany },
              { title: 'Для индивидуальных предпринимателей', items: requirementsIP },
            ].map(({ title, items }) => (
              <div key={title} className="bento-card" style={{ cursor: 'default' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>{title}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {items.map(item => (
                    <div key={item} style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
                      <CheckCircle2 size={14} color="#2E7DF7" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ fontSize: '0.875rem', color: '#4A6580' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Порядок оформления + CTA */}
      <section style={{ background: '#0D1B2A', padding: '80px 32px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.5rem,3vw,2rem)', color: '#fff', letterSpacing: '-0.02em', marginBottom: '1.25rem', textAlign: 'center' }}>
            Порядок оформления
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            {[
              'На текущем этапе заявки на финансирование для бизнеса принимаются через форму обратной связи.',
              'После получения заявки с вами свяжется специалист для уточнения деталей и дальнейшего оформления.',
              'Онлайн-кабинет для бизнеса находится в разработке и будет доступен позже.',
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C9923A', flexShrink: 0, marginTop: '7px' }} />
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9375rem', lineHeight: 1.65 }}>{t}</p>
              </div>
            ))}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9375rem', lineHeight: 1.65, marginBottom: '0.75rem', textAlign: 'center' }}>
            Мы понимаем, что бизнесу важны скорость, предсказуемость и понятные условия.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9375rem', lineHeight: 1.65, marginBottom: '2rem', textAlign: 'center' }}>
            Компания предоставляет решения, которые позволяют сосредоточиться на развитии, не отвлекаясь на сложные финансовые процессы.
          </p>
          <div style={{ textAlign: 'center' }}>
            <Link href="/contacts" className="btn btn-primary btn-lg" style={{ gap: '8px' }}>
              Оставить заявку <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
