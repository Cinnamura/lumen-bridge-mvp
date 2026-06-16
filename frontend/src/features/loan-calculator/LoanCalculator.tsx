'use client';
import { useEffect, useRef, useState } from 'react';
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

function AnimatedNumber({ value, children }: { value: number; children: React.ReactNode }) {
  const [flash, setFlash] = useState(false);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current !== value) {
      prev.current = value;
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 220);
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <span
      style={{
        display: 'inline-block',
        transition: 'opacity 180ms ease, transform 220ms cubic-bezier(0.16,1,0.3,1)',
        opacity: flash ? 0.65 : 1,
        transform: flash ? 'translateY(-2px) scale(0.985)' : 'translateY(0) scale(1)',
      }}
    >
      {children}
    </span>
  );
}

function SliderRow({
  label,
  unit,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const sliderBg = `linear-gradient(90deg, #10B981 0%, #3B82F6 ${pct}%, rgba(140,144,159,0.18) ${pct}%, rgba(140,144,159,0.18) 100%)`;
  const [raw, setRaw] = useState('');
  const [editing, setEditing] = useState(false);
  const outOfRange = editing && raw !== '' && (Number(raw) < min || Number(raw) > max);

  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: '1rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(154,164,182,0.82)' }}>
          {label}
        </span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
          <input
            type="number"
            value={editing ? raw : value}
            min={min}
            max={max}
            step={step}
            onFocus={() => {
              setEditing(true);
              setRaw(String(value));
            }}
            onBlur={() => {
              setEditing(false);
              const n = Number(raw);
            }}
            onChange={() => {}}
            style={{ display: 'none' }}
          />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem' }}>
          <input
            type="number"
            value={editing ? raw : value}
            min={min}
            max={max}
            step={step}
            onFocus={() => {
              setEditing(true);
              setRaw(String(value));
            }}
            onBlur={() => {
              setEditing(false);
              const n = Number(raw);
              if (!isNaN(n) && raw !== '') onChange(clamp(n, min, max));
            }}
            onChange={(e) => {
              setRaw(e.target.value);
              const n = Number(e.target.value);
              if (!isNaN(n) && e.target.value !== '') onChange(clamp(n, min, max));
            }}
            style={{
              fontFamily: 'var(--f-mono)',
              fontSize: '1.75rem',
              fontWeight: 700,
              color: outOfRange ? '#F59E0B' : '#F8FAFC',
              background: 'transparent',
              border: 'none',
              borderBottom: `1px solid ${outOfRange ? 'rgba(245,158,11,0.65)' : 'rgba(140,144,159,0.28)'}`,
              outline: 'none',
              width: `${String(editing ? raw : value).length + 1}ch`,
              minWidth: '4ch',
              letterSpacing: '-0.03em',
              paddingBottom: '0.15rem',
            }}
          />
          <span style={{ fontSize: '0.875rem', color: 'rgba(154,164,182,0.86)', paddingBottom: '0.35rem' }}>{unit}</span>
        </div>
        {outOfRange && (
          <span style={{ fontSize: '0.75rem', color: '#F59E0B' }}>
            {Number(raw) < min ? `мин. ${min}` : `макс. ${max}`}
          </span>
        )}
      </div>

      <input
        type="range"
        className="calc-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ background: sliderBg }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(124,135,156,0.84)', fontFamily: 'var(--f-mono)' }}>
        <span>{min.toLocaleString('de-DE')}</span>
        <span>{max.toLocaleString('de-DE')}</span>
      </div>
    </div>
  );
}

