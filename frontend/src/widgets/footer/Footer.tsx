'use client';
import Link from 'next/link';
import { MapPin, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer style={{ background: '#0D1B2A', color: '#fff', padding: '5rem 32px 2.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3.5rem' }}>

          {/* Brand */}
          <div>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: '1.3125rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>LumenBridge</div>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, marginBottom: '1.75rem', maxWidth: '28ch' }}>
              Финансовая организация, предоставляющая быстрые и доступные решения в сфере кредитования в Европе.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[
                { icon: <MapPin size={13} />, val: '18 Lower Baggot St, Dublin 2' },
                { icon: <Mail size={13} />,   val: 'support@lumenbridge.example' },
                { icon: <Phone size={13} />,  val: '+353 1 531 8420' },
              ].map(({ icon, val }) => (
                <div key={val} style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.8125rem' }}>
                  <span style={{ opacity: 0.6, flexShrink: 0 }}>{icon}</span>
                  {val}
                </div>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Компания</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[{ href: '/contacts', label: 'О компании' }, { href: '/how-it-works', label: 'Как это работает' }, { href: '/business', label: 'Для бизнеса' }].map(({ href, label }) => (
                <Link key={href} href={href} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', transition: 'color 200ms ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Поддержка</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[{ href: '/faq', label: 'Часто задаваемые вопросы' }, { href: '/contacts', label: 'Обратная связь' }, { href: '/contacts', label: 'Контакты' }].map(({ href, label }, i) => (
                <Link key={i} href={href} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', transition: 'color 200ms ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Документы</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[
                { href: '/terms',         label: 'Условия использования' },
                { href: '/privacy',       label: 'Политика конфиденциальности' },
                { href: '/cookies',       label: 'Cookie Policy' },
                { href: '/credit-policy', label: 'Credit Policy' },
                { href: '/aml-kyc',       label: 'AML/KYC Policy' },
              ].map(({ href, label }) => (
                <Link key={href} href={href} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', transition: 'color 200ms ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>© 2024 LumenBridge Finance Ltd. Все права защищены.</p>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)' }}>LumenBridge Finance Ltd осуществляет деятельность в соответствии с применимым европейским законодательством. Обработка персональных данных — в рамках GDPR.</p>
        </div>
      </div>
    </footer>
  );
}
