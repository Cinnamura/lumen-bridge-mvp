'use client';
import Link from 'next/link';

export function Footer() {
  return (
    <footer style={{ background: 'var(--color-midnight)', color: 'var(--color-white)', padding: 'var(--space-16) 0 var(--space-8)' }}>
      <div style={{ maxWidth: 'var(--container-xl)', margin: '0 auto', padding: '0 var(--space-6)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--space-10)' }} className="footer-grid">
          {/* Col 1 */}
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>
              LumenBridge
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.6)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-4)' }}>
              Краткосрочные займы для физических лиц и малого бизнеса в Европе.
            </p>
            <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <span>info@lumenbridge.eu</span>
              <span>+353 1 234 5678</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-4)', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Компания
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[
                { href: '/how-it-works', label: 'Как это работает' },
                { href: '/business', label: 'Для бизнеса' },
                { href: '/contacts', label: 'О компании' },
              ].map(({ href, label }) => (
                <Link key={href} href={href} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 150ms' }}
                  onMouseEnter={e => (e.target as HTMLElement).style.color = '#fff'}
                  onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.6)'}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3 */}
          <div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-4)', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Поддержка
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[
                { href: '/faq', label: 'FAQ' },
                { href: '/contacts', label: 'Обратная связь' },
                { href: '/contacts', label: 'Контакты' },
              ].map(({ href, label }, i) => (
                <Link key={i} href={href} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 150ms' }}
                  onMouseEnter={e => (e.target as HTMLElement).style.color = '#fff'}
                  onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.6)'}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 4 */}
          <div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-4)', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Документы
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[
                { href: '/privacy', label: 'Политика конфиденциальности' },
                { href: '/cookies', label: 'Cookie Policy' },
                { href: '/terms', label: 'Условия использования' },
                { href: '/credit-policy', label: 'Кредитная политика' },
                { href: '/aml-kyc', label: 'AML/KYC Policy' },
              ].map(({ href, label }) => (
                <Link key={href} href={href} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 150ms' }}
                  onMouseEnter={e => (e.target as HTMLElement).style.color = '#fff'}
                  onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.6)'}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 'var(--space-12)', paddingTop: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            © 2024 LumenBridge Finance Ltd. Все права защищены.
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            LumenBridge Finance Ltd осуществляет деятельность в соответствии с применимым европейским законодательством. Обработка персональных данных в рамках GDPR.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
