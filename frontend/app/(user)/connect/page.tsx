'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { api } from '@/lib/api';
import type { UserConnection } from '@/types';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

export default function ConnectPage() {
  const [items, setItems] = useState<UserConnection[]>([]);

  const load = async () => {
    const { data } = await api.get('/connections');
    setItems(data);
  };

  useEffect(() => {
    load().catch(() => {});
    const t = setInterval(load, 2000);
    return () => clearInterval(t);
  }, []);

  const connect = async (type: 'mtn' | 'bank') => {
    await api.post('/connections/connect', { type });
    await load();
  };

  const sync = async (id: string) => {
    await api.post(`/connections/${id}/sync`);
    await load();
  };

  const disconnect = async (id: string) => {
    await api.post(`/connections/${id}/disconnect`);
    await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Connected sources</h1>
        <p className="text-sm text-ink-muted">Simulated MTN Mobile Money and bank feeds</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={() => connect('mtn')}>
          Connect MTN MoMo
        </Button>
        <Button type="button" variant="ghost" onClick={() => connect('bank')}>
          Connect bank
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((c) => (
          <Card key={c._id} tilt={false}>
            <div className="font-medium">{c.displayName || c.type}</div>
            <div className="mt-1 text-sm capitalize text-ink-muted">Status: {c.status}</div>
            {c.lastSyncedAt ? (
              <div className="text-xs text-ink-muted">Last sync {format(new Date(c.lastSyncedAt), 'PPpp')}</div>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="button" variant="ghost" className="!text-xs" onClick={() => sync(c._id)} disabled={c.status !== 'connected'}>
                Sync now
              </Button>
              <Button type="button" variant="ghost" className="!text-xs" onClick={() => disconnect(c._id)}>
                Disconnect
              </Button>
            </div>
          </Card>
        ))}
        {items.length === 0 ? (
          <Card tilt={false}>No connections yet - add a simulated source.</Card>
        ) : null}
      </div>
    </div>
  );
}
