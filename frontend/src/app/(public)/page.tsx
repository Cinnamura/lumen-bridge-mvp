import Link from 'next/link';
import { LoanCalculator } from '@/features/loan-calculator/LoanCalculator';
import { HomeClient } from './HomeClient';
import {
  Shield, CheckCircle2, Clock, Lock, TrendingUp,
  ArrowRight, MapPin, Mail, Phone,
  FileText, Briefcase, Zap, RefreshCw,
} from 'lucide-react';

/* ─── Inline SVG area chart (static) ─── */
function TrendChart() {
  return (
    <svg width="100%" viewBox="0 0 260 72" fill="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#2E7DF7" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#2E7DF7" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M 0 65 C 35 60 55 50 85 40 C 115 30 138 34 175 18 C 205 8 232 5 260 3"
        stroke="#2E7DF7" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M 0 65 C 35 60 55 50 85 40 C 115 30 138 34 175 18 C 205 8 232 5 260 3 L 260 72 L 0 72 Z"
        fill="url(#tg)"/>
      <circle cx="260" cy="3" r="4" fill="#2E7DF7"/>
      <circle cx="260" cy="3" r="9" fill="#2E7DF7" fillOpacity="0.15"/>
    </svg>
  );
}

export default function HomePage() {
  return (
    <>
      {/* ══ HERO ══ */}
      <section style={{ background: '#0D1B2A', minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '6rem 32px 5rem', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle grid */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 18% 55%, rgba(46,125,247,0.08) 0%, transparent 55%), radial-gradient(circle at 78% 18%, rgba(46,125,247,0.05) 0%, transparent 45%)', pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)', backgroundSize: '64px 64px', pointerEvents: 'none', maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%,#000 30%,transparent 100%)' }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', position: 'relative' }}>
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '55fr 45fr', gap: '4rem', alignItems: 'center' }}>
            {/* Left */}
            <div className="anim-fade-up">
              {/* Pill badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(46,125,247,0.1)', border: '1px solid rgba(46,125,247,0.22)', borderRadius: '100px', padding: '5px 14px 5px 10px', marginBottom: '2rem' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#2E7DF7', display: 'block', boxShadow: '0 0 6px #2E7DF7' }} />
                <span style={{ fontSize: '0.6875rem', color: '#2E7DF7', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Быстрые займы в Европе
                </span>
              </div>

              <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(2.5rem,4.8vw,4.25rem)', color: '#fff', lineHeight: 1.08, marginBottom: '1.5rem', letterSpacing: '-0.025em' }}>
                Получите деньги тогда, когда это действительно нужно
              </h1>

              <p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.58)', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: '44ch' }}>
                Простые и прозрачные займы для частных лиц и бизнеса в Европе — быстрое решение и безопасное оформление.
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
                {['Без залога', 'Быстрое одобрение', 'На банковский счёт'].map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={13} color="rgba(46,125,247,0.75)" />
                    <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Calculator in dark card */}
            <div className="hero-calc anim-fade-up-1 bento-dark" style={{ padding: '2rem' }}>
              <LoanCalculator dark />
            </div>
          </div>
        </div>
      </section>

      {/* ══ STANDALONE CALCULATOR ══ */}
      <section style={{ background: '#F2F5F8', padding: '100px 32px' }}>
        <div style={{ maxWidth: '740px', margin: '0 auto' }}>
          <LoanCalculator />
        </div>
      </section>

      {/* ══ CONDITIONS — Bento grid 4 cols ══ */}
      <section style={{ background: '#fff', padding: '100px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.625rem' }}>Условия</p>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#0D1B2A', letterSpacing: '-0.02em' }}>Основные параметры</h2>
          </div>
          <div className="grid-4-resp" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem' }}>
            {[
              { label: 'Сумма', value: '500 — 50 000', unit: 'EUR' },
              { label: 'Срок',  value: '7 — 90',      unit: 'дней' },
              { label: 'Ставка', value: 'Индивидуально', unit: '' },
              { label: 'Погашение', value: 'Равными платежами', unit: '' },
            ].map((c, i) => (
              <div key={c.label} className={`bento-card reveal reveal-${i+1}`} style={{ textAlign: 'center', cursor: 'default' }}>
                <p style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.875rem' }}>{c.label}</p>
                <p style={{ fontFamily: 'var(--f-mono)', fontSize: '1.0625rem', fontWeight: 700, color: '#0D1B2A', letterSpacing: '-0.01em' }}>
                  {c.value}
                  {c.unit && <span style={{ fontSize: '0.8125rem', fontWeight: 400, color: '#4A6580', marginLeft: '4px' }}>{c.unit}</span>}
                </p>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8125rem', color: '#4A6580' }}>
            Итоговые условия определяются индивидуально после проверки клиента
          </p>
        </div>
        <HomeClient section="conditions" />
      </section>

      {/* ══ USE CASES — Bento asymmetric 2×2 ══ */}
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
              { icon: <Zap size={20} />,        title: 'Срочные расходы',  desc: 'Неожиданные платежи, которые нельзя перенести' },
              { icon: <Clock size={20} />,       title: 'Задержка дохода',  desc: 'Когда деньги нужны сейчас, а поступления позже' },
              { icon: <Briefcase size={20} />,   title: 'Бизнес-задачи',    desc: 'Кассовые разрывы или операционные расходы' },
              { icon: <TrendingUp size={20} />,  title: 'Возможности',      desc: 'Ситуации, где важно действовать без промедления' },
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

      {/* ══ HOW IT WORKS — numbered steps with connector ══ */}
      <section style={{ background: '#fff', padding: '100px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.625rem' }}>Процесс</p>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#0D1B2A', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
              Как всё происходит
            </h2>
            <p style={{ color: '#4A6580', maxWidth: '48ch', margin: '0 auto', lineHeight: 1.7, fontSize: '0.9375rem' }}>
              Оформление займа занимает несколько минут и полностью проходит онлайн
            </p>
          </div>
          <div className="grid-3-resp" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
            {[
              { n: '01', title: 'Регистрация',      desc: 'Введите номер телефона и подтвердите его SMS-кодом. Доступ к личному кабинету — сразу после.' },
              { n: '02', title: 'Заявка',            desc: 'Выберите сумму и срок, заполните данные и отправьте заявку на рассмотрение.' },
              { n: '03', title: 'Получение средств', desc: 'После одобрения подпишите договор онлайн. Деньги поступают на ваш банковский счёт.' },
            ].map((s, i) => (
              <div key={s.n} className={`bento-card reveal reveal-${i+1}`} style={{ cursor: 'default', position: 'relative' }}>
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

      {/* ══ TRANSPARENCY — dark, 2-col asymmetric ══ */}
      <section style={{ background: '#0D1B2A', padding: '100px 32px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', top: '-80px', right: '-80px', width: '480px', height: '480px', background: 'radial-gradient(circle,rgba(46,125,247,0.05) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'start' }} className="grid-2-resp">
            <div>
              <div style={{ width: '32px', height: '2px', background: '#2E7DF7', borderRadius: '99px', marginBottom: '1.5rem' }} />
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#fff', letterSpacing: '-0.02em', marginBottom: '1.25rem', lineHeight: 1.15 }}>
                Вы заранее знаете все условия
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, fontSize: '0.9375rem', marginBottom: '2rem' }}>
                Никаких сюрпризов после подписания. Полная стоимость займа отображается ещё до оформления.
              </p>
              <Link href="/apply" className="btn btn-primary" style={{ gap: '8px' }}>
                Подать заявку <ArrowRight size={15} />
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { icon: <Shield size={16} />,     t: 'Никаких скрытых комиссий', d: 'Полная стоимость займа известна до оформления' },
                { icon: <Clock size={16} />,      t: 'Быстрое рассмотрение',     d: 'Заявки обрабатываются в течение нескольких минут' },
                { icon: <Lock size={16} />,       t: 'Безопасность данных',       d: 'Ваши данные защищены современными технологиями' },
                { icon: <RefreshCw size={16} />,  t: 'Гибкое погашение',          d: 'Удобный срок, досрочное погашение без штрафов' },
                { icon: <TrendingUp size={16} />, t: 'Улучшение условий',         d: 'При повторных займах доступны более выгодные параметры' },
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

      {/* ══ ABOUT + STATS — Bento asymmetric ══ */}
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
              <p style={{ color: '#4A6580', lineHeight: 1.75, fontSize: '0.9375rem' }}>
                Мы работаем в соответствии с действующим законодательством и уделяем особое внимание защите данных клиентов и ответственному кредитованию.
              </p>
            </div>
            {/* Stats Bento */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { val: '500 EUR',  label: 'Минимальный займ' },
                { val: '90 дн.',   label: 'Максимальный срок' },
                { val: '0,8%',     label: 'Ставка в день' },
                { val: 'GDPR',     label: 'Соответствие стандарту' },
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

      {/* ══ CREDIT HISTORY — split with chart ══ */}
      <section style={{ background: '#F2F5F8', padding: '100px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }} className="grid-2-resp">
            <div>
              <div style={{ width: '32px', height: '2px', background: '#2E7DF7', borderRadius: '99px', marginBottom: '1.5rem' }} />
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#0D1B2A', letterSpacing: '-0.02em', marginBottom: '1.25rem', lineHeight: 1.15 }}>
                Займ — это не только деньги сейчас
              </h2>
              <p style={{ color: '#4A6580', lineHeight: 1.75, marginBottom: '2rem', fontSize: '0.9375rem' }}>
                Своевременное погашение помогает улучшить кредитный рейтинг и открывает доступ к более выгодным условиям.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
                {[
                  'Возможность начать с небольшой суммы',
                  'Формирование положительной кредитной истории',
                  'Улучшение условий при повторных обращениях',
                ].map(t => (
                  <div key={t} style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
                    <CheckCircle2 size={14} color="#2E7DF7" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.875rem', color: '#4A6580' }}>{t}</span>
                  </div>
                ))}
              </div>
              <Link href="/apply" className="btn btn-primary" style={{ gap: '8px' }}>
                Начать с небольшого займа <ArrowRight size={15} />
              </Link>
            </div>
            {/* Chart card */}
            <div className="bento-card" style={{ background: '#fff', cursor: 'default' }}>
              <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4A6580', marginBottom: '4px' }}>
                    Кредитный рейтинг
                  </p>
                  <p style={{ fontFamily: 'var(--f-mono)', fontSize: '2.25rem', fontWeight: 700, color: '#0D1B2A', letterSpacing: '-0.03em', lineHeight: 1 }}>
                    +124
                  </p>
                </div>
                <span style={{ background: 'rgba(30,138,94,0.1)', color: '#1E8A5E', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '99px', fontFamily: 'var(--f-mono)' }}>
                  +18% за месяц
                </span>
              </div>
              <TrendChart />
              <p style={{ fontSize: '0.8125rem', color: '#4A6580', marginTop: '1rem', lineHeight: 1.55 }}>
                Растёт с каждым своевременным платежом
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ BUSINESS — gold accent dark ══ */}
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

          <div className="grid-3-resp" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {[
              { icon: <TrendingUp size={18} />, title: '30 000 — 500 000 EUR', desc: 'Финансирование под задачи любого масштаба' },
              { icon: <Clock size={18} />,      title: '1 — 12 месяцев',       desc: 'Гибкие сроки под ваш бизнес-цикл' },
              { icon: <FileText size={18} />,   title: 'Без залога',            desc: 'В стандартных случаях залог не требуется' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bento-dark" style={{ cursor: 'default' }}>
                <div style={{ width: '38px', height: '38px', background: 'rgba(201,146,58,0.1)', borderRadius: '10px', border: '1px solid rgba(201,146,58,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9923A', marginBottom: '1rem' }}>
                  {icon}
                </div>
                <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '0.375rem', fontSize: '0.9375rem' }}>{title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', lineHeight: 1.6 }}>{desc}</p>
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

      {/* ══ COMPLIANCE — 4 cards ══ */}
      <section style={{ background: '#fff', padding: '72px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4A6580', marginBottom: '2.5rem' }}>
            Работаем прозрачно и в рамках закона
          </p>
          <div className="grid-4-resp" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem' }}>
            {[
              { icon: <Shield size={18} />,       t: 'Соответствие GDPR',    d: 'Европейские стандарты обработки данных' },
              { icon: <CheckCircle2 size={18} />, t: 'Ответственный подход', d: 'Тщательная проверка каждой заявки' },
              { icon: <Lock size={18} />,         t: 'Защита данных',         d: 'Многоуровневая безопасность' },
              { icon: <FileText size={18} />,     t: 'Чёткие условия',        d: 'Никакого мелкого шрифта' },
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

      {/* ══ FAQ PREVIEW ══ */}
      <HomeClient section="faq" />

      {/* ══ SECURITY ══ */}
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
          <p style={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, marginBottom: '1rem', fontSize: '0.9375rem' }}>
            Все операции выполняются через защищённые каналы в соответствии с применимым европейским законодательством. Используйте только официальный сайт.
          </p>
          <div style={{ background: 'rgba(192,57,43,0.07)', border: '1px solid rgba(192,57,43,0.18)', borderRadius: '12px', padding: '1.125rem 1.5rem', maxWidth: '520px', margin: '0 auto', textAlign: 'left', display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#C0392B', flexShrink: 0, marginTop: '5px' }} />
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', lineHeight: 1.65 }}>
              <strong style={{ color: 'rgba(255,255,255,0.82)', display: 'block', marginBottom: '4px' }}>Важно</strong>
              Мы не требуем предоплату и не запрашиваем конфиденциальные данные (пароли, CVV, PIN-коды) ни через какие каналы.
            </p>
          </div>
        </div>
      </section>

      {/* ══ CONTACT FORM ══ */}
      <section style={{ background: '#fff', padding: '100px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem' }} className="grid-2-resp">
            <div>
              <div style={{ width: '32px', height: '2px', background: '#2E7DF7', borderRadius: '99px', marginBottom: '1.5rem' }} />
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#0D1B2A', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                Свяжитесь с нами
              </h2>
              <p style={{ color: '#4A6580', lineHeight: 1.7, marginBottom: '2rem', fontSize: '0.9375rem' }}>
                Если у вас есть вопросы или нужна помощь — наша команда готова помочь в рабочие часы.
              </p>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><label className="input-label">Имя</label><input className="input" type="text" placeholder="Иван" /></div>
                  <div><label className="input-label">Email</label><input className="input" type="email" placeholder="ivan@example.com" /></div>
                </div>
                <div><label className="input-label">Телефон</label><input className="input" type="tel" placeholder="+353 1 531 8420" /></div>
                <div><label className="input-label">Сообщение</label><textarea className="input" rows={4} placeholder="Ваш вопрос..." style={{ resize: 'vertical' }} /></div>
                <div><label className="input-label">Прикрепить файл</label><input type="file" style={{ fontSize: '0.875rem', color: '#4A6580', marginTop: '2px' }} /></div>
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

            <div>
              <h3 style={{ fontSize: '1.1875rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '1rem', letterSpacing: '-0.01em' }}>Контактная информация</h3>
              <p style={{ color: '#4A6580', lineHeight: 1.7, marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                Служба поддержки работает в рабочие часы. Онлайн-заявки принимаются круглосуточно.
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
