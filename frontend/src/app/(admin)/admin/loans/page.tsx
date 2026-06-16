'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import AdminShell from '@/widgets/sidebar/AdminShell';
import { api, authHeader } from '@/shared/lib/api';
import { useAdminErrorHandler } from '@/shared/lib/admin-auth-context';
import { formatCurrency, formatDate } from '@/shared/lib/format';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TableSkeleton } from '@/shared/ui/Skeleton';

function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lb_admin_token');
}

interface LoanRow {
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
  createdAt: string;
  user?: { id?: string; phone: string; firstName?: string; lastName?: string };
}

const STATUSES = [
  { key: 'all', label: 'Все' },
  { key: 'pending_signing', label: 'Ожидают подписания' },
  { key: 'active', label: 'Активные' },
  { key: 'overdue', label: 'Просроченные' },
  { key: 'closed', label: 'Закрытые' },
] as const;

const BADGE: Record<LoanRow['status'], { label: string; cls: string }> = {
  pending_signing: { label: 'Подписание', cls: 'badge-signing' },
  active: { label: 'Активен', cls: 'badge-active' },
  overdue: { label: 'Просрочен', cls: 'badge-overdue' },
  closed: { label: 'Закрыт', cls: 'badge-closed' },
};

export default function AdminLoansPage() {
  const [rows, setRows] = useState<LoanRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<(typeof STATUSES)[number]['key']>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const handleError = useAdminErrorHandler(setError);

  const load = useCallback(() => {
    const token = getAdminToken(); if (!token) return;
    setLoading(true);
    setError('');
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (status !== 'all') params.set('status', status);
    api.get<{ data: LoanRow[]; total: number }>(`/admin/loans?${params}`, authHeader(token))
      .then((d) => { setRows(d.data); setTotal(d.total); })
      .catch(handleError)
      .finally(() => setLoading(false));
  }, [handleError, page, status]);
  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / 20));
  const tabStyle = (key: (typeof STATUSES)[number]['key']): React.CSSProperties => ({
    padding: '7px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer',
    fontWeight: 600, fontSize: '0.875rem',
    background: status === key ? '#0D1B2A' : 'transparent',
    color: status === key ? '#fff' : '#4A6580',
  });

  return (
    <AdminShell>
      <div className="admin-page">
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#4A6580', marginBottom: '2px' }}>Админ-панель</p>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0D1B2A' }}>Займы</h1>
        </div>

        <div style={{ display: 'inline-flex', background: '#fff', border: '1px solid #E8ECF0', borderRadius: '8px', padding: '3px', marginBottom: '1.25rem', gap: '2px', flexWrap: 'wrap' }}>
          {STATUSES.map(({ key, label }) => (
            <button key={key} style={tabStyle(key)} onClick={() => { setStatus(key); setPage(1); }}>{label}</button>
          ))}
        </div>

        {error && <div style={{ borderLeft: '4px solid #C0392B', background: '#FAD7D4', borderRadius: '8px', padding: '0.875rem 1rem', marginBottom: '1rem', color: '#6B1A14' }}>{error}</div>}
        {loading && <TableSkeleton rows={8} columns={8} />}

        {!loading && (
          <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Клиент</th>
                    <th>Сумма</th>
                    <th>Срок</th>
                    <th style={{ minWidth: '200px' }}>Баланс выплат</th>
                    <th>Статус</th>
                    <th>Выдан</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 && <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: '#4A6580' }}>Займов не найдено</td></tr>}
                  {rows.map((l) => {
                    const s = BADGE[l.status] ?? { label: l.status, cls: 'badge-closed' };
                    const pct = l.totalRepayment > 0 ? Math.min(100, (l.paidAmount / l.totalRepayment) * 100) : 0;
                    const done = l.remainingAmount === 0;
                    return (
                      <tr key={l.id}>
                        <td style={{ fontFamily: 'var(--f-mono)', fontSize: '0.75rem', color: '#4A6580' }}>{l.id.slice(0, 8)}…</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{[l.user?.firstName, l.user?.lastName].filter(Boolean).join(' ') || '—'}</div>
                          <div style={{ fontSize: '0.75rem', color: '#4A6580', fontFamily: 'var(--f-mono)' }}>{l.user?.phone ?? '—'}</div>
                        </td>
                        <td style={{ fontFamily: 'var(--f-mono)', fontWeight: 700 }}>{formatCurrency(l.amount)}</td>
                        <td style={{ fontSize: '0.8125rem', color: '#4A6580' }}>{l.termDays} дн.</td>
                        <td>
                          {l.status === 'pending_signing' ? (
                            <span style={{ fontSize: '0.8125rem', color: '#4A6580' }}>Ожидает подписания клиентом</span>
                          ) : (
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px', fontFamily: 'var(--f-mono)' }}>
                                <span style={{ color: done ? '#1E8A5E' : '#0D1B2A', fontWeight: 600 }}>{formatCurrency(l.paidAmount)}</span>
                                <span style={{ color: '#4A6580' }}>из {formatCurrency(l.totalRepayment)}</span>
                              </div>
                              <div style={{ height: '6px', background: '#E8ECF0', borderRadius: '999px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${pct}%`, background: done ? '#1E8A5E' : '#2E7DF7', borderRadius: '999px', transition: 'width 300ms ease' }} />
                              </div>
                              <p style={{ fontSize: '0.6875rem', color: done ? '#1E8A5E' : '#4A6580', marginTop: '3px' }}>
                                {done ? 'Погашен полностью' : `Остаток ${formatCurrency(l.remainingAmount)}`}
                              </p>
                            </div>
                          )}
                        </td>
                        <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                        <td style={{ fontSize: '0.8125rem', color: '#4A6580' }}>{l.issuedAt ? formatDate(l.issuedAt) : '—'}</td>
                        <td><Link href={`/admin/loans/${l.id}`} style={{ fontSize: '0.8125rem', color: '#2E7DF7', textDecoration: 'none', fontWeight: 600 }}>Открыть</Link></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', fontSize: '0.875rem', color: '#4A6580' }}>
          <span>Всего: <strong style={{ color: '#0D1B2A' }}>{total}</strong></span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} style={{ background: '#fff', border: '1.5px solid #C8D0DA', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', opacity: page <= 1 ? 0.5 : 1 }}><ChevronLeft size={16} /></button>
            <span style={{ fontFamily: 'var(--f-mono)', color: '#0D1B2A' }}>{page} / {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={{ background: '#fff', border: '1.5px solid #C8D0DA', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', opacity: page >= totalPages ? 0.5 : 1 }}><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
