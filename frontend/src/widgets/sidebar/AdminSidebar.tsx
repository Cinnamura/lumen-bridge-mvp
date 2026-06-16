'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FileText, Users, CreditCard, Wallet, Bell, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { useAdminAuth } from '@/shared/lib/admin-auth-context';

const NAV = [
  { href: '/admin/applications',  icon: FileText, label: 'Заявки' },
  { href: '/admin/clients',       icon: Users,    label: 'Клиенты' },
  { href: '/admin/loans',         icon: CreditCard, label: 'Займы' },
  { href: '/admin/payments',      icon: Wallet,   label: 'Платежи' },
  { href: '/admin/notifications', icon: Bell,     label: 'Уведомления' },
];

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, logout } = useAdminAuth();

  function handleLogout() {
    logout();
    router.push('/admin/login');
  }

  const navItems = profile?.role === 'admin'
    ? [...NAV, { href: '/admin/staff', icon: Shield, label: 'Сотрудники' }]
    : NAV;

  return (
    <aside style={{
      width: '256px', minHeight: '100vh', background: '#0D1B2A',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
    }}>
      <div style={{ padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Link href="/admin/applications" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <LayoutDashboard size={18} color="#2E7DF7" />
          <span style={{ fontFamily: 'var(--f-display)', fontSize: '1.0625rem', color: '#fff' }}>Admin Panel</span>
        </Link>
        {profile && (
          <p style={{ marginTop: '0.5rem', fontSize: '0.6875rem', color: '#2E7DF7', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            {profile.role === 'admin' ? 'Администратор' : 'Оператор'}
          </p>
        )}
      </div>

      <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {profile && (
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8125rem' }}>
            <span style={{ color: '#fff', fontWeight: 600 }}>{profile.login}</span>
          </p>
        )}
      </div>

      <nav style={{ flex: 1, padding: '0.75rem 0' }}>
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href} onClick={onClose} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.625rem 1.25rem',
              color: active ? '#fff' : 'rgba(255,255,255,0.6)',
              background: active ? 'rgba(46,125,247,0.12)' : 'transparent',
              borderLeft: active ? '3px solid #2E7DF7' : '3px solid transparent',
              textDecoration: 'none', fontSize: '0.9375rem',
              transition: 'all 150ms',
            }}>
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
          color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', padding: '0.25rem 0',
        }}>
          <LogOut size={16} />
          <span>Выйти</span>
        </button>
      </div>
    </aside>
  );
}
