'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, ChevronUp, FileText, ShieldCheck, Wallet } from 'lucide-react';
import CabinetShell from '@/widgets/sidebar/CabinetShell';
import { api, authHeader } from '@/shared/lib/api';
import { getToken } from '@/shared/lib/auth';
import { formatCurrency, formatDate } from '@/shared/lib/format';
import { Skeleton } from '@/shared/ui/Skeleton';

interface ScheduleItem {
  id: string;
  seq: number;
  dueDate: string;
  amountRequired: number;
  amountPaid: number;
  amountRemaining: number;
  status: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'SKIPPED_EARLY_PAYMENT';
  paidAt?: string;
}

interface PaymentReq {
  id: string;
  loanId: string;
  amount: number;
  reference: string;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
}

interface LoanDetail {
  id: string;
  amount: number;
  termDays: number;
  dailyRate: number;
  dailyPayment: number;
  totalRepayment: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'pending_signing' | 'active' | 'overdue' | 'closed';
  issuedAt?: string;
  closedAt?: string;
  signedAt?: string;
  nextPaymentDate?: string;
  nextPaymentAmount?: number;
  schedule: ScheduleItem[];
}

const STATUS_LABELS: Record<LoanDetail['status'], { label: string; cls: string }> = {
  pending_signing: { label: 'Ожидает подписания', cls: 'badge-signing' },
  active: { label: 'Активен', cls: 'badge-active' },
  overdue: { label: 'Просрочен', cls: 'badge-overdue' },
  closed: { label: 'Закрыт', cls: 'badge-closed' },
};

function darkCard(extra: React.CSSProperties = {}): React.CSSProperties {
  return {
    background: 'linear-gradient(180deg, rgba(20,25,36,0.94) 0%, rgba(11,15,25,0.96) 100%)',
    border: '1px solid rgba(140,144,159,0.18)',
    borderRadius: '18px',
    boxShadow: '0 18px 44px rgba(0,0,0,0.24)',
    color: '#D8E3FB',
    ...extra,
  };
}

function DetailSkeleton() {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div style={{ ...darkCard({ padding: '1.5rem' }) }}>
        <Skeleton h={18} w={180} />
        <div style={{ marginTop: '1rem' }}><Skeleton h={54} w={260} /></div>
      </div>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        {[1, 2, 3, 4].map((i) => <div key={i} style={{ ...darkCard({ padding: '1rem' }) }}><Skeleton h={74} /></div>)}
      </div>
      <div style={{ ...darkCard({ padding: '1rem' }) }}><Skeleton h={260} /></div>
    </div>
  );
}

