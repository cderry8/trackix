'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { api } from '@/lib/api';
import type { User } from '@/types';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  const load = async () => {
    const { data } = await api.get('/admin/users');
    setUsers(data);
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const suspend = async (id: string) => {
    await api.post(`/admin/users/${id}/suspend`);
    await load();
  };

  const unsuspend = async (id: string) => {
    await api.post(`/admin/users/${id}/unsuspend`);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete user and related data?')) return;
    await api.delete(`/admin/users/${id}`);
    await load();
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-sm text-ink-muted">Lifecycle management</p>
      </div>
      <Card tilt={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-ink-muted">
              <tr>
                <th className="pb-2">Name</th>
                <th className="pb-2">Email</th>
                <th className="pb-2">Role</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Joined</th>
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-ink/10 dark:border-white/10">
                  <td className="py-2">{u.name}</td>
                  <td className="py-2">{u.email}</td>
                  <td className="py-2">{u.role}</td>
                  <td className="py-2">{u.suspended ? 'Suspended' : 'Active'}</td>
                  <td className="py-2 text-xs text-ink-muted">
                    {u.createdAt ? format(new Date(u.createdAt), 'yyyy-MM-dd') : '—'}
                  </td>
                  <td className="space-x-2 py-2 text-right">
                    {u.role !== 'admin' && u.suspended ? (
                      <Button type="button" variant="ghost" className="!px-2 !py-1 !text-xs" onClick={() => unsuspend(u._id)}>
                        Unsuspend
                      </Button>
                    ) : null}
                    {u.role !== 'admin' && !u.suspended ? (
                      <Button type="button" variant="ghost" className="!px-2 !py-1 !text-xs" onClick={() => suspend(u._id)}>
                        Suspend
                      </Button>
                    ) : null}
                    {u.role !== 'admin' ? (
                      <Button type="button" variant="danger" className="!px-2 !py-1 !text-xs" onClick={() => remove(u._id)}>
                        Delete
                      </Button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
