'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { api } from '@/lib/api';
import type { Category, Transaction } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

export function TransactionForm({
  initial,
  onDone,
}: {
  initial?: Transaction;
  onDone?: () => void;
}) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [amount, setAmount] = useState(initial?.amount?.toString() ?? '');
  const [type, setType] = useState(initial?.type ?? 'expense');
  const [category, setCategory] = useState(initial?.category ?? '');
  const [date, setDate] = useState(
    initial?.date ? format(new Date(initial.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
  );
  const [note, setNote] = useState(initial?.note ?? '');
  const [source, setSource] = useState<'manual' | 'connected'>(initial?.source ?? 'manual');

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/categories');
      setCategories(data);
      if (!initial && data[0]) setCategory(data[0].name);
    })().catch(() => {});
  }, [initial]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      amount: Number(amount),
      type,
      category,
      date,
      note,
      source,
    };
    if (initial) {
      await api.patch(`/transactions/${initial._id}`, payload);
    } else {
      await api.post('/transactions', payload);
    }
    onDone?.() ?? router.push('/transactions');
  };

  return (
    <Card tilt={false}>
      <form className="space-y-4" onSubmit={submit}>
        <label className="block text-sm">
          <span className="text-ink-muted">Amount</span>
          <input
            required
            type="number"
            step="0.01"
            className="mt-1 w-full rounded-xl border border-ink/15 bg-transparent px-3 py-2 text-sm dark:border-white/15"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="text-ink-muted">Type</span>
          <select
            className="mt-1 w-full rounded-xl border border-ink/15 bg-transparent px-3 py-2 text-sm dark:border-white/15"
            value={type}
            onChange={(e) => setType(e.target.value as 'income' | 'expense')}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-ink-muted">Category</span>
          <select
            className="mt-1 w-full rounded-xl border border-ink/15 bg-transparent px-3 py-2 text-sm dark:border-white/15"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-ink-muted">Date</span>
          <input
            required
            type="date"
            className="mt-1 w-full rounded-xl border border-ink/15 bg-transparent px-3 py-2 text-sm dark:border-white/15"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="text-ink-muted">Note</span>
          <input
            className="mt-1 w-full rounded-xl border border-ink/15 bg-transparent px-3 py-2 text-sm dark:border-white/15"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="text-ink-muted">Source</span>
          <select
            className="mt-1 w-full rounded-xl border border-ink/15 bg-transparent px-3 py-2 text-sm dark:border-white/15"
            value={source}
            onChange={(e) => setSource(e.target.value as 'manual' | 'connected')}
          >
            <option value="manual">Manual</option>
            <option value="connected">Connected</option>
          </select>
        </label>
        <Button type="submit" className="w-full">
          Save
        </Button>
      </form>
    </Card>
  );
}
