'use client';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import { calcAnnuity, LOAN_CONFIG } from '@/shared/config/loan';
import { formatAmount } from '@/shared/lib/format';

interface Props {
  dark?: boolean;
}

export function LoanCalculator({ dark = false }: Props) {
  const cfg = LOAN_CONFIG.personal;
  const [amount, setAmount] = useState(10_000);
  const [days, setDays] = useState(30);

  const { payment, total } = calcAnnuity(amount, cfg.dailyRate, days);

  const amountProgress =
    ((amount - cfg.minAmount) / (cfg.maxAmount - cfg.minAmount)) * 100;
  const daysProgress =
    ((days - cfg.minDays) / (cfg.maxDays - cfg.minDays)) * 100;

  const SliderLabel = ({ label, value, unit }: { label: string; value: number; unit: string }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-2)' }}>
      <span style={{ fontSize: 'var(--text-sm)', color: dark ? 'rgba(255,255,255,0.6)' : 'var(--color-text-secondary)', fontWeight: 'var(--font-medium)' }}>
        {label}
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: dark ? 'var(--color-white)' : 'var(--color-midnight)' }}>
        {formatAmount(value)} <span style={{ fontSize: 'var(--text-lg)' }}>{unit}</span>
      </span>
    </div>
  );

  return (
    <div>
      {!dark && (
        <h2 style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-midnight)', marginBottom: 'var(--space-10)', textAlign: 'center' }}>
          Рассчитайте условия займа
        </h2>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        {/* Amount slider */}
        <div>
          <SliderLabel label="Сумма займа" value={amount} unit="EUR" />
          <input
            type="range"
            className="calc-slider"
            min={cfg.minAmount}
            max={cfg.maxAmount}
            step={100}
            value={amount}
            style={{ '--progress': `${amountProgress}%` } as React.CSSProperties}
            onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => setAmount(Number(e.target.value)), [])}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-1)', fontSize: 'var(--text-xs)', color: dark ? 'rgba(255,255,255,0.4)' : 'var(--color-slate)' }}>
            <span>{formatAmount(cfg.minAmount)} EUR</span>
            <span>{formatAmount(cfg.maxAmount)} EUR</span>
          </div>
        </div>

        {/* Days slider */}
        <div>
          <SliderLabel label="Срок займа" value={days} unit="дн." />
          <input
            type="range"
            className="calc-slider"
            min={cfg.minDays}
            max={cfg.maxDays}
            step={1}
            value={days}
            style={{ '--progress': `${daysProgress}%` } as React.CSSProperties}
            onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => setDays(Number(e.target.value)), [])}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-1)', fontSize: 'var(--text-xs)', color: dark ? 'rgba(255,255,255,0.4)' : 'var(--color-slate)' }}>
            <span>{cfg.minDays} дн.</span>
            <span>{cfg.maxDays} дн.</span>
          </div>
        </div>

        {/* Result card */}
        <div style={{
          background: 'var(--color-midnight)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.6)' }}>Ежедневный платёж</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-white)' }}>
              {formatAmount(payment)} EUR
            </span>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 'var(--space-4)', marginBottom: 'var(--space-2)' }}>
            <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.6)', marginBottom: 'var(--space-1)' }}>
              Итого к возврату
            </div>
            <div className="calc-result-amount" style={{ lineHeight: 1 }}>
              {formatAmount(total)} EUR
            </div>
          </div>

          <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)', marginBottom: 'var(--space-6)' }}>
            Ставка: 0,8% в день
          </div>
          <p style={{ fontSize: 'var(--text-xs)', fontStyle: 'italic', color: 'rgba(255,255,255,0.35)', marginBottom: 'var(--space-5)' }}>
            Расчёт является предварительным и не является офертой. Итоговые условия определяются индивидуально.
          </p>

          <Link href="/apply" className="btn-primary" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', width: '100%' }}>
            Подать заявку
          </Link>
        </div>
      </div>
    </div>
  );
}
