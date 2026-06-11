'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FileText, CreditCard, Bell, LogOut } from 'lucide-react';
import { clearToken } from '@/shared/lib/auth';

const NAV = [
  { href: '/cabinet/applications', icon: FileText, label: 'Заявки' },
  { href: '/cabinet/loans',        icon: CreditCard, label: 'Мои займы' },
  { href: '/cabinet/notifications', icon: Bell,      label: 'Уведомления' },
];

export default function CabinetSidebar({ phone, onClose }: { phone?: string; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    clearToken();
    document.cookie = 'lb_session=; path=/; max-age=0';
    router.push('/login');
  }

  return (
    <aside style={{
      width: '240px',
      minHeight: '100vh',
      background: '#0D1B2A',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Link href="/" style={{ fontFamily: 'var(--f-display)', fontSize: '1.125rem', color: '#fff', textDecoration: 'none', letterSpacing: '-0.01em' }}>
          LumenBridge
        </Link>
      </div>

      {/* User */}
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(46,125,247,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
          <span style={{ color: '#2E7DF7', fontSize: '0.875rem', fontWeight: 600 }}>
            {phone ? phone[3] : '?'}
          </span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
          {phone ? `+${phone.slice(1, 4)} *** ${phone.slice(-4)}` : 'Загрузка...'}
        </p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.75rem 0' }}>
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href} onClick={onClose} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.625rem 1.25rem',
              color: active ? '#fff' : 'rgba(255,255,255,0.55)',
              background: active ? 'rgba(46,125,247,0.12)' : 'transparent',
              borderLeft: active ? '3px solid #2E7DF7' : '3px solid transparent',
              textDecoration: 'none', fontSize: '0.9375rem', transition: 'all 150ms',
            }}>
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: '0.625rem',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', padding: '0.25rem 0',
        }}>
          <LogOut size={16} />
          <span>Выйти</span>
        </button>
      </div>
    </aside>
  );
}
