'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { api } from '@/lib/api';
import type { Transaction } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function TransactionsPage() {
  const [items, setItems] = useState<Transaction[]>([]);

  const load = async () => {
    const { data } = await api.get('/transactions');
    setItems(data);
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const del = async (id: string) => {
    await api.delete(`/transactions/${id}`);
    setItems((x) => x.filter((t) => t._id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Transactions</h1>
          <p className="text-sm text-ink-muted">Manual and connected activity</p>
        </div>
        <Link href="/transactions/new">
          <Button type="button">Add transaction</Button>
        </Link>
      </div>
      <Card tilt={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-ink-muted">
              <tr>
                <th className="pb-2">Date</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Source</th>
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody>
              {items.map((t, i) => (
                <motion.tr
                  key={t._id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-t border-ink/10 dark:border-white/10"
                >
                  <td className="py-2 font-mono text-xs">{format(new Date(t.date), 'yyyy-MM-dd')}</td>
                  <td className="py-2 capitalize">{t.type}</td>
                  <td className="py-2">{t.category}</td>
                  <td className="py-2 font-mono">
                    {t.type === 'expense' ? '-' : '+'}
                    {t.amount.toFixed(2)}
                  </td>
                  <td className="py-2 text-ink-muted">{t.source}</td>
                  <td className="py-2 text-right">
                    <Link href={`/transactions/${t._id}`} className="mr-3 text-xs text-accent-dim dark:text-accent">
                      Edit
                    </Link>
                    <button type="button" className="text-xs text-red-500" onClick={() => del(t._id)}>
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
