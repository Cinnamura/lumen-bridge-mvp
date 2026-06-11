'use client';
import { useEffect, useState } from 'react';
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
  id: string; loanId: string; userId: string;
  amount: number; reference: string;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string; reviewedAt?: string | null;
  user?: { phone: string; firstName?: string; lastName?: string };
}

const STATUSES = [
  { key: 'all',       label: 'Все' },
  { key: 'pending',   label: 'Ожидают' },
  { key: 'confirmed', label: 'Подтверждены' },
  { key: 'rejected',  label: 'Отклонены' },
];
const BADGE: Record<string, { label: string; cls: string }> = {
  pending:   { label: 'Ожидает',     cls: 'badge-pending' },
  confirmed: { label: 'Подтверждён', cls: 'badge-approved' },
  rejected:  { label: 'Отклонён',    cls: 'badge-rejected' },
};

export default function AdminPaymentsPage() {
  const [rows, setRows]   = useState<PRRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage]   = useState(1);
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError]     = useState('');
  const handleError = useAdminErrorHandler(setError);

  function load() {
    const token = getAdminToken(); if (!token) return;
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (status !== 'all') params.set('status', status);
    api.get<{ data: PRRow[]; total: number }>(`/admin/payment-requests?${params}`, authHeader(token))
      .then((d) => { setRows(d.data); setTotal(d.total); })
      .catch(handleError)
      .finally(() => setLoading(false));
  }
  useEffect(load, [page, status]);

  async function decide(id: string, decision: 'confirmed' | 'rejected') {
    const token = getAdminToken(); if (!token) return;
    setUpdatingId(id);
    try {
      const updated = await api.patch<{ id: string; status: 'confirmed' | 'rejected' }>(`/admin/payment-requests/${id}`, { status: decision }, authHeader(token));
      setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status: updated.status, reviewedAt: new Date().toISOString() } : r)));
    } catch (e: any) { handleError(e); }
    finally { setUpdatingId(null); }
  }

  const totalPages = Math.max(1, Math.ceil(total / 20));
  const tabStyle = (s: string): React.CSSProperties => ({
    padding: '7px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer',
    fontWeight: 600, fontSize: '0.875rem',
    background: status === s ? '#0D1B2A' : 'transparent',
    color: status === s ? '#fff' : '#4A6580',
  });

  return (
    <AdminShell>
      <div className="admin-page">
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#4A6580', marginBottom: '2px' }}>Админ-панель</p>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0D1B2A' }}>Заявки на оплату</h1>
        </div>

        <div style={{ display: 'inline-flex', background: '#fff', border: '1px solid #E8ECF0', borderRadius: '8px', padding: '3px', marginBottom: '1.25rem', gap: '2px', flexWrap: 'wrap' }}>
          {STATUSES.map(({ key, label }) => (
            <button key={key} style={tabStyle(key)} onClick={() => { setStatus(key); setPage(1); }}>{label}</button>
          ))}
        </div>

        {error && <div style={{ borderLeft: '4px solid #C0392B', background: '#FAD7D4', borderRadius: '8px', padding: '0.875rem 1rem', marginBottom: '1rem', color: '#6B1A14' }}>{error}</div>}

        {loading && <TableSkeleton rows={8} columns={6} />}

        {!loading && (
        <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Клиент</th>
                  <th>Сумма</th>
                  <th>Reference</th>
                  <th>Статус</th>
                  <th>Создана</th>
                  <th className="col-actions">Действие</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: '#4A6580' }}>Заявок не найдено</td></tr>}
                {rows.map((p) => {
                  const s = BADGE[p.status] ?? { label: p.status, cls: 'badge-closed' };
                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{[p.user?.firstName, p.user?.lastName].filter(Boolean).join(' ') || '—'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#4A6580', fontFamily: 'var(--f-mono)' }}>{p.user?.phone ?? '—'}</div>
                      </td>
                      <td style={{ fontFamily: 'var(--f-mono)', fontWeight: 700 }}>{formatCurrency(p.amount)}</td>
                      <td style={{ fontFamily: 'var(--f-mono)', fontSize: '0.75rem', color: '#4A6580', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.reference}</td>
                      <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                      <td style={{ fontSize: '0.8125rem', color: '#4A6580' }}>{formatDate(p.createdAt)}</td>
                      <td className="col-actions">
                        {p.status === 'pending' ? (
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button onClick={() => decide(p.id, 'confirmed')} disabled={updatingId === p.id}
                              style={{ background: '#1E8A5E', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
                              Подтвердить
                            </button>
                            <button onClick={() => decide(p.id, 'rejected')} disabled={updatingId === p.id}
                              style={{ background: '#fff', color: '#C0392B', border: '1.5px solid #C0392B', borderRadius: '6px', padding: '6px 12px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
                              Отклонить
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#4A6580' }}>{p.reviewedAt ? formatDate(p.reviewedAt) : '—'}</span>
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