export function LoanCalculator({ dark = false }: { dark?: boolean }) {
  const [amount, setAmount] = useState(10_000);
  const [days, setDays] = useState(30);
  const { payment, total } = calcAnnuity(amount, cfg.dailyRate, days);

  const shell = {
    position: 'relative' as const,
    overflow: 'hidden' as const,
    background: dark
      ? 'transparent'
      : 'linear-gradient(180deg, rgba(20,25,36,0.94) 0%, rgba(11,15,25,0.96) 100%)',
    borderRadius: dark ? '0' : '24px',
    border: dark ? 'none' : '1px solid rgba(140,144,159,0.18)',
    padding: dark ? '0' : '2rem',
    boxShadow: dark ? 'none' : '0 24px 60px rgba(0,0,0,0.32)',
  };

  return (
    <div style={shell}>
      {!dark && (
        <>
          <div aria-hidden style={{ position: 'absolute', inset: 'auto', width: '240px', height: '240px', top: '-70px', right: '-60px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.24) 0%, transparent 68%)' }} />
          <div aria-hidden style={{ position: 'absolute', inset: 'auto', width: '260px', height: '260px', bottom: '-120px', left: '-80px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)' }} />
        </>
      )}

      <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#93C5FD', marginBottom: '0.55rem' }}>
          {dark ? 'Калькулятор' : 'Кредитный калькулятор'}
        </p>
        {!dark && (
          <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#F8FAFC', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '0.65rem' }}>
            Рассчитайте условия займа
          </h2>
        )}
        <p style={{ fontSize: '0.9375rem', color: 'rgba(154,164,182,0.9)', lineHeight: 1.7, maxWidth: '42ch' }}>
          Ползунки и итоговая сумма обновляются мгновенно, без графиков и лишнего визуального шума.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem', position: 'relative' }}>
        <SliderRow label="Сумма займа" unit="EUR" value={amount} min={cfg.minAmount} max={cfg.maxAmount} step={100} onChange={setAmount} />
        <div style={{ height: '1px', background: 'rgba(140,144,159,0.18)' }} />
        <SliderRow label="Срок займа" unit="дн." value={days} min={cfg.minDays} max={cfg.maxDays} step={1} onChange={setDays} />

        <div
          className="aurora-blue"
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '20px',
            border: '1px solid rgba(140,144,159,0.18)',
            background: 'linear-gradient(180deg, rgba(24,33,49,0.92) 0%, rgba(11,15,25,0.94) 100%)',
            padding: '1.35rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.24)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.95rem', gap: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'rgba(154,164,182,0.86)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Ежедневный платёж
            </span>
            <AnimatedNumber value={payment}>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: '1.1rem', fontWeight: 700, color: '#E2E8F0' }}>
                {fmt(payment)} EUR
              </span>
            </AnimatedNumber>
          </div>

          <div style={{ borderTop: '1px solid rgba(140,144,159,0.16)', paddingTop: '1rem', marginBottom: '0.95rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'rgba(154,164,182,0.82)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.55rem' }}>
              Итого к возврату
            </div>
            <AnimatedNumber value={total}>
              <span
                style={{
                  fontFamily: 'var(--f-mono)',
                  fontSize: 'clamp(2.2rem,5vw,3rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  background: 'linear-gradient(90deg, #6EE7B7 0%, #60A5FA 48%, #A78BFA 100%)',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {fmt(total)}
              </span>
            </AnimatedNumber>
            <div style={{ fontSize: '0.95rem', color: 'rgba(154,164,182,0.92)', marginTop: '0.3rem' }}>EUR</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.8125rem', color: '#6EE7B7' }}>0,8% / день</span>
            <span style={{ fontSize: '0.75rem', color: 'rgba(154,164,182,0.84)' }}>Без скрытых комиссий</span>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'rgba(154,164,182,0.78)', lineHeight: 1.65, marginBottom: '1rem', fontStyle: 'italic' }}>
            Расчёт носит ознакомительный характер. Итоговые условия зависят от результатов проверки клиента.
          </p>

          <Link href={`/apply?amount=${amount}&termDays=${days}`} className="btn btn-primary" style={{ display: 'flex', justifyContent: 'center', width: '100%', gap: '8px' }}>
            Подать заявку <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
