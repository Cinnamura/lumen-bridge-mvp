import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Личный кабинет — LumenBridge' };

export default function CabinetRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
