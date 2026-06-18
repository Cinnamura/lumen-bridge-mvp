'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminShell from '@/widgets/sidebar/AdminShell';
import { api, authHeader } from '@/shared/lib/api';
import { formatCurrency, formatDate } from '@/shared/lib/format';
import { getLoanPaymentLabel, getLoanRateLabel, getLoanTermLabel } from '@/shared/lib/loan-display';
import { ChevronLeft } from 'lucide-react';
import { Skeleton } from '@/shared/ui/Skeleton';
import { useAdminAuth, useAdminErrorHandler } from '@/shared/lib/admin-auth-context';

function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lb_admin_token');
}

interface ScheduleRow {
  id: string;
  seq: number;
  dueDate: string;
  amountRequired: number;
  amountPaid: number;
  amountRemaining: number;
  status: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'SKIPPED_EARLY_PAYMENT';
  paidAt?: string;
}
interface PaymentRow  { id: string; amount: number; status: string; recordedAt: string; note?: string | null }
interface PayReqRow   { id: string; amount: number; reference: string; status: string; createdAt: string; reviewedAt?: string }
interface LoanDetail {
  id: string; applicationId: string;
  userId: string;
  user?: { id: string; phone: string; firstName?: string; lastName?: string; email?: string };
  type: 'personal' | 'business';
  amount: number; termDays?: number; termMonths?: number;
  dailyRate: number; dailyPayment: number; totalRepayment: number;
  paidAmount: number; remainingAmount: number;
  status: string;
  signedAt?: string; signedIp?: string; issuedAt?: string; closedAt?: string; createdAt: string;
  schedule: ScheduleRow[];
  payments: PaymentRow[];
  paymentRequests: PayReqRow[];
}

const LOAN_STATUS_LABEL: Record<string, string> = {
  pending_signing: 'Ожидает подписания', active: 'Активен', overdue: 'Просрочен', closed: 'Закрыт',
};
const LOAN_STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending_signing: { bg: '#EBF1FE', color: 'var(--accent-indigo)' },
  active:          { bg: '#E0F5EC', color: 'var(--accent-mint)' },
  overdue:         { bg: '#FAD7D4', color: 'var(--accent-crimson)' },
  closed:          { bg: '#F0F3F6', color: 'var(--text-secondary)' },
};
const SCH_STATUS_LABEL: Record<ScheduleRow['status'], string> = {
  UNPAID: 'Ожидает',
  PARTIALLY_PAID: 'Частично оплачен',
  PAID: 'Оплачен',
  OVERDUE: 'Просрочен',
  SKIPPED_EARLY_PAYMENT: 'Досрочно закрыт',
};

// FSM: допустимые переходы оператором
const ALLOWED_LOAN_TRANSITIONS: Record<string, string[]> = {
  active:  ['overdue', 'closed'],
  overdue: ['active', 'closed'],
  closed:  [],
  pending_signing: [],
};
const TRANSITION_CFG: Record<string, { label: string; bg: string; color: string; border?: string }> = {
  active:  { label: 'Отметить активным',    bg: 'var(--accent-mint)', color: '#fff' },
  overdue: { label: 'Отметить просроченным', bg: 'rgba(239, 71, 111, 0.14)', color: 'var(--accent-crimson)', border: '1.5px solid rgba(239, 71, 111, 0.4)' },
  closed:  { label: 'Закрыть займ',         bg: 'rgba(30, 41, 59, 0.88)', color: '#E2E8F0', border: '1px solid var(--line-strong)' },
};

