'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import AdminShell from '@/widgets/sidebar/AdminShell';
import { api, authHeader } from '@/shared/lib/api';
import { useAdminErrorHandler } from '@/shared/lib/admin-auth-context';
import { formatDate } from '@/shared/lib/format';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { TableSkeleton } from '@/shared/ui/Skeleton';

function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lb_admin_token');
}

interface ClientRow {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  applicationsCount: number;
  loansCount: number;
  status: 'new' | 'applicant' | 'active' | 'overdue' | 'closed';
}

const STATUS_FILTERS = [
  { key: 'all', label: 'Все' },
  { key: 'active', label: 'С активным займом' },
  { key: 'overdue', label: 'С просрочкой' },
  { key: 'no_loans', label: 'Без займов' },
] as const;

const STATUS_BADGE: Record<ClientRow['status'], { label: string; cls: string }> = {
  new: { label: 'Новый', cls: 'badge-new' },
  applicant: { label: 'Есть заявки', cls: 'badge-pending' },
  active: { label: 'Активный займ', cls: 'badge-active' },
  overdue: { label: 'Просрочка', cls: 'badge-overdue' },
  closed: { label: 'История займов', cls: 'badge-closed' },
};

export default function AdminClientsPage() {
  const [rows, setRows] = useState<ClientRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]['key']>('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const handleError = useAdminErrorHandler(setError);

  const load = useCallback(() => {
    const token = getAdminToken(); if (!token) return;
    setLoading(true);
    setError('');
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (search) params.set('search', search);
    if (status !== 'all') params.set('status', status);
    api.get<{ data: ClientRow[]; total: number }>(`/admin/clients?${params}`, authHeader(token))
      .then((d) => { setRows(d.data); setTotal(d.total); })
      .catch(handleError)
      .finally(() => setLoading(false));
  }, [handleError, page, search, status]);
  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / 20));
  const tabStyle = (key: (typeof STATUS_FILTERS)[number]['key']): React.CSSProperties => ({
    padding: '7px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.875rem',
    background: status === key ? '#0D1B2A' : 'transparent',
    color: status === key ? '#fff' : '#4A6580',
  });

  return (
    <AdminShell>
      <div className="admin-page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#4A6580', marginBottom: '2px' }}>Админ-панель</p>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0D1B2A' }}>Клиенты</h1>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setPage(1); setSearch(searchInput.trim()); }} style={{ position: 'relative' }}>
            <Search size={16} color="#4A6580" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="search"
              placeholder="Поиск по имени, телефону, email…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ padding: '8px 14px 8px 36px', border: '1.5px solid #C8D0DA', borderRadius: '8px', fontSize: '0.875rem', minWidth: '260px', outline: 'none', color: '#0D1B2A', background: '#fff' }}
            />
          </form>
        </div>

        <div style={{ display: 'inline-flex', background: '#fff', border: '1px solid #E8ECF0', borderRadius: '8px', padding: '3px', marginBottom: '1.25rem', gap: '2px', flexWrap: 'wrap' }}>
          {STATUS_FILTERS.map(({ key, label }) => (
            <button key={key} style={tabStyle(key)} onClick={() => { setStatus(key); setPage(1); }}>
              {label}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ borderLeft: '4px solid #C0392B', background: '#FAD7D4', borderRadius: '8px', padding: '0.875rem 1rem', marginBottom: '1rem', color: '#6B1A14' }}>{error}</div>
        )}

        {loading && <TableSkeleton rows={8} columns={7} />}

        {!loading && (
          <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Имя</th>
                    <th>Телефон</th>
                    <th>Email</th>
                    <th>Статус</th>
                    <th style={{ textAlign: 'right' }}>Заявки</th>
                    <th style={{ textAlign: 'right' }}>Займы</th>
                    <th>Зарегистрирован</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 && <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: '#4A6580' }}>Клиентов не найдено</td></tr>}
                  {rows.map((c) => {
                    const badge = STATUS_BADGE[c.status];
                    return (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 600 }}>{[c.firstName, c.lastName].filter(Boolean).join(' ') || '—'}</td>
                        <td style={{ fontFamily: 'var(--f-mono)' }}>{c.phone}</td>
                        <td style={{ color: c.email ? '#4A6580' : '#C8D0DA', fontSize: '0.8125rem' }}>{c.email || '—'}</td>
                        <td><span className={`badge ${badge.cls}`}>{badge.label}</span></td>
                        <td style={{ textAlign: 'right', fontFamily: 'var(--f-mono)', fontWeight: 600 }}>{c.applicationsCount}</td>
                        <td style={{ textAlign: 'right', fontFamily: 'var(--f-mono)', fontWeight: 600 }}>{c.loansCount}</td>
                        <td style={{ fontSize: '0.8125rem', color: '#4A6580' }}>{formatDate(c.createdAt)}</td>
                        <td><Link href={`/admin/clients/${c.id}`} style={{ fontSize: '0.8125rem', color: '#2E7DF7', textDecoration: 'none', fontWeight: 600 }}>Открыть</Link></td>
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
