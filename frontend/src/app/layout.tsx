import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/shared/lib/auth-context';

export const metadata: Metadata = {
  title: 'LumenBridge Finance — Быстрые займы в Европе',
  description: 'Краткосрочные займы для физических лиц и малого бизнеса. Быстрое одобрение, прозрачные условия.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
