'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/shared/lib/auth-context';

const NAV = [
  { href: '/how-it-works', label: 'Как это работает' },
  { href: '/business', label: 'Для бизнеса' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contacts', label: 'Контакты' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <div style={{ position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 120, width: 'min(calc(100vw - 32px), 1180px)' }}>
        <header
          style={{
            height: '60px',
            background: scrolled ? 'rgba(11,15,25,0.88)' : 'rgba(11,15,25,0.72)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(140,144,159,0.18)',
            borderRadius: '999px',
            boxShadow: scrolled ? '0 18px 40px rgba(0,0,0,0.28)' : '0 10px 26px rgba(0,0,0,0.18)',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 220ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <Link href="/" style={{ fontFamily: 'var(--f-display)', fontSize: '1.2rem', color: '#F8FAFC', letterSpacing: '-0.02em', flexShrink: 0 }}>
            LumenBridge
          </Link>

          <nav className="hdr-desktop" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {NAV.map(({ href, label }) => (
              <Link key={href} href={href} style={{ color: 'rgba(216,227,251,0.72)', fontSize: '0.9rem', fontWeight: 500, transition: 'color 180ms ease' }}>
                {label}
              </Link>
            ))}
          </nav>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {user ? (
              <Link href="/cabinet" className="btn btn-outline-light btn-sm hdr-desktop" style={{ padding: '7px 16px', borderRadius: '999px', gap: '6px' }}>
                <LayoutDashboard size={14} />
                Личный кабинет
              </Link>
            ) : (
              <Link href="/login" className="btn btn-outline-light btn-sm hdr-desktop" style={{ padding: '7px 16px', borderRadius: '999px' }}>
                Войти
              </Link>
            )}
            <Link href="/apply" className="btn btn-primary btn-sm" style={{ padding: '7px 16px', borderRadius: '999px' }}>
              Получить займ
            </Link>
            <button className="hdr-burger" onClick={() => setOpen((v) => !v)} style={{ display: 'none', background: 'none', border: 'none', color: '#F8FAFC', cursor: 'pointer', padding: '6px', lineHeight: 0 }} aria-label="Меню">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>
      </div>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(11,15,25,0.96)',
          backdropFilter: 'blur(28px)',
          zIndex: 110,
          display: 'flex',
          flexDirection: 'column',
          padding: '92px 32px 40px',
          transform: open ? 'translateY(0)' : 'translateY(-100%)',
          opacity: open ? 1 : 0,
          transition: 'transform 320ms cubic-bezier(0.16,1,0.3,1), opacity 220ms ease',
          pointerEvents: open ? 'all' : 'none',
        }}
      >
        {NAV.map(({ href, label }) => (
          <Link key={href} href={href} onClick={() => setOpen(false)} style={{ color: '#F8FAFC', fontSize: '1.4rem', fontWeight: 600, padding: '0.9rem 0', borderBottom: '1px solid rgba(140,144,159,0.16)' }}>
            {label}
          </Link>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2rem' }}>
          {user ? (
            <Link href="/cabinet" className="btn btn-outline-light btn-lg" onClick={() => setOpen(false)} style={{ justifyContent: 'center' }}>
              Личный кабинет
            </Link>
          ) : (
            <Link href="/login" className="btn btn-outline-light btn-lg" onClick={() => setOpen(false)} style={{ justifyContent: 'center' }}>
              Войти
            </Link>
          )}
          <Link href="/apply" className="btn btn-primary btn-lg" onClick={() => setOpen(false)} style={{ justifyContent: 'center' }}>
            Получить займ
          </Link>
        </div>
      </div>
    </>
  );
}