export default function AdminLoanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const { admin } = useAdminAuth();
  const isAdmin = admin?.role === 'admin';

  const [loan, setLoan]         = useState<LoanDetail | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const handleError = useAdminErrorHandler(setError);

  const [statusBusy, setStatusBusy] = useState(false);

  // Record payment (admin-only)
  const [showPayForm, setShowPayForm] = useState(false);
  const [payAmount, setPayAmount]     = useState('');
  const [payNote, setPayNote]         = useState('');
  const [payBusy, setPayBusy]         = useState(false);
  const [payError, setPayError]       = useState('');

  const load = useCallback(() => {
    const token = getAdminToken(); if (!token) return;
    setLoading(true);
    api.get<LoanDetail>(`/admin/loans/${id}`, authHeader(token))
      .then(setLoan).catch(handleError).finally(() => setLoading(false));
  }, [id, handleError]);

  useEffect(() => { load(); }, [load]);

  async function changeStatus(status: string) {
    const token = getAdminToken(); if (!token) return;
    setStatusBusy(true); setError('');
    try {
      await api.patch(`/admin/loans/${id}/status`, { status }, authHeader(token));
      await load();
    } catch (e: any) { handleError(e); }
    finally { setStatusBusy(false); }
  }

  async function recordPayment() {
    const token = getAdminToken(); if (!token) return;
    const amount = Number(payAmount);
    if (!amount || amount <= 0) { setPayError('Введите сумму'); return; }
    if (loan && amount > loan.remainingAmount) { setPayError('Сумма превышает остаток задолженности'); return; }
    setPayBusy(true); setPayError('');
    try {
      await api.post(`/admin/loans/${id}/payments`, { amount, note: payNote || undefined }, authHeader(token));
      setShowPayForm(false); setPayAmount(''); setPayNote('');
      await load();
    } catch (e: any) { setPayError(e?.message ?? 'Ошибка'); }
    finally { setPayBusy(false); }
  }

  const loanStatusStyle = loan ? LOAN_STATUS_COLORS[loan.status] ?? { bg: '#F0F3F6', color: 'var(--text-secondary)' } : null;
  const transitions     = loan ? ALLOWED_LOAN_TRANSITIONS[loan.status] ?? [] : [];
  const paidCount       = loan?.schedule.filter(s => s.status === 'PAID').length ?? 0;
  const nextSchedule    = loan?.schedule.find((s) => s.status !== 'PAID' && s.status !== 'SKIPPED_EARLY_PAYMENT');

  return (
    <AdminShell>
      <div className="admin-page">
        <button onClick={() => router.back()}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.875rem', marginBottom: '1.25rem', padding: 0 }}>
          <ChevronLeft size={16} /> Назад к займам
        </button>

        {loading && <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>{[200,140,100,180].map(w=><Skeleton key={w} h={20} w={w}/>)}</div>}
        {!loading && error && <div style={{ borderLeft: '4px solid var(--accent-crimson)', background: 'rgba(239, 71, 111, 0.16)', borderRadius: '8px', padding: '1rem', color: '#fecdd3', marginBottom: '1rem' }}>{error}</div>}

        {!loading && loan && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>Займ</p>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {[loan.user?.firstName, loan.user?.lastName].filter(Boolean).join(' ') || loan.user?.phone || '—'}
                </h1>
                <p style={{ fontFamily: 'var(--f-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{loan.id.slice(0, 16)}…</p>
              </div>
              {loanStatusStyle && (
                <span style={{ background: loanStatusStyle.bg, color: loanStatusStyle.color, fontWeight: 700, fontSize: '0.875rem', padding: '6px 14px', borderRadius: '8px' }}>
                  {LOAN_STATUS_LABEL[loan.status] ?? loan.status}
                </span>
              )}
            </div>

            {/* Balance block */}
            <div style={{ background: 'var(--surface-0)', borderRadius: '10px', padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Итого к возврату</p>
                  <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: '#fff', fontSize: '1.0625rem' }}>{formatCurrency(loan.totalRepayment)}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Выплачено</p>
                  <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: 'var(--accent-mint)', fontSize: '1.0625rem' }}>{formatCurrency(loan.paidAmount)}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Остаток</p>
                  <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: loan.remainingAmount === 0 ? 'var(--accent-mint)' : 'var(--accent-indigo)', fontSize: '1.0625rem' }}>{formatCurrency(loan.remainingAmount)}</p>
                </div>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: '999px', background: loan.remainingAmount === 0 ? 'var(--accent-mint)' : 'var(--accent-indigo)', width: `${loan.totalRepayment > 0 ? Math.min(100, (loan.paidAmount / loan.totalRepayment) * 100) : 0}%`, transition: 'width 300ms ease' }} />
              </div>
            </div>

            {/* Parameters */}
            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--line-soft)', borderRadius: '10px', padding: '1rem' }}>
              <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Параметры займа</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                {[
                  { label: 'Сумма займа',       value: formatCurrency(loan.amount) },
                  { label: 'Ставка',             value: getLoanRateLabel(loan) },
                  { label: 'Срок',               value: getLoanTermLabel(loan) },
                  { label: getLoanPaymentLabel(loan.type),  value: formatCurrency(loan.dailyPayment) },
                  { label: 'Дата выдачи',        value: loan.issuedAt ? formatDate(loan.issuedAt) : '—' },
                  { label: 'Дата закрытия',      value: loan.closedAt ? formatDate(loan.closedAt) : '—' },
                  ...(loan.signedIp ? [{ label: 'IP подписания', value: loan.signedIp }] : []),
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>{label}</p>
                    <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>{value}</p>
                  </div>
                ))}
              </div>
              {loan.user && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #F0F3F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>Клиент</p>
                    <p style={{ fontFamily: 'var(--f-mono)', color: 'var(--text-primary)' }}>{loan.user.phone}</p>
                  </div>
                  <Link href={`/admin/clients/${loan.user.id}`} style={{ fontSize: '0.8125rem', color: 'var(--accent-indigo)', textDecoration: 'none', fontWeight: 600 }}>
                    Карточка клиента →
                  </Link>
                </div>
              )}
            </div>

            {/* Actions: status change + record payment */}
            {(transitions.length > 0 || isAdmin) && loan.status !== 'pending_signing' && (
              <div style={{ background: 'var(--surface-1)', border: '1px solid var(--line-soft)', borderRadius: '10px', padding: '1rem' }}>
                <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.875rem' }}>Действия</h2>
                <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {transitions.map((t) => {
                    const cfg = TRANSITION_CFG[t];
                    if (!cfg) return null;
                    return (
                      <button key={t} onClick={() => changeStatus(t)} disabled={statusBusy}
                        style={{ background: statusBusy ? 'var(--surface-2)' : cfg.bg, color: statusBusy ? 'var(--text-secondary)' : cfg.color, border: cfg.border ?? 'none', borderRadius: '8px', padding: '9px 18px', fontWeight: 600, cursor: statusBusy ? 'not-allowed' : 'pointer', fontSize: '0.875rem' }}>
                        {cfg.label}
                      </button>
                    );
                  })}
                  {isAdmin && loan.status !== 'closed' && (
                    <button onClick={() => setShowPayForm((v) => !v)}
                      style={{ background: showPayForm ? 'var(--surface-2)' : 'var(--accent-indigo)', color: showPayForm ? 'var(--text-secondary)' : '#fff', border: 'none', borderRadius: '8px', padding: '9px 18px', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>
                      {showPayForm ? 'Отмена' : 'Зафиксировать платёж'}
                    </button>
                  )}
                </div>

                {showPayForm && (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--surface-2)', borderRadius: '10px', border: '1px solid var(--line-soft)' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)', marginBottom: '0.875rem' }}>Фиксация платежа</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem', marginBottom: '0.625rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Сумма (EUR)</label>
                        <input type="number" min={0.01} max={loan.remainingAmount} step="0.01"
                          value={payAmount} onChange={(e) => setPayAmount(e.target.value)}
                          placeholder={String(loan.remainingAmount)}
                          style={{ width: '100%', border: '1px solid var(--line-strong)', borderRadius: '8px', padding: '9px 12px', fontSize: '1rem', boxSizing: 'border-box', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Примечание (необязательно)</label>
                        <input type="text" value={payNote} onChange={(e) => setPayNote(e.target.value)}
                          placeholder="Банковский перевод, кэш…"
                          style={{ width: '100%', border: '1px solid var(--line-strong)', borderRadius: '8px', padding: '9px 12px', fontSize: '1rem', boxSizing: 'border-box', outline: 'none' }}
                        />
                      </div>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.625rem' }}>
                      Максимум: {formatCurrency(loan.remainingAmount)}
                    </p>
                    {payError && <p style={{ color: 'var(--accent-crimson)', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>{payError}</p>}
                    <button onClick={recordPayment} disabled={payBusy || !payAmount}
                      style={{ background: (payBusy || !payAmount) ? 'rgba(79, 70, 229, 0.55)' : 'var(--accent-indigo)', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 20px', fontWeight: 600, cursor: (payBusy || !payAmount) ? 'not-allowed' : 'pointer', fontSize: '0.9375rem' }}>
                      {payBusy ? 'Фиксирую…' : 'Подтвердить'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Schedule timeline */}
            {loan.schedule.length > 0 && (
              <div style={{ background: 'var(--surface-1)', border: '1px solid var(--line-soft)', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
                  <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)' }}>График платежей</h2>
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{paidCount} / {loan.schedule.length} оплачено</span>
                </div>
                {nextSchedule && (
                  <div style={{ background: 'rgba(79, 70, 229, 0.16)', borderRadius: '8px', padding: '0.625rem 1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--accent-indigo)', fontWeight: 600 }}>Ближайший платёж</span>
                    <span style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: 'var(--accent-indigo)' }}>
                      {formatCurrency(nextSchedule.amountRemaining)} — {formatDate(nextSchedule.dueDate)}
                    </span>
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {loan.schedule.map((row, idx) => {
                    const isPaid    = row.status === 'PAID';
                    const isSkipped = row.status === 'SKIPPED_EARLY_PAYMENT';
                    const isOverdue = row.status === 'OVERDUE';
                    const isPartial = row.status === 'PARTIALLY_PAID';
                    const isNext    = row.seq === nextSchedule?.seq;
                    const last      = idx === loan.schedule.length - 1;
                    const dotColor  = (isPaid || isSkipped)
                      ? 'var(--accent-mint)'
                      : isOverdue
                        ? 'var(--accent-crimson)'
                        : isPartial
                          ? 'var(--accent-indigo)'
                          : isNext
                            ? 'var(--accent-indigo)'
                            : 'var(--line-strong)';
                    return (
                      <div key={row.id} style={{ display: 'flex', gap: '0.875rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                          <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: (isPaid || isSkipped) ? 'var(--accent-mint)' : isPartial ? 'rgba(46, 125, 247, 0.14)' : '#fff', border: `2px solid ${dotColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                            {(isPaid || isSkipped) && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>}
                            {isNext && !isPaid && !isSkipped && <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-indigo)' }} />}
                          </div>
                          {!last && <div style={{ width: '2px', flex: 1, minHeight: '20px', background: (isPaid || isSkipped) ? 'var(--accent-mint)' : 'var(--surface-2)' }} />}
                        </div>
                        <div style={{ flex: 1, paddingBottom: last ? 0 : '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                          <div>
                            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontFamily: 'var(--f-mono)' }}>Платёж №{row.seq}</span>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontFamily: 'var(--f-mono)', marginTop: '2px' }}>{formatDate(row.dueDate)}</div>
                            {(isPartial || isOverdue) && row.amountPaid > 0 && (
                              <div style={{ fontSize: '0.75rem', color: isOverdue ? 'var(--accent-crimson)' : 'var(--accent-indigo)', marginTop: '2px' }}>
                                Оплачено {formatCurrency(row.amountPaid)} из {formatCurrency(row.amountRequired)}
                              </div>
                            )}
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>{formatCurrency((isPaid || isSkipped) ? row.amountRequired : row.amountRemaining)}</div>
                            {!isPaid && !isSkipped && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                План {formatCurrency(row.amountRequired)}
                              </div>
                            )}
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: '2px', color: (isPaid || isSkipped) ? 'var(--accent-mint)' : isOverdue ? 'var(--accent-crimson)' : isPartial ? 'var(--accent-indigo)' : 'var(--text-secondary)' }}>
                              {SCH_STATUS_LABEL[row.status] ?? row.status}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Payment history */}
            {loan.payments.length > 0 && (
              <div style={{ background: 'var(--surface-1)', border: '1px solid var(--line-soft)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid #F0F3F6' }}>
                  <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>История платежей</p>
                </div>
                <table className="admin-table" style={{ width: '100%' }}>
                  <thead><tr><th>Дата</th><th>Сумма</th><th>Примечание</th></tr></thead>
                  <tbody>
                    {loan.payments.map((p) => (
                      <tr key={p.id}>
                        <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{formatDate(p.recordedAt)}</td>
                        <td style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: 'var(--accent-mint)' }}>{formatCurrency(p.amount)}</td>
                        <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{p.note || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Payment requests */}
            {loan.paymentRequests.length > 0 && (
              <div style={{ background: 'var(--surface-1)', border: '1px solid var(--line-soft)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid #F0F3F6' }}>
                  <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>Заявки на оплату</p>
                </div>
                <table className="admin-table" style={{ width: '100%' }}>
                  <thead><tr><th>Дата</th><th>Сумма</th><th>Reference</th><th>Статус</th></tr></thead>
                  <tbody>
                    {loan.paymentRequests.map((pr) => (
                      <tr key={pr.id}>
                        <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{formatDate(pr.createdAt)}</td>
                        <td style={{ fontFamily: 'var(--f-mono)', fontWeight: 700 }}>{formatCurrency(pr.amount)}</td>
                        <td style={{ fontFamily: 'var(--f-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{pr.reference}</td>
                        <td style={{ fontSize: '0.8125rem', fontWeight: 600, color: pr.status === 'confirmed' ? 'var(--accent-mint)' : pr.status === 'rejected' ? 'var(--accent-crimson)' : '#C08020' }}>
                          {pr.status === 'confirmed' ? 'Подтверждена' : pr.status === 'rejected' ? 'Отклонена' : 'Ожидает'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
