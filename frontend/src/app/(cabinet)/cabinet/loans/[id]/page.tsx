'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CabinetShell from '@/widgets/sidebar/CabinetShell';
import { api, authHeader } from '@/shared/lib/api';
import { getToken } from '@/shared/lib/auth';
import { formatCurrency, formatDate } from '@/shared/lib/format';

interface ScheduleItem { id: string; seq: number; dueDate: string; amount: number; status: 'pending'|'paid'|'overdue'; paidAt?: string }
interface PaymentReq { id: string; loanId: string; amount: number; reference: string; status: string; createdAt: string }
interface LoanDetail {
  id: string; amount: number; termDays: number;
  dailyRate: number; dailyPayment: number; totalRepayment: number;
  paidAmount: number; remainingAmount: number;
  status: 'pending_signing'|'active'|'overdue'|'closed';
  issuedAt?: string; closedAt?: string; signedAt?: string;
  nextPaymentDate?: string; nextPaymentAmount?: number;
  schedule: ScheduleItem[];
}

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  pending_signing: { label: 'Ожидает подписания', cls: 'badge-signing' },
  active:          { label: 'Активен',            cls: 'badge-active' },
  overdue:         { label: 'Просрочен',          cls: 'badge-overdue' },
  closed:          { label: 'Закрыт',             cls: 'badge-closed' },
};

function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {[1,2,3].map(i => <div key={i} style={{ height: '80px', borderRadius: '10px', background: 'linear-gradient(90deg,#E8ECF0,#D0D5DD,#E8ECF0)', backgroundSize: '200%', animation: 'shimmer 1.5s infinite' }} />)}
    </div>
  );
}

