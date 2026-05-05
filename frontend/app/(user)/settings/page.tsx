'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/features/auth/AuthProvider';
import { useTheme } from '@/features/theme/ThemeProvider';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import {
  Moon,
  Sun,
  Bell,
  Wallet,
  Globe,
  Shield,
  Eye,
  EyeOff,
  Download,
  Trash2,
  Save,
  ChevronRight,
  Mail,
} from 'lucide-react';
import { cn } from '@/lib/cn';

export default function SettingsPage() {
  const { user, refreshMe } = useAuth();
  const { theme, toggle } = useTheme();
  const [currency, setCurrency] = useState('USD');
  const [isSaving, setIsSaving] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [transactionAlerts, setTransactionAlerts] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  useEffect(() => {
    if (user) {
      setCurrency(user.preferredCurrency || 'USD');
    }
  }, [user]);

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.patch('/users/me', { preferredCurrency: currency });
      await refreshMe();
    } finally {
      setIsSaving(false);
    }
  };

  const SettingRow = ({
    icon: Icon,
    title,
    description,
    action,
    danger,
  }: {
    icon: React.ElementType;
    title: string;
    description?: string;
    action: React.ReactNode;
    danger?: boolean;
  }) => (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', danger ? 'bg-red-500/10' : 'bg-accent-dim/10 dark:bg-accent/10')}>
          <Icon className={cn('h-5 w-5', danger ? 'text-red-500' : 'text-accent-dim dark:text-accent')} />
        </div>
        <div>
          <p className={cn('font-medium', danger && 'text-red-500')}>{title}</p>
          {description && <p className="text-xs text-ink-muted">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6 w-11 rounded-full transition-colors',
        checked ? 'bg-accent-dim dark:bg-accent' : 'bg-ink/20 dark:bg-white/20'
      )}
    >
      <span
        className={cn(
          'absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform',
          checked && 'translate-x-5'
        )}
      />
    </button>
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-ink-muted">Manage your preferences and app settings</p>
      </div>

      {/* Appearance */}
      <Card tilt={false}>
        <div className="border-b border-ink/10 p-4 dark:border-white/10">
          <div className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <h2 className="font-semibold">Appearance</h2>
          </div>
        </div>
        <div className="divide-y divide-ink/10 px-4 dark:divide-white/10">
          <SettingRow
            icon={theme === 'dark' ? Moon : Sun}
            title="Theme"
            description={theme === 'dark' ? 'Dark mode is on' : 'Light mode is on'}
            action={
              <Button type="button" variant="ghost" onClick={toggle} className="!text-xs">
                {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
              </Button>
            }
          />
          <SettingRow
            icon={Eye}
            title="Show Balance"
            description="Display amounts on dashboard"
            action={<Toggle checked={showBalance} onChange={setShowBalance} />}
          />
          <SettingRow
            icon={Wallet}
            title="Compact Mode"
            description="Smaller cards and tighter spacing"
            action={<Toggle checked={compactMode} onChange={setCompactMode} />}
          />
        </div>
      </Card>

      {/* Regional */}
      <Card tilt={false}>
        <div className="border-b border-ink/10 p-4 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <h2 className="font-semibold">Regional</h2>
          </div>
        </div>
        <div className="p-4">
          <form onSubmit={saveSettings} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-dim/10 dark:bg-accent/10">
                  <Wallet className="h-5 w-5 text-accent-dim dark:text-accent" />
                </div>
                <div>
                  <p className="font-medium">Currency</p>
                  <p className="text-xs text-ink-muted">Default currency for transactions</p>
                </div>
              </div>
              <select
                className="rounded-xl border border-ink/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-white/15"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                {[
                  { value: 'USD', label: 'USD ($) - US Dollar' },
                  { value: 'EUR', label: 'EUR (€) - Euro' },
                  { value: 'RWF', label: 'RWF (Fr) - Rwandan Franc' },
                  { value: 'GBP', label: 'GBP (£) - British Pound' },
                  { value: 'JPY', label: 'JPY (¥) - Japanese Yen' },
                ].map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" className="w-full" loading={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              Save Currency Preference
            </Button>
          </form>
        </div>
      </Card>

      {/* Notifications */}
      <Card tilt={false}>
        <div className="border-b border-ink/10 p-4 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <h2 className="font-semibold">Notifications</h2>
          </div>
        </div>
        <div className="divide-y divide-ink/10 px-4 dark:divide-white/10">
          <SettingRow
            icon={Mail}
            title="Email Notifications"
            description="Receive updates via email"
            action={<Toggle checked={emailNotifications} onChange={setEmailNotifications} />}
          />
          <SettingRow
            icon={Wallet}
            title="Budget Alerts"
            description="Warn when approaching budget limits"
            action={<Toggle checked={budgetAlerts} onChange={setBudgetAlerts} />}
          />
          <SettingRow
            icon={Download}
            title="Transaction Alerts"
            description="Notify on new transactions"
            action={<Toggle checked={transactionAlerts} onChange={setTransactionAlerts} />}
          />
        </div>
      </Card>

      {/* Privacy & Security */}
      <Card tilt={false}>
        <div className="border-b border-ink/10 p-4 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <h2 className="font-semibold">Privacy & Security</h2>
          </div>
        </div>
        <div className="divide-y divide-ink/10 px-4 dark:divide-white/10">
          <SettingRow
            icon={EyeOff}
            title="Hide Sensitive Data"
            description="Blur amounts in public"
            action={<Toggle checked={false} onChange={() => {}} />}
          />
          <SettingRow
            icon={Shield}
            title="Two-Factor Authentication"
            description="Add extra security layer"
            action={
              <Button type="button" variant="ghost" className="!text-xs">
                Setup <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            }
          />
        </div>
      </Card>

      {/* Data */}
      <Card tilt={false}>
        <div className="border-b border-ink/10 p-4 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            <h2 className="font-semibold">Data</h2>
          </div>
        </div>
        <div className="divide-y divide-ink/10 px-4 dark:divide-white/10">
          <SettingRow
            icon={Download}
            title="Export Data"
            description="Download all your transactions"
            action={
              <Button type="button" variant="ghost" className="!text-xs">
                Export CSV
              </Button>
            }
          />
          <SettingRow
            icon={Trash2}
            title="Delete Account"
            description="Permanently remove your data"
            danger
            action={
              <Button type="button" variant="ghost" className="!text-xs text-red-500 hover:bg-red-500/10">
                Delete
              </Button>
            }
          />
        </div>
      </Card>
    </div>
  );
}
