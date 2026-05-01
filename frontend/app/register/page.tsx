'use client';

import { useAuth } from '@/features/auth/AuthProvider';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const { register, user, loading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
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
      await register(name, email, password);
      router.replace('/dashboard');
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data
        ? String((err.response.data as { message?: string }).message)
        : 'Registration failed';
      setError(msg);
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
          <h1 className="text-2xl font-semibold">Create account</h1>
        </div>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <label className="block text-sm">
          <span className="text-ink-muted">Name</span>
          <input
            className="mt-1 w-full rounded-xl border border-ink/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-white/15"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
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
            minLength={6}
            required
          />
        </label>
        <Button className="w-full" type="submit">
          Start tracking
        </Button>
        <p className="text-center text-sm text-ink-muted">
          Have an account?{' '}
          <Link href="/login" className="text-accent-dim underline-offset-4 hover:underline dark:text-accent">
            Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
