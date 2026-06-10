'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight } from 'lucide-react';

/* ─── Animated FAQ Accordion ─── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="accordion-item">
      <button className="accordion-trigger" onClick={() => setOpen(o => !o)}>
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

/* ─── Reveal observer for a section ─── */
function RevealSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    targets.forEach(t => obs.observe(t));
    return () => obs.disconnect();
  }, []);
  return <div ref={ref}>{children}</div>;
}

/* ─── Exported per-section client islands ─── */
export function HomeClient({ section }: { section: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current?.closest('section');
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>('.reveal');
    if (!targets.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.08 });
    targets.forEach(t => obs.observe(t));
    return () => obs.disconnect();
  }, []);

  if (section === 'faq') {
    return (
      <section style={{ background: '#F2F5F8', padding: '72px 32px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2E7DF7', marginBottom: '0.625rem' }}>FAQ</p>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', color: '#0D1B2A', letterSpacing: '-0.02em' }}>
              Часто задаваемые вопросы
            </h2>
          </div>
          <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid rgba(13,27,42,0.06)', padding: '0 1.5rem', boxShadow: '0 1px 3px rgba(13,27,42,0.04),0 8px 24px rgba(13,27,42,0.05)' }}>
            <FaqItem q="Кто может получить займ?" a="Любой совершеннолетний резидент страны присутствия сервиса с действующим удостоверением личности и зарегистрированным номером телефона." />
            <FaqItem q="Как быстро я получу деньги?" a="Заявки рассматриваются в течение нескольких минут. После одобрения деньги переводятся сразу." />
            <FaqItem q="Есть ли скрытые комиссии?" a="Нет. Все условия и платежи отображаются до оформления займа." />
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/faq" className="btn btn-secondary" style={{ gap: '8px' }}>
              Смотреть все вопросы <ArrowRight size={15} />
            </Link>
          </div>
          <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8125rem', color: '#4A6580' }}>
            Если вы не нашли нужную информацию, вы можете связаться с нами через форму обратной связи.
          </p>
        </div>
      </section>
    );
  }

  /* Observer mount point for other sections */
  return <div ref={ref} style={{ display: 'none' }} aria-hidden />;
}
