'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminShell from '@/widgets/sidebar/AdminShell';
import { api, authHeader } from '@/shared/lib/api';
import { formatCurrency, formatDate } from '@/shared/lib/format';
import { ChevronLeft } from 'lucide-react';
import { Skeleton } from '@/shared/ui/Skeleton';
import { useAdminErrorHandler } from '@/shared/lib/admin-auth-context';

function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lb_admin_token');
}

interface PaymentReqItem { id: string; amount: number; reference: string; status: string; createdAt: string }
interface PaymentItem    { id: string; amount: number; recordedAt: string; note?: string | null }
interface LoanItem {
  id: string; amount: number; termDays: number; totalRepayment: number;
  paidAmount: number; remainingAmount: number; status: string;
  issuedAt?: string; closedAt?: string;
  payments: PaymentItem[];
  paymentRequests: PaymentReqItem[];
}
interface AppItem  { id: string; type: string; amount: number; termDays?: number; termMonths?: number; status: string; createdAt: string }
interface ClientDetail {
  id: string; phone: string; firstName: string; lastName: string; email: string; createdAt: string;
  applications: AppItem[];
  loans: LoanItem[];
}

const APP_STATUS: Record<string, string> = {
  new: 'Новая', in_review: 'На проверке', approved: 'Одобрена', rejected: 'Отклонена',
};
const APP_COLORS: Record<string, string> = {
  new: 'var(--accent-indigo)', in_review: '#C08020', approved: 'var(--accent-mint)', rejected: 'var(--accent-crimson)',
};
const LOAN_STATUS: Record<string, string> = {
  pending_signing: 'Ожидает подписания', active: 'Активен', overdue: 'Просрочен', closed: 'Закрыт',
};
const PR_STATUS: Record<string, string> = { pending: 'Ожидает', confirmed: 'Подтверждён', rejected: 'Отклонён' };

type Tab = 'applications' | 'loans' | 'payments';

