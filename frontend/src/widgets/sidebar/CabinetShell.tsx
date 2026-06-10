'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CabinetSidebar from './CabinetSidebar';
import { getToken } from '@/shared/lib/auth';
import { api, authHeader } from '@/shared/lib/api';

interface UserDto { id: string; phone: string; firstName?: string; lastName?: string }

export default function CabinetShell({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) { router.replace('/login'); return; }
    // /auth/me не в ТЗ, но нам нужен phone — берём из JWT payload (decode без verify)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Загружаем заявки, чтобы получить телефон через applications
      api.get<UserDto[]>('/cabinet/applications', authHeader(token))
        .catch(() => null)
        .then(() => {
          // Phone хранится в localStorage после логина
          const phone = localStorage.getItem('lb_phone') ?? '';
          setUser({ id: payload.sub, phone });
        });
    } catch {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#E8ECF0' }}>
      <CabinetSidebar phone={user?.phone} />
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