function ScheduleRows({ rows, tone, nearestPendingId }: { rows: ScheduleItem[]; tone: 'open' | 'paid'; nearestPendingId?: string }) {
  return (
    <div style={{ maxHeight: tone === 'open' ? '380px' : '240px', overflowY: 'auto', border: '1px solid rgba(140,144,159,0.18)', borderRadius: '12px', background: tone === 'open' ? 'rgba(11,15,25,0.72)' : 'rgba(18,18,20,0.52)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '88px 1fr 160px 120px', gap: '0.75rem', padding: '0.8rem 1rem', borderBottom: '1px solid rgba(140,144,159,0.16)', fontSize: '0.75rem', color: 'rgba(154,164,182,0.86)', textTransform: 'uppercase', letterSpacing: '0.05em', position: 'sticky', top: 0, background: tone === 'open' ? 'rgba(11,15,25,0.94)' : 'rgba(18,18,20,0.94)', zIndex: 1 }}>
        <span>№</span>
        <span>Дата</span>
        <span>Сумма</span>
        <span>Статус</span>
      </div>
      {rows.map((row) => {
        const isPaid = row.status === 'PAID';
        const isOverdue = row.status === 'OVERDUE';
        const isPartial = row.status === 'PARTIALLY_PAID';
        const isSkipped = row.status === 'SKIPPED_EARLY_PAYMENT';
        const isNearest = nearestPendingId === row.id;
        const badgeClass = isPaid
          ? 'badge-approved'
          : isSkipped
            ? 'badge-approved'
            : isOverdue
              ? 'badge-overdue'
              : isPartial
                ? 'badge-partial'
                : 'badge-pending';
        const badgeLabel = isPaid
          ? 'Оплачен'
          : isSkipped
            ? 'Досрочно закрыт'
            : isOverdue
              ? 'Просрочен'
              : isPartial
                ? 'Частично оплачен'
                : isNearest
                  ? 'Ближайший'
                  : 'Ожидает';
        return (
          <div
            key={row.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '88px 1fr 160px 120px',
              gap: '0.75rem',
              padding: '0.875rem 1rem',
              borderBottom: '1px solid rgba(140,144,159,0.12)',
              alignItems: 'center',
              background: isPaid
                ? 'rgba(16,185,129,0.06)'
                : isSkipped
                  ? 'rgba(16,185,129,0.04)'
                  : isOverdue
                    ? 'rgba(239,68,68,0.08)'
                    : isPartial
                      ? 'rgba(59,130,246,0.08)'
                      : isNearest
                        ? 'rgba(245,158,11,0.08)'
                        : 'transparent',
              boxShadow: isPartial
                ? 'inset 0 0 0 1px rgba(59,130,246,0.24)'
                : isNearest
                  ? 'inset 0 0 0 1px rgba(245,158,11,0.28)'
                  : 'none',
              opacity: isPaid && tone === 'paid' ? 0.82 : 1,
            }}
          >
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.8125rem', color: 'rgba(154,164,182,0.92)' }}>#{row.seq}</span>
            <div>
              <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 600, color: '#F8FAFC', marginBottom: '2px' }}>{formatDate(row.dueDate)}</p>
              {isPaid && row.paidAt && <p style={{ fontSize: '0.75rem', color: '#6EE7B7' }}>Оплачен {formatDate(row.paidAt)}</p>}
              {isPartial && <p style={{ fontSize: '0.75rem', color: '#93C5FD' }}>Оплачено {formatCurrency(row.amountPaid)} из {formatCurrency(row.amountRequired)}</p>}
              {isOverdue && row.amountPaid > 0 && <p style={{ fontSize: '0.75rem', color: '#FCA5A5' }}>Частично закрыт: {formatCurrency(row.amountPaid)}</p>}
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: '#F8FAFC' }}>{formatCurrency(isPaid ? row.amountRequired : row.amountRemaining)}</p>
              {!isPaid && (
                <p style={{ fontSize: '0.75rem', color: 'rgba(154,164,182,0.88)' }}>
                  Требуется {formatCurrency(row.amountRequired)}
                </p>
              )}
            </div>
            <span className={`badge ${badgeClass}`}>{badgeLabel}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function LoanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loan, setLoan] = useState<LoanDetail | null>(null);
  const [payRequests, setPayRequests] = useState<PaymentReq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPaidRows, setShowPaidRows] = useState(false);
  const [signStep, setSignStep] = useState<'idle' | 'otp_sent' | 'done'>('idle');
  const [mockCode, setMockCode] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [signLoading, setSignLoading] = useState(false);
  const [signError, setSignError] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [showPayForm, setShowPayForm] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payRef, setPayRef] = useState('');
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState('');
  const [payoffData, setPayoffData] = useState<{ payoffAmount: number; savings: number } | null>(null);
  const [payoffLoading, setPayoffLoading] = useState(false);
  const [payoffLocked, setPayoffLocked] = useState(false);

  const reload = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const [detail, requests] = await Promise.all([
        api.get<LoanDetail>(`/cabinet/loans/${id}`, authHeader(token)),
        api.get<PaymentReq[]>('/cabinet/payment-requests', authHeader(token)),
      ]);
      setLoan(detail);
      setPayRequests(requests.filter((request) => request.loanId === id));
    } catch (e: any) {
      setError(e.message ?? 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    if (loan && (loan.status === 'active' || loan.status === 'overdue') && searchParams.get('pay') === '1') {
      setShowPayForm(true);
    }
  }, [loan, searchParams]);

  async function requestSignOtp() {
    const token = getToken();
    if (!token) return;
    setSignLoading(true);
    setSignError('');
    try {
      const res = await api.post<{ mockCode: string }>(`/cabinet/loans/${id}/sign/request`, {}, authHeader(token));
      setMockCode(res.mockCode);
      setSignStep('otp_sent');
    } catch (e: any) {
      setSignError(e.message ?? 'Не удалось отправить код');
    } finally {
      setSignLoading(false);
    }
  }

  async function submitSign() {
    const code = otp.join('');
    if (code.length < 6) {
      setSignError('Введите 6-значный код');
      return;
    }
    const token = getToken();
    if (!token) return;
    setSignLoading(true);
    setSignError('');
    try {
      await api.post<LoanDetail>(`/cabinet/loans/${id}/sign`, { code }, authHeader(token));
      setSignStep('done');
      await reload();
      router.refresh();
    } catch (e: any) {
      setSignError(e.message ?? 'Ошибка подтверждения');
    } finally {
      setSignLoading(false);
    }
  }

  async function fetchPayoff() {
    const token = getToken();
    if (!token || !loan) return;
    setPayoffLoading(true);
    try {
      const data = await api.get<{ payoffAmount: number; savings: number }>(
        `/cabinet/loans/${id}/payoff`,
        authHeader(token),
      );
      setPayoffData(data);
      setPayAmount(data.payoffAmount.toFixed(2));
      setPayoffLocked(true);
      setShowPayForm(true);
    } catch (e: any) {
      setPayError(e.message ?? 'Не удалось рассчитать сумму погашения');
    } finally {
      setPayoffLoading(false);
    }
  }

  async function submitPayment() {
    const token = getToken();
    if (!token || !loan) return;
    const amount = Number(payAmount);
    if (!amount || amount <= 0) {
      setPayError('Введите сумму платежа');
      return;
    }
    if (amount > loan.remainingAmount) {
      setPayError('Сумма превышает остаток задолженности');
      return;
    }
    if (!payRef.trim()) {
      setPayError('Введите reference платежа');
      return;
    }

    setPayLoading(true);
    setPayError('');
    try {
      await api.post('/cabinet/payment-requests', { loanId: id, amount, reference: payRef.trim() }, authHeader(token));
      setShowPayForm(false);
      setPayAmount('');
      setPayRef('');
      setPayoffData(null);
      setPayoffLocked(false);
      await reload();
      router.refresh();
    } catch (e: any) {
      setPayError(e.message ?? 'Не удалось отправить заявку');
    } finally {
      setPayLoading(false);
    }
  }

  function handleOtpInput(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  }

  const openRows = useMemo(
    () => loan?.schedule.filter((row) => row.status !== 'PAID' && row.status !== 'SKIPPED_EARLY_PAYMENT') ?? [],
    [loan],
  );
  const paidRows = useMemo(
    () => loan?.schedule.filter((row) => row.status === 'PAID' || row.status === 'SKIPPED_EARLY_PAYMENT') ?? [],
    [loan],
  );
  const nearestPendingId = useMemo(() => openRows[0]?.id, [openRows]);
  const progress = loan && loan.totalRepayment > 0 ? Math.min(100, (loan.paidAmount / loan.totalRepayment) * 100) : 0;
  const activeRequest = payRequests.find((request) => request.status === 'pending');

  if (loading) {
    return <CabinetShell><div className="cabinet-page"><DetailSkeleton /></div></CabinetShell>;
  }

  if (error || !loan) {
    return (
      <CabinetShell>
        <div className="cabinet-page">
          <div style={{ ...darkCard({ borderLeft: '4px solid #EF4444', padding: '0.875rem 1rem' }) }}>
            <p style={{ fontWeight: 700, color: '#F8FAFC', marginBottom: '0.375rem' }}>Не удалось загрузить займ</p>
            <p style={{ color: 'rgba(154,164,182,0.9)', fontSize: '0.875rem', marginBottom: '0.875rem' }}>{error}</p>
            <button onClick={reload} className="btn btn-primary btn-sm">Попробовать снова</button>
          </div>
        </div>
      </CabinetShell>
    );
  }

  const status = STATUS_LABELS[loan.status] ?? { label: loan.status, cls: 'badge-closed' };

  return (
    <CabinetShell>
      <div className="cabinet-page" style={{ maxWidth: '1180px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'rgba(154,164,182,0.84)', marginBottom: '4px' }}>Личный кабинет / Мои займы</p>
            <h1 style={{ fontFamily: 'var(--f-mono)', fontSize: '2rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.35rem' }}>{formatCurrency(loan.amount)}</h1>
            <p style={{ color: 'rgba(154,164,182,0.9)', fontSize: '0.9375rem' }}>Детали договора, компактный график и действия по текущему обязательству.</p>
          </div>
          <span className={`badge ${status.cls}`}>{status.label}</span>
        </div>

        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(320px, 0.85fr)', alignItems: 'start' }} className="grid-2-resp">
          <div style={{ display: 'grid', gap: '1rem' }}>
            <section style={{ ...darkCard({ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(8,20,37,0.94) 0%, rgba(17,28,45,0.96) 55%, rgba(18,18,20,0.98) 100%)', position: 'relative', overflow: 'hidden' }) }}>
              <div style={{ position: 'absolute', width: '220px', height: '220px', right: '-50px', top: '-70px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.18), transparent 70%)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem', flexWrap: 'wrap', position: 'relative' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(154,164,182,0.82)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>Состояние займа</p>
                  <h2 style={{ fontSize: '1.55rem', fontWeight: 700, marginBottom: '0.4rem', color: '#F8FAFC' }}>{formatCurrency(loan.remainingAmount)}</h2>
                  <p style={{ fontSize: '0.9375rem', color: 'rgba(216,227,251,0.76)' }}>Остаток задолженности по договору на текущий момент.</p>
                </div>
                <div style={{ minWidth: '220px', padding: '1rem 1.1rem', borderRadius: '12px', background: 'rgba(18,18,20,0.4)', border: '1px solid rgba(140,144,159,0.18)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(154,164,182,0.82)', marginBottom: '4px' }}>Ближайший платёж</p>
                  <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, fontSize: '1rem', marginBottom: '3px', color: '#F8FAFC' }}>{loan.nextPaymentAmount ? formatCurrency(loan.nextPaymentAmount) : '—'}</p>
                  <p style={{ fontSize: '0.8125rem', color: 'rgba(154,164,182,0.88)' }}>{loan.nextPaymentDate ? formatDate(loan.nextPaymentDate) : 'Нет будущих платежей'}</p>
                </div>
              </div>

              {loan.status !== 'pending_signing' && (
                <div style={{ marginTop: '1rem', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', gap: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.8125rem', color: 'rgba(154,164,182,0.86)' }}>Прогресс исполнения обязательств</span>
                    <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.8125rem', color: '#F8FAFC' }}>{progress.toFixed(1)}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(140,144,159,0.18)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #10B981 0%, #3B82F6 100%)' }} />
                  </div>
                </div>
              )}
            </section>

            <section style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
              {[
                { label: 'Итого к возврату', value: formatCurrency(loan.totalRepayment), tone: 'rgba(59,130,246,0.14)' },
                { label: 'Выплачено', value: formatCurrency(loan.paidAmount), tone: 'rgba(16,185,129,0.14)' },
                { label: 'Ставка', value: `${(loan.dailyRate * 100).toFixed(1)}% / день`, tone: 'rgba(139,92,246,0.14)' },
                { label: 'Срок', value: `${loan.termDays} дней`, tone: 'rgba(245,158,11,0.14)' },
              ].map((item) => (
                <div key={item.label} style={{ ...darkCard({ padding: '1rem 1.05rem', background: `linear-gradient(180deg, ${item.tone} 0%, rgba(11,15,25,0.96) 100%)` }) }}>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(154,164,182,0.86)', marginBottom: '4px' }}>{item.label}</p>
                  <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: '#F8FAFC' }}>{item.value}</p>
                </div>
              ))}
            </section>

            {loan.status === 'pending_signing' && (
              <section style={{ ...darkCard({ padding: '1rem', background: 'linear-gradient(180deg, rgba(37,99,235,0.18) 0%, rgba(11,15,25,0.96) 100%)' }) }}>
                <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', marginBottom: '0.875rem' }}>
                  <ShieldCheck size={20} color="#93C5FD" />
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.25rem' }}>Займ ожидает подписания</h3>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(154,164,182,0.9)' }}>Подпишите договор через одноразовый код, чтобы активировать график и платежные действия.</p>
                  </div>
                </div>

                {signStep === 'idle' && (
                  <>
                    {signError && <p style={{ color: '#FCA5A5', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{signError}</p>}
                    <button onClick={requestSignOtp} disabled={signLoading} className="btn btn-primary btn-sm">
                      {signLoading ? 'Отправка кода…' : 'Подписать займ'}
                    </button>
                  </>
                )}

                {signStep === 'otp_sent' && (
                  <>
                    <div className="mock-banner" style={{ marginBottom: '0.875rem' }}>
                      Учебный режим — SMS не отправляется. Код подписания: <strong style={{ fontFamily: 'var(--f-mono)' }}>{mockCode}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(element) => {
                            otpRefs.current[index] = element;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(event) => handleOtpInput(index, event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Backspace' && !digit && index > 0) otpRefs.current[index - 1]?.focus();
                          }}
                          style={{ width: '46px', height: '50px', textAlign: 'center', fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--f-mono)', border: '1px solid rgba(140,144,159,0.24)', borderRadius: '10px', outline: 'none', background: 'rgba(11,15,25,0.92)', color: '#F8FAFC' }}
                        />
                      ))}
                    </div>
                    {signError && <p style={{ color: '#FCA5A5', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{signError}</p>}
                    <button onClick={submitSign} disabled={signLoading} className="btn btn-primary btn-sm">
                      {signLoading ? 'Проверка…' : 'Подтвердить подписание'}
                    </button>
                  </>
                )}

                {signStep === 'done' && <p style={{ color: '#6EE7B7', fontWeight: 600 }}>Займ подписан. График и действия обновлены.</p>}
              </section>
            )}

            {loan.schedule.length > 0 && (
              <section style={{ ...darkCard({ padding: '1.1rem 1.15rem' }) }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.875rem', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.25rem' }}>График платежей</h3>
                    <p style={{ fontSize: '0.8125rem', color: 'rgba(154,164,182,0.88)' }}>Календарные даты зафиксированы, а переплата уменьшает только будущие суммы.</p>
                  </div>
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.8125rem', color: 'rgba(154,164,182,0.88)' }}>{openRows.length} актуальных · {paidRows.length} оплаченных</span>
                </div>

                {openRows.length === 0 ? (
                  <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(18,18,20,0.52)', color: 'rgba(154,164,182,0.88)', fontSize: '0.875rem', border: '1px solid rgba(140,144,159,0.14)' }}>Открытых строк графика нет.</div>
                ) : (
                  <ScheduleRows rows={openRows} tone="open" nearestPendingId={nearestPendingId} />
                )}

                {paidRows.length > 0 && (
                  <div style={{ marginTop: '0.875rem' }}>
                    <button onClick={() => setShowPaidRows((value) => !value)} className="btn btn-secondary btn-sm" style={{ gap: '0.5rem' }}>
                      {showPaidRows ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      {showPaidRows ? 'Скрыть оплаченные дни' : 'Показать оплаченные дни'}
                    </button>
                    {showPaidRows && <div style={{ marginTop: '0.75rem' }}><ScheduleRows rows={paidRows} tone="paid" nearestPendingId={nearestPendingId} /></div>}
                  </div>
                )}
              </section>
            )}
          </div>

          <aside style={{ display: 'grid', gap: '1rem' }}>
            <section style={{ ...darkCard({ padding: '1.1rem 1.15rem' }) }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.875rem' }}>Действия</h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <button onClick={() => window.alert('Учебный режим — реальный договор не сформирован, здесь показывается mock-поток.')} className="btn btn-secondary" style={{ justifyContent: 'center' }}>
                  <FileText size={16} /> Просмотреть договор
                </button>
                {(loan.status === 'active' || loan.status === 'overdue') && (
                  <>
                    <button onClick={() => { setPayoffLocked(false); setPayoffData(null); setShowPayForm((v) => !v); }} className="btn btn-primary" style={{ justifyContent: 'center' }}>
                      <Wallet size={16} /> {showPayForm ? 'Скрыть форму оплаты' : 'Создать заявку на оплату'}
                    </button>
                    <button onClick={fetchPayoff} disabled={payoffLoading} className="btn btn-secondary" style={{ justifyContent: 'center', borderColor: 'rgba(16,185,129,0.4)', color: '#6EE7B7' }}>
                      {payoffLoading ? 'Расчёт...' : '✓ Погасить займ полностью'}
                    </button>
                  </>
                )}
              </div>

              <div className="mock-banner" style={{ marginTop: '0.875rem' }}>
                Учебный режим: реальные переводы и подписание договора не выполняются, интерфейс показывает mock-сценарий.
              </div>

              {showPayForm && (loan.status === 'active' || loan.status === 'overdue') && (
                <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '12px', background: 'rgba(18,18,20,0.54)', border: '1px solid rgba(140,144,159,0.16)' }}>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.75rem' }}>
                    {payoffLocked ? 'Досрочное погашение' : 'Новая заявка на оплату'}
                  </h4>

                  {payoffData && payoffLocked && (
                    <div style={{ padding: '0.75rem', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.24)', marginBottom: '0.875rem' }}>
                      <p style={{ fontSize: '0.8125rem', color: '#6EE7B7', lineHeight: 1.6 }}>
                        При досрочном погашении сегодня вы платите только за фактические дни использования займа.
                        {payoffData.savings > 0 && (
                          <> Экономия на процентах составит <strong style={{ fontFamily: 'var(--f-mono)' }}>{formatCurrency(payoffData.savings)}</strong>.</>
                        )}
                      </p>
                    </div>
                  )}

                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    <div>
                      <label className="input-label">Сумма (EUR)</label>
                      <input
                        className="input"
                        type="number"
                        min={0.01}
                        max={payoffLocked ? (payoffData?.payoffAmount ?? loan.remainingAmount) : loan.remainingAmount}
                        step="0.01"
                        value={payAmount}
                        readOnly={payoffLocked}
                        onChange={(event) => !payoffLocked && setPayAmount(event.target.value)}
                        style={payoffLocked ? { opacity: 0.85, cursor: 'not-allowed' } : undefined}
                      />
                    </div>
                    <div>
                      <label className="input-label">Reference</label>
                      <input className="input" type="text" value={payRef} onChange={(event) => setPayRef(event.target.value)} />
                    </div>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(154,164,182,0.88)', marginTop: '0.625rem' }}>
                    {payoffLocked
                      ? `Сумма досрочного погашения: ${formatCurrency(payoffData?.payoffAmount ?? 0)} (тело + проценты за 1 день)`
                      : `Максимальная сумма: ${formatCurrency(loan.remainingAmount)}`}
                  </p>
                  {payoffLocked && (
                    <button onClick={() => { setPayoffLocked(false); setPayoffData(null); setPayAmount(''); }} style={{ background: 'none', border: 'none', color: 'rgba(154,164,182,0.7)', fontSize: '0.75rem', cursor: 'pointer', padding: '4px 0' }}>
                      Ввести другую сумму
                    </button>
                  )}
                  {payError && <p style={{ fontSize: '0.8125rem', color: '#FCA5A5', marginTop: '0.5rem' }}>{payError}</p>}
                  <button onClick={submitPayment} disabled={payLoading} className="btn btn-primary" style={{ marginTop: '0.875rem', width: '100%' }}>
                    {payLoading ? 'Отправка…' : 'Отправить заявку'}
                  </button>
                </div>
              )}
            </section>

            <section style={{ ...darkCard({ padding: '1.1rem 1.15rem' }) }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.875rem' }}>Статус оплаты</h3>
              {payRequests.length === 0 ? (
                <div style={{ padding: '0.95rem', borderRadius: '10px', background: 'rgba(18,18,20,0.52)', color: 'rgba(154,164,182,0.88)', fontSize: '0.875rem', border: '1px solid rgba(140,144,159,0.14)' }}>Заявок на оплату пока нет.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {payRequests.slice(0, 4).map((request) => {
                    const badgeClass = request.status === 'confirmed' ? 'badge-approved' : request.status === 'rejected' ? 'badge-rejected' : 'badge-pending';
                    const badgeLabel = request.status === 'confirmed' ? 'Подтверждён' : request.status === 'rejected' ? 'Отклонён' : 'Ожидает';
                    return (
                      <div key={request.id} style={{ padding: '0.9rem 1rem', borderRadius: '10px', background: 'rgba(18,18,20,0.5)', border: '1px solid rgba(140,144,159,0.14)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '0.75rem', marginBottom: '0.375rem' }}>
                          <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: '#F8FAFC' }}>{formatCurrency(request.amount)}</p>
                          <span className={`badge ${badgeClass}`}>{badgeLabel}</span>
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: 'rgba(154,164,182,0.88)', marginBottom: '2px' }}>Reference: {request.reference}</p>
                        <p style={{ fontSize: '0.75rem', color: 'rgba(124,135,156,0.92)' }}>{formatDate(request.createdAt)}</p>
                      </div>
                    );
                  })}
                </div>
              )}
              {activeRequest && <p style={{ fontSize: '0.75rem', color: 'rgba(154,164,182,0.88)', marginTop: '0.75rem' }}>Открыта активная заявка на оплату. Новая заявка может быть отправлена после её обработки.</p>}
            </section>

            <section style={{ ...darkCard({ padding: '1.1rem 1.15rem' }) }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.875rem' }}>Параметры договора</h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {[
                  { label: 'Дата выдачи', value: loan.issuedAt ? formatDate(loan.issuedAt) : '—' },
                  { label: 'Дата подписания', value: loan.signedAt ? formatDate(loan.signedAt) : '—' },
                  { label: 'Дата закрытия', value: loan.closedAt ? formatDate(loan.closedAt) : '—' },
                  { label: 'Ежедневный платёж', value: formatCurrency(loan.dailyPayment) },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', paddingBottom: '0.625rem', borderBottom: '1px solid rgba(140,144,159,0.14)' }}>
                    <span style={{ fontSize: '0.8125rem', color: 'rgba(154,164,182,0.88)' }}>{item.label}</span>
                    <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.8125rem', color: '#F8FAFC', textAlign: 'right' }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '0.875rem' }}>
                <Link href="/cabinet/loans" style={{ color: '#93C5FD', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>Назад к списку займов</Link>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </CabinetShell>
  );
}
