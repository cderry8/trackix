'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/features/auth/AuthProvider';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const { user, refreshMe } = useAuth();
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [rates, setRates] = useState<Record<string, number>>({});
  const [conv, setConv] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setCurrency(user.preferredCurrency || 'USD');
    }
  }, [user]);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/currency/rates');
      setRates(data);
    })().catch(() => {});
  }, []);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.patch('/users/me', { name, preferredCurrency: currency });
    await refreshMe();
  };

  const convert = async () => {
    const [amt, from, to] = conv.split(',').map((s) => s.trim());
    const { data } = await api.get('/currency/convert', { params: { amount: amt, from, to } });
    alert(`Result: ${data.result} ${to}`);
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-ink-muted">Profile and multi-currency (mock FX)</p>
      </div>
      <Card tilt={false}>
        <form className="space-y-4" onSubmit={saveProfile}>
          <label className="block text-sm">
            <span className="text-ink-muted">Name</span>
            <input
              className="mt-1 w-full rounded-xl border border-ink/15 bg-transparent px-3 py-2 text-sm dark:border-white/15"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="text-ink-muted">Preferred currency</span>
            <select
              className="mt-1 w-full rounded-xl border border-ink/15 bg-transparent px-3 py-2 text-sm dark:border-white/15"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {['USD', 'EUR', 'RWF'].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" className="w-full">
            Save
          </Button>
        </form>
      </Card>
      <Card tilt={false}>
        <div className="text-sm font-medium">Mock rates (vs USD)</div>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-ink/5 p-3 text-xs dark:bg-white/5">
          {JSON.stringify(rates, null, 2)}
        </pre>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            placeholder="100, USD, EUR"
            className="min-w-[200px] flex-1 rounded-xl border border-ink/15 bg-transparent px-3 py-2 text-sm dark:border-white/15"
            value={conv}
            onChange={(e) => setConv(e.target.value)}
          />
          <Button type="button" variant="ghost" onClick={convert}>
            Convert
          </Button>
        </div>
      </Card>
    </div>
  );
}
