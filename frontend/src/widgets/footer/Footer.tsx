'use client';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(140,144,159,0.16)', padding: '5rem 32px 2.5rem', background: 'rgba(8,20,37,0.54)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '2.5rem', marginBottom: '3rem' }}>
          <div>
            <Image src="/logo.png" alt="LumenBridge" width={293} height={125} style={{ marginBottom: '1rem' }} />
            <p style={{ fontSize: '0.9rem', color: 'rgba(154,164,182,0.86)', lineHeight: 1.75, marginBottom: '1.5rem', maxWidth: '30ch' }}>
              Финансовая организация, предоставляющая быстрые и доступные решения в сфере кредитования в Европе.
            </p>
            <div style={{ display: 'grid', gap: '0.65rem' }}>
              {[
                { icon: <MapPin size={13} />, val: '18 Lower Baggot St, Dublin 2' },
                { icon: <Mail size={13} />, val: 'support@lumenbridge.example' },
                { icon: <Phone size={13} />, val: '+353 1 531 8420' },
              ].map(({ icon, val }) => (
                <div key={val} style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'rgba(154,164,182,0.82)', fontSize: '0.84rem' }}>
                  <span style={{ color: '#93C5FD', flexShrink: 0 }}>{icon}</span>
                  {val}
                </div>
              ))}
            </div>
          </div>

          {[
            {
              title: 'Компания',
              links: [
                { href: '/contacts', label: 'О компании' },
                { href: '/how-it-works', label: 'Как это работает' },
                { href: '/business', label: 'Для бизнеса' },
              ],
            },
            {
              title: 'Поддержка',
              links: [
                { href: '/faq', label: 'Часто задаваемые вопросы' },
                { href: '/contacts', label: 'Обратная связь' },
                { href: '/contacts', label: 'Контакты' },
              ],
            },
            {
              title: 'Документы',
              links: [
                { href: '/terms', label: 'Условия использования' },
                { href: '/privacy', label: 'Политика конфиденциальности' },
                { href: '/cookies', label: 'Cookie Policy' },
                { href: '/credit-policy', label: 'Credit Policy' },
                { href: '/aml-kyc', label: 'AML/KYC Policy' },
              ],
            },
          ].map((group) => (
            <div key={group.title}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(154,164,182,0.74)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>{group.title}</p>
              <div style={{ display: 'grid', gap: '0.6rem' }}>
                {group.links.map(({ href, label }) => (
                  <Link key={href + label} href={href} style={{ color: 'rgba(216,227,251,0.72)', fontSize: '0.9rem', transition: 'color 180ms ease' }}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(140,144,159,0.14)', paddingTop: '1.5rem', display: 'grid', gap: '0.3rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'rgba(154,164,182,0.7)' }}>© 2024 LumenBridge Finance Ltd. Все права защищены.</p>
          <p style={{ fontSize: '0.75rem', color: 'rgba(154,164,182,0.62)' }}>LumenBridge Finance Ltd осуществляет деятельность в соответствии с применимым европейским законодательством. Обработка персональных данных — в рамках GDPR.</p>
        </div>
      </div>
    </footer>
  );
}
