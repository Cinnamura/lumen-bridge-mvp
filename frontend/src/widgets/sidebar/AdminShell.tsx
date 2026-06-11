'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, LayoutDashboard } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#E8ECF0' }}>
      {/* Desktop sidebar */}
      <div className="admin-sidebar-wrap">
        <AdminSidebar />
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300 }}>
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(13,27,42,0.55)', backdropFilter: 'blur(2px)' }}
            onClick={() => setDrawerOpen(false)}
          />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '260px', zIndex: 1, boxShadow: '4px 0 24px rgba(13,27,42,0.25)' }}>
            <AdminSidebar onClose={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <main style={{ flex: 1, overflow: 'auto', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Mobile topbar */}
        <div className="admin-topbar">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Меню"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0D1B2A', padding: '0.25rem', display: 'flex', alignItems: 'center' }}
          >
            <Menu size={22} />
          </button>
          <Link href="/admin/applications" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <LayoutDashboard size={18} color="#2E7DF7" />
            <span style={{ fontFamily: 'var(--f-display)', fontSize: '1.0625rem', color: '#0D1B2A' }}>Admin Panel</span>
          </Link>
          <div style={{ width: '30px' }} />
        </div>

        {children}
      </main>
    </div>
  );
}
