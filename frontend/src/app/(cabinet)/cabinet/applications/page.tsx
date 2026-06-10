'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import CabinetShell from '@/widgets/sidebar/CabinetShell';
import { api, authHeader } from '@/shared/lib/api';
import { getToken } from '@/shared/lib/auth';
import { formatCurrency, formatDate } from '@/shared/lib/format';

interface ApplicationDto {
  id: string; type: string; amount: number;
  termDays?: number; termMonths?: number;
  status: 'new' | 'in_review' | 'approved' | 'rejected';
  phone: string; firstName?: string; lastName?: string;
  companyName?: string; createdAt: string;
}

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  new:       { label: 'На рассмотрении', cls: 'badge-new' },
  in_review: { label: 'В обработке',    cls: 'badge-pending' },
  approved:  { label: 'Одобрена',       cls: 'badge-approved' },
  rejected:  { label: 'Отклонена',      cls: 'badge-rejected' },
};

function Badge({ status }: { status: string }) {
  const s = STATUS_LABELS[status] ?? { label: status, cls: 'badge-closed' };
  return (
    <span className={`badge ${s.cls}`}>{s.label}</span>
  );
}

function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {[1,2,3].map((i) => (
        <div key={i} style={{ height: '72px', borderRadius: '10px', background: 'linear-gradient(90deg,#E8ECF0,#D0D5DD,#E8ECF0)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
      ))}
    </div>
  );
}

export default function ApplicationsPage() {
  const [items, setItems] = useState<ApplicationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    api.get<ApplicationDto[]>('/cabinet/applications', authHeader(token))
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <CabinetShell>
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#4A6580', marginBottom: '2px' }}>Личный кабинет</p>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0D1B2A' }}>Мои заявки</h1>
          </div>
          <Link href="/apply" style={{ background: '#2E7DF7', color: '#fff', borderRadius: '8px', padding: '10px 20px', fontWeight: 600, textDecoration: 'none', fontSize: '0.9375rem' }}>
            Подать новую заявку
          </Link>
        </div>

        {loading && <Skeleton />}

        {!loading && error && (
          <div style={{ borderLeft: '4px solid #C0392B', background: '#FAD7D4', borderRadius: '8px', padding: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            <div>
              <p style={{ fontWeight: 600, color: '#6B1A14', marginBottom: '4px' }}>Не удалось загрузить данные</p>
              <p style={{ color: '#6B1A14', fontSize: '0.875rem' }}>{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#4A6580" strokeWidth="1.25" style={{ margin: '0 auto 1rem' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.5rem' }}>Заявок пока нет</h3>
            <p style={{ color: '#4A6580', marginBottom: '1.25rem' }}>Подайте первую заявку для получения займа</p>
            <Link href="/apply" style={{ background: '#2E7DF7', color: '#fff', borderRadius: '8px', padding: '10px 24px', fontWeight: 600, textDecoration: 'none' }}>
              Подать заявку
            </Link>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {items.map((a) => (
              <div key={a.id} style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', boxShadow: '0 1px 3px rgba(13,27,42,0.04)' }}>
                <div>
                  <p style={{ fontFamily: 'var(--f-mono)', fontSize: '1.125rem', fontWeight: 700, color: '#0D1B2A' }}>
                    {formatCurrency(a.amount)} EUR
                  </p>
                  <p style={{ fontSize: '0.8125rem', color: '#4A6580', marginTop: '2px' }}>
                    {a.type === 'personal'
                      ? `${a.termDays} дней`
                      : `${a.termMonths} мес.`}{' '}
                    · {a.type === 'personal' ? 'Физлицо' : 'Бизнес'}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <p style={{ fontSize: '0.8125rem', color: '#4A6580' }}>{formatDate(a.createdAt)}</p>
                  <Badge status={a.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CabinetShell>
  );
}
