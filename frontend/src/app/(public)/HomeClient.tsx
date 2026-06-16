'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight } from 'lucide-react';

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="accordion-item">
      <button className="accordion-trigger" onClick={() => setOpen((o) => !o)}>
        <span>{q}</span>
        <span className={`accordion-icon${open ? ' open' : ''}`}>
          <ChevronDown size={18} />
        </span>
      </button>
      <div className={`accordion-body${open ? ' open' : ''}`}>
        <div className="accordion-body-inner">
          <p>{a}</p>
        </div>
      </div>
    </div>
  );
}

export function HomeClient({ section }: { section: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current?.closest('section');
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>('.reveal');
    if (!targets.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    targets.forEach((target) => obs.observe(target));
    return () => obs.disconnect();
  }, []);

  if (section === 'faq') {
    return (
      <section style={{ padding: '40px 24px 20px', position: 'relative' }}>
        {/* Hidden ref-div lets the shared observer find .reveal elements in this section */}
        <div ref={ref} aria-hidden style={{ display: 'none' }} />
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div className="reveal reveal-1" style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#93C5FD', marginBottom: '0.65rem' }}>FAQ</p>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.9rem,3vw,2.75rem)', color: '#F8FAFC', letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
              Часто задаваемые вопросы
            </h2>
          </div>

          <div className="card aurora-blue reveal reveal-2" style={{ padding: '0 1.5rem' }}>
            <FaqItem q="Кто может получить займ?" a="Любой совершеннолетний резидент страны присутствия сервиса с действующим удостоверением личности и зарегистрированным номером телефона." />
            <FaqItem q="Как быстро я получу деньги?" a="Заявки рассматриваются в течение нескольких минут. После одобрения деньги переводятся сразу." />
            <FaqItem q="Есть ли скрытые комиссии?" a="Нет. Все условия и платежи отображаются до оформления займа." />
          </div>

          <div className="reveal reveal-3" style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link href="/faq" className="btn btn-secondary" style={{ gap: '8px' }}>
              Смотреть все вопросы <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return <div ref={ref} style={{ display: 'none' }} aria-hidden />;
}
