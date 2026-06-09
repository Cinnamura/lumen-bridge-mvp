'use client';
import Link from 'next/link';
import { useState } from 'react';
import { LoanCalculator } from '@/features/loan-calculator/LoanCalculator';
import {
  Shield, CheckCircle2, Clock, Lock, TrendingUp,
  ArrowRight, ChevronDown, MapPin, Mail, Phone,
  FileText, Briefcase, Zap, RefreshCw,
} from 'lucide-react';

/* ─── Animated FAQ Accordion ─── */
function Faq({ q, a }: { q: string; a: string }) {
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

/* ─── Feature card for "когда деньги нужны" ─── */
function UseCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'default' }}>
      <div style={{ width: '44px', height: '44px', background: 'rgba(46,125,247,0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E7DF7', flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.375rem' }}>{title}</h3>
        <p style={{ fontSize: '0.875rem', color: '#4A6580', lineHeight: 1.65 }}>{desc}</p>
      </div>
    </div>
  );
}

/* ─── Trust item ─── */
function TrustItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
      <div style={{ width: '36px', height: '36px', background: 'rgba(46,125,247,0.12)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E7DF7', flexShrink: 0, marginTop: '2px' }}>
        {icon}
      </div>
      <div>
        <p style={{ fontWeight: 600, color: 'rgba(255,255,255,0.92)', marginBottom: '0.25rem', fontSize: '0.9375rem' }}>{title}</p>
        <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.55 }}>{desc}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* ══════════════════════════════════════
          HERO — fullscreen dark
      ══════════════════════════════════════ */}
      <section style={{ background: '#0D1B2A', minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '5rem 32px', position: 'relative', overflow: 'hidden' }}>
        {/* Background grid decoration */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(46,125,247,0.07) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(46,125,247,0.05) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%,#000 40%,transparent 100%)' }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', position: 'relative' }}>
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '6fr 4fr', gap: '5rem', alignItems: 'center' }}>

            {/* Left */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(46,125,247,0.1)', border: '1px solid rgba(46,125,247,0.2)', borderRadius: '100px', padding: '5px 14px', marginBottom: '2rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2E7DF7', display: 'block' }} />
                <span style={{ fontSize: '0.75rem', color: '#2E7DF7', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Быстрые займы в Европе
                </span>
              </div>

              <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(2.5rem,5vw,4rem)', color: '#fff', lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                Получите деньги тогда, когда это действительно нужно
              </h1>

              <p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: '46ch' }}>
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

              {/* Trust row */}
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                {['Без залога', 'Быстрое одобрение', 'На банковский счёт'].map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} color="rgba(46,125,247,0.8)" />
                    <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Calculator */}
            <div className="hero-calc card-dark" style={{ padding: '2rem' }}>
              <LoanCalculator dark />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CALCULATOR — standalone section
      ══════════════════════════════════════ */}
      <section style={{ background: '#F2F5F8', padding: '100px 32px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <LoanCalculator />
        </div>
      </section>

      {/* ══════════════════════════════════════
          CONDITIONS — 4 cards
      ══════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '100px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.75rem' }}>Условия</p>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#0D1B2A', letterSpacing: '-0.01em', marginBottom: '0.75rem' }}>
              Основные параметры
            </h2>
            <p style={{ color: '#4A6580', maxWidth: '44ch', margin: '0 auto', lineHeight: 1.65 }}>
              Итоговые условия определяются индивидуально после проверки клиента
            </p>
          </div>
          <div className="grid-4-resp" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem' }}>
            {[
              { label: 'Сумма', value: '500 — 50 000', unit: 'EUR' },
              { label: 'Срок',  value: '7 — 90',      unit: 'дней' },
              { label: 'Ставка', value: 'Индивидуально', unit: '' },
              { label: 'Погашение', value: 'Равными платежами', unit: '' },
            ].map(({ label, value, unit }) => (
              <div key={label} className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem', cursor: 'default' }}>
                <p style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '1rem' }}>{label}</p>
                <p style={{ fontFamily: 'var(--f-mono)', fontSize: '1.125rem', fontWeight: 700, color: '#0D1B2A', letterSpacing: '-0.01em' }}>
                  {value}
                  {unit && <span style={{ fontSize: '0.875rem', fontWeight: 400, color: '#4A6580', marginLeft: '4px' }}>{unit}</span>}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          USE CASES — when you need money
      ══════════════════════════════════════ */}
      <section style={{ background: '#F2F5F8', padding: '100px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.75rem' }}>Применение</p>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#0D1B2A', letterSpacing: '-0.01em', marginBottom: '0.75rem' }}>
              Когда деньги нужны сейчас
            </h2>
            <p style={{ color: '#4A6580', maxWidth: '50ch', margin: '0 auto', lineHeight: 1.65 }}>
              Не все финансовые вопросы можно отложить. Иногда важно принять решение быстро — без сложных процедур и ожиданий.
            </p>
          </div>
          <div className="grid-4-resp" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem' }}>
            <UseCard icon={<Zap size={20} />}      title="Срочные расходы"  desc="Неожиданные платежи, которые нельзя перенести" />
            <UseCard icon={<Clock size={20} />}     title="Задержка дохода"  desc="Когда деньги нужны сейчас, а поступления позже" />
            <UseCard icon={<Briefcase size={20} />} title="Бизнес-задачи"    desc="Кассовые разрывы или операционные расходы" />
            <UseCard icon={<TrendingUp size={20} />} title="Возможности"     desc="Ситуации, где важно действовать без промедления" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS — 3 steps
      ══════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '100px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.75rem' }}>Процесс</p>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#0D1B2A', letterSpacing: '-0.01em', marginBottom: '0.75rem' }}>
              Как всё происходит
            </h2>
            <p style={{ color: '#4A6580', maxWidth: '50ch', margin: '0 auto', lineHeight: 1.65 }}>
              Оформление займа занимает несколько минут и полностью проходит онлайн
            </p>
          </div>
          <div className="grid-3-resp" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2rem', position: 'relative' }}>
            {[
              { n: '01', title: 'Регистрация', desc: 'Введите номер телефона и подтвердите его SMS-кодом. Доступ к личному кабинету — сразу после.' },
              { n: '02', title: 'Заявка', desc: 'Выберите сумму и срок займа, заполните данные и отправьте заявку на рассмотрение.' },
              { n: '03', title: 'Получение средств', desc: 'После одобрения подпишите договор онлайн. Деньги поступают на ваш банковский счёт.' },
            ].map(({ n, title, desc }, i) => (
              <div key={n} style={{ position: 'relative' }}>
                {/* Connector line */}
                {i < 2 && (
                  <div aria-hidden style={{ position: 'absolute', top: '20px', left: 'calc(100% - 1rem)', width: '2rem', height: '1px', background: 'linear-gradient(to right,rgba(46,125,247,0.3),rgba(46,125,247,0.05))', zIndex: 0 }} className="hdr-desktop" />
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(46,125,247,0.08)', border: '1px solid rgba(46,125,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-mono)', fontSize: '0.75rem', fontWeight: 700, color: '#2E7DF7', flexShrink: 0 }}>
                      {n}
                    </div>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.5rem' }}>{title}</h3>
                    <p style={{ fontSize: '0.9rem', color: '#4A6580', lineHeight: 1.7 }}>{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TRANSPARENCY — dark section with trust items
      ══════════════════════════════════════ */}
      <section style={{ background: '#0D1B2A', padding: '100px 32px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', top: 0, right: 0, width: '600px', height: '600px', background: 'radial-gradient(circle,rgba(46,125,247,0.04) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <div style={{ maxWidth: '520px', marginBottom: '3.5rem' }}>
            <div className="divider" />
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#fff', letterSpacing: '-0.01em', marginBottom: '1rem' }}>
              Вы заранее знаете все условия
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, fontSize: '0.9375rem' }}>
              Никаких сюрпризов после подписания. Полная стоимость займа отображается ещё до оформления.
            </p>
          </div>
          <div className="grid-2-resp" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1.5rem', maxWidth: '820px' }}>
            <TrustItem icon={<Shield size={18} />}     title="Никаких скрытых комиссий" desc="Полная стоимость займа известна до оформления" />
            <TrustItem icon={<Clock size={18} />}      title="Быстрое рассмотрение"      desc="Заявки обрабатываются в течение нескольких минут" />
            <TrustItem icon={<Lock size={18} />}       title="Безопасность данных"        desc="Ваши данные защищены современными технологиями" />
            <TrustItem icon={<RefreshCw size={18} />}  title="Гибкое погашение"           desc="Удобный срок, досрочное погашение без штрафов" />
            <TrustItem icon={<TrendingUp size={18} />} title="Улучшение условий"          desc="При повторных займах доступны более выгодные параметры" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          ABOUT
      ══════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '100px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="grid-2-resp" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <div>
              <div className="divider" />
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#0D1B2A', letterSpacing: '-0.01em', marginBottom: '1.5rem' }}>
                О LumenBridge Finance Ltd
              </h2>
              <p style={{ color: '#4A6580', lineHeight: 1.75, marginBottom: '1rem', fontSize: '0.9375rem' }}>
                LumenBridge Finance Ltd — финансовая организация, предоставляющая быстрые и доступные решения в сфере кредитования в Европе.
              </p>
              <p style={{ color: '#4A6580', lineHeight: 1.75, fontSize: '0.9375rem' }}>
                Мы работаем в соответствии с действующим законодательством и уделяем особое внимание защите данных клиентов и ответственному кредитованию.
              </p>
            </div>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              {[
                { val: '500€',   label: 'Минимальный займ' },
                { val: '90',     label: 'Дней — максимальный срок' },
                { val: '0,8%',   label: 'Ставка в день' },
                { val: 'GDPR',   label: 'Соответствие стандарту' },
              ].map(({ val, label }) => (
                <div key={label} style={{ background: '#F2F5F8', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(13,27,42,0.05)' }}>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: '1.75rem', fontWeight: 700, color: '#0D1B2A', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>{val}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#4A6580', lineHeight: 1.5 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CREDIT HISTORY
      ══════════════════════════════════════ */}
      <section style={{ background: '#F2F5F8', padding: '100px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="grid-2-resp" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <div>
              <div className="divider" />
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#0D1B2A', letterSpacing: '-0.01em', marginBottom: '1.25rem' }}>
                Займ — это не только деньги сейчас
              </h2>
              <p style={{ color: '#4A6580', lineHeight: 1.75, marginBottom: '2rem', fontSize: '0.9375rem' }}>
                Своевременное погашение займа помогает улучшить кредитный рейтинг и открывает доступ к более выгодным условиям в будущем.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2.5rem' }}>
                {[
                  'Возможность начать с небольшой суммы',
                  'Формирование положительной кредитной истории',
                  'Улучшение условий при повторных обращениях',
                ].map(t => (
                  <div key={t} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(46,125,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CheckCircle2 size={12} color="#2E7DF7" />
                    </div>
                    <span style={{ fontSize: '0.875rem', color: '#4A6580', lineHeight: 1.5 }}>{t}</span>
                  </div>
                ))}
              </div>
              <Link href="/apply" className="btn btn-primary">
                Начать с небольшого займа <ArrowRight size={16} />
              </Link>
            </div>

            {/* Trend chart card */}
            <div style={{ background: '#fff', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 1px 3px rgba(13,27,42,0.05), 0 8px 32px rgba(13,27,42,0.08)', border: '1px solid rgba(13,27,42,0.05)' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.75rem', color: '#4A6580', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Кредитный рейтинг</p>
                <p style={{ fontFamily: 'var(--f-mono)', fontSize: '2rem', fontWeight: 700, color: '#0D1B2A' }}>+124</p>
              </div>
              <svg width="100%" viewBox="0 0 260 80" fill="none" style={{ display: 'block' }}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#2E7DF7" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#2E7DF7" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M 0 70 C 40 65 60 55 90 45 C 120 35 140 38 180 22 C 210 12 235 8 260 4" stroke="#2E7DF7" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M 0 70 C 40 65 60 55 90 45 C 120 35 140 38 180 22 C 210 12 235 8 260 4 L 260 80 L 0 80 Z" fill="url(#grad)" />
                <circle cx="260" cy="4" r="4" fill="#2E7DF7" />
                <circle cx="260" cy="4" r="8" fill="#2E7DF7" fillOpacity="0.2" />
              </svg>
              <p style={{ fontSize: '0.8125rem', color: '#4A6580', marginTop: '1rem', lineHeight: 1.5 }}>
                Растёт с каждым своевременным платежом
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BUSINESS — gold accent
      ══════════════════════════════════════ */}
      <section style={{ background: '#0D1B2A', padding: '100px 32px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle,rgba(201,146,58,0.06) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <div style={{ maxWidth: '600px', marginBottom: '3.5rem' }}>
            <div className="divider divider-gold" />
            <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C9923A', marginBottom: '0.75rem' }}>
              Для бизнеса
            </p>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#fff', letterSpacing: '-0.01em', marginBottom: '1rem' }}>
              Финансирование для бизнеса
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, fontSize: '0.9375rem' }}>
              Решения для компаний и предпринимателей, которым важна скорость и предсказуемость.
            </p>
          </div>

          <div className="grid-3-resp" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {[
              { icon: <TrendingUp size={20} />, title: '30 000 — 500 000 EUR', desc: 'Финансирование под задачи любого масштаба' },
              { icon: <Clock size={20} />,      title: '1 — 12 месяцев',       desc: 'Гибкие сроки под ваш бизнес-цикл' },
              { icon: <FileText size={20} />,   title: 'Без залога',            desc: 'В стандартных случаях залог не требуется' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card-glass" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.75rem' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(201,146,58,0.1)', borderRadius: '10px', border: '1px solid rgba(201,146,58,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9923A' }}>
                  {icon}
                </div>
                <div>
                  <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '0.375rem', fontSize: '0.9375rem' }}>{title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(201,146,58,0.08)', border: '1px solid rgba(201,146,58,0.2)', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '2rem', maxWidth: '600px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'rgba(201,146,58,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C9923A' }} />
            </div>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem', lineHeight: 1.65 }}>
              На данный момент заявки принимаются через форму обратной связи. Онлайн-кабинет для бизнеса будет доступен позже.
            </p>
          </div>

          <Link href="/contacts" className="btn btn-primary btn-lg" style={{ gap: '8px' }}>
            Оставить заявку <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════
          COMPLIANCE — trust badges
      ══════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '72px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4A6580', marginBottom: '2.5rem' }}>
            Работаем прозрачно и в рамках закона
          </p>
          <div className="grid-4-resp" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.5rem' }}>
            {[
              { icon: <Shield size={20} />,       title: 'Соответствие GDPR',    desc: 'Европейские стандарты обработки данных' },
              { icon: <CheckCircle2 size={20} />, title: 'Ответственный подход', desc: 'Тщательная проверка каждой заявки' },
              { icon: <Lock size={20} />,         title: 'Защита данных',         desc: 'Многоуровневая безопасность' },
              { icon: <FileText size={20} />,     title: 'Чёткие условия',        desc: 'Никакого мелкого шрифта' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.875rem', padding: '1.5rem', background: '#F2F5F8', borderRadius: '16px', border: '1px solid rgba(13,27,42,0.05)', transition: 'box-shadow 250ms ease', cursor: 'default' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(13,27,42,0.08)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                <div style={{ width: '40px', height: '40px', background: 'rgba(46,125,247,0.08)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E7DF7' }}>
                  {icon}
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: '#0D1B2A', marginBottom: '0.25rem', fontSize: '0.9375rem' }}>{title}</p>
                  <p style={{ fontSize: '0.8125rem', color: '#4A6580', lineHeight: 1.5 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ PREVIEW
      ══════════════════════════════════════ */}
      <section style={{ background: '#F2F5F8', padding: '100px 32px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.75rem' }}>FAQ</p>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#0D1B2A', letterSpacing: '-0.01em' }}>
              Часто задаваемые вопросы
            </h2>
          </div>
          <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid rgba(13,27,42,0.06)', overflow: 'hidden', boxShadow: '0 1px 3px rgba(13,27,42,0.04), 0 8px 24px rgba(13,27,42,0.06)', padding: '0 1.5rem' }}>
            <Faq q="Кто может получить займ?" a="Любой совершеннолетний резидент страны присутствия сервиса с действующим удостоверением личности и зарегистрированным номером телефона." />
            <Faq q="Как быстро я получу деньги?" a="Заявки рассматриваются в течение нескольких минут. После одобрения деньги переводятся сразу." />
            <Faq q="Есть ли скрытые комиссии?" a="Нет. Все условия и платежи отображаются до оформления займа." />
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/faq" className="btn btn-secondary" style={{ gap: '8px' }}>
              Смотреть все вопросы <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECURITY
      ══════════════════════════════════════ */}
      <section style={{ background: '#0D1B2A', padding: '100px 32px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: '56px', height: '56px', background: 'rgba(46,125,247,0.1)', borderRadius: '16px', border: '1px solid rgba(46,125,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={26} color="#2E7DF7" />
            </div>
          </div>
          <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#fff', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            Безопасность клиентов
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: '1rem', fontSize: '0.9375rem' }}>
            Мы уделяем особое внимание защите данных и безопасности наших клиентов. Все операции выполняются через защищённые каналы в соответствии с применимым европейским законодательством.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: '2.5rem', fontSize: '0.9375rem' }}>
            Используйте только официальный сайт и проверенные контактные данные компании.
          </p>
          <div style={{ background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.2)', borderRadius: '14px', padding: '1.25rem 1.5rem', maxWidth: '560px', margin: '0 auto', textAlign: 'left', display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(192,57,43,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#C0392B' }} />
            </div>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem', lineHeight: 1.65 }}>
              <strong style={{ color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: '4px' }}>Важно</strong>
              Мы не требуем предоплату и не запрашиваем конфиденциальные данные (пароли, CVV, PIN-коды) ни через какие каналы.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CONTACT FORM
      ══════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '100px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="grid-2-resp" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem' }}>
            <div>
              <div className="divider" />
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#0D1B2A', letterSpacing: '-0.01em', marginBottom: '0.75rem' }}>
                Свяжитесь с нами
              </h2>
              <p style={{ color: '#4A6580', lineHeight: 1.7, marginBottom: '2rem', fontSize: '0.9375rem' }}>
                Если у вас есть вопросы или нужна помощь — наша команда готова помочь в рабочие часы.
              </p>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="input-label">Имя</label>
                    <input className="input" type="text" placeholder="Иван" />
                  </div>
                  <div>
                    <label className="input-label">Email</label>
                    <input className="input" type="email" placeholder="ivan@example.com" />
                  </div>
                </div>
                <div>
                  <label className="input-label">Телефон</label>
                  <input className="input" type="tel" placeholder="+353 1 531 8420" />
                </div>
                <div>
                  <label className="input-label">Сообщение</label>
                  <textarea className="input" rows={4} placeholder="Ваш вопрос..." style={{ resize: 'vertical' }} />
                </div>
                <div>
                  <label className="input-label">Прикрепить файл</label>
                  <input type="file" style={{ fontSize: '0.875rem', color: '#4A6580', marginTop: '2px' }} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <input type="checkbox" id="consent" style={{ marginTop: '3px', accentColor: '#2E7DF7', width: '16px', height: '16px' }} />
                  <label htmlFor="consent" style={{ fontSize: '0.8125rem', color: '#4A6580', cursor: 'pointer', lineHeight: 1.6 }}>
                    Согласен с обработкой персональных данных в соответствии с{' '}
                    <a href="/privacy" style={{ color: '#2E7DF7', textDecoration: 'underline', textUnderlineOffset: '2px' }}>политикой конфиденциальности</a>
                  </label>
                </div>
                <div>
                  <button type="submit" className="btn btn-primary" style={{ gap: '8px' }}>
                    Отправить <ArrowRight size={15} />
                  </button>
                </div>
              </form>
            </div>

            {/* Contact details */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '1rem', letterSpacing: '-0.01em' }}>
                Контактная информация
              </h3>
              <p style={{ color: '#4A6580', lineHeight: 1.7, marginBottom: '2rem', fontSize: '0.9rem' }}>
                Вы можете связаться с нами по любым вопросам. Служба поддержки работает в рабочие часы. Онлайн-заявки принимаются круглосуточно.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {[
                  { icon: <MapPin size={16} />,  label: 'Адрес',  value: '18 Lower Baggot Street, Dublin 2, Ireland', href: null },
                  { icon: <Mail size={16} />,    label: 'Email',  value: 'support@lumenbridge.example', href: 'mailto:support@lumenbridge.example' },
                  { icon: <Phone size={16} />,   label: 'Телефон', value: '+353 1 531 8420', href: 'tel:+35315318420' },
                ].map(({ icon, label, value, href }) => (
                  <div key={label} style={{ display: 'flex', gap: '1rem', padding: '1.25rem 0', borderBottom: '1px solid rgba(13,27,42,0.06)', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', background: '#F2F5F8', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E7DF7', flexShrink: 0 }}>
                      {icon}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4A6580', fontWeight: 600, marginBottom: '2px' }}>{label}</p>
                      {href
                        ? <a href={href} style={{ color: '#0D1B2A', fontWeight: 500, fontSize: '0.9375rem', transition: 'color 150ms' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#2E7DF7'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#0D1B2A'; }}>{value}</a>
                        : <p style={{ color: '#0D1B2A', fontWeight: 500, fontSize: '0.9375rem' }}>{value}</p>}
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
