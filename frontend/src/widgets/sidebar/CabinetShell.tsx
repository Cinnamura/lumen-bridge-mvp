'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
import CabinetSidebar from './CabinetSidebar';
import { getToken } from '@/shared/lib/auth';
import Link from 'next/link';

export default function CabinetShell({ children }: { children: React.ReactNode }) {
  const [phone, setPhone] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace('/login');
      return;
    }
    // Phone was saved to localStorage at login time — no API call needed
    setPhone(localStorage.getItem('lb_phone') ?? '');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#E8ECF0' }}>

      {/* ── Desktop sidebar ── */}
      <div className="cabinet-sidebar-wrap">
        <CabinetSidebar phone={phone} />
      </div>

      {/* ── Mobile drawer ── */}
      {drawerOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300 }}>
          {/* Backdrop */}
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(13,27,42,0.55)', backdropFilter: 'blur(2px)' }}
            onClick={() => setDrawerOpen(false)}
          />
          {/* Sidebar panel */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '260px', zIndex: 1, boxShadow: '4px 0 24px rgba(13,27,42,0.25)' }}>
            <CabinetSidebar phone={phone} onClose={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <main style={{ flex: 1, overflow: 'auto', minWidth: 0, display: 'flex', flexDirection: 'column' }}>

        {/* Mobile top bar */}
        <div className="cabinet-topbar">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Меню"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0D1B2A', padding: '0.25rem', display: 'flex', alignItems: 'center' }}
          >
            <Menu size={22} />
          </button>
          <Link href="/" style={{ fontFamily: 'var(--f-display)', fontSize: '1.0625rem', color: '#0D1B2A', textDecoration: 'none' }}>
            LumenBridge
          </Link>
          {/* right spacer to center logo */}
          <div style={{ width: '30px' }} />
        </div>

        {children}
      </main>
    </div>
  );
}
