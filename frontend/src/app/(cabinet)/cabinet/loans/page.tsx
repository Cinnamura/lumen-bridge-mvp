'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import CabinetShell from '@/widgets/sidebar/CabinetShell';
import { api, authHeader } from '@/shared/lib/api';
import { getToken } from '@/shared/lib/auth';
import { formatCurrency, formatDate } from '@/shared/lib/format';
import { CalendarClock, CreditCard, Wallet } from 'lucide-react';
import { Skeleton } from '@/shared/ui/Skeleton';

interface LoanDto {
  id: string;
  amount: number;
  termDays: number;
  dailyPayment: number;
  totalRepayment: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'pending_signing' | 'active' | 'overdue' | 'closed';
  issuedAt?: string;
  closedAt?: string;
  nextPaymentDate?: string;
  nextPaymentAmount?: number;
}

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  pending_signing: { label: 'Ожидает подписания', cls: 'badge-signing' },
  active: { label: 'Активен', cls: 'badge-active' },
  overdue: { label: 'Просрочен', cls: 'badge-overdue' },
  closed: { label: 'Закрыт', cls: 'badge-closed' },
};

function cardStyle(extra: React.CSSProperties = {}): React.CSSProperties {
  return {
    background: '#fff',
    border: '1px solid #E8ECF0',
    borderRadius: '14px',
    boxShadow: '0 8px 24px rgba(13,27,42,0.06), 0 2px 6px rgba(13,27,42,0.04)',
    ...extra,
  };
}

function LoansSkeleton() {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
        {[1, 2, 3].map((i) => <div key={i} style={{ ...cardStyle({ padding: '1rem' }) }}><Skeleton h={74} /></div>)}
      </div>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        {[1, 2].map((i) => <div key={i} style={{ ...cardStyle({ padding: '1.2rem' }) }}><Skeleton h={180} /></div>)}
      </div>
    </div>
  );
}

function LoanCard({ loan }: { loan: LoanDto }) {
  const status = STATUS_LABELS[loan.status] ?? { label: loan.status, cls: 'badge-closed' };
  const progress = loan.totalRepayment > 0 ? Math.min(100, (loan.paidAmount / loan.totalRepayment) * 100) : 0;

  return (
    <div style={{ ...cardStyle({ padding: '1.2rem', background: loan.status === 'overdue' ? 'linear-gradient(180deg, #fff 0%, #fff8f0 100%)' : 'linear-gradient(180deg, #fff 0%, #f8fafc 100%)' }) }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <p style={{ fontFamily: 'var(--f-mono)', fontSize: '1.5rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '4px' }}>{formatCurrency(loan.amount)}</p>
          <p style={{ fontSize: '0.8125rem', color: '#4A6580' }}>{loan.issuedAt ? `Выдан ${formatDate(loan.issuedAt)}` : `${loan.termDays} дней`}</p>
        </div>
        <span className={`badge ${status.cls}`}>{status.label}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ padding: '0.85rem', borderRadius: '12px', background: '#F8FAFD', border: '1px solid #EDF1F5' }}>
          <p style={{ fontSize: '0.75rem', color: '#4A6580', marginBottom: '3px' }}>Остаток долга</p>
          <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: '#0D1B2A' }}>{formatCurrency(loan.remainingAmount)}</p>
        </div>
        <div style={{ padding: '0.85rem', borderRadius: '12px', background: '#F8FAFD', border: '1px solid #EDF1F5' }}>
          <p style={{ fontSize: '0.75rem', color: '#4A6580', marginBottom: '3px' }}>Следующий платёж</p>
          <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: '#0D1B2A' }}>{loan.nextPaymentAmount ? formatCurrency(loan.nextPaymentAmount) : '—'}</p>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.8125rem', color: '#4A6580' }}>Исполнение обязательств</span>
          <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.8125rem', color: '#0D1B2A' }}>{progress.toFixed(1)}%</span>
        </div>
        <div style={{ height: '8px', background: '#E8ECF0', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, borderRadius: '999px', background: loan.remainingAmount === 0 ? '#1E8A5E' : 'linear-gradient(90deg, #2E7DF7 0%, #7DB5FF 100%)' }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ fontSize: '0.8125rem', color: '#4A6580' }}>
          {loan.nextPaymentDate ? `Платёж до ${formatDate(loan.nextPaymentDate)}` : loan.closedAt ? `Закрыт ${formatDate(loan.closedAt)}` : `${loan.termDays} дней`}
        </div>
        <Link href={`/cabinet/loans/${loan.id}`} style={{ background: '#2E7DF7', color: '#fff', borderRadius: '10px', padding: '9px 16px', fontWeight: 600, textDecoration: 'none' }}>
          Открыть
        </Link>
      </div>
    </div>
  );
}

