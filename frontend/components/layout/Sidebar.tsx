'use client';

import { useAuth } from '@/features/auth/AuthProvider';
import { cn } from '@/lib/cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Wallet,
  Tags,
  PiggyBank,
  Target,
  Sparkles,
  Link2,
  Settings,
  Shield,
  Users,
  LineChart,
  ScrollText,
} from 'lucide-react';

type Item = { href: string; label: string; icon: React.ElementType };

const userNav: Item[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', icon: Wallet },
  { href: '/categories', label: 'Categories', icon: Tags },
  { href: '/budgets', label: 'Budgets', icon: PiggyBank },
  { href: '/goals', label: 'Goals', icon: Target },
  { href: '/ai', label: 'AI Insights', icon: Sparkles },
  { href: '/connect', label: 'Connections', icon: Link2 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const adminNav: Item[] = [
  { href: '/admin', label: 'Overview', icon: Shield },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/analytics', label: 'Analytics', icon: LineChart },
  { href: '/admin/logs', label: 'Logs', icon: ScrollText },
];

export function Sidebar({ admin }: { admin?: boolean }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const items = admin ? adminNav : userNav;

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-ink/10 bg-surface/60 py-6 backdrop-blur-xl dark:border-white/10 dark:bg-black/35 md:flex">
      <div className="px-5 pb-6">
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">Trackix</div>
        <div className="text-lg font-semibold">{admin ? 'Control' : 'Finance OS'}</div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition',
                active
                  ? 'bg-ink text-surface dark:bg-white dark:text-black'
                  : 'text-ink-muted hover:bg-ink/5 dark:hover:bg-white/5'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      {!admin && user?.role === 'admin' ? (
        <div className="px-4 pt-4">
          <Link
            href="/admin"
            className="text-xs text-ink-muted underline-offset-4 hover:underline"
          >
            Go to admin
          </Link>
        </div>
      ) : null}
      {admin ? (
        <div className="px-4 pt-4">
          <Link href="/dashboard" className="text-xs text-ink-muted underline-offset-4 hover:underline">
            Back to app
          </Link>
        </div>
      ) : null}
    </aside>
  );
}
