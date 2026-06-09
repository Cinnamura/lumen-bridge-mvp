export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--color-white)', minHeight: '100vh' }}>
      <div style={{ background: 'var(--color-midnight)', padding: 'var(--space-16) var(--space-6)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,var(--text-5xl))', color: 'var(--color-white)' }}>
            {title}
          </h1>
        </div>
      </div>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--space-16) var(--space-6)' }}>
        <div className="legal-content">
          {children}
        </div>
      </div>
    </div>
  );
}
