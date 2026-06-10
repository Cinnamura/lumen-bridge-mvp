'use client';
import { useEffect, useState } from 'react';
import CabinetShell from '@/widgets/sidebar/CabinetShell';
import { api, authHeader } from '@/shared/lib/api';
import { getToken } from '@/shared/lib/auth';
import { formatDate } from '@/shared/lib/format';
import { Bell, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface NotificationDto {
  id: string; type: string; title: string; body?: string;
  isRead: boolean; relatedId?: string; createdAt: string;
}

function iconFor(type: string) {
  if (type.includes('approved') || type.includes('signed') || type.includes('confirmed') || type.includes('closed'))
    return <CheckCircle size={18} color="#1E8A5E" />;
  if (type.includes('rejected') || type.includes('overdue'))
    return <AlertTriangle size={18} color="#C08020" />;
  return <Info size={18} color="#2E7DF7" />;
}

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationDto[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    const token = getToken(); if (!token) return;
    api.get<NotificationDto[]>('/cabinet/notifications', authHeader(token))
      .then(setItems).finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function markRead(id: string) {
    const token = getToken(); if (!token) return;
    await api.patch(`/cabinet/notifications/${id}/read`, {}, authHeader(token));
    setItems(items => items.map(n => n.id === id ? { ...n, isRead: true } : n));
  }

  return (
    <CabinetShell>
      <div style={{ padding: '2rem', maxWidth: '680px' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#4A6580', marginBottom: '2px' }}>Личный кабинет</p>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0D1B2A' }}>Уведомления</h1>
        </div>

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1,2,3].map(i => <div key={i} style={{ height: '64px', borderRadius: '10px', background: 'linear-gradient(90deg,#E8ECF0,#D0D5DD,#E8ECF0)', backgroundSize: '200%', animation: 'shimmer 1.5s infinite' }} />)}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <Bell size={60} color="#4A6580" style={{ margin: '0 auto 1rem', display: 'block' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.5rem' }}>Уведомлений нет</h3>
            <p style={{ color: '#4A6580' }}>Здесь будут появляться уведомления о статусах заявок и займов</p>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {items.map((n) => (
              <div key={n.id} onClick={() => !n.isRead && markRead(n.id)} style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.875rem',
                padding: '1rem',
                background: n.isRead ? '#fff' : '#E8ECF0',
                borderBottom: '1px solid #F0F3F6',
                cursor: n.isRead ? 'default' : 'pointer',
                position: 'relative',
              }}>
                <div style={{ marginTop: '2px', flexShrink: 0 }}>{iconFor(n.type)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <p style={{ fontWeight: n.isRead ? 500 : 700, color: '#0D1B2A', fontSize: '0.9375rem' }}>{n.title}</p>
                    {!n.isRead && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2E7DF7', flexShrink: 0, marginTop: '4px' }} />}
                  </div>
                  {n.body && <p style={{ color: '#4A6580', fontSize: '0.875rem', marginTop: '2px' }}>{n.body}</p>}
                  <p style={{ color: '#4A6580', fontSize: '0.75rem', marginTop: '4px' }}>{formatDate(n.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CabinetShell>
  );
}
