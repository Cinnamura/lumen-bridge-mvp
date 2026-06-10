'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const NAV = [
  { href: '/how-it-works', label: 'Как это работает' },
  { href: '/business',     label: 'Для бизнеса' },
  { href: '/faq',          label: 'FAQ' },
  { href: '/contacts',     label: 'Контакты' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Floating capsule nav */}
      <div style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        width: 'min(calc(100vw - 32px), 1100px)',
      }}>
        <header style={{
          height: '56px',
          background: scrolled
            ? 'rgba(13,27,42,0.88)'
            : 'rgba(13,27,42,0.65)',
          backdropFilter: 'blur(24px) saturate(200%)',
          WebkitBackdropFilter: 'blur(24px) saturate(200%)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: '9999px',
          boxShadow: scrolled
            ? '0 4px 24px rgba(13,27,42,0.35), 0 1px 0 rgba(255,255,255,0.06) inset'
            : '0 2px 12px rgba(13,27,42,0.20)',
          transition: 'background 280ms cubic-bezier(0.16,1,0.3,1), box-shadow 280ms',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <Link href="/" style={{
            fontFamily: 'var(--f-display)',
            fontSize: '1.1875rem',
            color: '#fff',
            letterSpacing: '-0.01em',
            lineHeight: 1,
            flexShrink: 0,
          }}>
            LumenBridge
          </Link>

          {/* Desktop nav */}
          <nav className="hdr-desktop" style={{ display: 'flex', gap: '1.625rem', alignItems: 'center' }}>
            {NAV.map(({ href, label }) => (
              <Link key={href} href={href} className="hdr-nav-link" style={{
                color: 'rgba(255,255,255,0.62)',
                fontSize: '0.875rem',
                fontWeight: 500,
                letterSpacing: '0.01em',
                whiteSpace: 'nowrap',
              }}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Link href="/login" className="btn btn-outline-light btn-sm hdr-desktop" style={{ padding: '7px 16px', fontSize: '0.8125rem', borderRadius: '9999px' }}>
              Войти
            </Link>
            <Link href="/apply" className="btn btn-primary btn-sm" style={{ padding: '7px 16px', fontSize: '0.8125rem', borderRadius: '9999px' }}>
              Получить займ
            </Link>
            <button
              className="hdr-burger"
              onClick={() => setOpen(o => !o)}
              style={{ display: 'none', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '6px', lineHeight: 0 }}
              aria-label="Меню"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>
      </div>

      {/* Mobile full-screen drawer */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(13,27,42,0.97)',
        backdropFilter: 'blur(24px)',
        zIndex: 99,
        display: 'flex', flexDirection: 'column',
        padding: '88px 32px 40px',
        transform: open ? 'translateY(0)' : 'translateY(-100%)',
        opacity: open ? 1 : 0,
        transition: 'transform 350ms cubic-bezier(0.16,1,0.3,1), opacity 280ms ease',
        pointerEvents: open ? 'all' : 'none',
      }}>
        {NAV.map(({ href, label }) => (
          <Link key={href} href={href} onClick={() => setOpen(false)} style={{
            color: 'rgba(255,255,255,0.85)', fontSize: '1.5rem', fontWeight: 500,
            padding: '0.875rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            {label}
          </Link>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2rem' }}>
          <Link href="/login"  className="btn btn-outline-light btn-lg" onClick={() => setOpen(false)} style={{ justifyContent: 'center' }}>Войти</Link>
          <Link href="/apply"  className="btn btn-primary btn-lg"       onClick={() => setOpen(false)} style={{ justifyContent: 'center' }}>Получить займ</Link>
        </div>
      </div>

      <style>{`
        .hdr-nav-link:hover { color: #fff !important; }
        @media (max-width: 767px) {
          .hdr-desktop { display: none !important; }
          .hdr-burger  { display: flex !important; }
        }
      `}</style>
    </>
  );
}
