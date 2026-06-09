'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const NAV = [
  { href: '/how-it-works', label: 'Как это работает' },
  { href: '/business',     label: 'Для бизнеса' },
  { href: '/faq',          label: 'FAQ' },
  { href: '/contacts',     label: 'Контакты' },
];

export function Header() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: '64px',
      background: scrolled ? 'rgba(13,27,42,0.95)' : '#0D1B2A',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
      transition: 'background 200ms, backdrop-filter 200ms',
    }}>
      {/* Main bar */}
      <div style={{
        maxWidth: '1200px', margin: '0 auto', padding: '0 24px',
        height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#fff', textDecoration: 'none' }}>
          LumenBridge
        </Link>

        {/* Desktop nav */}
        <nav className="hdr-desktop" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {NAV.map(({ href, label }) => (
            <Link key={href} href={href} className="hdr-link" style={{ color: 'rgba(255,255,255,0.72)', textDecoration: 'none', fontSize: '0.9375rem', fontWeight: 500 }}>
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA + hamburger */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link href="/login" className="btn-ghost btn-sm hdr-desktop" style={{ textDecoration: 'none' }}>Войти</Link>
          <Link href="/apply" className="btn-primary btn-sm" style={{ textDecoration: 'none' }}>Получить займ</Link>

          <button
            className="hdr-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            style={{ display: 'none', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '6px' }}
            aria-label="Меню"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          style={{ position: 'fixed', top: '64px', left: 0, right: 0, bottom: 0, background: '#0D1B2A', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', zIndex: 99 }}
          onClick={() => setMenuOpen(false)}
        >
          {NAV.map(({ href, label }) => (
            <Link key={href} href={href} style={{ color: '#fff', textDecoration: 'none', fontSize: '1.125rem', fontWeight: 500 }}>
              {label}
            </Link>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Link href="/login" className="btn-ghost" style={{ textDecoration: 'none', textAlign: 'center' }}>Войти</Link>
            <Link href="/apply" className="btn-primary" style={{ textDecoration: 'none', textAlign: 'center' }}>Получить займ</Link>
          </div>
        </div>
      )}

      <style>{`
        .hdr-link:hover { color: #fff !important; }
        @media (max-width: 768px) {
          .hdr-desktop   { display: none !important; }
          .hdr-hamburger { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