export default function AdminClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]    = useState('');
  const [tab, setTab]        = useState<Tab>('applications');
  const handleError = useAdminErrorHandler(setError);

  const load = useCallback(() => {
    const token = getAdminToken(); if (!token) return;
    setLoading(true);
    api.get<ClientDetail>(`/admin/clients/${id}`, authHeader(token))
      .then(setClient).catch(handleError).finally(() => setLoading(false));
  }, [id, handleError]);

  useEffect(() => { load(); }, [load]);

  const allPayments = client?.loans.flatMap((l) =>
    l.payments.map((p) => ({ ...p, loanId: l.id }))
  ).sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()) ?? [];

  const allPayReqs = client?.loans.flatMap((l) =>
    l.paymentRequests.map((pr) => ({ ...pr, loanId: l.id }))
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) ?? [];

  return (
    <AdminShell>
      <div className="admin-page">
        <button onClick={() => router.back()}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.875rem', marginBottom: '1.25rem', padding: 0 }}>
          <ChevronLeft size={16} /> Назад к клиентам
        </button>

        {loading && <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>{[200,140,100,180].map(w=><Skeleton key={w} h={20} w={w}/>)}</div>}
        {!loading && error && <div style={{ borderLeft: '4px solid var(--accent-crimson)', background: 'rgba(239, 71, 111, 0.16)', borderRadius: '8px', padding: '1rem', color: '#fecdd3' }}>{error}</div>}

        {!loading && client && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Header */}
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>Клиент</p>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {[client.firstName, client.lastName].filter(Boolean).join(' ') || 'Без имени'}
              </h1>
            </div>

            {/* Contacts */}
            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--line-soft)', borderRadius: '10px', padding: '1rem' }}>
              <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Контактные данные</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {[
                  { label: 'Телефон',        value: client.phone },
                  { label: 'Email',           value: client.email || '—' },
                  { label: 'Зарегистрирован', value: formatDate(client.createdAt) },
                  { label: 'Заявок',          value: String(client.applications.length) },
                  { label: 'Займов',          value: String(client.loans.length) },
                  { label: 'Активных займов', value: String(client.loans.filter(l => l.status === 'active' || l.status === 'overdue').length) },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>{label}</p>
                    <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="status-toggle-group">
              <button className={`status-toggle${tab === 'applications' ? ' active' : ''}`} onClick={() => setTab('applications')}>
                Заявки ({client.applications.length})
              </button>
              <button className={`status-toggle${tab === 'loans' ? ' active' : ''}`} onClick={() => setTab('loans')}>
                Займы ({client.loans.length})
              </button>
              <button className={`status-toggle${tab === 'payments' ? ' active' : ''}`} onClick={() => setTab('payments')}>
                Платежи ({allPayReqs.length})
              </button>
            </div>

            {/* Applications tab */}
            {tab === 'applications' && (
              <div style={{ background: 'var(--surface-1)', border: '1px solid var(--line-soft)', borderRadius: '10px', overflow: 'hidden' }}>
                {client.applications.length === 0 ? (
                  <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Заявок нет</p>
                ) : (
                  <table className="admin-table" style={{ width: '100%' }}>
                    <thead><tr><th>Дата</th><th>Тип</th><th>Сумма</th><th>Срок</th><th>Статус</th><th></th></tr></thead>
                    <tbody>
                      {client.applications.map((a) => (
                        <tr key={a.id}>
                          <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{formatDate(a.createdAt)}</td>
                          <td style={{ fontSize: '0.8125rem' }}>{a.type === 'personal' ? 'Физлицо' : 'Бизнес'}</td>
                          <td style={{ fontFamily: 'var(--f-mono)', fontWeight: 700 }}>{formatCurrency(a.amount)}</td>
                          <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{a.termDays ? `${a.termDays} дн.` : a.termMonths ? `${a.termMonths} мес.` : '—'}</td>
                          <td><span style={{ fontSize: '0.75rem', fontWeight: 600, color: APP_COLORS[a.status] ?? 'var(--text-secondary)' }}>{APP_STATUS[a.status] ?? a.status}</span></td>
                          <td><Link href={`/admin/applications/${a.id}`} style={{ fontSize: '0.8125rem', color: 'var(--accent-indigo)', textDecoration: 'none', fontWeight: 600 }}>Открыть</Link></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Loans tab */}
            {tab === 'loans' && (
              <div style={{ background: 'var(--surface-1)', border: '1px solid var(--line-soft)', borderRadius: '10px', overflow: 'hidden' }}>
                {client.loans.length === 0 ? (
                  <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Займов нет</p>
                ) : (
                  <table className="admin-table" style={{ width: '100%' }}>
                    <thead><tr><th>Сумма</th><th>Срок</th><th>Выплачено</th><th>Остаток</th><th>Статус</th><th></th></tr></thead>
                    <tbody>
                      {client.loans.map((l) => (
                        <tr key={l.id}>
                          <td style={{ fontFamily: 'var(--f-mono)', fontWeight: 700 }}>{formatCurrency(l.amount)}</td>
                          <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{l.termDays} дн.</td>
                          <td style={{ fontFamily: 'var(--f-mono)', color: 'var(--accent-mint)' }}>{formatCurrency(l.paidAmount)}</td>
                          <td style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: l.remainingAmount === 0 ? 'var(--accent-mint)' : 'var(--text-primary)' }}>{formatCurrency(l.remainingAmount)}</td>
                          <td style={{ fontSize: '0.8125rem', color: l.status === 'overdue' ? 'var(--accent-crimson)' : l.status === 'closed' ? 'var(--accent-mint)' : 'var(--text-secondary)' }}>
                            {LOAN_STATUS[l.status] ?? l.status}
                          </td>
                          <td><Link href={`/admin/loans/${l.id}`} style={{ fontSize: '0.8125rem', color: 'var(--accent-indigo)', textDecoration: 'none', fontWeight: 600 }}>Открыть</Link></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Payments tab */}
            {tab === 'payments' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'var(--surface-1)', border: '1px solid var(--line-soft)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid #F0F3F6' }}>
                    <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>Заявки на оплату</p>
                  </div>
                  {allPayReqs.length === 0 ? (
                    <p style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Нет заявок на оплату</p>
                  ) : (
                    <table className="admin-table" style={{ width: '100%' }}>
                      <thead><tr><th>Дата</th><th>Сумма</th><th>Reference</th><th>Статус</th></tr></thead>
                      <tbody>
                        {allPayReqs.map((pr) => (
                          <tr key={pr.id}>
                            <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{formatDate(pr.createdAt)}</td>
                            <td style={{ fontFamily: 'var(--f-mono)', fontWeight: 700 }}>{formatCurrency(pr.amount)}</td>
                            <td style={{ fontFamily: 'var(--f-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{pr.reference}</td>
                            <td style={{ fontSize: '0.8125rem', fontWeight: 600, color: pr.status === 'confirmed' ? 'var(--accent-mint)' : pr.status === 'rejected' ? 'var(--accent-crimson)' : '#C08020' }}>
                              {PR_STATUS[pr.status] ?? pr.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                <div style={{ background: 'var(--surface-1)', border: '1px solid var(--line-soft)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid #F0F3F6' }}>
                    <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>Зачисленные платежи</p>
                  </div>
                  {allPayments.length === 0 ? (
                    <p style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Платежей нет</p>
                  ) : (
                    <table className="admin-table" style={{ width: '100%' }}>
                      <thead><tr><th>Дата</th><th>Сумма</th><th>Примечание</th></tr></thead>
                      <tbody>
                        {allPayments.map((p) => (
                          <tr key={p.id}>
                            <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{formatDate(p.recordedAt)}</td>
                            <td style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: 'var(--accent-mint)' }}>{formatCurrency(p.amount)}</td>
                            <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{p.note || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
