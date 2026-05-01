'use client';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth/AuthProvider';
import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Bell,
  Brain,
  Building2,
  LineChart,
  Lock,
  Shield,
  Sparkles,
  Wallet,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const features = [
  {
    icon: Wallet,
    title: 'Every transaction, one view',
    body: 'Log income and expenses manually or pull simulated feeds from mobile money and bank-style connections.',
  },
  {
    icon: BarChart3,
    title: 'Dashboards that feel alive',
    body: 'Balances, savings rate, category mix, trends, heatmaps, and forward-looking projections—built for decisions.',
  },
  {
    icon: Brain,
    title: 'AI insights, not noise',
    body: 'Weekly reports, “explain my spending,” health score, and savings pacing suggestions grounded in your real data.',
  },
  {
    icon: LineChart,
    title: 'Budgets & goals with teeth',
    body: 'Monthly envelopes, overspend alerts, and goal tracking with suggested monthly contributions.',
  },
  {
    icon: Building2,
    title: 'Multi-currency ready',
    body: 'Work in USD, EUR, or RWF with transparent mock FX when you need a quick conversion.',
  },
  {
    icon: Shield,
    title: 'Built for operators',
    body: 'Separate admin tools for user lifecycle, platform stats, analytics, and audit logs—serious SaaS structure.',
  },
];

const steps = [
  { n: '01', title: 'Create your workspace', body: 'Sign up in seconds. Default categories are ready from day one.' },
  { n: '02', title: 'Capture money movement', body: 'Add transactions or connect a simulated source to auto-populate activity.' },
  { n: '03', title: 'Steer with intelligence', body: 'Open the dashboard, set budgets, and let AI surface risks and opportunities.' },
];

export function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard');
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-56 skeleton rounded-xl" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-48 skeleton rounded-xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-ink dark:text-white">
      <header className="sticky top-0 z-20 border-b border-ink/10 bg-surface/70 backdrop-blur-xl dark:border-white/10 dark:bg-black/50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-mono text-sm font-semibold tracking-[0.18em]">
            TRACKIX
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm text-ink-muted transition hover:text-ink dark:hover:text-white"
            >
              Log in
            </Link>
            <Link href="/register">
              <Button type="button" className="!py-2 !text-sm">
                Get started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white/40 px-3 py-1 text-xs font-medium text-ink-muted backdrop-blur dark:border-white/15 dark:bg-white/5">
              <Sparkles className="h-3.5 w-3.5 text-accent-dim dark:text-accent" />
              AI-powered expense intelligence for modern teams & founders
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Know where every dollar goes.
              <span className="block text-ink-muted dark:text-zinc-400">Act before spend drifts.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-ink-muted dark:text-zinc-400">
              Trackix brings together manual entries, simulated bank-grade connections, and explainable AI so you can
              run budgets, goals, and alerts with the clarity of a fintech command center—not a spreadsheet graveyard.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link href="/register">
                <Button type="button" className="group !px-6 !py-3 !text-base">
                  Start free
                  <ArrowRight className="ml-2 inline h-4 w-4 transition group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button type="button" variant="ghost" className="!px-6 !py-3 !text-base">
                  I already have an account
                </Button>
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-6 text-sm text-ink-muted">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-accent-dim dark:text-accent" />
                JWT-secured sessions
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent-dim dark:text-accent" />
                Real-time dashboards
              </div>
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-accent-dim dark:text-accent" />
                Smart alerts
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mt-16 grid gap-4 lg:grid-cols-3"
          >
            {[
              { label: '30-day signal', value: 'Balance · income · expense', sub: 'Unified KPI strip' },
              { label: 'Behavior layer', value: 'Heatmaps & projections', sub: 'Calendar spend + outlook' },
              { label: 'Control tower', value: 'Admin analytics + logs', sub: 'For owners & operators' },
            ].map((c, i) => (
              <div
                key={c.label}
                className={cn(
                  'rounded-2xl border border-ink/10 bg-white/60 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-black/45 dark:shadow-glass-dark',
                  i === 1 && 'lg:scale-[1.02] lg:border-accent/25'
                )}
              >
                <div className="text-xs font-mono uppercase tracking-wider text-ink-muted">{c.label}</div>
                <div className="mt-3 text-lg font-semibold">{c.value}</div>
                <div className="mt-1 text-sm text-ink-muted">{c.sub}</div>
              </div>
            ))}
          </motion.div>
        </section>

        <section className="border-y border-ink/10 bg-ink/[0.03] py-20 dark:border-white/10 dark:bg-white/[0.03]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-center text-2xl font-semibold sm:text-3xl">Why teams switch to Trackix</h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-ink-muted">
              A single surface for tracking, forecasting, and governance—minimal chrome, maximum signal.
            </p>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border border-ink/10 bg-surface/80 p-6 backdrop-blur dark:border-white/10 dark:bg-zinc-950/60"
                >
                  <f.icon className="h-8 w-8 text-accent-dim dark:text-accent" />
                  <h3 className="mt-4 font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{f.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="text-2xl font-semibold sm:text-3xl">From zero to clarity in three moves</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="relative rounded-2xl border border-ink/10 bg-white/50 p-6 dark:border-white/10 dark:bg-black/40"
              >
                <span className="font-mono text-xs text-accent-dim dark:text-accent">{s.n}</span>
                <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-ink/15 bg-gradient-to-br from-white/80 via-surface to-accent/10 p-10 text-center shadow-glass dark:border-white/15 dark:from-zinc-950/90 dark:via-black dark:to-accent/15 dark:shadow-glass-dark sm:p-14"
          >
            <h2 className="text-2xl font-semibold sm:text-3xl">Ready to run finance like a product?</h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-muted">
              Join Trackix, connect your flows, and let AI highlight what matters—before spend becomes a surprise.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 ">
              <Link href="/register">
                <Button type="button" className="!px-8 !py-3 !text-base">
                  Create your account
                </Button>
              </Link>
              <Link href="/login">
                <Button type="button" variant="ghost" className="!px-8 !py-3 !text-base">
                  Sign in instead
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-ink/10 py-10 text-center text-sm text-ink-muted dark:border-white/10">
        <p className="font-mono text-xs tracking-widest">TRACKIX</p>
        <p className="mt-2">Expense intelligence · Budgets · AI insights · Admin control</p>
      </footer>
    </div>
  );
}
