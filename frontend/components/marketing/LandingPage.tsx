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
  CheckCircle2,
  ChevronDown,
  CreditCard,
  DollarSign,
  Globe,
  LineChart,
  Lock,
  PieChart,
  Plus,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  User,
  Wallet,
  Zap,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
    body: 'Weekly reports, "explain my spending," health score, and savings pacing suggestions grounded in your real data.',
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

const stats = [
  { value: '10K+', label: 'Active users' },
  { value: '$2.4M', label: 'Transactions tracked' },
  { value: '50+', label: 'Countries supported' },
  { value: '99.9%', label: 'Uptime guaranteed' },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Startup Founder',
    avatar: 'SC',
    content: 'Trackix helped us cut our burn rate by 23% in the first month. The AI insights spotted subscriptions we forgot about.',
    rating: 5,
  },
  {
    name: 'Michael Osei',
    role: 'Finance Manager',
    avatar: 'MO',
    content: 'Finally, a tool that understands African markets. The multi-currency support and MTN MoMo integration are game-changers.',
    rating: 5,
  },
  {
    name: 'Emma Thompson',
    role: 'Freelance Designer',
    avatar: 'ET',
    content: 'I went from spreadsheet chaos to financial clarity. The dashboard is beautiful and actually makes me want to check my finances.',
    rating: 5,
  },
];

