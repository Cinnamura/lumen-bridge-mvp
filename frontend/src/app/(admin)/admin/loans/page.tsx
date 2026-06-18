'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import AdminShell from '@/widgets/sidebar/AdminShell';
import { api, authHeader } from '@/shared/lib/api';
import { useAdminErrorHandler } from '@/shared/lib/admin-auth-context';
import { formatCurrency, formatDate } from '@/shared/lib/format';
import { getLoanTermLabel } from '@/shared/lib/loan-display';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TableSkeleton } from '@/shared/ui/Skeleton';

function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lb_admin_token');
}

interface LoanRow {
  id: string;
  type: 'personal' | 'business';
  amount: number;
  termDays?: number;
  termMonths?: number;
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
  return (
    <AdminShell>
      <div className="admin-page">
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>Админ-панель</p>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Займы</h1>
        </div>

        <div className="status-toggle-group" style={{ marginBottom: '1.25rem' }}>
          {STATUSES.map(({ key, label }) => (
            <button key={key} className={`status-toggle${status === key ? ' active' : ''}`} onClick={() => { setStatus(key); setPage(1); }}>{label}</button>
          ))}
        </div>

        {error && <div style={{ borderLeft: '4px solid var(--accent-crimson)', background: 'rgba(239, 71, 111, 0.16)', borderRadius: '8px', padding: '0.875rem 1rem', marginBottom: '1rem', color: '#fecdd3' }}>{error}</div>}
        {loading && <TableSkeleton rows={8} columns={8} />}

        {!loading && (
          <div style={{ background: 'var(--surface-1)', border: '1px solid var(--line-soft)', borderRadius: '10px', overflow: 'hidden' }}>
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
                  {rows.length === 0 && <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)' }}>Займов не найдено</td></tr>}
                  {rows.map((l) => {
                    const s = BADGE[l.status] ?? { label: l.status, cls: 'badge-closed' };
                    const pct = l.totalRepayment > 0 ? Math.min(100, (l.paidAmount / l.totalRepayment) * 100) : 0;
                    const done = l.remainingAmount === 0;
                    return (
                      <tr key={l.id}>
                        <td style={{ fontFamily: 'var(--f-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{l.id.slice(0, 8)}…</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{[l.user?.firstName, l.user?.lastName].filter(Boolean).join(' ') || '—'}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--f-mono)' }}>{l.user?.phone ?? '—'}</div>
                        </td>
                        <td style={{ fontFamily: 'var(--f-mono)', fontWeight: 700 }}>{formatCurrency(l.amount)}</td>
                        <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{getLoanTermLabel(l, 'short')}</td>
                        <td>
                          {l.status === 'pending_signing' ? (
                            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Ожидает подписания клиентом</span>
                          ) : (
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px', fontFamily: 'var(--f-mono)' }}>
                                <span style={{ color: done ? 'var(--accent-mint)' : 'var(--text-primary)', fontWeight: 600 }}>{formatCurrency(l.paidAmount)}</span>
                                <span style={{ color: 'var(--text-secondary)' }}>из {formatCurrency(l.totalRepayment)}</span>
                              </div>
                              <div style={{ height: '6px', background: 'var(--surface-0)', borderRadius: '999px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${pct}%`, background: done ? 'var(--accent-mint)' : 'var(--accent-indigo)', borderRadius: '999px', transition: 'width 300ms ease' }} />
                              </div>
                              <p style={{ fontSize: '0.6875rem', color: done ? 'var(--accent-mint)' : 'var(--text-secondary)', marginTop: '3px' }}>
                                {done ? 'Погашен полностью' : `Остаток ${formatCurrency(l.remainingAmount)}`}
                              </p>
                            </div>
                          )}
                        </td>
                        <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                        <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{l.issuedAt ? formatDate(l.issuedAt) : '—'}</td>
                        <td><Link href={`/admin/loans/${l.id}`} style={{ fontSize: '0.8125rem', color: 'var(--accent-indigo)', textDecoration: 'none', fontWeight: 600 }}>Открыть</Link></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <span>Всего: <strong style={{ color: 'var(--text-primary)' }}>{total}</strong></span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} style={{ background: 'var(--surface-1)', border: '1px solid var(--line-strong)', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', opacity: page <= 1 ? 0.5 : 1 }}><ChevronLeft size={16} /></button>
            <span style={{ fontFamily: 'var(--f-mono)', color: 'var(--text-primary)' }}>{page} / {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={{ background: 'var(--surface-1)', border: '1px solid var(--line-strong)', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', opacity: page >= totalPages ? 0.5 : 1 }}><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
