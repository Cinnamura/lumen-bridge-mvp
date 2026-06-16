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
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
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

function cardStyle(extra: React.CSSProperties = {}): React.CSSProperties {
  return {
    background: '#fff',
    border: '1px solid #E8ECF0',
    borderRadius: '14px',
    boxShadow: '0 8px 24px rgba(13,27,42,0.06), 0 2px 6px rgba(13,27,42,0.04)',
    ...extra,
  };
}

function DetailSkeleton() {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div style={{ ...cardStyle({ padding: '1.5rem' }) }}>
        <Skeleton h={18} w={180} />
        <div style={{ marginTop: '1rem' }}><Skeleton h={54} w={260} /></div>
      </div>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
        {[1, 2, 3, 4].map((i) => <div key={i} style={{ ...cardStyle({ padding: '1rem' }) }}><Skeleton h={74} /></div>)}
      </div>
      <div style={{ ...cardStyle({ padding: '1rem' }) }}><Skeleton h={260} /></div>
    </div>
  );
}

function ScheduleRows({ rows, tone }: { rows: ScheduleItem[]; tone: 'open' | 'paid' }) {
  return (
    <div style={{ maxHeight: tone === 'open' ? '380px' : '240px', overflowY: 'auto', border: '1px solid #E8ECF0', borderRadius: '12px', background: tone === 'open' ? '#fff' : '#F8FAFD' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '88px 1fr 160px 120px', gap: '0.75rem', padding: '0.8rem 1rem', borderBottom: '1px solid #E8ECF0', fontSize: '0.75rem', color: '#4A6580', textTransform: 'uppercase', letterSpacing: '0.05em', position: 'sticky', top: 0, background: tone === 'open' ? '#fff' : '#F8FAFD', zIndex: 1 }}>
        <span>№</span>
        <span>Дата</span>
        <span>Сумма</span>
        <span>Статус</span>
      </div>
      {rows.map((row) => {
        const isPaid = row.status === 'paid';
        const isOverdue = row.status === 'overdue';
        const badgeClass = isPaid ? 'badge-approved' : isOverdue ? 'badge-overdue' : 'badge-pending';
        const badgeLabel = isPaid ? 'Оплачен' : isOverdue ? 'Просрочен' : 'Актуален';
        return (
          <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '88px 1fr 160px 120px', gap: '0.75rem', padding: '0.875rem 1rem', borderBottom: '1px solid #F0F3F6', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.8125rem', color: '#4A6580' }}>#{row.seq}</span>
            <div>
              <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 600, color: '#0D1B2A', marginBottom: '2px' }}>{formatDate(row.dueDate)}</p>
              {isPaid && row.paidAt && <p style={{ fontSize: '0.75rem', color: '#4A6580' }}>Оплачен {formatDate(row.paidAt)}</p>}
            </div>
            <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: '#0D1B2A' }}>{formatCurrency(row.amount)}</p>
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
    const token = getToken(); if (!token) return;
    setSignLoading(true); setSignError('');
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
    const token = getToken(); if (!token) return;
    setSignLoading(true); setSignError('');
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

  async function submitPayment() {
    const token = getToken(); if (!token || !loan) return;
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

    setPayLoading(true); setPayError('');
    try {
      await api.post('/cabinet/payment-requests', { loanId: id, amount, reference: payRef.trim() }, authHeader(token));
      setShowPayForm(false);
      setPayAmount('');
      setPayRef('');
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

  const openRows = useMemo(() => loan?.schedule.filter((row) => row.status !== 'paid') ?? [], [loan]);
  const paidRows = useMemo(() => loan?.schedule.filter((row) => row.status === 'paid') ?? [], [loan]);
  const progress = loan && loan.totalRepayment > 0 ? Math.min(100, (loan.paidAmount / loan.totalRepayment) * 100) : 0;
  const activeRequest = payRequests.find((request) => request.status === 'pending');

  if (loading) {
    return <CabinetShell><div className="cabinet-page"><DetailSkeleton /></div></CabinetShell>;
  }

  if (error || !loan) {
    return (
      <CabinetShell>
        <div className="cabinet-page">
          <div style={{ ...cardStyle({ borderLeft: '4px solid #C0392B', padding: '1rem 1.25rem' }) }}>
            <p style={{ fontWeight: 700, color: '#0D1B2A', marginBottom: '0.375rem' }}>Не удалось загрузить займ</p>
            <p style={{ color: '#4A6580', fontSize: '0.875rem', marginBottom: '0.875rem' }}>{error}</p>
            <button onClick={reload} style={{ background: '#2E7DF7', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 16px', fontWeight: 600, cursor: 'pointer' }}>Попробовать снова</button>
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
            <p style={{ fontSize: '0.75rem', color: '#4A6580', marginBottom: '4px' }}>Личный кабинет / Мои займы</p>
            <h1 style={{ fontFamily: 'var(--f-mono)', fontSize: '2rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.35rem' }}>{formatCurrency(loan.amount)}</h1>
            <p style={{ color: '#4A6580', fontSize: '0.9375rem' }}>Детали договора, компактный график и действия по текущему обязательству.</p>
          </div>
          <span className={`badge ${status.cls}`}>{status.label}</span>
        </div>

        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 0.85fr)', alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <section style={{ ...cardStyle({ padding: '1.5rem', background: 'linear-gradient(135deg, #0D1B2A 0%, #17314D 100%)', color: '#fff' }) }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>Состояние займа</p>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.4rem' }}>{formatCurrency(loan.remainingAmount)}</h2>
                  <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.72)' }}>Остаток задолженности по договору на текущий момент.</p>
                </div>
                <div style={{ minWidth: '220px', padding: '1rem 1.1rem', borderRadius: '14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Ближайший платёж</p>
                  <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, fontSize: '1rem', marginBottom: '3px' }}>{loan.nextPaymentAmount ? formatCurrency(loan.nextPaymentAmount) : '—'}</p>
                  <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.72)' }}>{loan.nextPaymentDate ? formatDate(loan.nextPaymentDate) : 'Нет будущих платежей'}</p>
                </div>
              </div>

              {loan.status !== 'pending_signing' && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', gap: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.62)' }}>Прогресс исполнения обязательств</span>
                    <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.8125rem', color: '#fff' }}>{progress.toFixed(1)}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.12)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #2E7DF7 0%, #7DB5FF 100%)' }} />
                  </div>
                </div>
              )}
            </section>

            <section style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
              {[
                { label: 'Итого к возврату', value: formatCurrency(loan.totalRepayment) },
                { label: 'Выплачено', value: formatCurrency(loan.paidAmount) },
                { label: 'Ставка', value: `${(loan.dailyRate * 100).toFixed(1)}% / день` },
                { label: 'Срок', value: `${loan.termDays} дней` },
              ].map((item) => (
                <div key={item.label} style={{ ...cardStyle({ padding: '1rem 1.05rem', background: 'linear-gradient(180deg, #fff 0%, #f8fafc 100%)' }) }}>
                  <p style={{ fontSize: '0.75rem', color: '#4A6580', marginBottom: '4px' }}>{item.label}</p>
                  <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: '#0D1B2A' }}>{item.value}</p>
                </div>
              ))}
            </section>

            {loan.status === 'pending_signing' && (
              <section style={{ ...cardStyle({ padding: '1.25rem', background: 'linear-gradient(180deg, #f6f9ff 0%, #edf4ff 100%)' }) }}>
                <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', marginBottom: '0.875rem' }}>
                  <ShieldCheck size={20} color="#2E7DF7" />
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.25rem' }}>Займ ожидает подписания</h3>
                    <p style={{ fontSize: '0.875rem', color: '#4A6580' }}>Подпишите договор через одноразовый код, чтобы активировать график и платежные действия.</p>
                  </div>
                </div>

                {signStep === 'idle' && (
                  <>
                    {signError && <p style={{ color: '#C0392B', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{signError}</p>}
                    <button onClick={requestSignOtp} disabled={signLoading} style={{ background: signLoading ? '#7AABF7' : '#2E7DF7', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 18px', fontWeight: 600, cursor: signLoading ? 'not-allowed' : 'pointer' }}>
                      {signLoading ? 'Отправка кода…' : 'Подписать займ'}
                    </button>
                  </>
                )}

                {signStep === 'otp_sent' && (
                  <>
                    <div style={{ background: '#FFFBCC', border: '1px solid #E6D200', color: '#5A4800', padding: '8px 14px', borderRadius: '8px', fontSize: '0.8125rem', marginBottom: '0.875rem' }}>
                      Учебный режим — SMS не отправляется. Код подписания: <strong style={{ fontFamily: 'var(--f-mono)' }}>{mockCode}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(element) => { otpRefs.current[index] = element; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(event) => handleOtpInput(index, event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Backspace' && !digit && index > 0) otpRefs.current[index - 1]?.focus();
                          }}
                          style={{ width: '46px', height: '50px', textAlign: 'center', fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--f-mono)', border: '1.5px solid #C8D0DA', borderRadius: '10px', outline: 'none' }}
                        />
                      ))}
                    </div>
                    {signError && <p style={{ color: '#C0392B', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{signError}</p>}
                    <button onClick={submitSign} disabled={signLoading} style={{ background: signLoading ? '#7AABF7' : '#2E7DF7', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 18px', fontWeight: 600, cursor: signLoading ? 'not-allowed' : 'pointer' }}>
                      {signLoading ? 'Проверка…' : 'Подтвердить подписание'}
                    </button>
                  </>
                )}

                {signStep === 'done' && <p style={{ color: '#1E8A5E', fontWeight: 600 }}>Займ подписан. График и действия обновлены.</p>}
              </section>
            )}

            {loan.schedule.length > 0 && (
              <section style={{ ...cardStyle({ padding: '1.1rem 1.15rem' }) }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.875rem', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.25rem' }}>График платежей</h3>
                    <p style={{ fontSize: '0.8125rem', color: '#4A6580' }}>Сумма актуальных строк всегда равна текущему остатку долга.</p>
                  </div>
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.8125rem', color: '#4A6580' }}>{openRows.length} актуальных · {paidRows.length} оплаченных</span>
                </div>

                {openRows.length === 0 ? (
                  <div style={{ padding: '1rem', borderRadius: '12px', background: '#F7F9FC', color: '#4A6580', fontSize: '0.875rem' }}>Открытых строк графика нет.</div>
                ) : (
                  <ScheduleRows rows={openRows} tone="open" />
                )}

                {paidRows.length > 0 && (
                  <div style={{ marginTop: '0.875rem' }}>
                    <button
                      onClick={() => setShowPaidRows((value) => !value)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#F8FAFD', color: '#0D1B2A', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '9px 14px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      {showPaidRows ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      {showPaidRows ? 'Скрыть оплаченные дни' : 'Показать оплаченные дни'}
                    </button>
                    {showPaidRows && <div style={{ marginTop: '0.75rem' }}><ScheduleRows rows={paidRows} tone="paid" /></div>}
                  </div>
                )}
              </section>
            )}
          </div>

          <aside style={{ display: 'grid', gap: '1rem' }}>
            <section style={{ ...cardStyle({ padding: '1.1rem 1.15rem', background: 'linear-gradient(180deg, #fff 0%, #f8fafc 100%)' }) }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.875rem' }}>Действия</h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <button onClick={() => window.alert('Учебный режим — реальный договор не сформирован, здесь показывается mock-поток.')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#fff', color: '#2E7DF7', border: '1.5px solid #2E7DF7', borderRadius: '10px', padding: '10px 14px', fontWeight: 600, cursor: 'pointer' }}>
                  <FileText size={16} /> Просмотреть договор
                </button>
                {(loan.status === 'active' || loan.status === 'overdue') && (
                  <button onClick={() => setShowPayForm((value) => !value)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#2E7DF7', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 14px', fontWeight: 600, cursor: 'pointer' }}>
                    <Wallet size={16} /> {showPayForm ? 'Скрыть форму оплаты' : 'Создать заявку на оплату'}
                  </button>
                )}
              </div>

              <div style={{ marginTop: '0.875rem', padding: '0.875rem 1rem', borderRadius: '12px', background: '#FFFBCC', border: '1px solid #E6D200', color: '#5A4800', fontSize: '0.8125rem' }}>
                Учебный режим: реальные переводы и подписание договора не выполняются, интерфейс показывает mock-сценарий.
              </div>

              {showPayForm && (loan.status === 'active' || loan.status === 'overdue') && (
                <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '12px', background: '#F8FAFD', border: '1px solid #E8ECF0' }}>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.75rem' }}>Новая заявка на оплату</h4>
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', color: '#4A6580', marginBottom: '4px' }}>Сумма (EUR)</label>
                      <input type="number" min={0.01} max={loan.remainingAmount} step="0.01" value={payAmount} onChange={(event) => setPayAmount(event.target.value)} style={{ width: '100%', border: '1.5px solid #C8D0DA', borderRadius: '10px', padding: '10px 12px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', color: '#4A6580', marginBottom: '4px' }}>Reference</label>
                      <input type="text" value={payRef} onChange={(event) => setPayRef(event.target.value)} style={{ width: '100%', border: '1.5px solid #C8D0DA', borderRadius: '10px', padding: '10px 12px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#4A6580', marginTop: '0.625rem' }}>Максимальная сумма: {formatCurrency(loan.remainingAmount)}</p>
                  {payError && <p style={{ fontSize: '0.8125rem', color: '#C0392B', marginTop: '0.5rem' }}>{payError}</p>}
                  <button onClick={submitPayment} disabled={payLoading} style={{ marginTop: '0.875rem', width: '100%', background: payLoading ? '#A9C4F0' : '#2E7DF7', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 16px', fontWeight: 600, cursor: payLoading ? 'not-allowed' : 'pointer' }}>
                    {payLoading ? 'Отправка…' : 'Отправить заявку'}
                  </button>
                </div>
              )}
            </section>

            <section style={{ ...cardStyle({ padding: '1.1rem 1.15rem' }) }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.875rem' }}>Статус оплаты</h3>
              {payRequests.length === 0 ? (
                <div style={{ padding: '0.95rem', borderRadius: '12px', background: '#F7F9FC', color: '#4A6580', fontSize: '0.875rem' }}>Заявок на оплату пока нет.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {payRequests.slice(0, 4).map((request) => {
                    const badgeClass = request.status === 'confirmed' ? 'badge-approved' : request.status === 'rejected' ? 'badge-rejected' : 'badge-pending';
                    const badgeLabel = request.status === 'confirmed' ? 'Подтверждён' : request.status === 'rejected' ? 'Отклонён' : 'Ожидает';
                    return (
                      <div key={request.id} style={{ padding: '0.9rem 1rem', borderRadius: '12px', background: '#F9FBFD', border: '1px solid #EDF1F5' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '0.75rem', marginBottom: '0.375rem' }}>
                          <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: '#0D1B2A' }}>{formatCurrency(request.amount)}</p>
                          <span className={`badge ${badgeClass}`}>{badgeLabel}</span>
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: '#4A6580', marginBottom: '2px' }}>Reference: {request.reference}</p>
                        <p style={{ fontSize: '0.75rem', color: '#4A6580' }}>{formatDate(request.createdAt)}</p>
                      </div>
                    );
                  })}
                </div>
              )}
              {activeRequest && <p style={{ fontSize: '0.75rem', color: '#4A6580', marginTop: '0.75rem' }}>Открыта активная заявка на оплату. Новая заявка может быть отправлена после её обработки.</p>}
            </section>

            <section style={{ ...cardStyle({ padding: '1.1rem 1.15rem', background: 'linear-gradient(180deg, #fff 0%, #f8fafc 100%)' }) }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.875rem' }}>Параметры договора</h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {[
                  { label: 'Дата выдачи', value: loan.issuedAt ? formatDate(loan.issuedAt) : '—' },
                  { label: 'Дата подписания', value: loan.signedAt ? formatDate(loan.signedAt) : '—' },
                  { label: 'Дата закрытия', value: loan.closedAt ? formatDate(loan.closedAt) : '—' },
                  { label: 'Ежедневный платёж', value: formatCurrency(loan.dailyPayment) },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', paddingBottom: '0.625rem', borderBottom: '1px solid #EDF1F5' }}>
                    <span style={{ fontSize: '0.8125rem', color: '#4A6580' }}>{item.label}</span>
                    <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.8125rem', color: '#0D1B2A', textAlign: 'right' }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '0.875rem' }}>
                <Link href="/cabinet/loans" style={{ color: '#2E7DF7', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>Назад к списку займов</Link>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </CabinetShell>
  );
}
