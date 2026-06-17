'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminShell from '@/widgets/sidebar/AdminShell';
import { api, authHeader } from '@/shared/lib/api';
import { formatCurrency, formatDate } from '@/shared/lib/format';
import { ChevronLeft, Save } from 'lucide-react';
import { Skeleton } from '@/shared/ui/Skeleton';
import { useAdminErrorHandler } from '@/shared/lib/admin-auth-context';

function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lb_admin_token');
}

interface AppDetail {
  id: string;
  type: 'personal' | 'business';
  amount: number;
  termDays?: number;
  termMonths?: number;
  status: 'new' | 'in_review' | 'approved' | 'rejected';
  comment?: string;
  createdAt: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  companyName?: string;
  regNumber?: string;
  repName?: string;
  repPosition?: string;
  user?: { id: string; phone: string; firstName?: string; lastName?: string; email?: string };
}

const STATUS_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: 'Новая', color: 'var(--accent-indigo)', bg: '#EBF1FE' },
  in_review: { label: 'На проверке', color: '#C08020', bg: '#FEF3CD' },
  approved: { label: 'Одобрена', color: 'var(--accent-mint)', bg: '#E0F5EC' },
  rejected: { label: 'Отклонена', color: 'var(--accent-crimson)', bg: '#FAD7D4' },
};

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  new: ['in_review', 'approved', 'rejected'],
  in_review: ['approved', 'rejected'],
  approved: [],
  rejected: [],
};

const TRANSITION_LABELS: Record<string, string> = {
  in_review: 'Взять на проверку',
  approved: 'Одобрить',
  rejected: 'Отклонить',
};

const TRANSITION_COLORS: Record<string, { bg: string; color: string; border?: string }> = {
  in_review: { bg: 'rgba(30, 41, 59, 0.88)', color: '#E2E8F0', border: '1px solid var(--line-strong)' },
  approved: { bg: 'var(--accent-mint)', color: '#fff' },
  rejected: { bg: 'rgba(239, 71, 111, 0.14)', color: 'var(--accent-crimson)', border: '1.5px solid rgba(239, 71, 111, 0.4)' },
};

