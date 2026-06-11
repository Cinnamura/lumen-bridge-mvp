import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Админ-панель — LumenBridge' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
