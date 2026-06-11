'use client';
import { useEffect, useState } from 'react';
import AdminShell from '@/widgets/sidebar/AdminShell';
import { api, authHeader } from '@/shared/lib/api';
import { formatDate } from '@/shared/lib/format';
import { Bell, AlertTriangle, FileText, Wallet } from 'lucide-react';

function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lb_admin_token');
}

interface DashData {
  counts: { newApplications: number; overdueLoans: number; pendingPayments: number };
  recent: { id: string; type: string; title: string; body: string; createdAt: string }[];
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
  const [data, setData]       = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    const token = getAdminToken(); if (!token) return;
    api.get<DashData>('/admin/notifications', authHeader(token))
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell>
      <div className="admin-page">
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#4A6580', marginBottom: '2px' }}>Админ-панель</p>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0D1B2A' }}>Сводка по системе</h1>
        </div>

        {loading && <p style={{ color: '#4A6580' }}>Загрузка…</p>}
        {!loading && error && <p style={{ color: '#C0392B' }}>Ошибка: {error}</p>}

        {!loading && data && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <Stat label="Новые заявки"     value={data.counts.newApplications} icon={FileText}      color="#2E7DF7" />
              <Stat label="Просроченные"     value={data.counts.overdueLoans}     icon={AlertTriangle} color="#C08020" />
              <Stat label="Заявки на оплату" value={data.counts.pendingPayments}  icon={Wallet}        color="#1E8A5E" />
            </div>

            <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '12px', padding: '1.25rem' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.0625rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '1rem' }}>
                <Bell size={18} color="#2E7DF7" /> События
              </h2>
              {data.recent.length === 0 ? (
                <p style={{ color: '#4A6580', fontSize: '0.875rem' }}>Нет событий для отображения.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {data.recent.map((n) => (
                    <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.75rem 0', borderBottom: '1px solid #F0F3F6' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, color: '#0D1B2A', fontSize: '0.9375rem' }}>{n.title}</p>
                        <p style={{ color: '#4A6580', fontSize: '0.8125rem', marginTop: '2px' }}>{n.body}</p>
                      </div>
                      <p style={{ color: '#4A6580', fontSize: '0.75rem', marginLeft: '1rem', whiteSpace: 'nowrap' }}>{formatDate(n.createdAt)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminShell>
  );
}
