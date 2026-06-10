import Link from 'next/link';
import { LoanCalculator } from '@/features/loan-calculator/LoanCalculator';
import { HomeClient } from './HomeClient';
import {
  Shield, CheckCircle2, Clock, Lock, TrendingUp,
  ArrowRight, MapPin, Mail, Phone,
  FileText, Zap, RefreshCw,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   Декоративная геометрическая SVG — чисто визуальный элемент,
   не несёт аналитической информации
   ───────────────────────────────────────────────────────────── */
function GeometricIllustration() {
  return (
    <svg
      viewBox="0 0 400 320"
      fill="none"
      style={{ width: '100%', maxWidth: '400px', display: 'block' }}
      aria-hidden
    >
      {/* Outer ring */}
      <circle cx="200" cy="160" r="140" stroke="rgba(46,125,247,0.10)" strokeWidth="1" />
      <circle cx="200" cy="160" r="110" stroke="rgba(46,125,247,0.07)" strokeWidth="1" />
      <circle cx="200" cy="160" r="80"  stroke="rgba(46,125,247,0.05)" strokeWidth="1" />

      {/* Cross-hairs */}
      <line x1="200" y1="20"  x2="200" y2="300" stroke="rgba(46,125,247,0.06)" strokeWidth="1" />
      <line x1="60"  y1="160" x2="340" y2="160" stroke="rgba(46,125,247,0.06)" strokeWidth="1" />

      {/* Diagonal grid */}
      <line x1="101" y1="61"  x2="299" y2="259" stroke="rgba(46,125,247,0.04)" strokeWidth="1" />
      <line x1="299" y1="61"  x2="101" y2="259" stroke="rgba(46,125,247,0.04)" strokeWidth="1" />

      {/* Pentagon outline */}
      <polygon
        points="200,50 330,145 280,290 120,290 70,145"
        stroke="rgba(46,125,247,0.08)" strokeWidth="1" fill="none"
      />

      {/* Inner hexagon */}
      <polygon
        points="200,90 250,115 250,205 200,230 150,205 150,115"
        stroke="rgba(46,125,247,0.12)" strokeWidth="1" fill="none"
      />

      {/* Corner accent dots */}
      <circle cx="200" cy="50"  r="3" fill="rgba(46,125,247,0.25)" />
      <circle cx="330" cy="145" r="3" fill="rgba(46,125,247,0.20)" />
      <circle cx="280" cy="290" r="3" fill="rgba(46,125,247,0.15)" />
      <circle cx="120" cy="290" r="3" fill="rgba(46,125,247,0.15)" />
      <circle cx="70"  cy="145" r="3" fill="rgba(46,125,247,0.20)" />

      {/* Central accent */}
      <circle cx="200" cy="160" r="8"  fill="rgba(46,125,247,0.12)" />
      <circle cx="200" cy="160" r="3"  fill="rgba(46,125,247,0.5)" />

      {/* Subtle arc segments */}
      <path d="M 200 60 A 100 100 0 0 1 300 160" stroke="rgba(46,125,247,0.15)" strokeWidth="1.5" fill="none" />
      <path d="M 200 260 A 100 100 0 0 1 100 160" stroke="rgba(46,125,247,0.10)" strokeWidth="1.5" fill="none" />

      {/* Floating small circles */}
      <circle cx="130" cy="90"  r="2.5" fill="rgba(46,125,247,0.20)" />
      <circle cx="270" cy="90"  r="2.5" fill="rgba(46,125,247,0.20)" />
      <circle cx="310" cy="200" r="2"   fill="rgba(46,125,247,0.15)" />
      <circle cx="90"  cy="200" r="2"   fill="rgba(46,125,247,0.15)" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <>
      {/* ══ 1. HERO ══ */}
      <section style={{ background: '#0D1B2A', minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '6rem 32px 5rem', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 18% 55%, rgba(46,125,247,0.08) 0%, transparent 55%), radial-gradient(circle at 78% 18%, rgba(46,125,247,0.05) 0%, transparent 45%)', pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)', backgroundSize: '64px 64px', pointerEvents: 'none', maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%,#000 30%,transparent 100%)' }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', position: 'relative' }}>
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '55fr 45fr', gap: '4rem', alignItems: 'center' }}>
            <div className="anim-fade-up">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(46,125,247,0.1)', border: '1px solid rgba(46,125,247,0.22)', borderRadius: '100px', padding: '5px 14px 5px 10px', marginBottom: '2rem' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#2E7DF7', display: 'block', boxShadow: '0 0 6px #2E7DF7' }} />
                <span style={{ fontSize: '0.6875rem', color: '#2E7DF7', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Быстрые займы в Европе
                </span>
              </div>

              <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(2.5rem,4.8vw,4.25rem)', color: '#fff', lineHeight: 1.08, marginBottom: '1.5rem', letterSpacing: '-0.025em' }}>
                Получите деньги тогда, когда это действительно нужно
              </h1>

              <p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: '0.75rem', maxWidth: '48ch' }}>
                Простые и прозрачные займы для частных лиц и бизнеса в Европе — быстрое решение и безопасное оформление
              </p>
              <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '48ch' }}>
                Неожиданные расходы или срочные возможности не должны вас останавливать. Сервис помогает быстро получить финансирование — без сложных процедур и скрытых условий.
              </p>

              <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                <Link href="/apply" className="btn btn-primary btn-lg" style={{ gap: '8px' }}>
                  Получить займ <ArrowRight size={16} />
                </Link>
                <Link href="/how-it-works" className="btn btn-ghost btn-lg">
                  Как это работает
                </Link>
              </div>

              <div style={{ display: 'flex', gap: '1.75rem', flexWrap: 'wrap' }}>
                {['Без залога', 'Быстрое одобрение', 'Выплата на банковский счёт'].map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={13} color="rgba(46,125,247,0.75)" />
                    <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-calc anim-fade-up-1 bento-dark" style={{ padding: '2rem' }}>
              <LoanCalculator dark />
            </div>
          </div>
        </div>
      </section>

      {/* ══ 2. КАЛЬКУЛЯТОР ══ */}
      <section style={{ background: '#F2F5F8', padding: '100px 32px' }}>
        <div style={{ maxWidth: '740px', margin: '0 auto' }}>
          <LoanCalculator />
        </div>
      </section>

      {/* ══ 3. УСЛОВИЯ ЗАЙМА ══ */}
      <section style={{ background: '#fff', padding: '100px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.625rem' }}>Условия</p>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#0D1B2A', letterSpacing: '-0.02em' }}>
              Основные условия
            </h2>
          </div>
          <div className="grid-4-resp" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem' }}>
            {[
              { label: 'Сумма',             value: 'от 500 до 50 000 EUR' },
              { label: 'Срок',              value: 'от 7 до 90 дней' },
              { label: 'Процентная ставка', value: 'определяется индивидуально' },
              { label: 'Погашение',         value: 'равными платежами' },
            ].map((c, i) => (
              <div key={c.label} className={`bento-card reveal reveal-${i+1}`} style={{ textAlign: 'center', cursor: 'default' }}>
                <p style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.875rem' }}>{c.label}</p>
                <p style={{ fontFamily: 'var(--f-mono)', fontSize: '1rem', fontWeight: 700, color: '#0D1B2A', letterSpacing: '-0.01em', lineHeight: 1.4 }}>{c.value}</p>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8125rem', color: '#4A6580' }}>
            Итоговые условия зависят от результатов проверки клиента и предоставленных данных.
          </p>
        </div>
        <HomeClient section="conditions" />
      </section>

      {/* ══ 4. КОГДА ДЕНЬГИ НУЖНЫ СЕЙЧАС ══ */}
      <section style={{ background: '#F2F5F8', padding: '100px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start', marginBottom: '2.5rem' }} className="grid-2-resp">
            <div>
              <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.625rem' }}>Применение</p>
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#0D1B2A', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                Когда деньги нужны сейчас
              </h2>
            </div>
            <div style={{ paddingTop: '0.5rem' }}>
              <p style={{ color: '#4A6580', lineHeight: 1.75, fontSize: '0.9375rem' }}>
                Не все финансовые вопросы можно отложить. Иногда важно принять решение быстро — без сложных процедур и ожиданий.
              </p>
            </div>
          </div>
          <div className="grid-4-resp" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem' }}>
            {[
              { icon: <Zap size={20} />,       title: 'Срочные расходы', desc: 'Неожиданные платежи, которые нельзя перенести' },
              { icon: <Clock size={20} />,      title: 'Задержка дохода', desc: 'Когда деньги нужны сейчас, а поступления позже' },
              { icon: <FileText size={20} />,   title: 'Бизнес-задачи',   desc: 'Кассовые разрывы или операционные расходы' },
              { icon: <TrendingUp size={20} />, title: 'Возможности',     desc: 'Ситуации, где важно действовать без промедления' },
            ].map((c, i) => (
              <div key={c.title} className={`bento-card reveal reveal-${i+1}`} style={{ cursor: 'default' }}>
                <div style={{ width: '42px', height: '42px', background: 'rgba(46,125,247,0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E7DF7', marginBottom: '1rem' }}>
                  {c.icon}
                </div>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.375rem' }}>{c.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#4A6580', lineHeight: 1.65 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <HomeClient section="usecases" />
      </section>

      {/* ══ 5. КАК ЭТО РАБОТАЕТ ══ */}
      <section style={{ background: '#fff', padding: '100px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.625rem' }}>Процесс</p>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#0D1B2A', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
              Как всё происходит
            </h2>
            <p style={{ color: '#4A6580', maxWidth: '52ch', margin: '0 auto', lineHeight: 1.7, fontSize: '0.9375rem' }}>
              Оформление займа занимает всего несколько минут и полностью проходит онлайн, без визитов в офис и сложных процедур.
            </p>
          </div>
          <div className="grid-3-resp" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
            {[
              { n: '01', title: 'Регистрация',      desc: 'Введите номер телефона и подтвердите его с помощью SMS-кода.' },
              { n: '02', title: 'Заявка',            desc: 'Выберите сумму и срок займа и отправьте заявку на рассмотрение.' },
              { n: '03', title: 'Получение средств', desc: 'После одобрения деньги поступают на ваш банковский счёт.' },
            ].map((s, i) => (
              <div key={s.n} className={`bento-card reveal reveal-${i+1}`} style={{ cursor: 'default' }}>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: '2.5rem', fontWeight: 700, color: '#2E7DF7', marginBottom: '1rem', letterSpacing: '-0.02em', opacity: 0.8 }}>
                  {s.n}
                </div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.625rem', letterSpacing: '-0.01em' }}>{s.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#4A6580', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <HomeClient section="steps" />
      </section>

      {/* ══ 6. ПРОЗРАЧНЫЕ УСЛОВИЯ ══ */}
      <section style={{ background: '#0D1B2A', padding: '100px 32px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', top: '-80px', right: '-80px', width: '480px', height: '480px', background: 'radial-gradient(circle,rgba(46,125,247,0.05) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'start' }} className="grid-2-resp">
            <div>
              <div style={{ width: '32px', height: '2px', background: '#2E7DF7', borderRadius: '99px', marginBottom: '1.5rem' }} />
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#fff', letterSpacing: '-0.02em', marginBottom: '1.25rem', lineHeight: 1.15 }}>
                Вы заранее знаете все условия
              </h2>
              <Link href="/apply" className="btn btn-primary" style={{ gap: '8px', marginTop: '0.5rem' }}>
                Подать заявку <ArrowRight size={15} />
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { icon: <Shield size={16} />,    t: 'Никаких скрытых комиссий',   d: 'Полная стоимость займа известна до оформления' },
                { icon: <Clock size={16} />,     t: 'Быстрое рассмотрение',        d: 'Заявки обрабатываются в течение нескольких минут' },
                { icon: <Lock size={16} />,      t: 'Безопасность данных',          d: 'Ваши данные защищены современными технологиями' },
                { icon: <RefreshCw size={16} />, t: 'Гибкое погашение',             d: 'Выбирайте удобный срок и погашайте без лишнего давления' },
                { icon: <TrendingUp size={16} />,t: 'Улучшение условий со временем',d: 'При повторных займах могут быть доступны более выгодные параметры и увеличенный лимит' },
              ].map(({ icon, t, d }) => (
                <div key={t} className="bento-dark" style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start', padding: '1rem 1.125rem' }}>
                  <div style={{ width: '32px', height: '32px', background: 'rgba(46,125,247,0.12)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E7DF7', flexShrink: 0 }}>
                    {icon}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, color: 'rgba(255,255,255,0.88)', marginBottom: '0.2rem', fontSize: '0.875rem' }}>{t}</p>
                    <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.38)', lineHeight: 1.55 }}>{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 7. О КОМПАНИИ ══ */}
      <section style={{ background: '#fff', padding: '100px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '4rem', alignItems: 'center' }} className="grid-2-resp">
            <div>
              <div style={{ width: '32px', height: '2px', background: '#2E7DF7', borderRadius: '99px', marginBottom: '1.5rem' }} />
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#0D1B2A', letterSpacing: '-0.02em', marginBottom: '1.25rem', lineHeight: 1.15 }}>
                О LumenBridge Finance Ltd
              </h2>
              <p style={{ color: '#4A6580', lineHeight: 1.75, marginBottom: '1rem', fontSize: '0.9375rem' }}>
                LumenBridge Finance Ltd — финансовая организация, предоставляющая быстрые и доступные решения в сфере кредитования в Европе.
              </p>
              <p style={{ color: '#4A6580', lineHeight: 1.75, marginBottom: '1rem', fontSize: '0.9375rem' }}>
                Наша цель — упростить доступ к финансированию за счёт прозрачных условий и современных технологий.
              </p>
              <p style={{ color: '#4A6580', lineHeight: 1.75, fontSize: '0.9375rem' }}>
                Мы работаем в соответствии с действующим законодательством и уделяем особое внимание защите данных клиентов и ответственному кредитованию.
              </p>
            </div>
            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { val: '500 EUR', label: 'Минимальный займ' },
                { val: '90 дн.',  label: 'Максимальный срок' },
                { val: '0,8%',    label: 'Ставка в день' },
                { val: 'GDPR',    label: 'Соответствие стандарту' },
              ].map((s, i) => (
                <div key={s.label} className={`bento-card reveal reveal-${i+1}`} style={{ cursor: 'default' }}>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: '1.625rem', fontWeight: 700, color: '#0D1B2A', letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>{s.val}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#4A6580', lineHeight: 1.5 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <HomeClient section="about" />
      </section>

      {/* ══ 8. УЛУЧШЕНИЕ КРЕДИТНОЙ ИСТОРИИ ══ */}
      <section style={{ background: '#F2F5F8', padding: '100px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }} className="grid-2-resp">
            <div>
              <div style={{ width: '32px', height: '2px', background: '#2E7DF7', borderRadius: '99px', marginBottom: '1.5rem' }} />
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#0D1B2A', letterSpacing: '-0.02em', marginBottom: '1.25rem', lineHeight: 1.15 }}>
                Займ — это не только деньги сейчас
              </h2>
              <p style={{ color: '#4A6580', lineHeight: 1.75, marginBottom: '2rem', fontSize: '0.9375rem' }}>
                Своевременное погашение займа помогает улучшить кредитный рейтинг и открывает доступ к более выгодным условиям в будущем.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
                {[
                  'Возможность начать с небольшой суммы',
                  'Формирование положительной кредитной истории',
                  'Формирование положительной кредитной истории',
                ].map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
                    <CheckCircle2 size={14} color="#2E7DF7" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.875rem', color: '#4A6580' }}>{t}</span>
                  </div>
                ))}
              </div>
              <Link href="/apply" className="btn btn-primary" style={{ gap: '8px' }}>
                Начать с небольшого займа <ArrowRight size={15} />
              </Link>
            </div>

            {/* Decorative geometric illustration — no analytics, pure visual */}
            <div className="bento-card" style={{ background: '#fff', cursor: 'default', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2.5rem', minHeight: '280px' }}>
              <GeometricIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* ══ 9. ДЛЯ БИЗНЕСА ══ */}
      <section style={{ background: '#0D1B2A', padding: '100px 32px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', top: '-120px', right: '-120px', width: '600px', height: '600px', background: 'radial-gradient(circle,rgba(201,146,58,0.07) 0%,transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <div style={{ maxWidth: '600px', marginBottom: '3.5rem' }}>
            <div style={{ width: '32px', height: '2px', background: '#C9923A', borderRadius: '99px', marginBottom: '1.5rem' }} />
            <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C9923A', marginBottom: '0.75rem' }}>
              Для бизнеса
            </p>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#fff', letterSpacing: '-0.02em', marginBottom: '1rem', lineHeight: 1.15 }}>
              Финансирование для бизнеса
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, fontSize: '0.9375rem' }}>
              Решения для компаний и предпринимателей, которым важна скорость и предсказуемость.
            </p>
          </div>

          <div className="grid-3-resp" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
            {[
              { val: 'Займы от 30 000 до 500 000 EUR' },
              { val: 'Срок: от 1 до 12 месяцев' },
              { val: 'Без залога' },
              { val: 'Быстрое рассмотрение' },
              { val: 'Подходит для малого и среднего бизнеса' },
            ].map(({ val }) => (
              <div key={val} className="bento-dark" style={{ padding: '1.125rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle2 size={15} color="#C9923A" style={{ flexShrink: 0 }} />
                <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', fontWeight: 500 }}>{val}</span>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(201,146,58,0.07)', border: '1px solid rgba(201,146,58,0.18)', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '2rem', maxWidth: '600px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C9923A', flexShrink: 0, marginTop: '6px' }} />
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', lineHeight: 1.65 }}>
              На данный момент заявки принимаются через форму обратной связи. Онлайн-кабинет для бизнеса будет доступен позже.
            </p>
          </div>
          <Link href="/contacts" className="btn btn-primary btn-lg" style={{ gap: '8px' }}>
            Оставить заявку <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ══ 10. БЛОК ДОВЕРИЯ ══ */}
      <section style={{ background: '#fff', padding: '72px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontFamily: 'var(--f-display)', fontSize: 'clamp(1.5rem,2.5vw,2rem)', color: '#0D1B2A', letterSpacing: '-0.02em', marginBottom: '2.5rem' }}>
            Работаем прозрачно и в рамках закона
          </h2>
          <div className="grid-4-resp" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem' }}>
            {[
              { icon: <Shield size={18} />,       t: 'Соответствие требованиям GDPR',    d: 'Европейские стандарты обработки данных' },
              { icon: <CheckCircle2 size={18} />, t: 'Ответственный подход к проверке заявок', d: 'Тщательный анализ каждого обращения' },
              { icon: <Lock size={18} />,         t: 'Защита персональных данных',         d: 'Многоуровневая безопасность' },
              { icon: <FileText size={18} />,     t: 'Чёткие и понятные условия',          d: 'Никакого мелкого шрифта' },
            ].map(({ icon, t, d }, i) => (
              <div key={t} className={`bento-card reveal reveal-${i+1}`} style={{ cursor: 'default' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(46,125,247,0.07)', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E7DF7', marginBottom: '1rem' }}>
                  {icon}
                </div>
                <p style={{ fontWeight: 700, color: '#0D1B2A', marginBottom: '0.25rem', fontSize: '0.9375rem' }}>{t}</p>
                <p style={{ fontSize: '0.8125rem', color: '#4A6580', lineHeight: 1.55 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
        <HomeClient section="compliance" />
      </section>

      {/* ══ 11. FAQ ПРЕВЬЮ ══ */}
      <HomeClient section="faq" />

      {/* ══ 12. БЕЗОПАСНОСТЬ КЛИЕНТОВ ══ */}
      <section style={{ background: '#0D1B2A', padding: '100px 32px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: '52px', height: '52px', background: 'rgba(46,125,247,0.1)', borderRadius: '14px', border: '1px solid rgba(46,125,247,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={24} color="#2E7DF7" />
            </div>
          </div>
          <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#fff', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
            Безопасность клиентов
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: '1rem', fontSize: '0.9375rem' }}>
            Мы уделяем особое внимание защите данных и безопасности наших клиентов. Все операции выполняются через защищённые каналы, а обработка информации осуществляется в соответствии с применимым европейским законодательством.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: '0.5rem', fontSize: '0.9375rem' }}>
            Мы не требуем предоплату и не запрашиваем конфиденциальные данные.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: '2rem', fontSize: '0.9375rem' }}>
            Используйте только официальный сайт и проверенные контактные данные компании при взаимодействии с сервисом.
          </p>
        </div>
      </section>

      {/* ══ 13. ОБРАТНАЯ СВЯЗЬ ══ */}
      <section style={{ background: '#fff', padding: '100px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem' }} className="grid-2-resp">
            <div>
              <div style={{ width: '32px', height: '2px', background: '#2E7DF7', borderRadius: '99px', marginBottom: '1.5rem' }} />
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#0D1B2A', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                Свяжитесь с нами
              </h2>
              <p style={{ color: '#4A6580', lineHeight: 1.7, marginBottom: '2rem', fontSize: '0.9375rem' }}>
                Если у вас есть вопросы или вам нужна помощь — наша команда готова помочь.
              </p>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><label className="input-label">Имя</label><input className="input" type="text" placeholder="Иван" /></div>
                  <div><label className="input-label">Email</label><input className="input" type="email" placeholder="ivan@example.com" /></div>
                </div>
                <div><label className="input-label">Телефон</label><input className="input" type="tel" placeholder="+353 1 531 8420" /></div>
                <div><label className="input-label">Сообщение</label><textarea className="input" rows={4} placeholder="Ваш вопрос..." style={{ resize: 'vertical' }} /></div>
                <div><label className="input-label">Прикрепление файла</label><input type="file" style={{ fontSize: '0.875rem', color: '#4A6580', marginTop: '2px' }} /></div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <input type="checkbox" id="hconsent" style={{ marginTop: '3px', accentColor: '#2E7DF7', width: '15px', height: '15px' }} />
                  <label htmlFor="hconsent" style={{ fontSize: '0.8125rem', color: '#4A6580', cursor: 'pointer', lineHeight: 1.6 }}>
                    Согласен с обработкой персональных данных в соответствии с{' '}
                    <a href="/privacy" style={{ color: '#2E7DF7', textDecoration: 'underline', textUnderlineOffset: '2px' }}>политикой конфиденциальности</a>
                  </label>
                </div>
                <div><button type="submit" className="btn btn-primary" style={{ gap: '8px' }}>Отправить <ArrowRight size={15} /></button></div>
              </form>
            </div>

            {/* 14. КОНТАКТНАЯ ИНФОРМАЦИЯ */}
            <div>
              <div style={{ width: '32px', height: '2px', background: '#2E7DF7', borderRadius: '99px', marginBottom: '1.5rem' }} />
              <h3 style={{ fontSize: '1.1875rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '1rem', letterSpacing: '-0.01em' }}>
                Контактная информация
              </h3>
              <p style={{ color: '#4A6580', lineHeight: 1.7, marginBottom: '0.75rem', fontSize: '0.9375rem' }}>
                Вы можете связаться с нами по любым вопросам, связанным с оформлением займа, условиями или обслуживанием.
              </p>
              <p style={{ color: '#4A6580', lineHeight: 1.7, marginBottom: '2rem', fontSize: '0.875rem' }}>
                Служба поддержки работает в рабочие часы. Онлайн-заявки принимаются круглосуточно и обрабатываются автоматически.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  { icon: <MapPin size={15} />,  label: 'Адрес',   v: '18 Lower Baggot Street, Dublin 2, Ireland' },
                  { icon: <Mail size={15} />,    label: 'Email',   v: 'support@lumenbridge.example' },
                  { icon: <Phone size={15} />,   label: 'Телефон', v: '+353 1 531 8420' },
                ].map(({ icon, label, v }) => (
                  <div key={label} style={{ display: 'flex', gap: '1rem', padding: '1.125rem 0', borderBottom: '1px solid rgba(13,27,42,0.05)', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', background: '#F2F5F8', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E7DF7', flexShrink: 0 }}>
                      {icon}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#4A6580', fontWeight: 700, marginBottom: '2px' }}>{label}</p>
                      <p style={{ color: '#0D1B2A', fontWeight: 500, fontSize: '0.9375rem' }}>{v}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
