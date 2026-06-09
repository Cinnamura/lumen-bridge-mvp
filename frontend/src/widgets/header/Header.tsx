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
    const fn = () => setScrolled(window.scrollY > 40);
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
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: '64px',
        /* Always dark glass — readable on ANY page background */
        background: scrolled
          ? 'rgba(13,27,42,0.92)'
          : 'rgba(13,27,42,0.72)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: scrolled
          ? '1px solid rgba(255,255,255,0.08)'
          : '1px solid rgba(255,255,255,0.04)',
        transition: 'background 300ms cubic-bezier(0.16,1,0.3,1), border-color 300ms',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto', padding: '0 32px',
          height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Link href="/" style={{
            fontFamily: 'var(--f-display)', fontSize: '1.3125rem',
            color: '#fff', letterSpacing: '-0.01em', lineHeight: 1,
          }}>
            LumenBridge
          </Link>

          <nav className="hdr-desktop" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            {NAV.map(({ href, label }) => (
              <Link key={href} href={href} className="hdr-nav-link" style={{
                color: 'rgba(255,255,255,0.65)',
                fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.01em',
              }}>
                {label}
              </Link>
            ))}
          </nav>

          <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
            <Link href="/login" className="btn btn-outline-light btn-sm hdr-desktop">
              Войти
            </Link>
            <Link href="/apply" className="btn btn-primary btn-sm">
              Получить займ
            </Link>
            <button
              className="hdr-burger"
              onClick={() => setOpen(o => !o)}
              style={{ display: 'none', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '6px', lineHeight: 0 }}
              aria-label="Меню"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
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
        .hdr-nav-link:hover { color: #fff !important; transition: color 180ms ease; }
        @media (max-width: 767px) {
          .hdr-desktop { display: none !important; }
          .hdr-burger  { display: flex  !important; }
        }
      `}</style>
    </>
  );
}
