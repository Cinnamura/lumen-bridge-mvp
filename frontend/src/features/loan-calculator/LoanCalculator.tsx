'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { calcAnnuity, LOAN_CONFIG } from '@/shared/config/loan';

const cfg = LOAN_CONFIG.personal;

function fmt(n: number) {
  return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

/* Animated number — pulses opacity+scale when value changes */
function AnimatedNumber({ value, children }: { value: number; children: React.ReactNode }) {
  const [flash, setFlash] = useState(false);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current !== value) {
      prev.current = value;
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 180);
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <span style={{
      display: 'inline-block',
      transition: 'opacity 120ms ease, transform 120ms cubic-bezier(0.16,1,0.3,1)',
      opacity: flash ? 0.5 : 1,
      transform: flash ? 'scale(0.97)' : 'scale(1)',
    }}>
      {children}
    </span>
  );
}

/* Dual-input row: slider + number input synced */
function SliderRow({
  label, unit, value, min, max, step,
  onChange,
}: {
  label: string; unit: string; value: number;
  min: number; max: number; step: number;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const sliderBg = `linear-gradient(to right,#2E7DF7 ${pct}%,rgba(255,255,255,0.12) ${pct}%)`;

  const [raw, setRaw] = useState('');
  const [editing, setEditing] = useState(false);
  const outOfRange = editing && raw !== '' && (Number(raw) < min || Number(raw) > max);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '1rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
          {label}
        </span>

        {/* Editable value chip */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              value={editing ? raw : value}
              min={min} max={max} step={step}
              onFocus={() => { setEditing(true); setRaw(String(value)); }}
              onBlur={() => {
                setEditing(false);
                const n = Number(raw);
                if (!isNaN(n) && raw !== '') onChange(clamp(n, min, max));
              }}
              onChange={e => {
                setRaw(e.target.value);
                const n = Number(e.target.value);
                if (!isNaN(n) && e.target.value !== '') onChange(clamp(n, min, max));
              }}
              style={{
                fontFamily: 'var(--f-mono)',
                fontSize: '1.625rem',
                fontWeight: 700,
                color: outOfRange ? '#C08020' : '#fff',
                background: 'transparent',
                border: 'none',
                borderBottom: `1.5px solid ${outOfRange ? '#C08020' : 'rgba(255,255,255,0.15)'}`,
                outline: 'none',
                width: `${String(editing ? raw : value).length + 1}ch`,
                minWidth: '4ch',
                maxWidth: '9ch',
                letterSpacing: '-0.02em',
                padding: '2px 0',
                transition: 'color 150ms, border-color 150ms',
                /* hide spin buttons */
                MozAppearance: 'textfield',
              } as React.CSSProperties}
            />
            {outOfRange && (
              <span style={{ position: 'absolute', left: 0, top: '100%', marginTop: '3px', fontSize: '0.6875rem', color: '#C08020', whiteSpace: 'nowrap' }}>
                {Number(raw) < min ? `мин. ${min}` : `макс. ${max}`}
              </span>
            )}
          </div>
          <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.35)', fontWeight: 400, paddingBottom: '4px' }}>
            {unit}
          </span>
        </div>
      </div>

      <input
        type="range"
        className="calc-slider"
        min={min} max={max} step={step} value={value}
        style={{ background: sliderBg }}
        onChange={e => onChange(Number(e.target.value))}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.6875rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--f-mono)', letterSpacing: '0.02em' }}>
        <span>{min.toLocaleString('de-DE')}</span>
        <span>{max.toLocaleString('de-DE')}</span>
      </div>
    </div>
  );
}

/* ─── Public API ─── */
export function LoanCalculator({ dark = false }: { dark?: boolean }) {
  const [amount, setAmount] = useState(10_000);
  const [days,   setDays]   = useState(30);
  const { payment, total } = calcAnnuity(amount, cfg.dailyRate, days);

  /* Standalone light-page version wraps itself in a dark Bento card */
  if (!dark) {
    return (
      <div style={{
        background: 'linear-gradient(135deg,#0D1B2A 0%,#1A2942 60%,#0D1B2A 100%)',
        borderRadius: '24px',
        padding: 'clamp(2rem,4vw,3rem)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.04),0 24px 64px rgba(13,27,42,0.35)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow accent */}
        <div aria-hidden style={{ position: 'absolute', top: '-60px', right: '-60px', width: '280px', height: '280px', background: 'radial-gradient(circle,rgba(46,125,247,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ marginBottom: '2rem', position: 'relative' }}>
          <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.5rem' }}>
            Кредитный калькулятор
          </p>
          <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.625rem,3vw,2.25rem)', color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.625rem', lineHeight: 1.15 }}>
            Рассчитайте условия займа
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, maxWidth: '46ch' }}>
            Выберите сумму и срок или введите значение вручную — результат пересчитывается мгновенно.
          </p>
        </div>

        <CalcInner amount={amount} days={days} payment={payment} total={total}
          setAmount={setAmount} setDays={setDays} />
      </div>
    );
  }

  /* In-hero dark variant (already on dark bg) */
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.5rem' }}>
          Калькулятор
        </p>
        <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
          Двигайте слайдер или вводите значение вручную
        </p>
      </div>
      <CalcInner amount={amount} days={days} payment={payment} total={total}
        setAmount={setAmount} setDays={setDays} />
    </div>
  );
}

function CalcInner({ amount, days, payment, total, setAmount, setDays }: {
  amount: number; days: number; payment: number; total: number;
  setAmount: (v: number) => void; setDays: (v: number) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <SliderRow label="Сумма займа" unit="EUR"
        value={amount} min={cfg.minAmount} max={cfg.maxAmount} step={100}
        onChange={setAmount} />

      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

      <SliderRow label="Срок займа" unit="дн."
        value={days} min={cfg.minDays} max={cfg.maxDays} step={1}
        onChange={setDays} />

      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

      {/* Result card */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '1.375rem',
      }}>
        {/* Daily payment row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Ежедневный платёж
          </span>
          <AnimatedNumber value={payment}>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: '1.0625rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
              {fmt(payment)} EUR
            </span>
          </AnimatedNumber>
        </div>

        {/* Total */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Итого к возврату
          </div>
          <AnimatedNumber value={total}>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: 'clamp(2rem,4.5vw,2.75rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {fmt(total)}
              <span style={{ fontSize: '1rem', fontWeight: 400, opacity: 0.45, marginLeft: '6px' }}>EUR</span>
            </span>
          </AnimatedNumber>
        </div>

        {/* Rate + disclaimer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.125rem' }}>
          <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.04em' }}>
            0,8% / день
          </span>
        </div>
        <p style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.2)', lineHeight: 1.6, marginBottom: '1.25rem', fontStyle: 'italic' }}>
          Расчёт носит ознакомительный характер. Итоговые условия зависят от результатов проверки клиента.
        </p>

        <Link href="/apply" className="btn btn-primary" style={{ display: 'flex', justifyContent: 'center', width: '100%', gap: '8px' }}>
          Подать заявку <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
