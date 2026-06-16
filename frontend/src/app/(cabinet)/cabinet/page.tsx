'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Bell, CalendarClock, CreditCard, FileText, Wallet } from 'lucide-react';
import CabinetShell from '@/widgets/sidebar/CabinetShell';
import { api, authHeader } from '@/shared/lib/api';
import { getToken } from '@/shared/lib/auth';
import { useAuth } from '@/shared/lib/auth-context';
import { formatCurrency, formatDate } from '@/shared/lib/format';
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

interface ApplicationDto {
  id: string;
  type: string;
  amount: number;
  status: 'new' | 'in_review' | 'approved' | 'rejected';
  createdAt: string;
}

interface NotificationDto {
  id: string;
  type: string;
  title: string;
  body?: string;
  isRead: boolean;
  createdAt: string;
}

interface PaymentReq {
  id: string;
  loanId: string;
  amount: number;
  reference: string;
  status: string;
  createdAt: string;
}

const APP_STATUS: Record<ApplicationDto['status'], string> = {
  new: 'На рассмотрении',
  in_review: 'В обработке',
  approved: 'Одобрена',
  rejected: 'Отклонена',
};

function shellCard(extra: React.CSSProperties = {}): React.CSSProperties {
  return {
    background: 'linear-gradient(180deg, rgba(20,25,36,0.94) 0%, rgba(11,15,25,0.96) 100%)',
    border: '1px solid rgba(140,144,159,0.18)',
    borderRadius: '18px',
    boxShadow: '0 18px 44px rgba(0,0,0,0.24)',
    color: '#D8E3FB',
    ...extra,
  };
}

function metricCard(label: string, value: string, hint: string, tone: 'blue' | 'green' | 'amber') {
  const colors = {
    blue: ['rgba(59,130,246,0.18)', '#93C5FD'],
    green: ['rgba(16,185,129,0.18)', '#6EE7B7'],
    amber: ['rgba(245,158,11,0.18)', '#FCD34D'],
  } as const;
  const [bg, accent] = colors[tone];
  return (
    <div style={{ ...shellCard({ padding: '1rem 1.1rem', position: 'relative', overflow: 'hidden' }) }}>
      <div style={{ position: 'absolute', width: '160px', height: '160px', right: '-50px', top: '-60px', borderRadius: '50%', background: `radial-gradient(circle, ${bg} 0%, transparent 70%)` }} />
      <p style={{ fontSize: '0.75rem', color: 'rgba(154,164,182,0.88)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '0.75rem', position: 'relative' }}>{label}</p>
      <p style={{ fontFamily: 'var(--f-mono)', fontSize: '1.4rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.3rem', position: 'relative' }}>{value}</p>
      <p style={{ fontSize: '0.8125rem', color: accent, position: 'relative' }}>{hint}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div style={{ ...shellCard({ padding: '1.5rem' }) }}>
        <Skeleton h={18} w={160} />
        <div style={{ marginTop: '1rem' }}><Skeleton h={52} w={260} /></div>
        <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginTop: '1rem' }}>
          {[1, 2, 3].map((i) => <Skeleton key={i} h={72} />)}
        </div>
      </div>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {[1, 2, 3, 4].map((i) => <div key={i} style={{ ...shellCard({ padding: '1rem' }) }}><Skeleton h={80} /></div>)}
      </div>
    </div>
  );
}

