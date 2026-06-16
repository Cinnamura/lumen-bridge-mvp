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

function cardStyle(extra: React.CSSProperties = {}): React.CSSProperties {
  return {
    background: '#fff',
    border: '1px solid #E8ECF0',
    borderRadius: '14px',
    boxShadow: '0 8px 24px rgba(13,27,42,0.06), 0 2px 6px rgba(13,27,42,0.04)',
    ...extra,
  };
}

function DashboardSkeleton() {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div style={{ ...cardStyle({ padding: '1.5rem' }) }}>
        <Skeleton h={18} w={160} />
        <div style={{ marginTop: '1rem' }}><Skeleton h={52} w={260} /></div>
        <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', marginTop: '1rem' }}>
          {[1, 2, 3].map((i) => <Skeleton key={i} h={72} />)}
        </div>
      </div>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
        {[1, 2, 3, 4].map((i) => <div key={i} style={{ ...cardStyle({ padding: '1rem' }) }}><Skeleton h={72} /></div>)}
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
  const progress = primaryLoan && primaryLoan.totalRepayment > 0
    ? Math.min(100, (primaryLoan.paidAmount / primaryLoan.totalRepayment) * 100)
    : 0;
  const displayName = user?.firstName ? user.firstName : user?.phone ? `+${user.phone.slice(1, 4)}` : 'клиент';

  return (
    <CabinetShell>
      <div className="cabinet-page">
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#4A6580', marginBottom: '4px' }}>Личный кабинет</p>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.35rem' }}>Главная</h1>
          <p style={{ color: '#4A6580', fontSize: '0.9375rem' }}>Ключевые обязательства и статусы в одном месте.</p>
        </div>

        {loading && <DashboardSkeleton />}

        {!loading && error && (
          <div style={{ ...cardStyle({ borderLeft: '4px solid #C0392B', padding: '1rem 1.25rem' }) }}>
            <p style={{ fontWeight: 700, color: '#0D1B2A', marginBottom: '0.375rem' }}>Не удалось загрузить данные</p>
            <p style={{ color: '#4A6580', fontSize: '0.875rem', marginBottom: '0.875rem' }}>{error}</p>
            <button onClick={load} style={{ background: '#2E7DF7', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 16px', fontWeight: 600, cursor: 'pointer' }}>
              Попробовать снова
            </button>
          </div>
        )}

        {!loading && !error && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            <section style={{
              ...cardStyle({
                padding: '1.5rem',
                background: primaryLoan
                  ? 'linear-gradient(135deg, #0D1B2A 0%, #17314D 100%)'
                  : 'linear-gradient(135deg, #ffffff 0%, #f4f7fb 100%)',
                color: primaryLoan ? '#fff' : '#0D1B2A',
                overflow: 'hidden',
              }),
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ maxWidth: '680px' }}>
                  <p style={{ fontSize: '0.75rem', color: primaryLoan ? 'rgba(255,255,255,0.62)' : '#4A6580', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                    {primaryLoan ? 'Активный займ' : 'Профиль готов'}
                  </p>
                  <h2 style={{ fontSize: '1.625rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    {primaryLoan ? `Здравствуйте, ${displayName}` : 'В кабинете пока нет активного займа'}
                  </h2>
                  <p style={{ fontSize: '0.9375rem', color: primaryLoan ? 'rgba(255,255,255,0.72)' : '#4A6580', maxWidth: '56ch' }}>
                    {primaryLoan
                      ? 'Здесь видно текущий остаток долга, ближайший платёж и прогресс исполнения обязательств без переходов по разделам.'
                      : 'После одобрения и подписания займа здесь появится сводка по обязательствам, быстрым действиям и графику платежей.'}
                  </p>
                </div>

                {primaryLoan ? (
                  <div style={{ minWidth: '260px', display: 'grid', gap: '0.875rem', alignContent: 'start' }}>
                    <div style={{ padding: '1rem 1.125rem', borderRadius: '14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                      <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.58)', marginBottom: '4px' }}>Сумма к возврату</p>
                      <p style={{ fontFamily: 'var(--f-mono)', fontSize: '1.5rem', fontWeight: 700 }}>{formatCurrency(primaryLoan.remainingAmount)}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <Link href={`/cabinet/loans/${primaryLoan.id}${primaryLoan.status !== 'pending_signing' ? '?pay=1' : ''}`} style={{ background: '#2E7DF7', color: '#fff', borderRadius: '10px', padding: '10px 18px', textDecoration: 'none', fontWeight: 600 }}>
                        {primaryLoan.status === 'pending_signing' ? 'Подписать займ' : 'Быстрая оплата'}
                      </Link>
                      <Link href={`/cabinet/loans/${primaryLoan.id}`} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '10px', padding: '10px 18px', textDecoration: 'none', fontWeight: 600 }}>
                        Открыть займ
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'start' }}>
                    <Link href="/apply" style={{ background: '#2E7DF7', color: '#fff', borderRadius: '10px', padding: '10px 18px', textDecoration: 'none', fontWeight: 600 }}>
                      Подать заявку
                    </Link>
                  </div>
                )}
              </div>

              {primaryLoan && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.875rem', marginTop: '1.25rem' }}>
                  {[
                    { label: 'Ближайший платёж', value: primaryLoan.nextPaymentAmount ? formatCurrency(primaryLoan.nextPaymentAmount) : '—' },
                    { label: 'Дата платежа', value: primaryLoan.nextPaymentDate ? formatDate(primaryLoan.nextPaymentDate) : '—' },
                    { label: 'Выплачено', value: formatCurrency(primaryLoan.paidAmount) },
                  ].map((item) => (
                    <div key={item.label} style={{ padding: '0.9rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.58)', marginBottom: '3px' }}>{item.label}</p>
                      <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, fontSize: '1rem' }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {primaryLoan && primaryLoan.status !== 'pending_signing' && (
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

            <section style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              {[
                { label: 'Остаток долга', value: formatCurrency(totalOutstanding), hint: 'По всем активным займам', icon: Wallet },
                { label: 'Следующий платёж', value: primaryLoan?.nextPaymentDate ? formatDate(primaryLoan.nextPaymentDate) : '—', hint: primaryLoan?.nextPaymentAmount ? formatCurrency(primaryLoan.nextPaymentAmount) : 'Нет платежа', icon: CalendarClock },
                { label: 'Заявки', value: String(applications.length), hint: applications[0] ? `Последняя: ${APP_STATUS[applications[0].status]}` : 'Новых заявок нет', icon: FileText },
                { label: 'Уведомления', value: String(unreadNotifications), hint: pendingPaymentRequests ? `Заявок на оплату: ${pendingPaymentRequests}` : 'Без новых действий', icon: Bell },
              ].map(({ label, value, hint, icon: Icon }) => (
                <div key={label} style={{ ...cardStyle({ padding: '1rem 1.1rem', background: 'linear-gradient(180deg, #ffffff 0%, #f7f9fc 100%)' }) }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#4A6580', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{label}</span>
                    <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#EBF1FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={17} color="#2E7DF7" />
                    </div>
                  </div>
                  <p style={{ fontFamily: 'var(--f-mono)', fontSize: '1.375rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.35rem' }}>{value}</p>
                  <p style={{ fontSize: '0.8125rem', color: '#4A6580' }}>{hint}</p>
                </div>
              ))}
            </section>

            <section style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)' }}>
              <div style={{ ...cardStyle({ padding: '1.1rem 1.15rem' }) }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0D1B2A' }}>Последние заявки</h3>
                  <Link href="/cabinet/applications" style={{ color: '#2E7DF7', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600 }}>Все заявки</Link>
                </div>
                {applications.length === 0 ? (
                  <div style={{ padding: '1.25rem', borderRadius: '12px', background: '#F7F9FC', color: '#4A6580', fontSize: '0.875rem' }}>Заявок пока нет.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {applications.slice(0, 3).map((item) => (
                      <div key={item.id} style={{ padding: '0.95rem 1rem', borderRadius: '12px', background: '#F9FBFD', border: '1px solid #EDF1F5' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'start' }}>
                          <div>
                            <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: '#0D1B2A', marginBottom: '2px' }}>{formatCurrency(item.amount)}</p>
                            <p style={{ fontSize: '0.8125rem', color: '#4A6580' }}>{item.type === 'personal' ? 'Физлицо' : 'Бизнес'} · {formatDate(item.createdAt)}</p>
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

              <div style={{ ...cardStyle({ padding: '1.1rem 1.15rem' }) }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0D1B2A' }}>Последние события</h3>
                  <Link href="/cabinet/notifications" style={{ color: '#2E7DF7', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600 }}>Открыть</Link>
                </div>
                {notifications.length === 0 ? (
                  <div style={{ padding: '1.25rem', borderRadius: '12px', background: '#F7F9FC', color: '#4A6580', fontSize: '0.875rem' }}>Уведомлений пока нет.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {notifications.slice(0, 4).map((item) => (
                      <div key={item.id} style={{ paddingBottom: '0.75rem', borderBottom: '1px solid #EDF1F5' }}>
                        <p style={{ fontWeight: item.isRead ? 600 : 700, color: '#0D1B2A', fontSize: '0.9375rem' }}>{item.title}</p>
                        {item.body && <p style={{ fontSize: '0.8125rem', color: '#4A6580', marginTop: '2px' }}>{item.body}</p>}
                        <p style={{ fontSize: '0.75rem', color: '#4A6580', marginTop: '4px' }}>{formatDate(item.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {closedLoans.length > 0 && (
              <section style={{ ...cardStyle({ padding: '1rem 1.15rem', background: 'linear-gradient(180deg, #ffffff 0%, #f7f9fc 100%)' }) }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.25rem' }}>История закрытых займов</h3>
                    <p style={{ fontSize: '0.875rem', color: '#4A6580' }}>{closedLoans.length} закрыт{closedLoans.length === 1 ? '' : closedLoans.length < 5 ? 'о' : 'ых'} займ(ов) в архиве.</p>
                  </div>
                  <Link href="/cabinet/loans" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#2E7DF7', textDecoration: 'none', fontWeight: 600 }}>
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
