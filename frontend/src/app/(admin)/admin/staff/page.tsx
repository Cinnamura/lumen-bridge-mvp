'use client';
import { useEffect, useMemo, useState } from 'react';
import AdminShell from '@/widgets/sidebar/AdminShell';
import { api, authHeader } from '@/shared/lib/api';
import { useAdminAuth, useAdminErrorHandler } from '@/shared/lib/admin-auth-context';
import { formatDate } from '@/shared/lib/format';
import { Search, Shield, UserPlus } from 'lucide-react';
import { TableSkeleton } from '@/shared/ui/Skeleton';

function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lb_admin_token');
}

interface StaffUser {
  id: string;
  login: string;
  role: 'admin' | 'operator';
  createdAt: string;
}

const EMPTY_FORM = { login: '', password: '', role: 'operator' as 'admin' | 'operator' };

export default function AdminStaffPage() {
  const { profile, loading: authLoading } = useAdminAuth();
  const [rows, setRows] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<StaffUser | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const handleError = useAdminErrorHandler(setError);

  const isAdmin = profile?.role === 'admin';

  function resetForm() {
    setEditing(null);
    setForm(EMPTY_FORM);
  }

  const load = useMemo(() => () => {
    const token = getAdminToken();
    if (!token || !isAdmin) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    const suffix = params.toString() ? `?${params}` : '';
    api.get<StaffUser[]>(`/admin/staff${suffix}`, authHeader(token))
      .then(setRows)
      .catch(handleError)
      .finally(() => setLoading(false));
  }, [handleError, isAdmin, search]);

  useEffect(() => {
    if (!authLoading) load();
  }, [authLoading, load]);

  const title = editing ? 'Редактирование сотрудника' : 'Новый сотрудник';
  const submitLabel = editing ? 'Сохранить изменения' : 'Создать учётную запись';
  const helperText = editing
    ? 'Пароль можно оставить пустым, если менять его не нужно.'
    : 'Новый логин и пароль сразу активируют учётную запись.';

  const sortedRows = useMemo(() => rows.slice().sort((a, b) => {
    if (a.role !== b.role) return a.role === 'admin' ? -1 : 1;
    return a.login.localeCompare(b.login);
  }), [rows]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const token = getAdminToken();
    if (!token || !isAdmin) return;
    if (!form.login.trim()) {
      setError('Введите логин');
      return;
    }
    if (!editing && form.password.trim().length < 6) {
      setError('Пароль должен быть не короче 6 символов');
      return;
    }

    setSaving(true);
    setError('');
    try {
      if (editing) {
        await api.patch(`/admin/staff/${editing.id}`, {
          login: form.login.trim(),
          role: form.role,
          password: form.password.trim() || undefined,
        }, authHeader(token));
      } else {
        await api.post('/admin/staff', {
          login: form.login.trim(),
          password: form.password.trim(),
          role: form.role,
        }, authHeader(token));
      }
      resetForm();
      load();
    } catch (e: any) {
      handleError(e);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(user: StaffUser) {
    setEditing(user);
    setForm({ login: user.login, password: '', role: user.role });
    setError('');
  }

  return (
    <AdminShell>
      <div className="admin-page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#4A6580', marginBottom: '2px' }}>Админ-панель</p>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0D1B2A' }}>Сотрудники</h1>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setSearch(searchInput.trim()); }} style={{ position: 'relative' }}>
            <Search size={16} color="#4A6580" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="search"
              placeholder="Поиск по логину…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ padding: '8px 14px 8px 36px', border: '1.5px solid #C8D0DA', borderRadius: '8px', fontSize: '0.875rem', minWidth: '240px', outline: 'none', color: '#0D1B2A', background: '#fff' }}
            />
          </form>
        </div>

        {authLoading && <TableSkeleton rows={4} columns={4} />}

        {!authLoading && !isAdmin && (
          <div style={{ borderLeft: '4px solid #C0392B', background: '#fff', borderRadius: '12px', padding: '1rem 1.25rem', color: '#0D1B2A' }}>
            <p style={{ fontWeight: 700, marginBottom: '0.375rem' }}>Доступ ограничен</p>
            <p style={{ fontSize: '0.875rem', color: '#4A6580' }}>Управление ролями и учётными записями доступно только администратору.</p>
          </div>
        )}

        {!authLoading && isAdmin && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 0.9fr)', gap: '1rem', alignItems: 'start' }}>
            <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #F0F3F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <p style={{ fontWeight: 700, color: '#0D1B2A', fontSize: '0.9375rem' }}>Учётные записи персонала</p>
                  <p style={{ fontSize: '0.8125rem', color: '#4A6580', marginTop: '2px' }}>Операторы не видят этот раздел и не могут менять роли.</p>
                </div>
                <button onClick={resetForm} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#2E7DF7', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', fontWeight: 600, cursor: 'pointer' }}>
                  <UserPlus size={15} /> Новый
                </button>
              </div>

              {loading && <TableSkeleton rows={5} columns={4} />}
              {!loading && error && (
                <div style={{ borderLeft: '4px solid #C0392B', background: '#FAD7D4', margin: '1rem', borderRadius: '8px', padding: '0.875rem 1rem', color: '#6B1A14' }}>{error}</div>
              )}
              {!loading && !error && sortedRows.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                  <Shield size={56} color="#4A6580" style={{ margin: '0 auto 1rem', display: 'block' }} />
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.5rem' }}>Сотрудники не найдены</h3>
                  <p style={{ color: '#4A6580' }}>Измените поисковый запрос или создайте новую учётную запись.</p>
                </div>
              )}
              {!loading && !error && sortedRows.length > 0 && (
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Логин</th>
                        <th>Роль</th>
                        <th>Создан</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedRows.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <div style={{ fontWeight: 600, color: '#0D1B2A' }}>{user.login}</div>
                            {profile?.id === user.id && <div style={{ fontSize: '0.75rem', color: '#4A6580' }}>Текущая сессия</div>}
                          </td>
                          <td><span className={`badge ${user.role === 'admin' ? 'badge-approved' : 'badge-pending'}`}>{user.role === 'admin' ? 'Администратор' : 'Оператор'}</span></td>
                          <td style={{ fontSize: '0.8125rem', color: '#4A6580' }}>{formatDate(user.createdAt)}</td>
                          <td><button onClick={() => startEdit(user)} style={{ background: 'none', border: 'none', color: '#2E7DF7', fontWeight: 600, cursor: 'pointer', padding: 0 }}>Изменить</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <form onSubmit={submit} style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '12px', padding: '1.25rem' }}>
              <p style={{ fontWeight: 700, color: '#0D1B2A', fontSize: '1rem', marginBottom: '0.375rem' }}>{title}</p>
              <p style={{ fontSize: '0.8125rem', color: '#4A6580', marginBottom: '1rem' }}>{helperText}</p>

              <div style={{ display: 'grid', gap: '0.875rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', color: '#4A6580', marginBottom: '4px' }}>Логин</label>
                  <input value={form.login} onChange={(e) => setForm((prev) => ({ ...prev, login: e.target.value }))} style={{ width: '100%', border: '1.5px solid #C8D0DA', borderRadius: '8px', padding: '10px 12px', fontSize: '0.9375rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', color: '#4A6580', marginBottom: '4px' }}>{editing ? 'Новый пароль' : 'Пароль'}</label>
                  <input type="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} style={{ width: '100%', border: '1.5px solid #C8D0DA', borderRadius: '8px', padding: '10px 12px', fontSize: '0.9375rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', color: '#4A6580', marginBottom: '4px' }}>Роль</label>
                  <select value={form.role} onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value as 'admin' | 'operator' }))} style={{ width: '100%', border: '1.5px solid #C8D0DA', borderRadius: '8px', padding: '10px 12px', fontSize: '0.9375rem', outline: 'none', boxSizing: 'border-box', background: '#fff' }}>
                    <option value="operator">Оператор</option>
                    <option value="admin">Администратор</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <button type="submit" disabled={saving} style={{ background: saving ? '#A9C4F0' : '#2E7DF7', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 16px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}>
                  {saving ? 'Сохраняю…' : submitLabel}
                </button>
                {editing && (
                  <button type="button" onClick={resetForm} style={{ background: '#fff', color: '#4A6580', border: '1.5px solid #C8D0DA', borderRadius: '8px', padding: '10px 16px', fontWeight: 600, cursor: 'pointer' }}>
                    Отмена
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