export default function LoanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [loan, setLoan] = useState<LoanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Signing flow
  const [signStep, setSignStep] = useState<'idle'|'otp_sent'|'done'>('idle');
  const [mockCode, setMockCode] = useState('');
  const [otp, setOtp] = useState(['','','','','','']);
  const [signLoading, setSignLoading] = useState(false);
  const [signError, setSignError] = useState('');
  const otpRefs = useRef<(HTMLInputElement|null)[]>([]);

  // Payment request form
  const [showPayForm, setShowPayForm] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payRef, setPayRef] = useState('');
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState('');
  const [payRequests, setPayRequests] = useState<PaymentReq[]>([]);

  const router = useRouter();

  /** Перезагружает займ и заявки на оплату из API. Возвращает Promise,
   *  чтобы вызывающий мог дождаться обновления состояния. */
  async function reload() {
    const token = getToken();
    if (!token) return;
    try {
      const [detail, reqs] = await Promise.all([
        api.get<LoanDetail>(`/cabinet/loans/${id}`, authHeader(token)),
        api.get<PaymentReq[]>('/cabinet/payment-requests', authHeader(token)),
      ]);
      setLoan(detail);
      setPayRequests(reqs);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { reload(); }, [id]);

  async function requestSignOtp() {
    const token = getToken(); if (!token) return;
    setSignLoading(true); setSignError('');
    try {
      const res = await api.post<{ mockCode: string }>(`/cabinet/loans/${id}/sign/request`, {}, authHeader(token));
      setMockCode(res.mockCode);
      setSignStep('otp_sent');
    } catch (e: any) { setSignError(e.message); }
    finally { setSignLoading(false); }
  }

  async function submitSign() {
    const code = otp.join('');
    if (code.length < 6) { setSignError('Введите 6-значный код'); return; }
    const token = getToken(); if (!token) return;
    setSignLoading(true); setSignError('');
    try {
      const updated = await api.post<LoanDetail>(`/cabinet/loans/${id}/sign`, { code }, authHeader(token));
      setLoan(updated);
      setSignStep('done');
      await reload();          // подтянуть график и заявки
      router.refresh();        // обновить серверные данные
    } catch (e: any) { setSignError(e.message); }
    finally { setSignLoading(false); }
  }

  async function submitPayment() {
    const token = getToken(); if (!token) return;
    setPayLoading(true); setPayError('');
    try {
      await api.post('/cabinet/payment-requests', { loanId: id, amount: Number(payAmount), reference: payRef }, authHeader(token));
      setShowPayForm(false); setPayAmount(''); setPayRef('');
      await reload();          // принудительный рефетч — баланс и заявки сразу свежие
      router.refresh();
    } catch (e: any) { setPayError(e.message); }
    finally { setPayLoading(false); }
  }

  function handleOtpInput(i: number, val: string) {
    const digit = val.replace(/\D/g,'').slice(-1);
    const next = [...otp]; next[i] = digit; setOtp(next);
    if (digit && i < 5) otpRefs.current[i+1]?.focus();
  }

  if (loading) return <CabinetShell><div className="cabinet-page"><Skeleton /></div></CabinetShell>;
  if (error || !loan) return (
    <CabinetShell>
      <div className="cabinet-page">
        <div style={{ borderLeft: '4px solid #C0392B', background: '#FAD7D4', borderRadius: '8px', padding: '1rem' }}>
          <p style={{ color: '#6B1A14' }}>Не удалось загрузить займ: {error}</p>
        </div>
      </div>
    </CabinetShell>
  );

  const s = STATUS_LABELS[loan.status] ?? { label: loan.status, cls: 'badge-closed' };

  return (
    <CabinetShell>
      <div className="cabinet-page" style={{ maxWidth: '760px' }}>
        {/* Header */}
        <div style={{ marginBottom: '1.75rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#4A6580', marginBottom: '2px' }}>Личный кабинет / Мои займы</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 style={{ fontFamily: 'var(--f-mono)', fontSize: '2rem', fontWeight: 700, color: '#0D1B2A' }}>
              {formatCurrency(loan.amount)}
            </h1>
            <span className={`badge ${s.cls}`}>{s.label}</span>
          </div>
        </div>

        {/* Параметры 2×2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Ставка', value: `${(loan.dailyRate * 100).toFixed(1)}% в день` },
            { label: 'Срок', value: `${loan.termDays} дней` },
            { label: 'Итого к возврату', value: formatCurrency(loan.totalRepayment) },
            { label: loan.nextPaymentDate ? 'Следующий платёж' : (loan.issuedAt ? 'Дата выдачи' : 'Создан'),
              value: loan.nextPaymentDate ? formatDate(loan.nextPaymentDate) : (loan.issuedAt ? formatDate(loan.issuedAt) : '—') },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '1rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#4A6580', marginBottom: '4px' }}>{label}</p>
              <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: '#0D1B2A', fontSize: '1rem' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* ═══ Баланс выплат ═══ */}
        {loan.status !== 'pending_signing' && (
          <div style={{ background: '#0D1B2A', borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Взято изначально</p>
                <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: '#fff', fontSize: '1.0625rem' }}>{formatCurrency(loan.totalRepayment)}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Уже выплачено</p>
                <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: '#1E8A5E', fontSize: '1.0625rem' }}>{formatCurrency(loan.paidAmount)}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Осталось выплатить</p>
                <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: loan.remainingAmount === 0 ? '#1E8A5E' : '#2E7DF7', fontSize: '1.0625rem' }}>{formatCurrency(loan.remainingAmount)}</p>
              </div>
            </div>
            {/* Прогресс-бар погашения */}
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${loan.totalRepayment > 0 ? Math.min(100, (loan.paidAmount / loan.totalRepayment) * 100) : 0}%`,
                background: loan.remainingAmount === 0 ? '#1E8A5E' : '#2E7DF7',
                borderRadius: '999px',
                transition: 'width 300ms ease',
              }} />
            </div>
            {loan.remainingAmount === 0 && (
              <p style={{ marginTop: '0.75rem', fontSize: '0.8125rem', color: '#1E8A5E', fontWeight: 600 }}>
                Задолженность полностью погашена.
              </p>
            )}
          </div>
        )}

        {/* ═══ Pending signing flow ═══ */}
        {loan.status === 'pending_signing' && (
          <div style={{ background: '#EBF1FE', border: '1px solid #B3CEFB', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <p style={{ fontWeight: 700, color: '#0D1B2A', marginBottom: '0.5rem' }}>Займ ожидает вашего подписания</p>
            <p style={{ fontSize: '0.875rem', color: '#4A6580', marginBottom: '1rem' }}>
              Подпишите договор с помощью одноразового кода для активации займа.
            </p>

            {signStep === 'idle' && (
              <>
                {signError && <p style={{ color: '#C0392B', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{signError}</p>}
                <button onClick={requestSignOtp} disabled={signLoading} style={{ background: signLoading ? '#7AABF7' : '#2E7DF7', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontWeight: 600, cursor: signLoading ? 'not-allowed' : 'pointer' }}>
                  {signLoading ? 'Отправка кода...' : 'Подписать займ'}
                </button>
              </>
            )}

            {signStep === 'otp_sent' && (
              <>
                {/* Mock banner */}
                <div style={{ background: '#FFFBCC', border: '1px solid #E6D200', color: '#5A4800', padding: '8px 14px', borderRadius: '6px', fontSize: '0.8125rem', marginBottom: '0.875rem' }}>
                  Учебный режим — SMS не отправляется. Код подписания: <strong style={{ fontFamily: 'var(--f-mono)' }}>{mockCode}</strong>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#4A6580', marginBottom: '0.75rem' }}>Введите код из SMS:</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  {otp.map((d, i) => (
                    <input key={i} ref={el => { otpRefs.current[i] = el; }}
                      type="text" inputMode="numeric" maxLength={1} value={d}
                      onChange={e => handleOtpInput(i, e.target.value)}
                      onKeyDown={e => { if (e.key === 'Backspace' && !d && i > 0) otpRefs.current[i-1]?.focus(); }}
                      style={{ width: '44px', height: '48px', textAlign: 'center', fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--f-mono)', border: '1.5px solid #C8D0DA', borderRadius: '8px', outline: 'none' }}
                    />
                  ))}
                </div>
                {signError && <p style={{ color: '#C0392B', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{signError}</p>}
                <button onClick={submitSign} disabled={signLoading} style={{ background: signLoading ? '#7AABF7' : '#2E7DF7', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontWeight: 600, cursor: signLoading ? 'not-allowed' : 'pointer' }}>
                  {signLoading ? 'Проверка...' : 'Подтвердить подписание'}
                </button>
              </>
            )}

            {signStep === 'done' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1E8A5E', fontWeight: 600 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                Займ успешно подписан. Обновите страницу для просмотра графика.
              </div>
            )}
          </div>
        )}

        {/* ═══ График платежей (таймлайн) ═══ */}
        {loan.schedule.length > 0 && (() => {
          const paidCount = loan.schedule.filter(s => s.status === 'paid').length;
          // первый неоплаченный — ближайший обязательный платёж
          const nextSeq = loan.schedule.find(s => s.status !== 'paid')?.seq;
          return (
          <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0D1B2A' }}>График платежей</h2>
              <span style={{ fontSize: '0.8125rem', color: '#4A6580', fontFamily: 'var(--f-mono)' }}>
                {paidCount} / {loan.schedule.length} оплачено
              </span>
            </div>

            <div style={{ position: 'relative' }}>
              {loan.schedule.map((row, idx) => {
                const isPaid = row.status === 'paid';
                const isOverdue = row.status === 'overdue';
                const isNext = row.seq === nextSeq;
                const last = idx === loan.schedule.length - 1;
                const dot = isPaid ? '#1E8A5E' : isOverdue ? '#C0392B' : isNext ? '#2E7DF7' : '#C8D0DA';
                return (
                  <div key={row.id} style={{ display: 'flex', gap: '0.875rem', position: 'relative' }}>
                    {/* Линия + маркер */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{
                        width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                        background: isPaid ? '#1E8A5E' : '#fff',
                        border: `2px solid ${dot}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1,
                      }}>
                        {isPaid && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5"><polyline points="20 6 9 17 4 12" /></svg>}
                        {isNext && !isPaid && <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#2E7DF7' }} />}
                      </div>
                      {!last && <div style={{ width: '2px', flex: 1, minHeight: '20px', background: isPaid ? '#1E8A5E' : '#E8ECF0' }} />}
                    </div>

                    {/* Содержимое строки */}
                    <div style={{
                      flex: 1, paddingBottom: last ? 0 : '0.875rem',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                      gap: '1rem',
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.8125rem', color: '#4A6580', fontFamily: 'var(--f-mono)' }}>Платёж №{row.seq}</span>
                          {isNext && !isPaid && (
                            <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#2E7DF7', background: '#EBF1FE', padding: '1px 8px', borderRadius: '999px' }}>Ближайший</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#0D1B2A', fontFamily: 'var(--f-mono)', marginTop: '2px' }}>{formatDate(row.dueDate)}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: '#0D1B2A' }}>{formatCurrency(row.amount)}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: '2px',
                          color: isPaid ? '#1E8A5E' : isOverdue ? '#C0392B' : '#4A6580' }}>
                          {isPaid ? 'Оплачен' : isOverdue ? 'Просрочен' : 'Ожидает оплаты'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          );
        })()}

        {/* ═══ Действия ═══ */}
        {(loan.status === 'active' || loan.status === 'overdue') && (
          <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '1rem' }}>Действия</h2>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {/* Mock договор */}
              <button onClick={() => alert('Учебный режим — это mock-документ, реальный договор не сформирован.')} style={{ background: 'transparent', border: '1.5px solid #2E7DF7', color: '#2E7DF7', borderRadius: '8px', padding: '9px 18px', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>
                Просмотреть договор
              </button>
              <button onClick={() => setShowPayForm(true)} style={{ background: '#2E7DF7', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 18px', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>
                Создать заявку на оплату
              </button>
            </div>

            {/* Mock договор banner */}
            <div style={{ marginTop: '0.75rem', background: '#FFFBCC', border: '1px solid #E6D200', color: '#5A4800', padding: '8px 14px', borderRadius: '6px', fontSize: '0.8125rem' }}>
              Учебный режим — реальные платежи не проводятся. Договор является mock-документом.
            </div>

            {/* Payment form */}
            {showPayForm && (() => {
              const amountNum = Number(payAmount);
              const overLimit = amountNum > loan.remainingAmount;
              const invalid = !payAmount || amountNum <= 0 || overLimit || !payRef.trim();
              return (
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#F8F9FA', borderRadius: '10px', border: '1px solid #E8ECF0' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.875rem' }}>Заявка на оплату</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', color: '#4A6580', marginBottom: '4px' }}>Сумма (EUR)</label>
                    <input
                      type="number" min={0.01} max={loan.remainingAmount} step="0.01"
                      value={payAmount} onChange={e => setPayAmount(e.target.value)}
                      placeholder={String(loan.remainingAmount)}
                      style={{ width: '100%', border: `1.5px solid ${overLimit ? '#C0392B' : '#C8D0DA'}`, borderRadius: '8px', padding: '9px 12px', fontSize: '1rem', boxSizing: 'border-box', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', color: '#4A6580', marginBottom: '4px' }}>Reference / реквизиты</label>
                    <input type="text" value={payRef} onChange={e => setPayRef(e.target.value)} placeholder="REF-..." style={{ width: '100%', border: '1.5px solid #C8D0DA', borderRadius: '8px', padding: '9px 12px', fontSize: '1rem', boxSizing: 'border-box', outline: 'none' }} />
                  </div>
                </div>
                <p style={{ fontSize: '0.75rem', color: overLimit ? '#C0392B' : '#4A6580', marginBottom: '0.75rem' }}>
                  {overLimit
                    ? `Сумма не может превышать остаток задолженности — ${formatCurrency(loan.remainingAmount)}`
                    : `Максимум к оплате: ${formatCurrency(loan.remainingAmount)}`}
                </p>
                {payError && <p style={{ color: '#C0392B', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>{payError}</p>}
                <div style={{ display: 'flex', gap: '0.625rem' }}>
                  <button onClick={() => setShowPayForm(false)} style={{ background: '#fff', border: '1.5px solid #C8D0DA', color: '#4A6580', borderRadius: '8px', padding: '9px 18px', fontWeight: 600, cursor: 'pointer' }}>Отмена</button>
                  <button onClick={submitPayment} disabled={payLoading || invalid}
                    title={overLimit ? 'Сумма превышает остаток задолженности' : (invalid ? 'Заполните сумму и реквизиты' : undefined)}
                    style={{ background: (payLoading || invalid) ? '#A9C4F0' : '#2E7DF7', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 18px', fontWeight: 600, cursor: (payLoading || invalid) ? 'not-allowed' : 'pointer' }}>
                    {payLoading ? 'Отправка...' : 'Отправить заявку'}
                  </button>
                </div>
              </div>
              );
            })()}

            {/* Payment requests status */}
            {payRequests.filter(p => p.loanId === id).length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <p style={{ fontWeight: 600, color: '#0D1B2A', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Заявки на оплату</p>
                {payRequests.filter(p => p.loanId === id).map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #F0F3F6', fontSize: '0.875rem' }}>
                    <span style={{ fontFamily: 'var(--f-mono)', color: '#0D1B2A' }}>{formatCurrency(p.amount)}</span>
                    <span style={{ color: '#4A6580' }}>{formatDate(p.createdAt)}</span>
                    <span className={`badge ${p.status === 'confirmed' ? 'badge-approved' : p.status === 'rejected' ? 'badge-rejected' : 'badge-pending'}`}>
                      {p.status === 'pending' ? 'На проверке' : p.status === 'confirmed' ? 'Подтверждено' : 'Отклонено'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </CabinetShell>
  );
}
