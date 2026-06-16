'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import AdminShell from '@/widgets/sidebar/AdminShell';
import { api, authHeader } from '@/shared/lib/api';
import { useAdminErrorHandler } from '@/shared/lib/admin-auth-context';
import { formatDate } from '@/shared/lib/format';
import { Bell, AlertTriangle, FileText, Wallet } from 'lucide-react';
import { Skeleton } from '@/shared/ui/Skeleton';

function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lb_admin_token');
}

interface DashData {
  counts: { newApplications: number; overdueLoans: number; pendingPayments: number };
  recent: { id: string; type: string; title: string; body: string; createdAt: string; href?: string }[];
}

function Stat({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '12px', padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.75rem', color: '#4A6580', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{label}</span>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${color}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} color={color} />
        </div>
      </div>
      <p style={{ fontFamily: 'var(--f-mono)', fontSize: '2rem', fontWeight: 700, color: '#0D1B2A', lineHeight: 1 }}>{value}</p>
    </div>
  );
}

export default function AdminNotificationsPage() {
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const handleError = useAdminErrorHandler(setError);

  const load = useCallback(() => {
    const token = getAdminToken(); if (!token) return;
    setLoading(true);
    setError('');
    api.get<DashData>('/admin/notifications', authHeader(token))
      .then(setData)
      .catch(handleError)
      .finally(() => setLoading(false));
  }, [handleError]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <AdminShell>
      <div className="admin-page">
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#4A6580', marginBottom: '2px' }}>Админ-панель</p>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0D1B2A' }}>Системные уведомления</h1>
        </div>

        {loading && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '12px', padding: '1.25rem' }}>
                  <Skeleton h={12} w={120} />
                  <div style={{ marginTop: '1rem' }}><Skeleton h={32} w={90} /></div>
                </div>
              ))}
            </div>
            <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '12px', padding: '1.25rem' }}>
              <Skeleton h={20} w={180} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginTop: '1rem' }}>
                {[1, 2, 3].map((i) => <Skeleton key={i} h={48} />)}
              </div>
            </div>
          </>
        )}

        {!loading && error && (
          <div style={{ borderLeft: '4px solid #C0392B', background: '#fff', borderRadius: '12px', padding: '1rem 1.25rem', color: '#0D1B2A' }}>
            <p style={{ fontWeight: 700, marginBottom: '0.375rem' }}>Не удалось загрузить данные</p>
            <p style={{ fontSize: '0.875rem', color: '#4A6580', marginBottom: '0.75rem' }}>{error}</p>
            <button onClick={load} style={{ background: '#2E7DF7', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 16px', fontWeight: 600, cursor: 'pointer' }}>
              Попробовать снова
            </button>
          </div>
        )}

        {!loading && data && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <Stat label="Новые заявки" value={data.counts.newApplications} icon={FileText} color="#2E7DF7" />
              <Stat label="Просроченные" value={data.counts.overdueLoans} icon={AlertTriangle} color="#C08020" />
              <Stat label="Заявки на оплату" value={data.counts.pendingPayments} icon={Wallet} color="#1E8A5E" />
            </div>

            <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '12px', padding: '1.25rem' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.0625rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '1rem' }}>
                <Bell size={18} color="#2E7DF7" /> События
              </h2>
              {data.recent.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                  <Bell size={60} color="#4A6580" style={{ margin: '0 auto 1rem', display: 'block' }} />
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.5rem' }}>Событий пока нет</h3>
                  <p style={{ color: '#4A6580' }}>Новые заявки, просрочки и заявки на оплату появятся здесь.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {data.recent.map((n) => {
                    const body = (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.75rem 0', borderBottom: '1px solid #F0F3F6', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 600, color: '#0D1B2A', fontSize: '0.9375rem' }}>{n.title}</p>
                          <p style={{ color: '#4A6580', fontSize: '0.8125rem', marginTop: '2px' }}>{n.body}</p>
                        </div>
                        <p style={{ color: '#4A6580', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{formatDate(n.createdAt)}</p>
                      </div>
                    );

                    return n.href ? (
                      <Link key={n.id} href={n.href} style={{ textDecoration: 'none' }}>
                        {body}
                      </Link>
                    ) : (
                      <div key={n.id}>{body}</div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminShell>
  );
}
