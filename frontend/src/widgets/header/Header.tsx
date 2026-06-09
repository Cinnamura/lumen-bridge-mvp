'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: '64px',
        background: scrolled
          ? 'rgba(13,27,42,0.92)'
          : 'var(--color-midnight)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
        transition: 'background 200ms ease, backdrop-filter 200ms ease',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-xl)',
          margin: '0 auto',
          padding: '0 var(--space-6)',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-xl)',
            color: 'var(--color-white)',
            textDecoration: 'none',
            fontWeight: 400,
            letterSpacing: '-0.01em',
          }}
        >
          LumenBridge
        </Link>

        {/* Desktop nav */}
        <nav
          style={{
            display: 'flex',
            gap: 'var(--space-8)',
            alignItems: 'center',
          }}
          className="desktop-nav"
        >
          {[
            { href: '/how-it-works', label: 'Как это работает' },
            { href: '/business', label: 'Для бизнеса' },
            { href: '/faq', label: 'FAQ' },
            { href: '/contacts', label: 'Контакты' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                color: 'rgba(255,255,255,0.75)',
                textDecoration: 'none',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                transition: 'color 150ms ease',
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = '#fff')
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color =
                  'rgba(255,255,255,0.75)')
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <Link href="/login" className="btn-ghost btn-sm" style={{ textDecoration: 'none' }}>
            Войти
          </Link>
          <Link href="/apply" className="btn-primary btn-sm" style={{ textDecoration: 'none' }}>
            Получить займ
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'var(--color-white)',
              cursor: 'pointer',
              padding: 'var(--space-2)',
            }}
            className="hamburger"
            aria-label="Меню"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'var(--color-midnight)',
            display: 'flex',
            flexDirection: 'column',
            padding: 'var(--space-8)',
            gap: 'var(--space-6)',
          }}
          onClick={() => setMenuOpen(false)}
        >
          {[
            { href: '/how-it-works', label: 'Как это работает' },
            { href: '/business', label: 'Для бизнеса' },
            { href: '/faq', label: 'FAQ' },
            { href: '/contacts', label: 'Контакты' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                color: 'var(--color-white)',
                textDecoration: 'none',
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-medium)',
              }}
            >
              {item.label}
            </Link>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <Link href="/login" className="btn-ghost" style={{ textDecoration: 'none', textAlign: 'center' }}>
              Войти
            </Link>
            <Link href="/apply" className="btn-primary" style={{ textDecoration: 'none', textAlign: 'center' }}>
              Получить займ
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
