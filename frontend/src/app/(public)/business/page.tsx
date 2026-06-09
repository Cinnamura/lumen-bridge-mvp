import Link from 'next/link';
import { ArrowRight, TrendingUp, Clock, FileText, CheckCircle2, Zap, Users } from 'lucide-react';

export default function BusinessPage() {
  return (
    <>
      <section style={{ background: '#0D1B2A', padding: '100px 32px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 40%, rgba(201,146,58,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(201,146,58,0.1)', border: '1px solid rgba(201,146,58,0.2)', borderRadius: '100px', padding: '5px 14px', marginBottom: '2rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C9923A', display: 'block' }} />
            <span style={{ fontSize: '0.75rem', color: '#C9923A', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Для бизнеса</span>
          </div>
          <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(2.5rem,5vw,4rem)', color: '#fff', letterSpacing: '-0.02em', marginBottom: '1.25rem', maxWidth: '18ch', lineHeight: 1.1 }}>
            Займы для бизнеса в Европе
          </h1>
          <p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.55)', maxWidth: '52ch', lineHeight: 1.75, marginBottom: '2.5rem' }}>
            Краткосрочные финансовые решения для предпринимателей и компаний, которым важно быстро получить доступ к средствам.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {['30 000 — 500 000 EUR', '1 — 12 месяцев', 'Без залога'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} color="rgba(201,146,58,0.8)" />
                <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* When relevant */}
      <section style={{ background: '#F2F5F8', padding: '100px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.75rem' }}>Применение</p>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.375rem)', color: '#0D1B2A', letterSpacing: '-0.01em' }}>
              Когда это актуально
            </h2>
          </div>
          <div className="grid-4-resp" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem' }}>
            {[
              { icon: <TrendingUp size={20} />, title: 'Кассовый разрыв',       desc: 'Покрытие временного дефицита оборотных средств' },
              { icon: <Zap size={20} />,        title: 'Закупка товаров',        desc: 'Пополнение склада под сезон или контракт' },
              { icon: <FileText size={20} />,   title: 'Операционные расходы',   desc: 'Поддержание текущей деятельности компании' },
              { icon: <Users size={20} />,      title: 'Запуск и расширение',    desc: 'Выход на новый рынок или масштабирование бизнеса' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card" style={{ cursor: 'default' }}>
                <div style={{ width: '44px', height: '44px', background: 'rgba(46,125,247,0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E7DF7', marginBottom: '1rem' }}>
                  {icon}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.375rem' }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#4A6580', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions */}
      <section style={{ background: '#fff', padding: '100px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.75rem' }}>Параметры</p>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.375rem)', color: '#0D1B2A', letterSpacing: '-0.01em' }}>
              Условия финансирования
            </h2>
          </div>
          <div className="grid-4-resp" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem' }}>
            {[
              { label: 'Сумма займа', value: '30 000 — 500 000 EUR' },
              { label: 'Срок',        value: '1 — 12 месяцев' },
              { label: 'Залог',       value: 'Не требуется' },
              { label: 'Рассмотрение', value: 'В кратчайшие сроки' },
            ].map(({ label, value }) => (
              <div key={label} className="card" style={{ textAlign: 'center', cursor: 'default' }}>
                <p style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.75rem' }}>{label}</p>
                <p style={{ fontFamily: 'var(--f-mono)', fontSize: '1rem', fontWeight: 700, color: '#0D1B2A', lineHeight: 1.4 }}>{value}</p>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#4A6580' }}>
            Итоговые условия определяются индивидуально после рассмотрения заявки и предоставленных документов.
          </p>
        </div>
      </section>

      {/* Requirements */}
      <section style={{ background: '#F2F5F8', padding: '100px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.75rem' }}>Требования</p>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.375rem)', color: '#0D1B2A', letterSpacing: '-0.01em' }}>
              Требования к заёмщикам
            </h2>
            <p style={{ color: '#4A6580', marginTop: '0.75rem', fontSize: '0.9375rem' }}>
              Финансирование доступно для зарегистрированных европейских компаний и предпринимателей
            </p>
          </div>
          <div className="grid-2-resp" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: '860px', margin: '0 auto' }}>
            {[
              { title: 'Для компаний (PVT, LTD)', items: ['Certificate of Incorporation', 'Регистрационный номер компании', 'Удостоверение личности директора', 'Банковская выписка за последние месяцы'] },
              { title: 'Для индивидуальных предпринимателей', items: ['Сертификат регистрации бизнеса', 'Регистрационный номер предпринимателя', 'Удостоверение личности владельца', 'Выписка по банковскому счёту'] },
            ].map(({ title, items }) => (
              <div key={title} className="card" style={{ cursor: 'default' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>{title}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {items.map(item => (
                    <div key={item} style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
                      <CheckCircle2 size={14} color="#2E7DF7" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '0.875rem', color: '#4A6580' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#0D1B2A', padding: '80px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: '580px', margin: '0 auto' }}>
          <div style={{ background: 'rgba(201,146,58,0.08)', border: '1px solid rgba(201,146,58,0.2)', borderRadius: '14px', padding: '1.125rem 1.5rem', marginBottom: '2rem', textAlign: 'left', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <Clock size={16} color="#C9923A" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem', lineHeight: 1.65 }}>
              Заявки на бизнес-займы принимаются через форму обратной связи. После получения заявки с вами свяжется специалист для уточнения деталей.
            </p>
          </div>
          <Link href="/contacts" className="btn btn-primary btn-lg" style={{ gap: '8px' }}>
            Оставить заявку <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