export default function LoansPage() {
  const [active, setActive] = useState<LoanDto[]>([]);
  const [closed, setClosed] = useState<LoanDto[]>([]);
  const [tab, setTab] = useState<'active' | 'closed'>('active');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const data = await api.get<{ active: LoanDto[]; closed: LoanDto[] }>('/cabinet/loans', authHeader(token));
      setActive(data.active);
      setClosed(data.closed);
    } catch (e: any) {
      setError(e.message ?? 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const totalOutstanding = useMemo(() => active.reduce((sum, loan) => sum + loan.remainingAmount, 0), [active]);
  const nextLoan = useMemo(() => active.find((loan) => loan.nextPaymentDate) ?? active[0] ?? null, [active]);
  const tabStyle = (current: 'active' | 'closed'): React.CSSProperties => ({
    padding: '8px 18px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.9375rem',
    background: tab === current ? '#0D1B2A' : 'transparent',
    color: tab === current ? '#fff' : '#4A6580',
  });

  return (
    <CabinetShell>
      <div className="cabinet-page">
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#4A6580', marginBottom: '4px' }}>Личный кабинет</p>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.35rem' }}>Мои займы</h1>
          <p style={{ color: '#4A6580', fontSize: '0.9375rem' }}>Активные обязательства, остатки и быстрый доступ к детальному графику.</p>
        </div>

        {loading && <LoansSkeleton />}

        {!loading && error && (
          <div style={{ ...cardStyle({ borderLeft: '4px solid #C0392B', padding: '1rem 1.25rem' }) }}>
            <p style={{ fontWeight: 700, color: '#0D1B2A', marginBottom: '0.375rem' }}>Не удалось загрузить займы</p>
            <p style={{ color: '#4A6580', fontSize: '0.875rem', marginBottom: '0.875rem' }}>{error}</p>
            <button onClick={load} style={{ background: '#2E7DF7', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 16px', fontWeight: 600, cursor: 'pointer' }}>Попробовать снова</button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '1.5rem' }}>
              {[
                { label: 'Активных займов', value: String(active.length), hint: 'Включая ожидающие подписания', icon: CreditCard },
                { label: 'Остаток долга', value: formatCurrency(totalOutstanding), hint: 'По всем активным займам', icon: Wallet },
                { label: 'Ближайшая дата', value: nextLoan?.nextPaymentDate ? formatDate(nextLoan.nextPaymentDate) : '—', hint: nextLoan?.nextPaymentAmount ? formatCurrency(nextLoan.nextPaymentAmount) : 'Нет обязательства', icon: CalendarClock },
              ].map(({ label, value, hint, icon: Icon }) => (
                <div key={label} style={{ ...cardStyle({ padding: '1rem 1.1rem', background: 'linear-gradient(180deg, #ffffff 0%, #f7f9fc 100%)' }) }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#4A6580', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{label}</span>
                    <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#EBF1FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={17} color="#2E7DF7" />
                    </div>
                  </div>
                  <p style={{ fontFamily: 'var(--f-mono)', fontSize: '1.375rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.25rem' }}>{value}</p>
                  <p style={{ fontSize: '0.8125rem', color: '#4A6580' }}>{hint}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'inline-flex', background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '4px', marginBottom: '1.25rem', gap: '4px' }}>
              <button style={tabStyle('active')} onClick={() => setTab('active')}>Активные</button>
              <button style={tabStyle('closed')} onClick={() => setTab('closed')}>Закрытые</button>
            </div>

            {tab === 'active' && (active.length === 0 ? (
              <div style={{ ...cardStyle({ padding: '2rem', textAlign: 'center' }) }}>
                <CreditCard size={54} color="#4A6580" style={{ margin: '0 auto 1rem', display: 'block' }} />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.5rem' }}>Активных займов нет</h3>
                <p style={{ color: '#4A6580' }}>После одобрения и подписания заявки здесь появятся действующие обязательства.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
                {active.map((loan) => <LoanCard key={loan.id} loan={loan} />)}
              </div>
            ))}

            {tab === 'closed' && (closed.length === 0 ? (
              <div style={{ ...cardStyle({ padding: '2rem', textAlign: 'center' }) }}>
                <Wallet size={54} color="#4A6580" style={{ margin: '0 auto 1rem', display: 'block' }} />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.5rem' }}>Истории займов нет</h3>
                <p style={{ color: '#4A6580' }}>Закрытые договоры появятся здесь после полного погашения.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
                {closed.map((loan) => <LoanCard key={loan.id} loan={loan} />)}
              </div>
            ))}
          </>
        )}
      </div>
    </CabinetShell>
  );
}
