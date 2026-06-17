'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import AdminShell from '@/widgets/sidebar/AdminShell';
import { api, authHeader } from '@/shared/lib/api';
import { formatCurrency, formatDate } from '@/shared/lib/format';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdminErrorHandler } from '@/shared/lib/admin-auth-context';

function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lb_admin_token');
}

interface AppRow {
  id: string;
  type: 'personal' | 'business';
  amount: number;
  termDays?: number;
  termMonths?: number;
  status: 'new' | 'in_review' | 'approved' | 'rejected';
  phone?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  comment?: string;
  createdAt: string;
  user?: { id: string; phone: string; firstName?: string; lastName?: string };
}

const STATUSES: { key: 'all' | AppRow['status']; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'new', label: 'Новые' },
  { key: 'in_review', label: 'На проверке' },
  { key: 'approved', label: 'Одобренные' },
  { key: 'rejected', label: 'Отклонённые' },
];

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  new: { label: 'Новая', cls: 'badge-new' },
  in_review: { label: 'На проверке', cls: 'badge-pending' },
  approved: { label: 'Одобрена', cls: 'badge-approved' },
  rejected: { label: 'Отклонена', cls: 'badge-rejected' },
};

function clientName(a: AppRow): string {
  if (a.type === 'business') return a.companyName ?? '—';
  if (a.firstName || a.lastName) return `${a.firstName ?? ''} ${a.lastName ?? ''}`.trim();
  if (a.user?.firstName || a.user?.lastName) return `${a.user.firstName ?? ''} ${a.user.lastName ?? ''}`.trim();
  return '—';
}

function panelStyle(extra: React.CSSProperties = {}): React.CSSProperties {
  return {
    background: 'var(--surface-1)',
    border: '1px solid var(--line-soft)',
    borderRadius: '10px',
    boxShadow: '0 8px 24px rgba(13,27,42,0.06), 0 2px 6px rgba(13,27,42,0.04)',
    color: 'var(--text-primary)',
    ...extra,
  };
}

