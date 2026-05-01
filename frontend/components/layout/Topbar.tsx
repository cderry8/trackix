'use client';

import { useTheme } from '@/features/theme/ThemeProvider';
import { useAuth } from '@/features/auth/AuthProvider';
import { Bell, Moon, Sun, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { NotificationItem } from '@/types';
import { Button } from '../ui/Button';

export function Topbar({ admin }: { admin?: boolean }) {
  const { toggle, theme } = useTheme();
  const { user, logout } = useAuth();
  const [items, setItems] = useState<NotificationItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/notifications');
        setItems(data);
      } catch {
        /* noop */
      }
    })();
  }, []);

  const unread = items.filter((n) => !n.read).length;

  return (
    <header className="flex h-16 items-center justify-between border-b border-ink/10 px-6 dark:border-white/10">
      <div className="text-sm text-ink-muted">
        {admin ? 'Administrator' : `Hi, ${user?.name?.split(' ')[0] ?? ''}`}
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={admin ? '/admin/logs' : '/notifications'}
          className="relative rounded-lg p-2 hover:bg-ink/5 dark:hover:bg-white/5"
        >
          <Bell className="h-5 w-5" />
          {unread > 0 ? (
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-accent" />
          ) : null}
        </Link>
        <button
          type="button"
          onClick={toggle}
          className="rounded-lg p-2 hover:bg-ink/5 dark:hover:bg-white/5"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <Link
          href={user?.role === 'admin' && !admin ? '/admin' : '/settings'}
          className="hidden items-center gap-2 rounded-lg px-2 py-1 hover:bg-ink/5 sm:flex dark:hover:bg-white/5"
        >
          <UserCircle className="h-5 w-5" />
          <span className="text-sm">{user?.email}</span>
        </Link>
        <Button variant="ghost" className="!py-1.5 !text-xs" type="button" onClick={() => logout()}>
          Logout
        </Button>
      </div>
    </header>
  );
}
