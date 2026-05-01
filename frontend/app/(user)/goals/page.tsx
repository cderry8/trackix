'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { api } from '@/lib/api';
import type { Goal } from '@/types';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

export default function GoalsPage() {
  const [items, setItems] = useState<Goal[]>([]);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [plan, setPlan] = useState<string | null>(null);

  const load = async () => {
    const { data } = await api.get('/goals');
    setItems(data);
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/goals', { title, targetAmount: Number(target) });
    setTitle('');
    setTarget('');
    await load();
  };

  const suggest = async (id: string) => {
    const { data } = await api.get(`/goals/${id}/savings-plan`);
    setPlan(`Suggested monthly: ${data.suggestedMonthly} · ${data.aiNote || ''}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Goals</h1>
        <p className="text-sm text-ink-muted">Targets with AI-assisted pacing</p>
      </div>
      {plan ? <Card tilt={false}><p className="text-sm">{plan}</p></Card> : null}
      <Card tilt={false}>
        <form className="grid gap-3 md:grid-cols-3" onSubmit={add}>
          <input
            required
            placeholder="Title"
            className="rounded-xl border border-ink/15 bg-transparent px-3 py-2 text-sm dark:border-white/15"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            required
            type="number"
            placeholder="Target amount"
            className="rounded-xl border border-ink/15 bg-transparent px-3 py-2 text-sm dark:border-white/15"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
          <Button type="submit">Add goal</Button>
        </form>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((g) => {
          const pct = g.targetAmount ? Math.min(100, (g.currentAmount / g.targetAmount) * 100) : 0;
          return (
            <Card key={g._id} tilt={false}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-medium">{g.title}</div>
                  {g.deadline ? (
                    <div className="text-xs text-ink-muted">By {format(new Date(g.deadline), 'yyyy-MM-dd')}</div>
                  ) : null}
                </div>
                <Button type="button" variant="ghost" className="!py-1 !text-xs" onClick={() => suggest(g._id)}>
                  AI plan
                </Button>
              </div>
              <div className="mt-2 font-mono text-sm">
                {g.currentAmount.toFixed(2)} / {g.targetAmount.toFixed(2)}
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-white/10">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
