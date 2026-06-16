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
    <aside style={{
      width: '240px',
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0D1B2A 0%, #12243A 100%)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.04)',
    }}>
      <div style={{ padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Link href="/cabinet" style={{ fontFamily: 'var(--f-display)', fontSize: '1.125rem', color: '#fff', textDecoration: 'none' }}>
          LumenBridge
        </Link>
        <p style={{ marginTop: '0.5rem', fontSize: '0.6875rem', color: '#2E7DF7', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
          Client Dashboard
        </p>
      </div>

      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(180deg, rgba(46,125,247,0.24) 0%, rgba(46,125,247,0.12) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.625rem', boxShadow: '0 8px 18px rgba(46,125,247,0.15)' }}>
          <span style={{ color: '#BFD7FF', fontSize: '0.9375rem', fontWeight: 700 }}>
            {phone ? phone[3] : '?'}
          </span>
        </div>
        <p style={{ color: '#fff', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '2px' }}>Клиент</p>
        <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: '0.75rem' }}>
          {phone ? `+${phone.slice(1, 4)} *** ${phone.slice(-4)}` : 'Загрузка...'}
        </p>
      </div>

      <nav style={{ flex: 1, padding: '0.75rem 0' }}>
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
                padding: '0.675rem 1.25rem',
                color: active ? '#fff' : 'rgba(255,255,255,0.58)',
                background: active ? 'linear-gradient(90deg, rgba(46,125,247,0.18) 0%, rgba(46,125,247,0.06) 100%)' : 'transparent',
                borderLeft: active ? '3px solid #2E7DF7' : '3px solid transparent',
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

      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: '0.625rem',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,0.48)', fontSize: '0.875rem', padding: '0.25rem 0',
        }}>
          <LogOut size={16} />
          <span>Выйти</span>
        </button>
      </div>
    </aside>
  );
}