export default function CabinetDashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeLoans, setActiveLoans] = useState<LoanDto[]>([]);
  const [closedLoans, setClosedLoans] = useState<LoanDto[]>([]);
  const [applications, setApplications] = useState<ApplicationDto[]>([]);
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentReq[]>([]);

  const load = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const [loans, apps, notes, requests] = await Promise.all([
        api.get<{ active: LoanDto[]; closed: LoanDto[] }>('/cabinet/loans', authHeader(token)),
        api.get<ApplicationDto[]>('/cabinet/applications', authHeader(token)),
        api.get<NotificationDto[]>('/cabinet/notifications', authHeader(token)),
        api.get<PaymentReq[]>('/cabinet/payment-requests', authHeader(token)),
      ]);
      setActiveLoans(loans.active);
      setClosedLoans(loans.closed);
      setApplications(apps);
      setNotifications(notes);
      setPaymentRequests(requests);
    } catch (e: any) {
      setError(e.message ?? 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const primaryLoan = useMemo(
    () => activeLoans.find((loan) => loan.status === 'active' || loan.status === 'overdue') ?? activeLoans[0] ?? null,
    [activeLoans],
  );

  const totalOutstanding = activeLoans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
  const unreadNotifications = notifications.filter((item) => !item.isRead).length;
  const pendingPaymentRequests = paymentRequests.filter((item) => item.status === 'pending').length;
  const progress = primaryLoan && primaryLoan.totalRepayment > 0 ? Math.min(100, (primaryLoan.paidAmount / primaryLoan.totalRepayment) * 100) : 0;
  const displayName = user?.firstName ? user.firstName : user?.phone ? `+${user.phone.slice(1, 4)}` : 'клиент';

  return (
    <CabinetShell>
      <div className="cabinet-page">
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'rgba(154,164,182,0.84)', marginBottom: '4px' }}>Личный кабинет</p>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.35rem', letterSpacing: '-0.03em' }}>Главная</h1>
          <p style={{ color: 'rgba(154,164,182,0.9)', fontSize: '0.95rem' }}>Ключевые обязательства и статусы в одном месте.</p>
        </div>

        {loading && <DashboardSkeleton />}

        {!loading && error && (
          <div style={{ ...shellCard({ borderLeft: '4px solid #EF4444', padding: '0.875rem 1rem' }) }}>
            <p style={{ fontWeight: 700, color: '#F8FAFC', marginBottom: '0.375rem' }}>Не удалось загрузить данные</p>
            <p style={{ color: 'rgba(154,164,182,0.9)', fontSize: '0.875rem', marginBottom: '0.875rem' }}>{error}</p>
            <button onClick={load} className="btn btn-primary btn-sm">Попробовать снова</button>
          </div>
        )}

        {!loading && !error && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            <section style={{ ...shellCard({ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(8,20,37,0.94) 0%, rgba(17,28,45,0.96) 55%, rgba(18,18,20,0.98) 100%)', overflow: 'hidden', position: 'relative' }) }}>
              <div style={{ position: 'absolute', width: '260px', height: '260px', top: '-90px', right: '-70px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.18), transparent 68%)' }} />
              <div style={{ position: 'absolute', width: '240px', height: '240px', bottom: '-120px', left: '-60px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.14), transparent 70%)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', position: 'relative' }}>
                <div style={{ maxWidth: '680px' }}>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(154,164,182,0.82)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                    {primaryLoan ? 'Активный займ' : 'Профиль готов'}
                  </p>
                  <h2 style={{ fontSize: '1.7rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
                    {primaryLoan ? `Здравствуйте, ${displayName}` : 'В кабинете пока нет активного займа'}
                  </h2>
                  <p style={{ fontSize: '0.95rem', color: 'rgba(216,227,251,0.78)', maxWidth: '56ch', lineHeight: 1.75 }}>
                    {primaryLoan
                      ? 'Здесь видно текущий остаток долга, ближайший платёж и прогресс исполнения обязательств без переходов по разделам.'
                      : 'После одобрения и подписания займа здесь появится сводка по обязательствам, быстрым действиям и графику платежей.'}
                  </p>
                </div>
                {primaryLoan ? (
                  <div style={{ minWidth: '260px', display: 'grid', gap: '0.875rem', alignContent: 'start', position: 'relative' }}>
                    <div style={{ padding: '1rem 1.125rem', borderRadius: '12px', background: 'rgba(18,18,20,0.4)', border: '1px solid rgba(140,144,159,0.18)' }}>
                      <p style={{ fontSize: '0.75rem', color: 'rgba(154,164,182,0.82)', marginBottom: '4px' }}>Сумма к возврату</p>
                      <p style={{ fontFamily: 'var(--f-mono)', fontSize: '1.6rem', fontWeight: 700, color: '#F8FAFC' }}>{formatCurrency(primaryLoan.remainingAmount)}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <Link href={`/cabinet/loans/${primaryLoan.id}${primaryLoan.status !== 'pending_signing' ? '?pay=1' : ''}`} className="btn btn-primary btn-sm">
                        {primaryLoan.status === 'pending_signing' ? 'Подписать займ' : 'Быстрая оплата'}
                      </Link>
                      <Link href={`/cabinet/loans/${primaryLoan.id}`} className="btn btn-secondary btn-sm">
                        Открыть займ
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'start' }}>
                    <Link href="/apply" className="btn btn-primary btn-sm">Подать заявку</Link>
                  </div>
                )}
              </div>

              {primaryLoan && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.875rem', marginTop: '1.25rem', position: 'relative' }}>
                    <div style={{ padding: '0.9rem 1rem', borderRadius: '10px', background: 'rgba(59,130,246,0.16)', border: '1px solid rgba(59,130,246,0.22)' }}>
                      <p style={{ fontSize: '0.75rem', color: 'rgba(216,227,251,0.78)', marginBottom: '3px' }}>Взято</p>
                      <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, fontSize: '1rem', color: '#F8FAFC' }}>{formatCurrency(primaryLoan.amount)}</p>
                    </div>
                    <div style={{ padding: '0.9rem 1rem', borderRadius: '10px', background: 'rgba(16,185,129,0.14)', border: '1px solid rgba(16,185,129,0.22)' }}>
                      <p style={{ fontSize: '0.75rem', color: 'rgba(216,227,251,0.78)', marginBottom: '3px' }}>Выплачено</p>
                      <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, fontSize: '1rem', color: '#F8FAFC' }}>{formatCurrency(primaryLoan.paidAmount)}</p>
                    </div>
                    <div style={{ padding: '0.9rem 1rem', borderRadius: '10px', background: 'rgba(245,158,11,0.14)', border: '1px solid rgba(245,158,11,0.22)' }}>
                      <p style={{ fontSize: '0.75rem', color: 'rgba(216,227,251,0.78)', marginBottom: '3px' }}>Остаток</p>
                      <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, fontSize: '1rem', color: '#F8FAFC' }}>{formatCurrency(primaryLoan.remainingAmount)}</p>
                    </div>
                  </div>

                  {primaryLoan.status !== 'pending_signing' && (
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
                </>
              )}
            </section>

            {primaryLoan && (
              <section style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                {[
                  metricCard('Ближайший платёж', primaryLoan.nextPaymentAmount ? formatCurrency(primaryLoan.nextPaymentAmount) : '—', primaryLoan.nextPaymentDate ? formatDate(primaryLoan.nextPaymentDate) : 'Нет даты', 'blue'),
                  metricCard('Остаток долга', formatCurrency(totalOutstanding), 'По всем активным займам', 'amber'),
                  metricCard('Уведомления', String(unreadNotifications), pendingPaymentRequests ? `Заявок на оплату: ${pendingPaymentRequests}` : 'Без новых действий', 'green'),
                ]}
              </section>
            )}

            <section style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)' }} className="grid-2-resp">
              <div style={{ ...shellCard({ padding: '1.15rem' }) }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC' }}>Последние заявки</h3>
                  <Link href="/cabinet/applications" style={{ color: '#93C5FD', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600 }}>Все заявки</Link>
                </div>
                {applications.length === 0 ? (
                  <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(18,18,20,0.52)', color: 'rgba(154,164,182,0.88)', fontSize: '0.875rem', border: '1px solid rgba(140,144,159,0.14)' }}>Заявок пока нет.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {applications.slice(0, 3).map((item) => (
                      <div key={item.id} style={{ padding: '0.95rem 1rem', borderRadius: '10px', background: 'rgba(18,18,20,0.5)', border: '1px solid rgba(140,144,159,0.14)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'start' }}>
                          <div>
                            <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: '#F8FAFC', marginBottom: '2px' }}>{formatCurrency(item.amount)}</p>
                            <p style={{ fontSize: '0.8125rem', color: 'rgba(154,164,182,0.88)' }}>{item.type === 'personal' ? 'Физлицо' : 'Бизнес'} · {formatDate(item.createdAt)}</p>
                          </div>
                          <span className={`badge ${item.status === 'approved' ? 'badge-approved' : item.status === 'rejected' ? 'badge-rejected' : item.status === 'in_review' ? 'badge-pending' : 'badge-new'}`}>
                            {APP_STATUS[item.status]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ ...shellCard({ padding: '1.15rem' }) }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC' }}>Последние события</h3>
                  <Link href="/cabinet/notifications" style={{ color: '#93C5FD', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600 }}>Открыть</Link>
                </div>
                {notifications.length === 0 ? (
                  <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(18,18,20,0.52)', color: 'rgba(154,164,182,0.88)', fontSize: '0.875rem', border: '1px solid rgba(140,144,159,0.14)' }}>Уведомлений пока нет.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {notifications.slice(0, 4).map((item) => (
                      <div key={item.id} style={{ paddingBottom: '0.75rem', borderBottom: '1px solid rgba(140,144,159,0.14)' }}>
                        <p style={{ fontWeight: item.isRead ? 600 : 700, color: '#F8FAFC', fontSize: '0.9375rem' }}>{item.title}</p>
                        {item.body && <p style={{ fontSize: '0.8125rem', color: 'rgba(154,164,182,0.88)', marginTop: '2px' }}>{item.body}</p>}
                        <p style={{ fontSize: '0.75rem', color: 'rgba(124,135,156,0.94)', marginTop: '4px' }}>{formatDate(item.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {closedLoans.length > 0 && (
              <section style={{ ...shellCard({ padding: '1rem 1.15rem' }) }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.25rem' }}>История закрытых займов</h3>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(154,164,182,0.88)' }}>{closedLoans.length} закрыт{closedLoans.length === 1 ? '' : closedLoans.length < 5 ? 'о' : 'ых'} займ(ов) в архиве.</p>
                  </div>
                  <Link href="/cabinet/loans" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#93C5FD', textDecoration: 'none', fontWeight: 600 }}>
                    Перейти к займам <ArrowRight size={16} />
                  </Link>
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </CabinetShell>
  );
}
