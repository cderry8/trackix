'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { api } from '@/lib/api';
import type { Category } from '@/types';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FolderOpen } from 'lucide-react';

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    const { data } = await api.get('/categories');
    setItems(data);
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      await api.post('/categories', { name });
      setName('');
      await load();
    } finally {
      setIsAdding(false);
    }
  };

  const del = async (id: string) => {
    setDeletingId(id);
    try {
      await api.delete(`/categories/${id}`);
      await load();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Categories</h1>
        <p className="text-sm text-ink-muted">Organize streams of spend and income</p>
      </div>
      <Card tilt={false}>
        <form className="flex flex-wrap gap-2" onSubmit={add}>
          <input
            placeholder="New category"
            className="min-w-[200px] flex-1 rounded-xl border border-ink/15 bg-transparent px-3 py-2 text-sm dark:border-white/15"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Button type="submit" loading={isAdding}>Add</Button>
        </form>
      </Card>
      {items.length === 0 ? (
        <Card tilt={false} className="py-12">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ink/5 dark:bg-white/5">
              <FolderOpen className="h-8 w-8 text-ink-muted" />
            </div>
            <h3 className="mt-4 font-semibold">No categories yet</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">
              Create categories to organize your income and expenses. Default categories will be provided automatically.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {items.map((c, i) => (
            <motion.div key={c._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card tilt={false} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{c.name}</div>
                  {c.isDefault ? <div className="text-xs text-ink-muted">Default</div> : null}
                </div>
                {!c.isDefault ? (
                  <button
                    type="button"
                    className="text-xs text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => del(c._id)}
                    disabled={deletingId === c._id}
                  >
                    {deletingId === c._id ? 'Removing...' : 'Remove'}
                  </button>
                ) : null}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
