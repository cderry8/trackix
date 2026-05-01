'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { api } from '@/lib/api';
import type { Budget } from '@/types';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

type Usage = {
  budget: Budget;
  spent: number;
  remaining: number;
  percent: number;
};

export default function BudgetsPage() {
  const [usage, setUsage] = useState<Usage[]>([]);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'));

  const load = async () => {
    const { data } = await api.get('/budgets/usage');
    setUsage(data);
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const d = new Date(`${month}-01`);
    await api.post('/budgets', { category, limit: Number(limit), month: d.toISOString() });
    setCategory('');
    setLimit('');
    await load();
  };

  const del = async (id: string) => {
    await api.delete(`/budgets/${id}`);
    await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Budgets</h1>
        <p className="text-sm text-ink-muted">Monthly envelopes with live utilization</p>
      </div>
      <Card tilt={false}>
        <form className="grid gap-3 md:grid-cols-4" onSubmit={add}>
          <input
            required
            placeholder="Category name"
            className="rounded-xl border border-ink/15 bg-transparent px-3 py-2 text-sm dark:border-white/15"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            required
            type="number"
            placeholder="Limit"
            className="rounded-xl border border-ink/15 bg-transparent px-3 py-2 text-sm dark:border-white/15"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          />
          <input
            type="month"
            className="rounded-xl border border-ink/15 bg-transparent px-3 py-2 text-sm dark:border-white/15"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <Button type="submit">Create budget</Button>
        </form>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        {usage.map((u) => (
          <Card key={u.budget._id} tilt={false}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-medium">{u.budget.category}</div>
                <div className="text-xs text-ink-muted">
                  {format(new Date(u.budget.month), 'MMM yyyy')}
                </div>
              </div>
              <button type="button" className="text-xs text-red-500" onClick={() => del(u.budget._id)}>
                Delete
              </button>
            </div>
            <div className="mt-3 font-mono text-sm">
              Spent {u.spent.toFixed(2)} / {u.budget.limit.toFixed(2)} · Remaining {u.remaining.toFixed(2)}
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-white/10">
              <div
                className={`h-full rounded-full ${u.percent > 100 ? 'bg-red-500' : 'bg-accent'}`}
                style={{ width: `${Math.min(100, u.percent)}%` }}
              />
            </div>
            {u.percent > 100 ? (
              <div className="mt-2 text-xs text-red-500">Overspending</div>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
