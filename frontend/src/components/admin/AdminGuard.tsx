'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { accessToken, isLoading, getToken } = useAuth();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function check() {
      if (isLoading) return;

      const token = accessToken || (await getToken());
      if (!token) {
        router.replace('/admin/login');
        return;
      }

      setReady(true);
    }

    check();
  }, [accessToken, isLoading, getToken, router]);

  if (isLoading || !ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