const faqs = [
  {
    q: 'Is Trackix really free to use?',
    a: 'Yes! Trackix is completely free for personal use. We believe everyone deserves access to powerful financial tools without breaking the bank.',
  },
  {
    q: 'Can I connect my real bank account?',
    a: 'Currently, we offer simulated connections for demo purposes. Real bank integrations are on our roadmap and coming soon for select markets.',
  },
  {
    q: 'How secure is my financial data?',
    a: 'We use JWT authentication, encrypted connections, and never store sensitive banking credentials. Your data belongs to you.',
  },
  {
    q: 'What currencies are supported?',
    a: 'We support USD, EUR, and RWF out of the box. More currencies are being added based on user demand.',
  },
  {
    q: 'Is there a mobile app?',
    a: 'Trackix is a progressive web app (PWA) that works great on mobile browsers. Native apps are in development.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-ink/10 dark:border-white/10">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="font-semibold">{q}</span>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-ink-muted transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-ink-muted">{a}</p>
      </motion.div>
    </div>
  );
}

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
                secured Application
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

        {/* Stats Section */}
        <section className="border-y border-ink/10 bg-gradient-to-r from-accent/5 via-surface to-accent/5 py-16 dark:border-white/10 dark:from-accent/10 dark:via-black dark:to-accent/10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-ink dark:text-white sm:text-4xl">{stat.value}</div>
                  <div className="mt-1 text-sm text-ink-muted">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
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

        {/* Dashboard Preview Section */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-semibold sm:text-3xl">Your financial command center</h2>
              <p className="mx-auto mt-3 max-w-2xl text-ink-muted">
                Everything you need to understand your finances, in one beautiful dashboard.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-12"
          >
            <div className="relative rounded-2xl border border-ink/10 bg-white/80 p-4 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/80 dark:shadow-accent/10">
              {/* Browser Chrome */}
              <div className="flex items-center gap-2 border-b border-ink/10 pb-3 dark:border-white/10">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="ml-4 flex-1 rounded-md bg-ink/5 px-3 py-1 text-xs text-ink-muted dark:bg-white/10">
                  app.trackix.com/dashboard
                </div>
              </div>

              {/* Dashboard Mock Content */}
              <div className="grid gap-4 p-4 md:grid-cols-3">
                {/* Balance Card */}
                <div className="rounded-xl border border-ink/10 bg-gradient-to-br from-accent/20 to-accent/5 p-4 dark:border-white/10 dark:from-accent/30 dark:to-accent/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-ink-muted">Total Balance</span>
                    <Wallet className="h-4 w-4 text-accent-dim dark:text-accent" />
                  </div>
                  <div className="mt-2 text-2xl font-bold">$12,450.00</div>
                  <div className="mt-1 text-xs text-green-500">+8.2% from last month</div>
                </div>

                {/* Income Card */}
                <div className="rounded-xl border border-ink/10 bg-surface/60 p-4 dark:border-white/10 dark:bg-zinc-800/60">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-ink-muted">Monthly Income</span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="mt-2 text-2xl font-bold">$4,200.00</div>
                  <div className="mt-1 text-xs text-ink-muted">3 sources</div>
                </div>

                {/* Expenses Card */}
                <div className="rounded-xl border border-ink/10 bg-surface/60 p-4 dark:border-white/10 dark:bg-zinc-800/60">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-ink-muted">Monthly Expenses</span>
                    <CreditCard className="h-4 w-4 text-red-400" />
                  </div>
                  <div className="mt-2 text-2xl font-bold">$2,845.50</div>
                  <div className="mt-1 text-xs text-green-500">Under budget</div>
                </div>

                {/* Chart Area */}
                <div className="col-span-full rounded-xl border border-ink/10 bg-surface/40 p-4 dark:border-white/10 dark:bg-zinc-800/40">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Spending Overview</h3>
                    <div className="flex gap-2">
                      <span className="rounded-md bg-accent/20 px-2 py-1 text-xs">Income</span>
                      <span className="rounded-md bg-red-500/20 px-2 py-1 text-xs">Expenses</span>
                    </div>
                  </div>
                  <div className="mt-4 flex h-32 items-end justify-between gap-2">
                    {[40, 65, 45, 80, 55, 70, 60].map((h, i) => (
                      <div key={i} className="flex flex-1 flex-col items-center gap-1">
                        <div className="flex w-full gap-0.5">
                          <div
                            className="flex-1 rounded-t bg-accent/60"
                            style={{ height: `${h * 0.7}%` }}
                          />
                          <div
                            className="flex-1 rounded-t bg-red-400/60"
                            style={{ height: `${h * 0.5}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-ink-muted">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="col-span-full md:col-span-2 rounded-xl border border-ink/10 bg-surface/40 p-4 dark:border-white/10 dark:bg-zinc-800/40">
                  <h3 className="font-semibold">Recent Transactions</h3>
                  <div className="mt-3 space-y-2">
                    {[
                      { name: 'Grocery Store', amount: '-$85.40', type: 'expense' },
                      { name: 'Freelance Payment', amount: '+$1,200.00', type: 'income' },
                      { name: 'Netflix Subscription', amount: '-$15.99', type: 'expense' },
                    ].map((t, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-surface/60 p-2 dark:bg-zinc-700/50">
                        <div className="flex items-center gap-2">
                          <div className={cn('flex h-8 w-8 items-center justify-center rounded-full', t.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20')}>
                            {t.type === 'income' ? <Plus className="h-4 w-4 text-green-500" /> : <DollarSign className="h-4 w-4 text-red-400" />}
                          </div>
                          <span className="text-sm font-medium">{t.name}</span>
                        </div>
                        <span className={cn('text-sm font-semibold', t.type === 'income' ? 'text-green-500' : 'text-ink dark:text-white')}>{t.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Insight Card */}
                <div className="rounded-xl border border-accent/30 bg-gradient-to-br from-accent/10 to-transparent p-4 dark:border-accent/20">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent-dim dark:text-accent" />
                    <span className="text-xs font-medium text-accent-dim dark:text-accent">AI Insight</span>
                  </div>
                  <p className="mt-2 text-sm text-ink-muted">
                    You&apos;ve reduced dining out expenses by 35% this month. Keep it up to hit your savings goal!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
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

        {/* Testimonials Section */}
        <section className="border-y border-ink/10 bg-gradient-to-b from-surface via-accent/5 to-surface py-20 dark:border-white/10 dark:from-black dark:via-accent/10 dark:to-black">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-2xl font-semibold sm:text-3xl">Loved by thousands</h2>
              <p className="mx-auto mt-3 max-w-2xl text-ink-muted">
                See what our users are saying about their Trackix experience.
              </p>
            </motion.div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl border border-ink/10 bg-white/70 p-6 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/70 dark:shadow-glass-dark"
                >
                  <div className="flex gap-1">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-ink-muted">&quot;{t.content}&quot;</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 font-semibold text-accent-dim dark:text-accent">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-xs text-ink-muted">{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-2xl font-semibold sm:text-3xl">Frequently asked questions</h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-muted">
              Everything you need to know about Trackix.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-10"
          >
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </motion.div>
        </section>

        {/* Trust Badges Section */}
        <section className="border-y border-ink/10 bg-ink/[0.02] py-16 dark:border-white/10 dark:bg-white/[0.02]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h3 className="text-lg font-semibold">Your security is our priority</h3>
              <p className="mt-2 text-sm text-ink-muted">
                Bank-grade security to keep your financial data safe.
              </p>
            </motion.div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
              {[
                { icon: ShieldCheck, label: '256-bit Encryption' },
                { icon: Lock, label: 'JWT Authentication' },
                { icon: CheckCircle2, label: 'SOC 2 Compliant' },
                { icon: Globe, label: 'GDPR Ready' },
              ].map((badge, i) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 text-sm text-ink-muted"
                >
                  <badge.icon className="h-5 w-5 text-accent-dim dark:text-accent" />
                  <span>{badge.label}</span>
                </motion.div>
              ))}
            </div>
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
