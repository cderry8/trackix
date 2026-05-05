'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import type { Subscription, Transaction } from '@/types';
import { useEffect, useState } from 'react';
import { format, differenceInDays, isSameMonth, parseISO, startOfMonth } from 'date-fns';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  AlertCircle,
  Plus,
  Pause,
  ExternalLink,
  Calendar,
  CreditCard,
} from 'lucide-react';
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Area,
  AreaChart,
  Bar,
  BarChart,
} from 'recharts';

type Summary = {
  currency: string;
  totalBalance: number;
  income: number;
  expenses: number;
  savingsRate: number;
};

const COLORS = ['#60a5fa', '#a78bfa', '#34d399', '#fbbf24', '#f472b6', '#94a3b8', '#f87171', '#818cf8'];

const PROVIDER_ICONS: Record<string, string> = {
  netflix: '🎬',
  spotify: '🎵',
  youtube: '▶️',
  amazon: '📦',
  aws: '☁️',
  github: '💻',
  notion: '📝',
  figma: '🎨',
  adobe: '🎭',
  microsoft: '🪟',
  apple: '🍎',
  google: '🔍',
  disney: '✨',
  hulu: '📺',
  default: '💳',
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [pie, setPie] = useState<{ category: string; amount: number }[]>([]);
  const [trend, setTrend] = useState<{ month: string; income: number; expense: number }[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [subscriptionSummary, setSubscriptionSummary] = useState({
    monthlyTotal: 0,
    yearlyTotal: 0,
    subscriptionCount: 0,
    upcomingRenewals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [s, p, t, transRes, subsRes, subsSummaryRes] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/dashboard/category-breakdown'),
        api.get('/dashboard/monthly-trend'),
        api.get('/transactions').catch(() => ({ data: [] })),
        api.get('/subscriptions').catch(() => ({ data: [] })),
        api.get('/subscriptions/summary').catch(() => ({ data: { monthlyTotal: 0, yearlyTotal: 0, subscriptionCount: 0, upcomingRenewals: 0 } })),
      ]);
      setSummary(s.data);
      setPie(p.data);
      setTrend(t.data);
      setRecentTransactions(transRes.data.slice(0, 5));
      setSubscriptions(subsRes.data.filter((sub: Subscription) => sub.status === 'active').slice(0, 4));
      setSubscriptionSummary(subsSummaryRes.data);
    } finally {
      setLoading(false);
    }
  };

  const c = summary?.currency ?? 'USD';

  const getProviderIcon = (provider: string) => {
    const key = provider.toLowerCase();
    return PROVIDER_ICONS[key] || PROVIDER_ICONS.default;
  };

  const handleCancelSubscription = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) return;
    try {
      await api.post(`/subscriptions/${id}/cancel`);
      loadDashboardData();
    } catch (err) {
      alert('Failed to cancel subscription');
    }
  };

  const currentMonthExpenses = recentTransactions
    .filter((t) => t.type === 'expense' && isSameMonth(parseISO(t.date), new Date()))
    .reduce((sum, t) => sum + t.amount, 0);

  const currentMonthIncome = recentTransactions
    .filter((t) => t.type === 'income' && isSameMonth(parseISO(t.date), new Date()))
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-ink-muted">Welcome back! Here&apos;s your financial overview</p>
        </div>
        <div className="flex gap-2">
          <Link href="/transactions/new">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card tilt={false} className="relative overflow-hidden">
          <div className="absolute right-0 top-0 h-24 w-24 -translate-y-1/4 translate-x-1/4 rounded-full bg-accent-dim/10 dark:bg-accent/10" />
          <div className="relative">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-ink-muted">
              <Wallet className="h-4 w-4" />
              Total Balance
            </div>
            <div className="mt-2 font-mono text-2xl">
              {summary ? `${summary.totalBalance.toLocaleString()} ${c}` : '—'}
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-emerald-500">
              <ArrowUpRight className="h-3 w-3" />
              <span>+{summary?.savingsRate.toFixed(1) || 0}% this month</span>
            </div>
          </div>
        </Card>

        <Card tilt={false} className="relative overflow-hidden">
          <div className="absolute right-0 top-0 h-24 w-24 -translate-y-1/4 translate-x-1/4 rounded-full bg-emerald-500/10" />
          <div className="relative">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-ink-muted">
              <TrendingUp className="h-4 w-4" />
              Income
            </div>
            <div className="mt-2 font-mono text-2xl text-emerald-500">
              {summary ? `${summary.income.toLocaleString()} ${c}` : '—'}
            </div>
            <div className="mt-1 text-xs text-ink-muted">
              {currentMonthIncome > 0 ? `+${currentMonthIncome.toLocaleString()} ${c} this month` : 'No income this month'}
            </div>
          </div>
        </Card>

        <Card tilt={false} className="relative overflow-hidden">
          <div className="absolute right-0 top-0 h-24 w-24 -translate-y-1/4 translate-x-1/4 rounded-full bg-red-500/10" />
          <div className="relative">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-ink-muted">
              <TrendingDown className="h-4 w-4" />
              Expenses
            </div>
            <div className="mt-2 font-mono text-2xl text-red-500">
              {summary ? `${summary.expenses.toLocaleString()} ${c}` : '—'}
            </div>
            <div className="mt-1 text-xs text-ink-muted">
              {currentMonthExpenses > 0 ? `-${currentMonthExpenses.toLocaleString()} ${c} this month` : 'No expenses this month'}
            </div>
          </div>
        </Card>

        <Card tilt={false} className="relative overflow-hidden">
          <div className="absolute right-0 top-0 h-24 w-24 -translate-y-1/4 translate-x-1/4 rounded-full bg-purple-500/10" />
          <div className="relative">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-ink-muted">
              <Target className="h-4 w-4" />
              Savings Rate
            </div>
            <div className="mt-2 font-mono text-2xl">
              {summary ? `${summary.savingsRate.toFixed(1)}%` : '—'}
            </div>
            <div className="mt-1 text-xs text-ink-muted">
              {summary && summary.savingsRate > 20 ? 'Great job saving!' : 'Try to save more'}
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Income vs Expense Area Chart */}
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium">Income vs Expenses Trend</h2>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-ink-muted">Income</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-ink-muted">Expenses</span>
              </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => `${v.toFixed(2)} ${c}`} />
                <Area type="monotone" dataKey="income" stroke="#34d399" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#f87171" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Pie Chart */}
        <Card>
          <h2 className="mb-4 text-sm font-medium">Spending by Category</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  dataKey="amount"
                  nameKey="category"
                  data={pie}
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {pie.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v.toFixed(2)} ${c}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {pie.slice(0, 4).map((item, i) => (
              <div key={item.category} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-ink-muted">{item.category}</span>
                </div>
                <span className="font-mono">{item.amount.toFixed(0)} {c}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Subscriptions & Recent Transactions Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Subscriptions Widget */}
        <Card tilt={false}>
          <div className="flex items-center justify-between border-b border-ink/10 p-4 dark:border-white/10">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-accent-dim dark:text-accent" />
              <h2 className="font-semibold">Active Subscriptions</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-ink-muted">Monthly cost</p>
                <p className="font-mono text-lg font-semibold">${subscriptionSummary.monthlyTotal.toFixed(2)}</p>
              </div>
              <Link href="/subscriptions">
                <Button variant="ghost" size="sm" className="!text-xs">
                  View All
                </Button>
              </Link>
            </div>
          </div>
          <div className="divide-y divide-ink/10 dark:divide-white/10">
            {subscriptions.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm text-ink-muted">No active subscriptions</p>
                <Link href="/subscriptions">
                  <Button variant="ghost" size="sm" className="mt-2">
                    Add your first subscription
                  </Button>
                </Link>
              </div>
            ) : (
              subscriptions.map((sub) => {
                const daysUntil = differenceInDays(new Date(sub.nextBillingDate), new Date());
                return (
                  <div key={sub._id} className="flex items-center justify-between p-4 hover:bg-ink/5 dark:hover:bg-white/5">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                        style={{ backgroundColor: `${sub.color || '#60a5fa'}20` }}
                      >
                        {getProviderIcon(sub.provider)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{sub.name}</p>
                          {daysUntil <= 7 && daysUntil >= 0 && (
                            <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-xs text-orange-500">
                              Due in {daysUntil}d
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-ink-muted">
                          {sub.provider} • ${sub.amount.toFixed(2)}/{sub.frequency}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="!p-2 text-orange-500"
                        onClick={() => handleCancelSubscription(sub._id)}
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {subscriptionSummary.upcomingRenewals > 0 && (
            <div className="border-t border-ink/10 p-3 dark:border-white/10">
              <div className="flex items-center gap-2 rounded-lg bg-orange-500/10 p-2 text-xs text-orange-500">
                <AlertCircle className="h-4 w-4" />
                <span>{subscriptionSummary.upcomingRenewals} subscription(s) due for renewal this week</span>
              </div>
            </div>
          )}
        </Card>

        {/* Recent Transactions */}
        <Card tilt={false}>
          <div className="flex items-center justify-between border-b border-ink/10 p-4 dark:border-white/10">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-accent-dim dark:text-accent" />
              <h2 className="font-semibold">Recent Transactions</h2>
            </div>
            <Link href="/transactions">
              <Button variant="ghost" size="sm" className="!text-xs">
                View All
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-ink/10 dark:divide-white/10">
            {recentTransactions.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm text-ink-muted">No recent transactions</p>
                <Link href="/transactions/new">
                  <Button variant="ghost" size="sm" className="mt-2">
                    Add your first transaction
                  </Button>
                </Link>
              </div>
            ) : (
              recentTransactions.map((t) => (
                <div key={t._id} className="flex items-center justify-between p-4 hover:bg-ink/5 dark:hover:bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl',
                      t.type === 'income' ? 'bg-emerald-500/10' : 'bg-red-500/10'
                    )}>
                      {t.type === 'income' ? (
                        <ArrowUpRight className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{t.category}</p>
                      <p className="text-xs text-ink-muted">{format(parseISO(t.date), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                  <div className={cn(
                    'font-mono font-medium',
                    t.type === 'income' ? 'text-emerald-500' : 'text-red-500'
                  )}>
                    {t.type === 'income' ? '+' : '-'}{t.amount.toFixed(2)} {c}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Monthly Comparison Bar Chart */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium">Monthly Spending Overview</h2>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-accent-dim dark:bg-accent" />
              <span className="text-ink-muted">Total Spending</span>
            </div>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => `${v.toFixed(2)} ${c}`} />
              <Bar dataKey="expense" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

// Add cn import
import { cn } from '@/lib/cn';
