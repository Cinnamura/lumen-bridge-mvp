'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, CreditCard, FileText, Home, LogOut } from 'lucide-react';
import { useAuth } from '@/shared/lib/auth-context';

const NAV = [
  { href: '/cabinet', icon: Home, label: 'Главная' },
  { href: '/cabinet/applications', icon: FileText, label: 'Заявки' },
  { href: '/cabinet/loans', icon: CreditCard, label: 'Мои займы' },
  { href: '/cabinet/notifications', icon: Bell, label: 'Уведомления' },
];

export default function CabinetSidebar({ phone, onClose }: { phone?: string; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    router.push('/login');
  }

  return (
    <aside style={{ width: '248px', minHeight: '100vh', background: 'linear-gradient(180deg, rgba(8,20,37,0.96) 0%, rgba(11,15,25,0.98) 52%, rgba(18,18,20,0.98) 100%)', display: 'flex', flexDirection: 'column', flexShrink: 0, boxShadow: 'inset -1px 0 0 rgba(140,144,159,0.14)' }}>
      <div style={{ padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid rgba(140,144,159,0.16)' }}>
        <Link href="/cabinet" style={{ fontFamily: 'var(--f-display)', fontSize: '1.125rem', color: '#F8FAFC', textDecoration: 'none' }}>LumenBridge</Link>
        <p style={{ marginTop: '0.5rem', fontSize: '0.6875rem', color: '#93C5FD', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
          Client Dashboard
        </p>
      </div>

      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(140,144,159,0.16)' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'linear-gradient(180deg, rgba(59,130,246,0.26) 0%, rgba(139,92,246,0.18) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.65rem', boxShadow: '0 14px 30px rgba(59,130,246,0.14)' }}>
          <span style={{ color: '#DBEAFE', fontSize: '0.95rem', fontWeight: 700 }}>{phone ? phone[3] : '?'}</span>
        </div>
        <p style={{ color: '#F8FAFC', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '2px' }}>Клиент</p>
        <p style={{ color: 'rgba(154,164,182,0.86)', fontSize: '0.75rem' }}>{phone ? `+${phone.slice(1, 4)} *** ${phone.slice(-4)}` : 'Загрузка...'}</p>
      </div>

      <nav style={{ flex: 1, padding: '0.8rem 0' }}>
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = href === '/cabinet' ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.72rem 1.25rem',
                color: active ? '#F8FAFC' : 'rgba(154,164,182,0.86)',
                background: active ? 'linear-gradient(90deg, rgba(59,130,246,0.18) 0%, rgba(139,92,246,0.14) 100%)' : 'transparent',
                borderLeft: active ? '3px solid #60A5FA' : '3px solid transparent',
                textDecoration: 'none',
                fontSize: '0.9375rem',
                transition: 'all 150ms',
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(140,144,159,0.16)' }}>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(154,164,182,0.86)', fontSize: '0.875rem', padding: '0.25rem 0' }}>
          <LogOut size={16} />
          <span>Выйти</span>
        </button>
      </div>
    </aside>
  );
}
