import Link from 'next/link';
import Image from 'next/image';
import { LoanCalculator } from '@/features/loan-calculator/LoanCalculator';
import { HomeClient } from './HomeClient';
import {
  Shield, CheckCircle2, Clock, Lock, TrendingUp,
  ArrowRight, MapPin, Mail, Phone,
  FileText, Zap, RefreshCw,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   Ascending Liquidity Curve — «Вектор Ускорения».
   Плавная восходящая экспоненциальная кривая: градиент
   accent → серебро, растворение в технический пунктир,
   светящиеся узлы-транши с пульсацией. Без цифр и текста.
   ───────────────────────────────────────────────────────────── */
function AscendingCurve() {
  const W = 440;
  const H = 300;
  const pad = 32;

  // Экспоненциальная кривая роста: y = baseline - k*(e^(t*g) - 1)
  const x0 = pad;
  const x1 = W - pad;
  const yBottom = H - pad;
  const yTop = pad + 8;
  const g = 2.6; // крутизна экспоненты
  const denom = Math.exp(g) - 1;

  const px = (t: number) => x0 + t * (x1 - x0);
  const py = (t: number) => yBottom - ((Math.exp(t * g) - 1) / denom) * (yBottom - yTop);

  // Строим гладкий путь (Catmull-Rom → кубические Безье упрощённо через много точек)
  const steps = 48;
  const solidEnd = 0.78; // до этой доли — сплошная линия, дальше пунктир
  const solidPts: string[] = [];
  const dashPts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const point = `${px(t).toFixed(1)},${py(t).toFixed(1)}`;
    if (t <= solidEnd) solidPts.push(point);
    if (t >= solidEnd) dashPts.push(point);
  }

  // Площадь под сплошной частью
  const areaPath =
    `M ${px(0)},${yBottom} ` +
    solidPts.map(p => `L ${p}`).join(' ') +
    ` L ${px(solidEnd)},${yBottom} Z`;

  // Узлы-транши на ключевых долях
  const nodeTs = [0.22, 0.5, 0.74];

  // Вертикальные направляющие (едва заметная сетка)
  const guides = [0.25, 0.5, 0.75];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} fill="none" style={{ width: '100%', maxWidth: '440px', display: 'block' }} aria-hidden>
      <defs>
        <linearGradient id="ac-line" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%"   stopColor="#4A6580" stopOpacity="0.35" />
          <stop offset="55%"  stopColor="#2E7DF7" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#2E7DF7" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="ac-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#2E7DF7" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#2E7DF7" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Базовая ось */}
      <line x1={x0} y1={yBottom} x2={x1} y2={yBottom} stroke="rgba(74,101,128,0.18)" strokeWidth="1" />

      {/* Вертикальные направляющие */}
      {guides.map((t, i) => (
        <line key={`g${i}`} x1={px(t)} y1={yBottom} x2={px(t)} y2={py(t)}
          stroke="rgba(74,101,128,0.10)" strokeWidth="1" strokeDasharray="2 4" />
      ))}

      {/* Площадь под кривой */}
      <path d={areaPath} fill="url(#ac-area)" />

      {/* Сплошная часть кривой */}
      <polyline points={solidPts.join(' ')} fill="none"
        stroke="url(#ac-line)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Пунктирное растворение */}
      <polyline points={dashPts.join(' ')} fill="none"
        stroke="#2E7DF7" strokeOpacity="0.6" strokeWidth="1.5"
        strokeLinecap="round" strokeDasharray="1 6" />

      {/* Финальная стрелка-наконечник растворяется — лёгкий блик */}
      <circle cx={px(1)} cy={py(1)} r="3" fill="#2E7DF7" fillOpacity="0.5" />

      {/* Узлы-транши с пульсацией */}
      {nodeTs.map((t, i) => (
        <g key={`n${i}`}>
          <circle cx={px(t)} cy={py(t)} r="8" fill="#2E7DF7" fillOpacity="0.12" className="curve-pulse" style={{ animationDelay: `${i * 0.5}s` }} />
          <circle cx={px(t)} cy={py(t)} r="4" fill="#fff" stroke="#2E7DF7" strokeWidth="1.5" />
          <circle cx={px(t)} cy={py(t)} r="1.5" fill="#2E7DF7" />
        </g>
      ))}
    </svg>
  );
}

