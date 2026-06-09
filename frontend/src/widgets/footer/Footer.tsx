'use client';
import Link from 'next/link';

export function Footer() {
  return (
    <footer style={{ background: '#0D1B2A', color: '#fff', padding: '4rem 24px 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '2.5rem', marginBottom: '3rem' }}>
          {/* Brand */}
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginBottom: '1rem' }}>LumenBridge</div>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Финансовая организация, предоставляющая быстрые и доступные решения в сфере кредитования в Европе.
            </p>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span>18 Lower Baggot Street, Dublin 2, Ireland</span>
              <a href="mailto:support@lumenbridge.example" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>support@lumenbridge.example</a>
              <a href="tel:+35315318420" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>+353 1 531 8420</a>
            </div>
          </div>

          {/* Компания */}
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '1rem' }}>Компания</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[{ href: '/contacts', label: 'О компании' }, { href: '/how-it-works', label: 'Как это работает' }, { href: '/business', label: 'Для бизнеса' }].map(({ href, label }) => (
                <Link key={href} href={href} className="footer-link" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.875rem' }}>{label}</Link>
              ))}
            </div>
          </div>

          {/* Поддержка */}
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '1rem' }}>Поддержка</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[{ href: '/faq', label: 'Часто задаваемые вопросы' }, { href: '/contacts', label: 'Обратная связь' }, { href: '/contacts', label: 'Контакты' }].map(({ href, label }, i) => (
                <Link key={i} href={href} className="footer-link" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.875rem' }}>{label}</Link>
              ))}
            </div>
          </div>

          {/* Документы */}
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '1rem' }}>Документы</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { href: '/terms',         label: 'Условия использования' },
                { href: '/privacy',       label: 'Политика конфиденциальности' },
                { href: '/cookies',       label: 'Cookie Policy' },
                { href: '/credit-policy', label: 'Credit Policy' },
                { href: '/aml-kyc',       label: 'AML/KYC Policy' },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="footer-link" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.875rem' }}>{label}</Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>© 2024 LumenBridge Finance Ltd. Все права защищены.</p>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>LumenBridge Finance Ltd осуществляет деятельность в соответствии с применимым европейским законодательством.</p>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>Обработка персональных данных осуществляется в рамках требований GDPR.</p>
        </div>
      </div>

      <style>{`.footer-link:hover { color: #fff !important; }`}</style>
    </footer>
  );
}
