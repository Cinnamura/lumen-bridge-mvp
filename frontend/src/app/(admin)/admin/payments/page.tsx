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

interface PRRow {
  id: string;
  loanId: string;
  userId: string;
  amount: number;
  reference: string;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
  reviewedAt?: string | null;
  user?: { phone: string; firstName?: string; lastName?: string };
}

const STATUSES = [
  { key: 'all', label: 'Все' },
  { key: 'pending', label: 'Ожидают' },
  { key: 'confirmed', label: 'Подтверждены' },
  { key: 'rejected', label: 'Отклонены' },
] as const;

const BADGE: Record<PRRow['status'], { label: string; cls: string }> = {
  pending: { label: 'Ожидает', cls: 'badge-pending' },
  confirmed: { label: 'Подтверждён', cls: 'badge-approved' },
  rejected: { label: 'Отклонён', cls: 'badge-rejected' },
};

export default function AdminPaymentsPage() {
  const [rows, setRows] = useState<PRRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<(typeof STATUSES)[number]['key']>('all');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const handleError = useAdminErrorHandler(setError);

  const load = useCallback(() => {
    const token = getAdminToken(); if (!token) return;
    setLoading(true);
    setError('');
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (status !== 'all') params.set('status', status);
    api.get<{ data: PRRow[]; total: number }>(`/admin/payment-requests?${params}`, authHeader(token))
      .then((d) => { setRows(d.data); setTotal(d.total); })
      .catch(handleError)
      .finally(() => setLoading(false));
  }, [handleError, page, status]);
  useEffect(() => {
    load();
  }, [load]);

  async function decide(id: string, decision: 'confirmed' | 'rejected') {
    const token = getAdminToken(); if (!token) return;
    setUpdatingId(id);
    try {
      const updated = await api.patch<{ id: string; status: 'confirmed' | 'rejected' }>(`/admin/payment-requests/${id}`, { status: decision }, authHeader(token));
      setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status: updated.status, reviewedAt: new Date().toISOString() } : r)));
    } catch (e: any) {
      handleError(e);
    } finally {
      setUpdatingId(null);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / 20));
  const tabStyle = (key: (typeof STATUSES)[number]['key']): React.CSSProperties => ({
    padding: '7px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer',
    fontWeight: 600, fontSize: '0.875rem',
    background: status === key ? 'var(--text-primary)' : 'transparent',
    color: status === key ? '#fff' : 'var(--text-secondary)',
  });

  return (
    <AdminShell>
      <div className="admin-page">
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>Админ-панель</p>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Заявки на оплату</h1>
        </div>

        <div style={{ display: 'inline-flex', background: 'var(--surface-1)', border: '1px solid var(--line-soft)', borderRadius: '8px', padding: '3px', marginBottom: '1.25rem', gap: '2px', flexWrap: 'wrap' }}>
          {STATUSES.map(({ key, label }) => (
            <button key={key} style={tabStyle(key)} onClick={() => { setStatus(key); setPage(1); }}>{label}</button>
          ))}
        </div>

        {error && <div style={{ borderLeft: '4px solid var(--accent-crimson)', background: 'rgba(239, 71, 111, 0.16)', borderRadius: '8px', padding: '0.875rem 1rem', marginBottom: '1rem', color: '#fecdd3' }}>{error}</div>}
        {loading && <TableSkeleton rows={8} columns={7} />}

        {!loading && (
          <div style={{ background: 'var(--surface-1)', border: '1px solid var(--line-soft)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Клиент</th>
                    <th>Сумма</th>
                    <th>Reference</th>
                    <th>Статус</th>
                    <th>Создана</th>
                    <th>Займ</th>
                    <th className="col-actions">Действие</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)' }}>Заявок не найдено</td></tr>}
                  {rows.map((p) => {
                    const s = BADGE[p.status] ?? { label: p.status, cls: 'badge-closed' };
                    return (
                      <tr key={p.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{[p.user?.firstName, p.user?.lastName].filter(Boolean).join(' ') || '—'}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--f-mono)' }}>{p.user?.phone ?? '—'}</div>
                        </td>
                        <td style={{ fontFamily: 'var(--f-mono)', fontWeight: 700 }}>{formatCurrency(p.amount)}</td>
                        <td style={{ fontFamily: 'var(--f-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.reference}</td>
                        <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                        <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{formatDate(p.createdAt)}</td>
                        <td><Link href={`/admin/loans/${p.loanId}`} style={{ fontSize: '0.8125rem', color: 'var(--accent-indigo)', textDecoration: 'none', fontWeight: 600 }}>Открыть займ</Link></td>
                        <td className="col-actions">
                          {p.status === 'pending' ? (
                            <div style={{ display: 'inline-flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              <button onClick={() => decide(p.id, 'confirmed')} disabled={updatingId === p.id} style={{ background: 'var(--accent-mint)', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
                                Подтвердить
                              </button>
                              <button onClick={() => decide(p.id, 'rejected')} disabled={updatingId === p.id} style={{ background: 'var(--surface-1)', color: 'var(--accent-crimson)', border: '1.5px solid var(--accent-crimson)', borderRadius: '6px', padding: '6px 12px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
                                Отклонить
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{p.reviewedAt ? formatDate(p.reviewedAt) : '—'}</span>
                          )}
                        </td>
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
