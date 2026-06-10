'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import CabinetShell from '@/widgets/sidebar/CabinetShell';
import { api, authHeader } from '@/shared/lib/api';
import { getToken } from '@/shared/lib/auth';
import { formatCurrency, formatDate } from '@/shared/lib/format';

interface LoanDto {
  id: string; amount: number; termDays: number;
  dailyPayment: number; totalRepayment: number;
  status: 'pending_signing' | 'active' | 'overdue' | 'closed';
  issuedAt?: string; closedAt?: string;
  nextPaymentDate?: string; nextPaymentAmount?: number;
}

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  pending_signing: { label: 'Ожидает подписания', cls: 'badge-signing' },
  active:          { label: 'Активен',            cls: 'badge-active' },
  overdue:         { label: 'Просрочен',          cls: 'badge-overdue' },
  closed:          { label: 'Закрыт',             cls: 'badge-closed' },
};

function LoanCard({ loan, compact = false }: { loan: LoanDto; compact?: boolean }) {
  const s = STATUS_LABELS[loan.status] ?? { label: loan.status, cls: 'badge-closed' };
  const paidDays = compact ? undefined : undefined;
  const totalDays = loan.termDays;
  const isNearDue = loan.nextPaymentDate
    ? (new Date(loan.nextPaymentDate).getTime() - Date.now()) / 86400000 < 3
    : false;

  return (
    <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(13,27,42,0.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: compact ? '0' : '1rem' }}>
        <div>
          <p style={{ fontFamily: 'var(--f-mono)', fontSize: compact ? '1rem' : '1.375rem', fontWeight: 700, color: '#0D1B2A' }}>
            {formatCurrency(loan.amount)}
          </p>
          {loan.issuedAt && <p style={{ fontSize: '0.8125rem', color: '#4A6580', marginTop: '2px' }}>{formatDate(loan.issuedAt)}</p>}
          {compact && loan.closedAt && <p style={{ fontSize: '0.8125rem', color: '#4A6580' }}>Закрыт: {formatDate(loan.closedAt)}</p>}
        </div>
        <span className={`badge ${s.cls}`}>{s.label}</span>
      </div>

      {!compact && (
        <>
          {loan.nextPaymentDate && (
            <div style={{ background: isNearDue ? '#FEF3CD' : '#F8F9FA', border: `1px solid ${isNearDue ? '#E6D200' : '#E8ECF0'}`, borderRadius: '8px', padding: '0.625rem 0.875rem', marginBottom: '0.875rem', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8125rem', color: '#4A6580' }}>Следующий платёж</span>
              <span style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: isNearDue ? '#7A5200' : '#0D1B2A', fontSize: '0.875rem' }}>
                {formatCurrency(loan.nextPaymentAmount ?? 0)} · {formatDate(loan.nextPaymentDate)}
              </span>
            </div>
          )}
          <Link href={`/cabinet/loans/${loan.id}`} style={{ display: 'block', textAlign: 'center', background: '#2E7DF7', color: '#fff', borderRadius: '8px', padding: '9px', fontWeight: 600, textDecoration: 'none', fontSize: '0.9375rem' }}>
            Открыть
          </Link>
        </>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))' }}>
      {[1,2].map(i => <div key={i} style={{ height: '160px', borderRadius: '12px', background: 'linear-gradient(90deg,#E8ECF0,#D0D5DD,#E8ECF0)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />)}
    </div>
  );
}

export default function LoansPage() {
  const [active, setActive] = useState<LoanDto[]>([]);
  const [closed, setClosed] = useState<LoanDto[]>([]);
  const [tab, setTab] = useState<'active' | 'closed'>('active');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    api.get<{ active: LoanDto[]; closed: LoanDto[] }>('/cabinet/loans', authHeader(token))
      .then((d) => { setActive(d.active); setClosed(d.closed); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const tabStyle = (t: string): React.CSSProperties => ({
    padding: '8px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.9375rem',
    background: tab === t ? '#0D1B2A' : 'transparent',
    color: tab === t ? '#fff' : '#4A6580',
  });

  return (
    <CabinetShell>
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#4A6580', marginBottom: '2px' }}>Личный кабинет</p>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0D1B2A' }}>Мои займы</h1>
        </div>

        <div style={{ display: 'inline-flex', background: '#E8ECF0', borderRadius: '8px', padding: '3px', marginBottom: '1.5rem', gap: '2px' }}>
          <button style={tabStyle('active')} onClick={() => setTab('active')}>Активные</button>
          <button style={tabStyle('closed')} onClick={() => setTab('closed')}>Закрытые</button>
        </div>

        {loading && <Skeleton />}
        {!loading && error && (
          <div style={{ borderLeft: '4px solid #C0392B', background: '#FAD7D4', borderRadius: '8px', padding: '1rem' }}>
            <p style={{ color: '#6B1A14' }}>Не удалось загрузить данные: {error}</p>
          </div>
        )}

        {!loading && !error && tab === 'active' && (
          active.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#4A6580" strokeWidth="1.25" style={{ margin: '0 auto 1rem' }}><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.5rem' }}>Активных займов нет</h3>
              <p style={{ color: '#4A6580' }}>Здесь появятся займы после одобрения заявки</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))' }}>
              {active.map((l) => <LoanCard key={l.id} loan={l} />)}
            </div>
          )
        )}

        {!loading && !error && tab === 'closed' && (
          closed.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.5rem' }}>Истории займов нет</h3>
              <p style={{ color: '#4A6580' }}>Здесь будет история погашённых займов</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {closed.map((l) => <LoanCard key={l.id} loan={l} compact />)}
            </div>
          )
        )}
      </div>
    </CabinetShell>
  );
}
