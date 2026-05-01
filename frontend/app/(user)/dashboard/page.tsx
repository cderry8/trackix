'use client';

import { Card } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
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
} from 'recharts';

type Summary = {
  currency: string;
  totalBalance: number;
  income: number;
  expenses: number;
  savingsRate: number;
};

const COLORS = ['#60a5fa', '#a78bfa', '#34d399', '#fbbf24', '#f472b6', '#94a3b8'];

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [pie, setPie] = useState<{ category: string; amount: number }[]>([]);
  const [trend, setTrend] = useState<{ month: string; income: number; expense: number }[]>([]);
  const [heatmap, setHeatmap] = useState<{ date: string; amount: number }[]>([]);
  const [projection, setProjection] = useState<{ points: { month: number; projectedSavings: number }[] } | null>(
    null
  );

  useEffect(() => {
    (async () => {
      const [s, p, t, h, pr] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/dashboard/category-breakdown'),
        api.get('/dashboard/monthly-trend'),
        api.get('/dashboard/heatmap'),
        api.get('/dashboard/projection'),
      ]);
      setSummary(s.data);
      setPie(p.data);
      setTrend(t.data);
      setHeatmap(h.data);
      setProjection(pr.data);
    })().catch(() => {});
  }, []);

  const c = summary?.currency ?? 'USD';

  const maxHeat = Math.max(1, ...heatmap.map((x) => x.amount));
  const heatByDate = Object.fromEntries(heatmap.map((x) => [x.date, x.amount]));
  const lastDays = Array.from({ length: 90 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (89 - i));
    return d.toISOString().slice(0, 10);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-ink-muted">Signal-rich overview of your capital flows</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card tilt={false}>
          <div className="text-xs uppercase tracking-wide text-ink-muted">Balance (30d)</div>
          <div className="mt-2 font-mono text-2xl">
            {summary ? `${summary.totalBalance.toLocaleString()} ${c}` : '—'}
          </div>
        </Card>
        <Card tilt={false}>
          <div className="text-xs uppercase tracking-wide text-ink-muted">Income</div>
          <div className="mt-2 font-mono text-2xl text-emerald-500 dark:text-emerald-400">
            {summary ? `${summary.income.toLocaleString()} ${c}` : '—'}
          </div>
        </Card>
        <Card tilt={false}>
          <div className="text-xs uppercase tracking-wide text-ink-muted">Expenses</div>
          <div className="mt-2 font-mono text-2xl text-red-500 dark:text-red-400">
            {summary ? `${summary.expenses.toLocaleString()} ${c}` : '—'}
          </div>
        </Card>
        <Card tilt={false}>
          <div className="text-xs uppercase tracking-wide text-ink-muted">Savings rate</div>
          <div className="mt-2 font-mono text-2xl">
            {summary ? `${summary.savingsRate.toFixed(1)}%` : '—'}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-2 text-sm font-medium">Category spending</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie dataKey="amount" nameKey="category" data={pie} innerRadius={56} outerRadius={90} paddingAngle={2}>
                  {pie.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v.toFixed(2)} ${c}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h2 className="mb-2 text-sm font-medium">Income vs expense</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#34d399" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="expense" stroke="#f87171" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="mb-3 text-sm font-medium">Spending heatmap (last 90 days)</h2>
        <div className="flex flex-wrap gap-1">
          {lastDays.map((key) => {
            const val = heatByDate[key] || 0;
            const intensity = val / maxHeat;
            const style =
              val === 0
                ? undefined
                : { backgroundColor: `rgba(96, 165, 250, ${0.12 + intensity * 0.7})` };
            return (
              <div
                key={key}
                title={`${key}: ${val.toFixed(2)} ${c}`}
                className="h-3 w-3 rounded-sm bg-ink/5 dark:bg-white/5"
                style={style}
              />
            );
          })}
        </div>
      </Card>

      <Card>
        <h2 className="mb-2 text-sm font-medium">Future projection (mock)</h2>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projection?.points ?? []}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="projectedSavings" stroke="#a78bfa" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
