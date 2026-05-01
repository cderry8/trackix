'use client';

import { Card } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

type Log = { _id: string; action: string; details: string; createdAt: string };

export default function AdminLogsPage() {
  const [items, setItems] = useState<Log[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/admin/logs');
      setItems(data);
    })().catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Audit logs</h1>
        <p className="text-sm text-ink-muted">Administrative actions</p>
      </div>
      <Card tilt={false}>
        <div className="space-y-2 text-sm">
          {items.map((l) => (
            <div key={l._id} className="flex flex-wrap justify-between gap-2 border-b border-ink/10 pb-2 last:border-0 dark:border-white/10">
              <div>
                <span className="font-mono text-xs uppercase text-accent-dim dark:text-accent">{l.action}</span>
                <div className="text-ink-muted">{l.details}</div>
              </div>
              <div className="text-xs text-ink-muted">{format(new Date(l.createdAt), 'PPpp')}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
