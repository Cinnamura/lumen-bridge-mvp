'use client';
import { useEffect, useState } from 'react';
import AdminShell from '@/widgets/sidebar/AdminShell';
import { api, authHeader } from '@/shared/lib/api';
import { formatCurrency, formatDate } from '@/shared/lib/format';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lb_admin_token');
}

interface LoanRow {
  id: string; amount: number; termDays: number;
  dailyPayment: number; totalRepayment: number;
  status: 'pending_signing' | 'active' | 'overdue' | 'closed';
  issuedAt?: string; closedAt?: string; createdAt: string;
  user?: { phone: string; firstName?: string; lastName?: string };
}

const STATUSES = [
  { key: 'all', label: 'Все' },
  { key: 'pending_signing', label: 'Ожидают подписания' },
  { key: 'active', label: 'Активные' },
  { key: 'overdue', label: 'Просроченные' },
  { key: 'closed', label: 'Закрытые' },
];
const BADGE: Record<string, { label: string; cls: string }> = {
  pending_signing: { label: 'Подписание', cls: 'badge-signing' },
  active:          { label: 'Активен',    cls: 'badge-active' },
  overdue:         { label: 'Просрочен',  cls: 'badge-overdue' },
  closed:          { label: 'Закрыт',     cls: 'badge-closed' },
};

export default function AdminLoansPage() {
  const [rows, setRows]   = useState<LoanRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage]   = useState(1);
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  function load() {
    const token = getAdminToken(); if (!token) return;
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (status !== 'all') params.set('status', status);
    api.get<{ data: LoanRow[]; total: number }>(`/admin/loans?${params}`, authHeader(token))
      .then((d) => { setRows(d.data); setTotal(d.total); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }
  useEffect(load, [page, status]);

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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0D1B2A' }}>Займы</h1>
        </div>

        <div style={{ display: 'inline-flex', background: '#fff', border: '1px solid #E8ECF0', borderRadius: '8px', padding: '3px', marginBottom: '1.25rem', gap: '2px', flexWrap: 'wrap' }}>
          {STATUSES.map(({ key, label }) => (
            <button key={key} style={tabStyle(key)} onClick={() => { setStatus(key); setPage(1); }}>{label}</button>
          ))}
        </div>

        {error && <div style={{ borderLeft: '4px solid #C0392B', background: '#FAD7D4', borderRadius: '8px', padding: '0.875rem 1rem', marginBottom: '1rem', color: '#6B1A14' }}>{error}</div>}

        <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Клиент</th>
                  <th>Сумма</th>
                  <th>Срок</th>
                  <th>Ежедневный платёж</th>
                  <th>Статус</th>
                  <th>Выдан</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: '#4A6580' }}>
                  <Loader2 size={20} style={{ display: 'inline-block', marginRight: 8 }} /> Загрузка…</td></tr>}
                {!loading && rows.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: '#4A6580' }}>Займов не найдено</td></tr>}
                {!loading && rows.map((l) => {
                  const s = BADGE[l.status] ?? { label: l.status, cls: 'badge-closed' };
                  return (
                    <tr key={l.id}>
                      <td style={{ fontFamily: 'var(--f-mono)', fontSize: '0.75rem', color: '#4A6580' }}>{l.id.slice(0, 8)}…</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{[l.user?.firstName, l.user?.lastName].filter(Boolean).join(' ') || '—'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#4A6580', fontFamily: 'var(--f-mono)' }}>{l.user?.phone ?? '—'}</div>
                      </td>
                      <td style={{ fontFamily: 'var(--f-mono)', fontWeight: 700 }}>{formatCurrency(l.amount)}</td>
                      <td style={{ fontSize: '0.8125rem', color: '#4A6580' }}>{l.termDays} дн.</td>
                      <td style={{ fontFamily: 'var(--f-mono)' }}>{formatCurrency(l.dailyPayment)}</td>
                      <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                      <td style={{ fontSize: '0.8125rem', color: '#4A6580' }}>{l.issuedAt ? formatDate(l.issuedAt) : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

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
