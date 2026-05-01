'use client';

import { Card } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

type Stats = { totalUsers: number; activeUsers: number; totalTransactions: number };

export default function AdminHomePage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/admin/stats');
      setStats(data);
    })().catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin overview</h1>
        <p className="text-sm text-ink-muted">Platform pulse and governance</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card tilt={false}>
          <div className="text-xs uppercase text-ink-muted">Users</div>
          <div className="mt-2 font-mono text-3xl">{stats?.totalUsers ?? '—'}</div>
        </Card>
        <Card tilt={false}>
          <div className="text-xs uppercase text-ink-muted">Active</div>
          <div className="mt-2 font-mono text-3xl">{stats?.activeUsers ?? '—'}</div>
        </Card>
        <Card tilt={false}>
          <div className="text-xs uppercase text-ink-muted">Transactions</div>
          <div className="mt-2 font-mono text-3xl">{stats?.totalTransactions ?? '—'}</div>
        </Card>
      </div>
    </div>
  );
}