export default function AdminApplicationsPage() {
  const [rows, setRows] = useState<AppRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<'all' | AppRow['status']>('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const handleError = useAdminErrorHandler(setError);

  const LIMIT = 20;

  const load = useCallback(() => {
    const token = getAdminToken();
    if (!token) return;
    setLoading(true);
    setError('');
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (status !== 'all') params.set('status', status);
    if (search) params.set('search', search);
    api.get<{ data: AppRow[]; total: number }>(`/admin/applications?${params}`, authHeader(token))
      .then((d) => {
        setRows(d.data);
        setTotal(d.total);
      })
      .catch(handleError)
      .finally(() => setLoading(false));
  }, [handleError, page, status, search]);

  useEffect(() => {
    load();
  }, [load]);

  async function changeStatus(id: string, newStatus: AppRow['status']) {
    const token = getAdminToken();
    if (!token) return;
    setUpdatingId(id);
    try {
      const updated = await api.patch<AppRow>(`/admin/applications/${id}/status`, { status: newStatus }, authHeader(token));
      setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status: updated.status, comment: updated.comment } : r)));
    } catch (e: any) {
      handleError(e);
    } finally {
      setUpdatingId(null);
    }
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <AdminShell>
      <div className="admin-page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>Админ-панель</p>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Заявки</h1>
          </div>
          <form onSubmit={submitSearch} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: 12, pointerEvents: 'none' }} />
            <input
              type="search"
              placeholder="Поиск по имени, телефону, email…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ padding: '8px 14px 8px 36px', border: '1px solid var(--line-strong)', borderRadius: '8px', fontSize: '0.875rem', minWidth: '260px', outline: 'none', color: 'var(--text-primary)', background: 'var(--surface-1)' }}
            />
          </form>
        </div>

        <div className="status-toggle-group" style={{ marginBottom: '1.25rem' }}>
          {STATUSES.map(({ key, label }) => (
            <button
              key={key}
              className={`status-toggle${status === key ? ' active' : ''}`}
              onClick={() => {
                setStatus(key);
                setPage(1);
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ ...panelStyle({ borderLeft: '4px solid #EF4444', padding: '0.875rem 1rem', marginBottom: '1rem' }) }}>
            <span style={{ color: 'var(--accent-crimson)', fontSize: '0.875rem' }}>{error}</span>
          </div>
        )}

        <div style={panelStyle({ overflow: 'hidden' })}>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Дата</th>
                  <th>Клиент</th>
                  <th>Телефон</th>
                  <th>Сумма</th>
                  <th>Срок</th>
                  <th>Статус</th>
                  <th className="col-actions">Действие</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <tr key={`s-${i}`}>
                        {Array.from({ length: 8 }).map((__, j) => (
                          <td key={j} style={{ padding: '0.875rem 1rem' }}>
                            <div style={{ height: 14, borderRadius: 6, background: 'linear-gradient(90deg, rgba(30,41,59,0.42), rgba(59,130,246,0.2), rgba(30,41,59,0.42))', backgroundSize: '200% 100%', animation: 'shimmer 1.5s ease-in-out infinite', width: `${50 + ((j * 11 + i * 7) % 40)}%` }} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                )}
                {!loading && rows.length === 0 && (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: 'rgba(154,164,182,0.88)' }}>Заявок не найдено</td></tr>
                )}
                {!loading && rows.map((a) => {
                  const s = STATUS_BADGE[a.status] ?? { label: a.status, cls: 'badge-closed' };
                  const termLabel = a.termDays ? `${a.termDays} дн.` : (a.termMonths ? `${a.termMonths} мес.` : '—');
                  return (
                    <tr key={a.id}>
                      <td style={{ fontFamily: 'var(--f-mono)', fontSize: '0.75rem', color: 'rgba(154,164,182,0.88)' }}>{a.id.slice(0, 8)}…</td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{formatDate(a.createdAt)}</td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{clientName(a)}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{a.type === 'personal' ? 'Физлицо' : 'Бизнес'}</div>
                      </td>
                      <td style={{ fontFamily: 'var(--f-mono)', fontSize: '0.8125rem', color: 'var(--text-primary)' }}>{a.phone ?? a.user?.phone ?? '—'}</td>
                      <td style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>{formatCurrency(a.amount)}</td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{termLabel}</td>
                      <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                      <td className="col-actions">
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                          <Link href={`/admin/applications/${a.id}`} style={{ fontSize: '0.8125rem', color: 'var(--accent-indigo)', textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}>
                            Открыть
                          </Link>
                          {(a.status === 'approved' || a.status === 'rejected') ? (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                              {a.status === 'approved' ? 'Займ создан' : 'Решение принято'}
                            </span>
                          ) : (
                            <select
                              disabled={updatingId === a.id}
                              value={a.status}
                              onChange={(e) => changeStatus(a.id, e.target.value as AppRow['status'])}
                              style={{ padding: '6px 10px', border: '1px solid var(--line-strong)', borderRadius: '8px', fontSize: '0.8125rem', background: 'var(--surface-1)', color: 'var(--text-primary)', cursor: 'pointer', minWidth: '140px' }}
                            >
                              <option value={a.status} disabled>{a.status === 'new' ? 'Новая' : 'На проверке'}</option>
                              {a.status === 'new' && <option value="in_review">Взять на проверку</option>}
                              <option value="approved">Одобрить</option>
                              <option value="rejected">Отклонить</option>
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', fontSize: '0.875rem', color: 'rgba(154,164,182,0.88)' }}>
          <span>Всего: <strong style={{ color: 'var(--text-primary)' }}>{total}</strong></span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="btn btn-secondary btn-sm" style={{ padding: '6px 10px', opacity: page <= 1 ? 0.5 : 1 }}><ChevronLeft size={16} /></button>
            <span style={{ fontFamily: 'var(--f-mono)', color: 'var(--text-primary)' }}>{page} / {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="btn btn-secondary btn-sm" style={{ padding: '6px 10px', opacity: page >= totalPages ? 0.5 : 1 }}><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
