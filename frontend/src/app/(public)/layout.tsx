import { Header } from '@/widgets/header/Header';
import { Footer } from '@/widgets/footer/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '0' }}>{children}</main>
      <Footer />
    </>
  );
}
