'use client';

import { Card } from '@/components/ui/Card';
import { api } from '@/lib/api';
import type { NotificationItem } from '@/types';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);

  const load = async () => {
    const { data } = await api.get('/notifications');
    setItems(data);
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const read = async (id: string) => {
    await api.post(`/notifications/${id}/read`);
    await load();
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <p className="text-sm text-ink-muted">System, AI, and alert streams</p>
      </div>
      <div className="space-y-2">
        {items.map((n) => (
          <Card key={n._id} tilt={false} className={!n.read ? 'border-accent/40' : ''}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-medium">{n.title}</div>
                <div className="text-sm text-ink-muted">{n.body}</div>
                <div className="mt-1 text-xs text-ink-muted">{format(new Date(n.createdAt), 'PPpp')}</div>
              </div>
              {!n.read ? (
                <button type="button" className="text-xs text-accent-dim dark:text-accent" onClick={() => read(n._id)}>
                  Mark read
                </button>
              ) : null}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
