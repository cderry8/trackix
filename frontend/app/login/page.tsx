'use client';

import { useAuth } from '@/features/auth/AuthProvider';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import {
  ArrowLeft,
  BarChart3,
  Brain,
  CheckCircle2,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Mail,
  Shield,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) router.replace('/dashboard');
  }, [authLoading, user, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      router.replace('/dashboard');
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form */}
      <motion.div
        className="flex w-full flex-col justify-center p-6 lg:w-1/2 lg:p-12"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mx-auto w-full max-w-md">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-ink-muted transition hover:text-ink"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to home
          </Link>

          {/* Logo */}
          <div className="mt-8 font-mono text-xs uppercase tracking-[0.25em] text-ink-muted">
            Trackix
          </div>

          {/* Heading */}
          <h1 className="mt-2 text-3xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-ink-muted">
            Sign in to continue tracking your finances
          </p>

          {/* Error */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-500"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-medium">Email Address</span>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                <input
                  type="email"
                  className="w-full rounded-xl border border-ink/15 bg-transparent py-2.5 pl-10 pr-4 text-sm outline-none focus:border-accent dark:border-white/15"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium">Password</span>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full rounded-xl border border-ink/15 bg-transparent py-2.5 pl-10 pr-10 text-sm outline-none focus:border-accent dark:border-white/15"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted transition hover:text-ink"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-ink/20 accent-accent-dim dark:border-white/20"
                />
                <span className="text-ink-muted">Remember me</span>
              </label>
              <Link
                href="#"
                className="text-sm text-accent-dim underline-offset-4 hover:underline dark:text-accent"
              >
                Forgot password?
              </Link>
            </div>

            <Button className="w-full" type="submit" loading={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-ink-muted">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-accent-dim underline-offset-4 hover:underline dark:text-accent"
            >
              Create one
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Right Side - Visual */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:border-l lg:border-ink/10 lg:bg-gradient-to-br lg:from-accent/5 lg:via-surface lg:to-accent/10 lg:p-12 lg:dark:border-white/10 lg:dark:from-accent/10 lg:dark:via-black lg:dark:to-accent/5"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="mx-auto max-w-md">
          {/* Welcome Card */}
          <div className="rounded-2xl border border-ink/10 bg-white/70 p-6 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/70 dark:shadow-glass-dark">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-dim/20 dark:bg-accent/20">
                <Brain className="h-6 w-6 text-accent-dim dark:text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Smart Financial Insights</h3>
                <p className="text-xs text-ink-muted">AI-powered analysis of your spending patterns</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {[
                'Track expenses across multiple currencies',
                'Set and monitor budgets with alerts',
                'Visualize spending with interactive charts',
                'Export data for tax and accounting',
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-2 text-sm text-ink-muted"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                  </div>
                  {item}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { icon: BarChart3, label: 'Smart Analytics' },
              { icon: Zap, label: 'Real-time Sync' },
              { icon: Shield, label: 'Bank-grade Security' },
              { icon: Globe, label: 'Multi-Currency' },
            ].map((feature, i) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="flex items-center gap-2 text-sm text-ink-muted"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-dim/10 dark:bg-accent/10">
                  <feature.icon className="h-4 w-4 text-accent-dim dark:text-accent" />
                </div>
                {feature.label}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