export default function AdminApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [app, setApp] = useState<AppDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const handleError = useAdminErrorHandler(setError);

  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveOk, setSaveOk] = useState(false);
  const [updating, setUpdating] = useState(false);

  const load = useCallback(() => {
    const token = getAdminToken(); if (!token) return;
    setLoading(true);
    api.get<AppDetail>(`/admin/applications/${id}`, authHeader(token))
      .then((d) => { setApp(d); setComment(d.comment ?? ''); })
      .catch(handleError)
      .finally(() => setLoading(false));
  }, [id, handleError]);

  useEffect(() => { load(); }, [load]);

  async function changeStatus(status: string) {
    const token = getAdminToken(); if (!token) return;
    setUpdating(true); setError('');
    try {
      const updated = await api.patch<AppDetail>(
        `/admin/applications/${id}/status`,
        { status, comment: comment || undefined },
        authHeader(token),
      );
      setApp((prev) => prev ? { ...prev, status: updated.status, comment: updated.comment } : prev);
    } catch (e: any) {
      handleError(e);
    } finally {
      setUpdating(false);
    }
  }

  async function saveComment() {
    const token = getAdminToken(); if (!token) return;
    setSaving(true); setSaveOk(false);
    try {
      await api.patch(`/admin/applications/${id}/comment`, { comment }, authHeader(token));
      setSaveOk(true);
      setTimeout(() => setSaveOk(false), 2500);
    } catch (e: any) {
      handleError(e);
    } finally {
      setSaving(false);
    }
  }

  const clientName = app
    ? app.type === 'business'
      ? (app.companyName || '—')
      : [app.firstName ?? app.user?.firstName, app.lastName ?? app.user?.lastName].filter(Boolean).join(' ') || '—'
    : '';

  const badge = app ? STATUS_BADGE[app.status] : null;
  const transitions = app ? ALLOWED_TRANSITIONS[app.status] ?? [] : [];

  return (
    <AdminShell>
      <div className="admin-page">
        <button onClick={() => router.back()} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.875rem', marginBottom: '1.25rem', padding: 0 }}>
          <ChevronLeft size={16} /> Назад к заявкам
        </button>

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[200, 100, 140, 180].map((w) => <Skeleton key={w} h={20} w={w} />)}
          </div>
        )}

        {!loading && error && (
          <div style={{ borderLeft: '4px solid var(--accent-crimson)', background: 'rgba(239, 71, 111, 0.16)', borderRadius: '8px', padding: '1rem', color: '#fecdd3' }}>{error}</div>
        )}

        {!loading && app && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>Заявка</p>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{clientName}</h1>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontFamily: 'var(--f-mono)', marginTop: '2px' }}>{app.id.slice(0, 16)}…</p>
              </div>
              {badge && (
                <span style={{ background: badge.bg, color: badge.color, fontWeight: 700, fontSize: '0.875rem', padding: '6px 14px', borderRadius: '8px' }}>
                  {badge.label}
                </span>
              )}
            </div>

            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--line-soft)', borderRadius: '10px', padding: '1rem' }}>
              <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Параметры заявки</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                {[
                  { label: 'Тип', value: app.type === 'personal' ? 'Физлицо' : 'Бизнес' },
                  { label: 'Сумма', value: formatCurrency(app.amount) },
                  { label: 'Срок', value: app.termDays ? `${app.termDays} дней` : app.termMonths ? `${app.termMonths} мес.` : '—' },
                  { label: 'Подано', value: formatDate(app.createdAt) },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>{label}</p>
                    <p style={{ fontFamily: 'var(--f-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--line-soft)', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Клиент</h2>
                {app.user?.id && (
                  <Link href={`/admin/clients/${app.user.id}`} style={{ fontSize: '0.8125rem', color: 'var(--accent-indigo)', textDecoration: 'none', fontWeight: 600 }}>
                    Открыть карточку →
                  </Link>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {[
                  { label: 'Имя', value: clientName },
                  { label: 'Телефон', value: app.phone ?? app.user?.phone ?? '—' },
                  { label: 'Email', value: app.email ?? app.user?.email ?? '—' },
                  ...(app.type === 'business' ? [
                    { label: 'Регистрационный номер', value: app.regNumber ?? '—' },
                    { label: 'Представитель', value: app.repName ?? '—' },
                    { label: 'Должность', value: app.repPosition ?? '—' },
                  ] : []),
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>{label}</p>
                    <p style={{ fontFamily: 'var(--f-mono)', color: 'var(--text-primary)' }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--line-soft)', borderRadius: '10px', padding: '1rem' }}>
              <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Комментарий оператора</h2>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Добавьте внутренний комментарий к заявке…"
                rows={4}
                style={{ width: '100%', border: '1px solid var(--line-strong)', borderRadius: '8px', padding: '10px 12px', fontSize: '0.9375rem', resize: 'vertical', outline: 'none', color: 'var(--text-primary)', boxSizing: 'border-box', fontFamily: 'inherit' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.625rem' }}>
                <button onClick={saveComment} disabled={saving} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: saving ? 'rgba(79, 70, 229, 0.55)' : 'var(--accent-indigo)', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.875rem' }}>
                  <Save size={14} /> {saving ? 'Сохраняю…' : 'Сохранить'}
                </button>
                {saveOk && <span style={{ fontSize: '0.8125rem', color: 'var(--accent-mint)', fontWeight: 600 }}>Сохранено</span>}
              </div>
            </div>

            {transitions.length > 0 ? (
              <div style={{ background: 'var(--surface-1)', border: '1px solid var(--line-soft)', borderRadius: '10px', padding: '1rem' }}>
                <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.875rem' }}>Изменить статус</h2>
                <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                  {transitions.map((t) => {
                    const c = TRANSITION_COLORS[t];
                    return (
                      <button key={t} onClick={() => changeStatus(t)} disabled={updating} style={{ background: updating ? 'var(--surface-2)' : c.bg, color: updating ? 'var(--text-secondary)' : c.color, border: c.border ?? 'none', borderRadius: '8px', padding: '9px 20px', fontWeight: 600, cursor: updating ? 'not-allowed' : 'pointer', fontSize: '0.9375rem' }}>
                        {TRANSITION_LABELS[t]}
                      </button>
                    );
                  })}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Текущий статус: <strong>{STATUS_BADGE[app.status]?.label}</strong></p>
              </div>
            ) : (
              <div style={{ background: 'var(--surface-2)', border: '1px solid var(--line-soft)', borderRadius: '10px', padding: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Статус заявки зафиксирован — дальнейшие изменения недоступны.
              </div>
            )}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
