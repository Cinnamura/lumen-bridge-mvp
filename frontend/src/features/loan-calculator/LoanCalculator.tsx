'use client';
import { useState } from 'react';
import Link from 'next/link';
import { calcAnnuity, LOAN_CONFIG } from '@/shared/config/loan';

function fmt(n: number) {
  return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

export function LoanCalculator({ dark = false }: { dark?: boolean }) {
  const cfg = LOAN_CONFIG.personal;
  const [amount, setAmount] = useState(10_000);
  const [days,   setDays]   = useState(30);

  const { payment, total } = calcAnnuity(amount, cfg.dailyRate, days);

  const aPct = ((amount - cfg.minAmount) / (cfg.maxAmount - cfg.minAmount)) * 100;
  const dPct = ((days   - cfg.minDays)   / (cfg.maxDays   - cfg.minDays))   * 100;

  const sliderBg = (pct: number) =>
    `linear-gradient(to right,#2E7DF7 ${pct}%,rgba(255,255,255,0.15) ${pct}%)`;

  const lc = dark ? 'rgba(255,255,255,0.5)'  : '#4A6580';
  const vc = dark ? '#ffffff'                 : '#0D1B2A';
  const bc = dark ? 'rgba(255,255,255,0.25)' : 'rgba(74,101,128,0.5)';

  return (
    <div>
      {!dark && (
        <>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.75rem' }}>
            Кредитный калькулятор
          </p>
          <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#0D1B2A', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
            Рассчитайте условия займа
          </h2>
          <p style={{ fontSize: '0.9375rem', color: '#4A6580', lineHeight: 1.65, marginBottom: '2.5rem', maxWidth: '52ch' }}>
            Выберите сумму и срок — сразу увидите итоговую сумму к возврату. Все условия известны до оформления.
          </p>
        </>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Amount */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8125rem', color: lc, fontWeight: 500, letterSpacing: '0.02em' }}>Сумма займа</span>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: '1.75rem', fontWeight: 700, color: vc, letterSpacing: '-0.02em', transition: 'color 150ms ease' }}>
              {fmt(amount)}<span style={{ fontSize: '1rem', fontWeight: 400, marginLeft: '4px', opacity: 0.7 }}>EUR</span>
            </span>
          </div>
          <input
            type="range" className="calc-slider"
            min={cfg.minAmount} max={cfg.maxAmount} step={100} value={amount}
            style={{ background: sliderBg(aPct) }}
            onChange={e => setAmount(Number(e.target.value))}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.75rem', color: bc, fontFamily: 'var(--f-mono)' }}>
            <span>500</span><span>50 000</span>
          </div>
        </div>

        {/* Days */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8125rem', color: lc, fontWeight: 500, letterSpacing: '0.02em' }}>Срок займа</span>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: '1.75rem', fontWeight: 700, color: vc, letterSpacing: '-0.02em', transition: 'color 150ms ease' }}>
              {days}<span style={{ fontSize: '1rem', fontWeight: 400, marginLeft: '4px', opacity: 0.7 }}>дн.</span>
            </span>
          </div>
          <input
            type="range" className="calc-slider"
            min={cfg.minDays} max={cfg.maxDays} step={1} value={days}
            style={{ background: sliderBg(dPct) }}
            onChange={e => setDays(Number(e.target.value))}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.75rem', color: bc, fontFamily: 'var(--f-mono)' }}>
            <span>7</span><span>90</span>
          </div>
        </div>

        {/* Result */}
        <div style={{
          background: 'rgba(13,27,42,0.92)',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.02em' }}>Ежедневный платёж</span>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: '1.125rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
              {fmt(payment)} EUR
            </span>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Итого к возврату
            </div>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 'clamp(2.25rem,5vw,3rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {fmt(total)}
              <span style={{ fontSize: '1.25rem', fontWeight: 400, opacity: 0.6, marginLeft: '6px' }}>EUR</span>
            </div>
          </div>

          <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.35)', marginBottom: '1.25rem', fontFamily: 'var(--f-mono)' }}>
            0,8% / день
          </div>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', lineHeight: 1.6, marginBottom: '1.25rem', fontStyle: 'italic' }}>
            Расчёт носит ознакомительный характер. Итоговые условия зависят от результатов проверки клиента.
          </p>
          <Link href="/apply" className="btn btn-primary" style={{ display: 'block', textAlign: 'center', width: '100%', letterSpacing: '0.02em' }}>
            Подать заявку
          </Link>
        </div>
      </div>
    </div>
  );
}
