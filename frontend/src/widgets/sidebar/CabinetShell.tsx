'use client';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import CabinetSidebar from './CabinetSidebar';
import { useAuth } from '@/shared/lib/auth-context';

export default function CabinetShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'radial-gradient(circle at top right, rgba(59,130,246,0.06), transparent 26%), linear-gradient(180deg, #081425 0%, #0b0f19 48%, #121214 100%)' }}>
      <div className="cabinet-sidebar-wrap">
        <CabinetSidebar phone={user?.phone} />
      </div>

      {drawerOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(11,15,25,0.68)', backdropFilter: 'blur(6px)' }} onClick={() => setDrawerOpen(false)} />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '260px', zIndex: 1, boxShadow: '8px 0 40px rgba(0,0,0,0.35)' }}>
            <CabinetSidebar phone={user?.phone} onClose={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <main style={{ flex: 1, overflow: 'auto', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div className="cabinet-topbar">
          <button onClick={() => setDrawerOpen(true)} aria-label="Меню" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#F8FAFC', padding: '0.25rem', display: 'flex', alignItems: 'center' }}>
            <Menu size={22} />
          </button>
          <Link href="/" style={{ fontFamily: 'var(--f-display)', fontSize: '1.0625rem', color: '#F8FAFC', textDecoration: 'none' }}>
            LumenBridge
          </Link>
          <div style={{ width: '30px' }} />
        </div>
        {children}
      </main>
    </div>
  );
}
