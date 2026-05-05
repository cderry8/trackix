'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { api } from '@/lib/api';
import type { Subscription } from '@/types';
import { format, differenceInDays } from 'date-fns';
import { useEffect, useState } from 'react';
import {
  Plus,
  CreditCard,
  Calendar,
  Trash2,
  Pause,
  Play,
  ExternalLink,
  Receipt,
  TrendingUp,
  AlertCircle,
  X,
  Save,
} from 'lucide-react';
import { cn } from '@/lib/cn';

const PROVIDER_ICONS: Record<string, string> = {
  netflix: '🎬',
  spotify: '🎵',
  youtube: '▶️',
  amazon: '📦',
  aws: '☁️',
  github: '💻',
  notion: '📝',
  figma: '🎨',
  adobe: '🎭',
  microsoft: '🪟',
  apple: '🍎',
  google: '🔍',
  disney: '✨',
  hulu: '📺',
  default: '💳',
};

const FREQUENCY_MULTIPLIER: Record<string, number> = {
  weekly: 4.33,
  monthly: 1,
  quarterly: 0.33,
  yearly: 0.083,
};

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [summary, setSummary] = useState({
    monthlyTotal: 0,
    yearlyTotal: 0,
    subscriptionCount: 0,
    upcomingRenewals: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    provider: '',
    amount: '',
    currency: 'USD',
    frequency: 'monthly',
    nextBillingDate: '',
    category: 'entertainment',
    website: '',
    color: '#60a5fa',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [subsRes, summaryRes] = await Promise.all([
        api.get('/subscriptions'),
        api.get('/subscriptions/summary'),
      ]);
      setSubscriptions(subsRes.data);
      setSummary(summaryRes.data);
    } finally {
      setLoading(false);
    }
  };

  const getProviderIcon = (provider: string) => {
    const key = provider.toLowerCase();
    return PROVIDER_ICONS[key] || PROVIDER_ICONS.default;
  };

  const getMonthlyCost = (sub: Subscription) => {
    return sub.amount * (FREQUENCY_MULTIPLIER[sub.frequency] || 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.patch(`/subscriptions/${editingId}`, {
          ...formData,
          amount: Number(formData.amount),
        });
      } else {
        await api.post('/subscriptions', {
          ...formData,
          amount: Number(formData.amount),
        });
      }
      setShowAddModal(false);
      setEditingId(null);
      resetForm();
      loadData();
    } catch (err) {
      alert('Failed to save subscription');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      provider: '',
      amount: '',
      currency: 'USD',
      frequency: 'monthly',
      nextBillingDate: '',
      category: 'entertainment',
      website: '',
      color: '#60a5fa',
    });
  };

  const handleEdit = (sub: Subscription) => {
    setEditingId(sub._id);
    setFormData({
      name: sub.name,
      provider: sub.provider,
      amount: String(sub.amount),
      currency: sub.currency,
      frequency: sub.frequency,
      nextBillingDate: sub.nextBillingDate.slice(0, 10),
      category: sub.category,
      website: sub.website || '',
      color: sub.color || '#60a5fa',
    });
    setShowAddModal(true);
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) return;
    try {
      await api.post(`/subscriptions/${id}/cancel`);
      loadData();
    } catch (err) {
      alert('Failed to cancel subscription');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscription?')) return;
    try {
      await api.delete(`/subscriptions/${id}`);
      loadData();
    } catch (err) {
      alert('Failed to delete subscription');
    }
  };

  const activeSubscriptions = subscriptions.filter((s) => s.status === 'active');
  const cancelledSubscriptions = subscriptions.filter((s) => s.status === 'cancelled');

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Subscriptions</h1>
          <p className="text-sm text-ink-muted">Track and manage your recurring payments</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Subscription
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card tilt={false} className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <Receipt className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">${summary.monthlyTotal.toFixed(2)}</p>
              <p className="text-xs text-ink-muted">Monthly Cost</p>
            </div>
          </div>
        </Card>
        <Card tilt={false} className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">${summary.yearlyTotal.toFixed(2)}</p>
              <p className="text-xs text-ink-muted">Yearly Cost</p>
            </div>
          </div>
        </Card>
        <Card tilt={false} className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
              <CreditCard className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{summary.subscriptionCount}</p>
              <p className="text-xs text-ink-muted">Active Subs</p>
            </div>
          </div>
        </Card>
        <Card tilt={false} className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
              <AlertCircle className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{summary.upcomingRenewals}</p>
              <p className="text-xs text-ink-muted">Due This Week</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Subscriptions */}
      <Card tilt={false}>
        <div className="border-b border-ink/10 p-4 dark:border-white/10">
          <h2 className="font-semibold">Active Subscriptions</h2>
        </div>
        <div className="divide-y divide-ink/10 dark:divide-white/10">
          {loading ? (
            <div className="p-8 text-center text-ink-muted">Loading...</div>
          ) : activeSubscriptions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-ink-muted">No active subscriptions</p>
              <Button variant="ghost" className="mt-2" onClick={() => setShowAddModal(true)}>
                Add your first subscription
              </Button>
            </div>
          ) : (
            activeSubscriptions.map((sub) => {
              const daysUntil = differenceInDays(new Date(sub.nextBillingDate), new Date());
              const monthlyCost = getMonthlyCost(sub);

              return (
                <div key={sub._id} className="flex items-center justify-between p-4 hover:bg-ink/5 dark:hover:bg-white/5">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                      style={{ backgroundColor: `${sub.color || '#60a5fa'}20` }}
                    >
                      {getProviderIcon(sub.provider)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{sub.name}</p>
                        <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-500">Active</span>
                        {daysUntil <= 7 && daysUntil >= 0 && (
                          <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-xs text-orange-500">
                            Due in {daysUntil}d
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-ink-muted">
                        {sub.provider} • ${sub.amount.toFixed(2)}/{sub.frequency} • ${monthlyCost.toFixed(2)}/mo
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-ink-muted">
                        <Calendar className="h-3 w-3" />
                        Next: {format(new Date(sub.nextBillingDate), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {sub.website && (
                      <a href={sub.website} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" className="!p-2">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
                    <Button variant="ghost" className="!p-2" onClick={() => handleEdit(sub)}>
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" className="!p-2 text-orange-500" onClick={() => handleCancel(sub._id)}>
                      <Pause className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" className="!p-2 text-red-500" onClick={() => handleDelete(sub._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Cancelled Subscriptions */}
      {cancelledSubscriptions.length > 0 && (
        <Card tilt={false}>
          <div className="border-b border-ink/10 p-4 dark:border-white/10">
            <h2 className="font-semibold text-ink-muted">Cancelled Subscriptions</h2>
          </div>
          <div className="divide-y divide-ink/10 opacity-60 dark:divide-white/10">
            {cancelledSubscriptions.map((sub) => (
              <div key={sub._id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                    style={{ backgroundColor: `${sub.color || '#60a5fa'}20` }}
                  >
                    {getProviderIcon(sub.provider)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{sub.name}</p>
                      <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs text-red-500">Cancelled</span>
                    </div>
                    <p className="text-sm text-ink-muted">
                      {sub.provider} • Was ${sub.amount.toFixed(2)}/{sub.frequency}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" className="!p-2 text-red-500" onClick={() => handleDelete(sub._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg">
            <div className="flex items-center justify-between border-b border-ink/10 p-4 dark:border-white/10">
              <h3 className="font-semibold">{editingId ? 'Edit Subscription' : 'Add Subscription'}</h3>
              <Button variant="ghost" className="!p-2" onClick={() => { setShowAddModal(false); setEditingId(null); resetForm(); }}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm">
                    <span className="text-ink-muted">Name</span>
                    <input
                      required
                      type="text"
                      className="mt-1 w-full rounded-xl border border-ink/15 bg-transparent px-3 py-2 text-sm dark:border-white/15"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Netflix Premium"
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-sm">
                    <span className="text-ink-muted">Provider</span>
                    <input
                      required
                      type="text"
                      className="mt-1 w-full rounded-xl border border-ink/15 bg-transparent px-3 py-2 text-sm dark:border-white/15"
                      value={formData.provider}
                      onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                      placeholder="Netflix"
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-sm">
                    <span className="text-ink-muted">Amount</span>
                    <input
                      required
                      type="number"
                      step="0.01"
                      className="mt-1 w-full rounded-xl border border-ink/15 bg-transparent px-3 py-2 text-sm dark:border-white/15"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="15.99"
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-sm">
                    <span className="text-ink-muted">Currency</span>
                    <select
                      className="mt-1 w-full rounded-xl border border-ink/15 bg-transparent px-3 py-2 text-sm dark:border-white/15"
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    >
                      {['USD', 'EUR', 'GBP', 'RWF'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div>
                  <label className="block text-sm">
                    <span className="text-ink-muted">Frequency</span>
                    <select
                      className="mt-1 w-full rounded-xl border border-ink/15 bg-transparent px-3 py-2 text-sm dark:border-white/15"
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </label>
                </div>
                <div>
                  <label className="block text-sm">
                    <span className="text-ink-muted">Next Billing Date</span>
                    <input
                      required
                      type="date"
                      className="mt-1 w-full rounded-xl border border-ink/15 bg-transparent px-3 py-2 text-sm dark:border-white/15"
                      value={formData.nextBillingDate}
                      onChange={(e) => setFormData({ ...formData, nextBillingDate: e.target.value })}
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-sm">
                    <span className="text-ink-muted">Category</span>
                    <select
                      className="mt-1 w-full rounded-xl border border-ink/15 bg-transparent px-3 py-2 text-sm dark:border-white/15"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="entertainment">Entertainment</option>
                      <option value="productivity">Productivity</option>
                      <option value="utilities">Utilities</option>
                      <option value="cloud">Cloud Services</option>
                      <option value="health">Health & Fitness</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                </div>
                <div>
                  <label className="block text-sm">
                    <span className="text-ink-muted">Website (optional)</span>
                    <input
                      type="url"
                      className="mt-1 w-full rounded-xl border border-ink/15 bg-transparent px-3 py-2 text-sm dark:border-white/15"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://..."
                    />
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="ghost" className="flex-1" onClick={() => { setShowAddModal(false); setEditingId(null); resetForm(); }}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingId ? 'Save Changes' : 'Add Subscription'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
