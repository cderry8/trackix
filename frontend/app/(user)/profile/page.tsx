'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/features/auth/AuthProvider';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  User,
  Mail,
  Calendar,
  Shield,
  CreditCard,
  Building2,
  Edit3,
  CheckCircle2,
  TrendingUp,
  Wallet,
  Target,
  FolderOpen,
  Bell,
  Lock,
  Smartphone,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

interface Stats {
  transactions: number;
  categories: number;
  budgets: number;
  goals: number;
  connections: number;
}

export default function ProfilePage() {
  const { user, refreshMe } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState<Stats>({
    transactions: 0,
    categories: 0,
    budgets: 0,
    goals: 0,
    connections: 0,
  });
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone('');
    }
  }, [user]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [transRes, catRes, budgetRes, goalRes, connRes] = await Promise.all([
          api.get('/transactions').catch(() => ({ data: [] })),
          api.get('/categories').catch(() => ({ data: [] })),
          api.get('/budgets').catch(() => ({ data: [] })),
          api.get('/goals').catch(() => ({ data: [] })),
          api.get('/connections').catch(() => ({ data: [] })),
        ]);

        setStats({
          transactions: transRes.data.length || 0,
          categories: catRes.data.length || 0,
          budgets: budgetRes.data.length || 0,
          goals: goalRes.data.length || 0,
          connections: connRes.data.length || 0,
        });
        setConnections(connRes.data || []);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.patch('/users/me', { name });
      await refreshMe();
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const statCards = [
    { icon: TrendingUp, label: 'Transactions', value: stats.transactions, color: 'bg-blue-500/10 text-blue-500' },
    { icon: FolderOpen, label: 'Categories', value: stats.categories, color: 'bg-purple-500/10 text-purple-500' },
    { icon: Wallet, label: 'Budgets', value: stats.budgets, color: 'bg-green-500/10 text-green-500' },
    { icon: Target, label: 'Goals', value: stats.goals, color: 'bg-orange-500/10 text-orange-500' },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-ink-muted">Manage your account and view your activity</p>
      </div>

      {/* Profile Card */}
      <Card tilt={false} className="overflow-hidden">
        <div className="relative">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-accent-dim/20 via-accent/20 to-accent-dim/20 dark:from-accent/30 dark:via-accent/20 dark:to-accent/30" />
          
          {/* Avatar */}
          <div className="relative -mt-12 px-6">
            <div className="flex items-end justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-accent-dim text-2xl font-bold text-white shadow-lg dark:border-zinc-900 dark:bg-accent">
                  {user ? getInitials(user.name) : '?'}
                </div>
                <div className="pb-2">
                  <h2 className="text-xl font-semibold">{user?.name}</h2>
                  <p className="text-sm text-ink-muted">{user?.email}</p>
                </div>
              </div>
              <div className="pb-2">
                {!isEditing ? (
                  <Button type="button" variant="ghost" onClick={() => setIsEditing(true)}>
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="p-6 pt-4">
          {isEditing ? (
            <form onSubmit={saveProfile} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium">
                    <span className="text-ink-muted">Full Name</span>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                      <input
                        type="text"
                        className="w-full rounded-xl border border-ink/15 bg-transparent py-2.5 pl-10 pr-4 text-sm outline-none focus:border-accent dark:border-white/15"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    <span className="text-ink-muted">Email</span>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                      <input
                        type="email"
                        disabled
                        className="w-full rounded-xl border border-ink/15 bg-ink/5 py-2.5 pl-10 pr-4 text-sm dark:border-white/15 dark:bg-white/5"
                        value={email}
                      />
                    </div>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    <span className="text-ink-muted">Phone Number</span>
                    <div className="relative mt-1">
                      <Smartphone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                      <input
                        type="tel"
                        className="w-full rounded-xl border border-ink/15 bg-transparent py-2.5 pl-10 pr-4 text-sm outline-none focus:border-accent dark:border-white/15"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+250 78X XXX XXX"
                      />
                    </div>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    <span className="text-ink-muted">Member Since</span>
                    <div className="relative mt-1">
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                      <input
                        type="text"
                        disabled
                        className="w-full rounded-xl border border-ink/15 bg-ink/5 py-2.5 pl-10 pr-4 text-sm dark:border-white/15 dark:bg-white/5"
                        value={user?.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : 'Unknown'}
                      />
                    </div>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" loading={isSaving}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink/5 dark:bg-white/5">
                  <User className="h-5 w-5 text-ink-muted" />
                </div>
                <div>
                  <p className="text-xs text-ink-muted">Full Name</p>
                  <p className="font-medium">{user?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink/5 dark:bg-white/5">
                  <Mail className="h-5 w-5 text-ink-muted" />
                </div>
                <div>
                  <p className="text-xs text-ink-muted">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink/5 dark:bg-white/5">
                  <Calendar className="h-5 w-5 text-ink-muted" />
                </div>
                <div>
                  <p className="text-xs text-ink-muted">Member Since</p>
                  <p className="font-medium">
                    {user?.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : 'Unknown'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink/5 dark:bg-white/5">
                  <Shield className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-ink-muted">Account Status</p>
                  <p className="font-medium text-green-500">Active</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        {statCards.map((stat, i) => (
          <Card key={stat.label} tilt={false} className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', stat.color)}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{loading ? '-' : stat.value}</p>
                <p className="text-xs text-ink-muted">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Connected Banks & Settings */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Connected Banks */}
        <Card tilt={false}>
          <div className="flex items-center justify-between border-b border-ink/10 p-4 dark:border-white/10">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-accent-dim dark:text-accent" />
              <h3 className="font-semibold">Connected Banks</h3>
            </div>
            <Link href="/connect">
              <Button type="button" variant="ghost" className="!text-xs">
                Manage
              </Button>
            </Link>
          </div>
          <div className="p-4">
            {connections.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-ink-muted">No banks connected yet</p>
                <Link href="/connect">
                  <Button type="button" variant="ghost" className="mt-2 !text-xs">
                    Connect a bank
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {connections.slice(0, 3).map((conn) => (
                  <div key={conn._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-dim/10 dark:bg-accent/10">
                        <CreditCard className="h-4 w-4 text-accent-dim dark:text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{conn.displayName || conn.bankName || 'Bank Account'}</p>
                        <p className="text-xs text-ink-muted">****{conn.accountNumber?.slice(-4) || '0000'}</p>
                      </div>
                    </div>
                    <div className={cn('h-2 w-2 rounded-full', conn.status === 'connected' ? 'bg-green-500' : 'bg-yellow-500')} />
                  </div>
                ))}
                {connections.length > 3 && (
                  <p className="text-center text-xs text-ink-muted">+{connections.length - 3} more</p>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Quick Settings */}
        <Card tilt={false}>
          <div className="flex items-center gap-2 border-b border-ink/10 p-4 dark:border-white/10">
            <Lock className="h-5 w-5 text-accent-dim dark:text-accent" />
            <h3 className="font-semibold">Account Settings</h3>
          </div>
          <div className="divide-y divide-ink/10 dark:divide-white/10">
            <Link href="/settings" className="flex items-center justify-between p-4 transition hover:bg-ink/5 dark:hover:bg-white/5">
              <div className="flex items-center gap-3">
                <Wallet className="h-4 w-4 text-ink-muted" />
                <span className="text-sm">Currency & Preferences</span>
              </div>
              <span className="text-xs text-ink-muted">→</span>
            </Link>
            <Link href="/notifications" className="flex items-center justify-between p-4 transition hover:bg-ink/5 dark:hover:bg-white/5">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-ink-muted" />
                <span className="text-sm">Notifications</span>
              </div>
              <span className="text-xs text-ink-muted">→</span>
            </Link>
            <Link href="/connect" className="flex items-center justify-between p-4 transition hover:bg-ink/5 dark:hover:bg-white/5">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-ink-muted" />
                <span className="text-sm">Security & Connections</span>
              </div>
              <span className="text-xs text-ink-muted">→</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
