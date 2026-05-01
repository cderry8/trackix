'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from './AuthProvider';

export function RequireAuth({
  children,
  admin,
}: {
  children: React.ReactNode;
  admin?: boolean;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace('/login');
    else if (admin && user.role !== 'admin') router.replace('/dashboard');
  }, [user, loading, admin, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-48 skeleton" />
      </div>
    );
  }

  if (admin && user.role !== 'admin') return null;

  return <>{children}</>;
}
