'use client';

import { LandingPage } from '@/components/marketing/LandingPage';
import { useAuth } from '@/features/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [loading, user, router]);
  if (loading) return null;
  if (user) return null;
  return <LandingPage />;
}