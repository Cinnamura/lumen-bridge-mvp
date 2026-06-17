import dynamic from 'next/dynamic';
import { Header } from '@/widgets/header/Header';
import { Footer } from '@/widgets/footer/Footer';

const StitchAuroraShader = dynamic(() => import('@/shared/ui/animations/StitchAuroraShader'), { ssr: false });

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.1, filter: 'blur(120px)' }}>
        <StitchAuroraShader />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Header />
        {/* 16px (top offset) + 60px (header height) + 16px (breathing room) = 92px */}
        <main style={{ paddingTop: '92px', background: 'transparent' }}>{children}</main>
        <Footer />
      </div>
    </>
  );
}
