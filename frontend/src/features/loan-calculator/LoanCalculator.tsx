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
  const [days, setDays] = useState(30);

  const { payment, total } = calcAnnuity(amount, cfg.dailyRate, days);

  const amountPct = ((amount - cfg.minAmount) / (cfg.maxAmount - cfg.minAmount)) * 100;
  const daysPct   = ((days   - cfg.minDays)   / (cfg.maxDays   - cfg.minDays))   * 100;

  const sliderBg = (pct: number) =>
    `linear-gradient(to right, #2E7DF7 0%, #2E7DF7 ${pct}%, #C8D0DA ${pct}%, #C8D0DA 100%)`;

  const labelColor  = dark ? 'rgba(255,255,255,0.65)' : '#4A6580';
  const valueColor  = dark ? '#ffffff' : '#0D1B2A';
  const boundColor  = dark ? 'rgba(255,255,255,0.35)' : '#9AA5B4';

  return (
    <div>
      {!dark && (
        <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.25rem)', fontWeight: 700, color: '#0D1B2A', marginBottom: '2.5rem', textAlign: 'center' }}>
          Рассчитайте условия займа
        </h2>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Amount */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.875rem', color: labelColor, fontWeight: 500 }}>Сумма займа</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.875rem', fontWeight: 700, color: valueColor }}>
              {fmt(amount)} <span style={{ fontSize: '1.125rem' }}>EUR</span>
            </span>
          </div>
          <input
            type="range"
            className="calc-slider"
            min={cfg.minAmount} max={cfg.maxAmount} step={100} value={amount}
            style={{ background: sliderBg(amountPct) }}
            onChange={e => setAmount(Number(e.target.value))}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.75rem', color: boundColor }}>
            <span>{fmt(cfg.minAmount)} EUR</span>
            <span>{fmt(cfg.maxAmount)} EUR</span>
          </div>
        </div>

        {/* Days */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.875rem', color: labelColor, fontWeight: 500 }}>Срок займа</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.875rem', fontWeight: 700, color: valueColor }}>
              {days} <span style={{ fontSize: '1.125rem' }}>дн.</span>
            </span>
          </div>
          <input
            type="range"
            className="calc-slider"
            min={cfg.minDays} max={cfg.maxDays} step={1} value={days}
            style={{ background: sliderBg(daysPct) }}
            onChange={e => setDays(Number(e.target.value))}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.75rem', color: boundColor }}>
            <span>{cfg.minDays} дн.</span>
            <span>{cfg.maxDays} дн.</span>
          </div>
        </div>

        {/* Result */}
        <div style={{ background: '#0D1B2A', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>Ежедневный платёж</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
              {fmt(payment)} EUR
            </span>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem', marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Итого к возврату</div>
            <div className="calc-result-amount">{fmt(total)} EUR</div>
          </div>

          <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', margin: '0.75rem 0 1rem' }}>
            Ставка: 0,8% в день
          </div>
          <p style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.3)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
            Расчёт носит ознакомительный характер. Итоговые условия зависят от результатов проверки клиента.
          </p>

          <Link href="/apply" className="btn-primary" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', width: '100%' }}>
            Подать заявку
          </Link>
        </div>
      </div>
    </div>
  );
}
