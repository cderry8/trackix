'use client';

import { useAuth } from '@/features/auth/AuthProvider';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard');
  }, [loading, user, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      router.replace('/dashboard');
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <motion.form
        onSubmit={submit}
        className="glass-panel w-full max-w-md space-y-4 p-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <Link href="/" className="text-xs text-ink-muted underline-offset-4 hover:underline">
            ← Back to home
          </Link>
          <div className="mt-3 font-mono text-xs uppercase tracking-[0.25em] text-ink-muted">Trackix</div>
          <h1 className="text-2xl font-semibold">Sign in</h1>
        </div>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <label className="block text-sm">
          <span className="text-ink-muted">Email</span>
          <input
            className="mt-1 w-full rounded-xl border border-ink/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-white/15"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </label>
        <label className="block text-sm">
          <span className="text-ink-muted">Password</span>
          <input
            className="mt-1 w-full rounded-xl border border-ink/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-white/15"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </label>
        <Button className="w-full" type="submit">
          Continue
        </Button>
        <p className="text-center text-sm text-ink-muted">
          No account?{' '}
          <Link href="/register" className="text-accent-dim underline-offset-4 hover:underline dark:text-accent">
            Register
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