export default function HomePage() {
  return (
    <>
      {/* ══════════════════════════════════════════════
          1. HERO — SPLIT
          Текст слева, калькулятор справа.
          На мобильном: текст → калькулятор (одна колонка).
      ══════════════════════════════════════════════ */}
      <section style={{
        background: '#0D1B2A',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: 'clamp(5.5rem,10vw,7rem) 32px 4rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Атмосферный фон */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 55%, rgba(46,125,247,0.09) 0%, transparent 50%), radial-gradient(circle at 78% 20%, rgba(46,125,247,0.06) 0%, transparent 45%)', pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px)', backgroundSize: '64px 64px', pointerEvents: 'none', maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%,#000 30%,transparent 100%)' }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', position: 'relative' }}>
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '55fr 45fr', gap: '3.5rem', alignItems: 'center' }}>

            {/* Левая колонка */}
            <div className="anim-fade-up">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(46,125,247,0.1)', border: '1px solid rgba(46,125,247,0.22)', borderRadius: '9999px', padding: '5px 14px 5px 10px', marginBottom: '1.75rem' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#2E7DF7', display: 'block', boxShadow: '0 0 8px rgba(46,125,247,0.8)' }} />
                <span style={{ fontSize: '0.6875rem', color: '#2E7DF7', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Быстрые займы в Европе
                </span>
              </div>

              <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(2.25rem,4.5vw,4rem)', color: '#fff', lineHeight: 1.08, marginBottom: '1.125rem', letterSpacing: '-0.025em' }}>
                Получите деньги тогда, когда это действительно нужно
              </h1>

              <p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: '0.625rem', maxWidth: '48ch' }}>
                Простые и прозрачные займы для частных лиц и бизнеса в Европе — быстрое решение и безопасное оформление
              </p>
              <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.42)', lineHeight: 1.7, marginBottom: '1.875rem', maxWidth: '48ch' }}>
                Неожиданные расходы или срочные возможности не должны вас останавливать.
                Сервис помогает быстро получить финансирование — без сложных процедур и скрытых условий.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
                <Link href="/apply" className="btn btn-primary btn-lg" style={{ gap: '8px' }}>
                  Получить займ <ArrowRight size={16} />
                </Link>
                <Link href="/how-it-works" className="btn btn-ghost btn-lg">
                  Как это работает
                </Link>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                {['Без залога', 'Быстрое одобрение', 'Выплата на банковский счёт'].map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={13} color="rgba(46,125,247,0.75)" />
                    <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.38)', fontWeight: 500 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Правая колонка — калькулятор поверх calculator_bg */}
            <div className="hero-calc anim-fade-up-1" style={{ position: 'relative' }}>
              {/* Фоновая текстура (вертикальная 3:4), мягкая глубина под слайдерами */}
              <div aria-hidden style={{
                position: 'absolute', inset: 0,
                zIndex: 0,
                pointerEvents: 'none',
                borderRadius: '20px',
                overflow: 'hidden',
              }}>
                <Image
                  src="/images/calculator_bg.png"
                  alt=""
                  fill
                  sizes="(max-width:1023px) 0px, 520px"
                  style={{ objectFit: 'cover', objectPosition: 'center', opacity: 0.4, mixBlendMode: 'screen' }}
                  priority
                />
              </div>
              {/* Карточка калькулятора */}
              <div className="bento-dark" style={{ position: 'relative', zIndex: 1, padding: '2rem', background: 'rgba(13,27,42,0.55)' }}>
                <LoanCalculator dark />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          3. ОСНОВНЫЕ УСЛОВИЯ
      ══════════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '72px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.5rem' }}>Условия</p>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#0D1B2A', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
              Основные условия
            </h2>
            <p style={{ color: '#4A6580', lineHeight: 1.7, fontSize: '0.9375rem', maxWidth: '52ch', margin: '0 auto' }}>
              Итоговые условия зависят от результатов проверки клиента и предоставленных данных.
            </p>
          </div>

          {/* Bento-сетка условий: асимметрия + контрастные акценты */}
          <div className="bento-conditions" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gridAutoRows: '1fr', gap: '1.25rem' }}>
            {/* Сумма — крупная карточка на тёмном фоне, 2 колонки */}
            <div className="bento-card reveal reveal-1 bento-span-2" style={{ gridColumn: 'span 2', cursor: 'default', background: '#0D1B2A', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.75rem' }}>Сумма</p>
              <p style={{ fontFamily: 'var(--f-mono)', fontSize: 'clamp(1.375rem,2.5vw,1.875rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                от 500 до 50 000 <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.7em' }}>EUR</span>
              </p>
            </div>

            {/* Срок — стандартная белая */}
            <div className="bento-card reveal reveal-2" style={{ cursor: 'default', background: '#fff', border: '1px solid rgba(232,236,240,0.7)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.625rem' }}>Срок</p>
              <p style={{ fontFamily: 'var(--f-mono)', fontSize: '1rem', fontWeight: 700, color: '#0D1B2A', letterSpacing: '-0.01em', lineHeight: 1.4 }}>от 7 до 90 дней</p>
            </div>

            {/* Погашение — стандартная белая */}
            <div className="bento-card reveal reveal-3" style={{ cursor: 'default', background: '#fff', border: '1px solid rgba(232,236,240,0.7)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.625rem' }}>Погашение</p>
              <p style={{ fontFamily: 'var(--f-mono)', fontSize: '1rem', fontWeight: 700, color: '#0D1B2A', letterSpacing: '-0.01em', lineHeight: 1.4 }}>равными платежами</p>
            </div>

            {/* Процентная ставка — вытянутая на сером фоне, 4 колонки */}
            <div className="bento-card reveal reveal-4 bento-span-4" style={{ gridColumn: 'span 4', cursor: 'default', background: '#E8ECF0', border: '1px solid rgba(13,27,42,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <p style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.375rem' }}>Процентная ставка</p>
                <p style={{ fontFamily: 'var(--f-mono)', fontSize: '1.0625rem', fontWeight: 700, color: '#0D1B2A', letterSpacing: '-0.01em' }}>определяется индивидуально</p>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#4A6580', maxWidth: '40ch', lineHeight: 1.55 }}>
                Точные условия формируются после анализа заявки и зависят от профиля клиента.
              </p>
            </div>
          </div>
        </div>
        <HomeClient section="conditions" />
      </section>

      {/* ══════════════════════════════════════════════
          4. КОГДА ДЕНЬГИ НУЖНЫ СЕЙЧАС
      ══════════════════════════════════════════════ */}
      <section style={{ background: '#E8ECF0', padding: '72px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'end', marginBottom: '2.5rem' }} className="grid-2-resp">
            <div>
              <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.5rem' }}>Применение</p>
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#0D1B2A', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                Когда деньги нужны сейчас
              </h2>
            </div>
            <p style={{ color: '#4A6580', lineHeight: 1.75, fontSize: '0.9375rem' }}>
              Не все финансовые вопросы можно отложить. Иногда важно принять решение быстро — без сложных процедур и ожиданий.
            </p>
          </div>
          <div className="bento-usecases" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gridAutoRows: '1fr', gap: '1.25rem' }}>
            {/* Срочные расходы — большая акцентная тёмная, 2 колонки + 2 ряда */}
            <div className="bento-card reveal reveal-1 bento-feature" style={{ gridColumn: 'span 2', gridRow: 'span 2', cursor: 'default', background: '#0D1B2A', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '240px' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(46,125,247,0.15)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E7DF7' }}>
                <Zap size={24} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '1.5rem', fontWeight: 400, color: '#fff', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>Срочные расходы</h3>
                <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, maxWidth: '32ch' }}>Неожиданные платежи, которые нельзя перенести</p>
              </div>
            </div>

            {/* Задержка дохода — стандартная белая */}
            <div className="bento-card reveal reveal-2" style={{ cursor: 'default', background: '#fff', border: '1px solid rgba(232,236,240,0.7)' }}>
              <div style={{ width: '42px', height: '42px', background: 'rgba(46,125,247,0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E7DF7', marginBottom: '1rem' }}>
                <Clock size={20} />
              </div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.375rem' }}>Задержка дохода</h3>
              <p style={{ fontSize: '0.875rem', color: '#4A6580', lineHeight: 1.65 }}>Когда деньги нужны сейчас, а поступления позже</p>
            </div>

            {/* Бизнес-задачи — стандартная белая */}
            <div className="bento-card reveal reveal-3" style={{ cursor: 'default', background: '#fff', border: '1px solid rgba(232,236,240,0.7)' }}>
              <div style={{ width: '42px', height: '42px', background: 'rgba(46,125,247,0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E7DF7', marginBottom: '1rem' }}>
                <FileText size={20} />
              </div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.375rem' }}>Бизнес-задачи</h3>
              <p style={{ fontSize: '0.875rem', color: '#4A6580', lineHeight: 1.65 }}>Кассовые разрывы или операционные расходы</p>
            </div>

            {/* Возможности — серая вытянутая на 2 колонки */}
            <div className="bento-card reveal reveal-4 bento-span-2" style={{ gridColumn: 'span 2', cursor: 'default', background: '#E8ECF0', border: '1px solid rgba(13,27,42,0.06)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '42px', height: '42px', background: 'rgba(46,125,247,0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E7DF7', flexShrink: 0 }}>
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.25rem' }}>Возможности</h3>
                <p style={{ fontSize: '0.875rem', color: '#4A6580', lineHeight: 1.6 }}>Ситуации, где важно действовать без промедления</p>
              </div>
            </div>
          </div>
        </div>
        <HomeClient section="usecases" />
      </section>

      {/* ══════════════════════════════════════════════
          5. КАК ЭТО РАБОТАЕТ
      ══════════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '72px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.5rem' }}>Процесс</p>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#0D1B2A', letterSpacing: '-0.02em', marginBottom: '0.625rem' }}>
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
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: '2.25rem', fontWeight: 700, color: '#2E7DF7', marginBottom: '0.875rem', letterSpacing: '-0.02em', opacity: 0.8 }}>
                  {s.n}
                </div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>{s.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#4A6580', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <HomeClient section="steps" />
      </section>

      {/* ══════════════════════════════════════════════
          6. ПРОЗРАЧНЫЕ УСЛОВИЯ
      ══════════════════════════════════════════════ */}
      <section style={{ background: '#0D1B2A', padding: '72px 32px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', top: '-80px', right: '-80px', width: '480px', height: '480px', background: 'radial-gradient(circle,rgba(46,125,247,0.05) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }} className="grid-2-resp">
            <div>
              <div style={{ width: '32px', height: '2px', background: '#2E7DF7', borderRadius: '99px', marginBottom: '1.25rem' }} />
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#fff', letterSpacing: '-0.02em', marginBottom: '1.25rem', lineHeight: 1.15 }}>
                Вы заранее знаете все условия
              </h2>
              <Link href="/apply" className="btn btn-primary" style={{ gap: '8px' }}>
                Подать заявку <ArrowRight size={15} />
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                { icon: <Shield size={16} />,     t: 'Никаких скрытых комиссий',    d: 'Полная стоимость займа известна до оформления' },
                { icon: <Clock size={16} />,      t: 'Быстрое рассмотрение',         d: 'Заявки обрабатываются в течение нескольких минут' },
                { icon: <Lock size={16} />,       t: 'Безопасность данных',           d: 'Ваши данные защищены современными технологиями' },
                { icon: <RefreshCw size={16} />,  t: 'Гибкое погашение',              d: 'Выбирайте удобный срок и погашайте без лишнего давления' },
                { icon: <TrendingUp size={16} />, t: 'Улучшение условий со временем', d: 'При повторных займах могут быть доступны более выгодные параметры и увеличенный лимит' },
              ].map(({ icon, t, d }) => (
                <div key={t} className="bento-dark" style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start', padding: '0.875rem 1rem' }}>
                  <div style={{ width: '30px', height: '30px', background: 'rgba(46,125,247,0.12)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E7DF7', flexShrink: 0 }}>
                    {icon}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, color: 'rgba(255,255,255,0.88)', marginBottom: '0.15rem', fontSize: '0.875rem' }}>{t}</p>
                    <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.38)', lineHeight: 1.5 }}>{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          7. О КОМПАНИИ
      ══════════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '72px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '4rem', alignItems: 'center' }} className="grid-2-resp">
            <div>
              <div style={{ width: '32px', height: '2px', background: '#2E7DF7', borderRadius: '99px', marginBottom: '1.25rem' }} />
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#0D1B2A', letterSpacing: '-0.02em', marginBottom: '1.25rem', lineHeight: 1.15 }}>
                О LumenBridge Finance Ltd
              </h2>
              <p style={{ color: '#4A6580', lineHeight: 1.75, marginBottom: '0.875rem', fontSize: '0.9375rem' }}>
                LumenBridge Finance Ltd — финансовая организация, предоставляющая быстрые и доступные решения в сфере кредитования в Европе.
              </p>
              <p style={{ color: '#4A6580', lineHeight: 1.75, marginBottom: '0.875rem', fontSize: '0.9375rem' }}>
                Наша цель — упростить доступ к финансированию за счёт прозрачных условий и современных технологий.
              </p>
              <p style={{ color: '#4A6580', lineHeight: 1.75, fontSize: '0.9375rem' }}>
                Мы работаем в соответствии с действующим законодательством и уделяем особое внимание защите данных клиентов и ответственному кредитованию.
              </p>
            </div>
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

      {/* ══════════════════════════════════════════════
          8. УЛУЧШЕНИЕ КРЕДИТНОЙ ИСТОРИИ
      ══════════════════════════════════════════════ */}
      <section style={{ background: '#E8ECF0', padding: '72px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }} className="grid-2-resp">
            <div>
              <div style={{ width: '32px', height: '2px', background: '#2E7DF7', borderRadius: '99px', marginBottom: '1.25rem' }} />
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#0D1B2A', letterSpacing: '-0.02em', marginBottom: '1rem', lineHeight: 1.15 }}>
                Займ — это не только деньги сейчас
              </h2>
              <p style={{ color: '#4A6580', lineHeight: 1.75, marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
                Своевременное погашение займа помогает улучшить кредитный рейтинг и открывает доступ к более выгодным условиям в будущем.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '2rem' }}>
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
            {/* Ascending liquidity curve — вектор ускорения */}
            <div className="bento-card" style={{ background: '#fff', cursor: 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', minHeight: '260px' }}>
              <AscendingCurve />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          9. ДЛЯ БИЗНЕСА — Editorial layout
          fintech_photography — едва заметный фон секции
      ══════════════════════════════════════════════ */}
      <section style={{ background: '#0D1B2A', padding: '72px 32px', position: 'relative', overflow: 'hidden' }}>
        {/* Едва заметный полноэкранный фон */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <Image
            src="/images/fintech_photography.png"
            alt=""
            fill
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center', opacity: 0.06, mixBlendMode: 'luminosity' }}
          />
        </div>
        <div aria-hidden style={{ position: 'absolute', top: '-120px', right: '-120px', width: '600px', height: '600px', background: 'radial-gradient(circle,rgba(201,146,58,0.07) 0%,transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Журнальный асимметричный layout: текст доминирует (7fr / 5fr) */}
          <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '4rem', alignItems: 'center' }} className="grid-2-resp">
            {/* Левая: текст */}
            <div>
              <div style={{ width: '32px', height: '2px', background: '#C9923A', borderRadius: '99px', marginBottom: '1.25rem' }} />
              <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C9923A', marginBottom: '0.625rem' }}>
                Для бизнеса
              </p>
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.875rem', lineHeight: 1.15 }}>
                Финансирование для бизнеса
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, fontSize: '0.9375rem', marginBottom: '1.75rem' }}>
                Решения для компаний и предпринимателей, которым важна скорость и предсказуемость.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
                {[
                  'Займы от 30 000 до 500 000 EUR',
                  'Срок: от 1 до 12 месяцев',
                  'Без залога',
                  'Быстрое рассмотрение',
                  'Подходит для малого и среднего бизнеса',
                ].map(val => (
                  <div key={val} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <CheckCircle2 size={14} color="#C9923A" style={{ flexShrink: 0 }} />
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 500 }}>{val}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: 'rgba(201,146,58,0.07)', border: '1px solid rgba(201,146,58,0.18)', borderRadius: '12px', padding: '0.875rem 1.125rem', marginBottom: '1.75rem', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C9923A', flexShrink: 0, marginTop: '6px' }} />
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', lineHeight: 1.65 }}>
                  На данный момент заявки принимаются через форму обратной связи. Онлайн-кабинет для бизнеса будет доступен позже.
                </p>
              </div>
              <Link href="/contacts" className="btn btn-primary btn-lg" style={{ gap: '8px' }}>
                Оставить заявку <ArrowRight size={16} />
              </Link>
            </div>

            {/* Правая: business_handshake */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                position: 'relative',
                width: '100%',
                maxHeight: '360px',
                aspectRatio: '16/10',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(13,27,42,0.3), 0 16px 48px rgba(13,27,42,0.4)',
                border: '1px solid rgba(232,236,240,0.3)',
              }}>
                <Image
                  src="/images/business_handshake.png"
                  alt=""
                  fill
                  sizes="(max-width:767px) 100vw, 500px"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          10. БЛОК ДОВЕРИЯ
      ══════════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '64px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontFamily: 'var(--f-display)', fontSize: 'clamp(1.5rem,2.5vw,2rem)', color: '#0D1B2A', letterSpacing: '-0.02em', marginBottom: '2rem' }}>
            Работаем прозрачно и в рамках закона
          </h2>
          <div className="grid-4-resp" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem' }}>
            {[
              { icon: <Shield size={18} />,       t: 'Соответствие требованиям GDPR',       d: 'Европейские стандарты обработки данных' },
              { icon: <CheckCircle2 size={18} />, t: 'Ответственный подход к проверке заявок', d: 'Тщательный анализ каждого обращения' },
              { icon: <Lock size={18} />,         t: 'Защита персональных данных',             d: 'Многоуровневая безопасность' },
              { icon: <FileText size={18} />,     t: 'Чёткие и понятные условия',              d: 'Никакого мелкого шрифта' },
            ].map(({ icon, t, d }, i) => (
              <div key={t} className={`bento-card reveal reveal-${i+1}`} style={{ cursor: 'default' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(46,125,247,0.07)', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E7DF7', marginBottom: '0.875rem' }}>
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

      {/* ══════════════════════════════════════════════
          11. FAQ ПРЕВЬЮ
      ══════════════════════════════════════════════ */}
      <HomeClient section="faq" />

      {/* ══════════════════════════════════════════════
          12. БЕЗОПАСНОСТЬ КЛИЕНТОВ
      ══════════════════════════════════════════════ */}
      <section style={{ background: '#0D1B2A', padding: '72px 32px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <div style={{ width: '52px', height: '52px', background: 'rgba(46,125,247,0.1)', borderRadius: '14px', border: '1px solid rgba(46,125,247,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={24} color="#2E7DF7" />
            </div>
          </div>
          <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#fff', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Безопасность клиентов
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: '0.875rem', fontSize: '0.9375rem' }}>
            Мы уделяем особое внимание защите данных и безопасности наших клиентов. Все операции выполняются через защищённые каналы, а обработка информации осуществляется в соответствии с применимым европейским законодательством.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: '0.5rem', fontSize: '0.9375rem' }}>
            Мы не требуем предоплату и не запрашиваем конфиденциальные данные.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, fontSize: '0.9375rem' }}>
            Используйте только официальный сайт и проверенные контактные данные компании при взаимодействии с сервисом.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          13. ОБРАТНАЯ СВЯЗЬ / 14. КОНТАКТЫ
      ══════════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '72px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem' }} className="grid-2-resp">
            <div>
              <div style={{ width: '32px', height: '2px', background: '#2E7DF7', borderRadius: '99px', marginBottom: '1.25rem' }} />
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#0D1B2A', letterSpacing: '-0.02em', marginBottom: '0.625rem' }}>
                Свяжитесь с нами
              </h2>
              <p style={{ color: '#4A6580', lineHeight: 1.7, marginBottom: '1.75rem', fontSize: '0.9375rem' }}>
                Если у вас есть вопросы или вам нужна помощь — наша команда готова помочь.
              </p>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
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
                <div>
                  <button type="submit" className="btn btn-primary" style={{ gap: '8px' }}>Отправить <ArrowRight size={15} /></button>
                </div>
              </form>
            </div>

            <div>
              <div style={{ width: '32px', height: '2px', background: '#2E7DF7', borderRadius: '99px', marginBottom: '1.25rem' }} />
              <h3 style={{ fontSize: '1.1875rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.875rem', letterSpacing: '-0.01em' }}>
                Контактная информация
              </h3>
              <p style={{ color: '#4A6580', lineHeight: 1.7, marginBottom: '0.75rem', fontSize: '0.9375rem' }}>
                Вы можете связаться с нами по любым вопросам, связанным с оформлением займа, условиями или обслуживанием.
              </p>
              <p style={{ color: '#4A6580', lineHeight: 1.7, marginBottom: '1.75rem', fontSize: '0.875rem' }}>
                Служба поддержки работает в рабочие часы. Онлайн-заявки принимаются круглосуточно и обрабатываются автоматически.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  { icon: <MapPin size={15} />,  label: 'Адрес',   v: '18 Lower Baggot Street, Dublin 2, Ireland' },
                  { icon: <Mail size={15} />,    label: 'Email',   v: 'support@lumenbridge.example' },
                  { icon: <Phone size={15} />,   label: 'Телефон', v: '+353 1 531 8420' },
                ].map(({ icon, label, v }) => (
                  <div key={label} style={{ display: 'flex', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid rgba(13,27,42,0.05)', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', background: '#E8ECF0', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E7DF7', flexShrink: 0 }}>
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
