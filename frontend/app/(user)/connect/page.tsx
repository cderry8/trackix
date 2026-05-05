'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';
import { api } from '@/lib/api';
import type { UserConnection } from '@/types';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  CreditCard,
  Landmark,
  Lock,
  Plus,
  RefreshCw,
  Trash2,
  Wallet,
  X,
} from 'lucide-react';

const BANKS = [
  { id: 'bk', name: 'Bank of Kigali', icon: Landmark },
  { id: 'bpr', name: 'BPR Bank', icon: Building2 },
  { id: 'im', name: 'I&M Bank', icon: Building2 },
  { id: 'equity', name: 'Equity Bank', icon: Building2 },
  { id: 'cogebanque', name: 'COGEBANQUE', icon: Building2 },
  { id: 'gt', name: 'GTBank', icon: Building2 },
  { id: 'access', name: 'Access Bank', icon: Building2 },
  { id: 'kcb', name: 'KCB Rwanda', icon: Building2 },
];

export default function ConnectPage() {
  const [items, setItems] = useState<UserConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  // Form states
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    try {
      const { data } = await api.get('/connections');
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleConnect = async () => {
    if (!selectedBank || !accountNumber || !accountName) return;

    setConnecting(true);
    try {
      await api.post('/connections/connect', {
        type: 'bank',
        bankId: selectedBank,
        accountNumber,
        accountName,
        phoneNumber,
      });
      setShowAddModal(false);
      setSelectedBank(null);
      setAccountNumber('');
      setAccountName('');
      setPhoneNumber('');
      await load();
    } catch (err) {
      console.error('Connection failed:', err);
    } finally {
      setConnecting(false);
    }
  };

  const sync = async (id: string) => {
    setSyncingId(id);
    try {
      await api.post(`/connections/${id}/sync`);
      await load();
    } finally {
      setSyncingId(null);
    }
  };

  const disconnect = async (id: string) => {
    if (!confirm('Are you sure you want to disconnect this bank account?')) return;
    setDeletingId(id);
    try {
      await api.post(`/connections/${id}/disconnect`);
      await load();
    } finally {
      setDeletingId(null);
    }
  };

  const selectedBankData = BANKS.find((b) => b.id === selectedBank);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Connected Banks</h1>
          <p className="text-sm text-ink-muted">Link your bank accounts to track transactions automatically</p>
        </div>
        <Button type="button" onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Connect Bank
        </Button>
      </div>

      {/* Empty State */}
      {items.length === 0 && !loading && (
        <Card tilt={false} className="py-12">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ink/5 dark:bg-white/5">
              <Wallet className="h-8 w-8 text-ink-muted" />
            </div>
            <h3 className="mt-4 font-semibold">No bank accounts connected</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">
              Connect your bank accounts to automatically import transactions and keep your finances up to date.
            </p>
            <Button type="button" className="mt-4" onClick={() => setShowAddModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Connect Your First Bank
            </Button>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-dim border-t-transparent dark:border-accent" />
        </div>
      )}

      {/* Connected Banks List */}
      {!loading && items.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((c) => {
            const BankIcon = BANKS.find((b) => b.id === c.bankId)?.icon || Building2;
            return (
              <Card key={c._id} tilt={false}>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-dim/10 dark:bg-accent/10">
                    <BankIcon className="h-6 w-6 text-accent-dim dark:text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{c.displayName || c.bankName || 'Bank Account'}</div>
                    <div className="mt-1 text-sm text-ink-muted">
                      Account: ****{c.accountNumber?.slice(-4) || '0000'}
                    </div>
                    <div className="mt-1 text-xs text-ink-muted">
                      Status: <span className={cn(
                        'font-medium',
                        c.status === 'connected' ? 'text-green-500' : 'text-yellow-500'
                      )}>{c.status}</span>
                    </div>
                    {c.lastSyncedAt ? (
                      <div className="text-xs text-ink-muted">
                        Last sync: {format(new Date(c.lastSyncedAt), 'MMM d, h:mm a')}
                      </div>
                    ) : (
                      <div className="text-xs text-ink-muted">Not synced yet</div>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="!text-xs"
                    onClick={() => sync(c._id)}
                    disabled={c.status !== 'connected' || syncingId === c._id}
                    loading={syncingId === c._id}
                  >
                    <RefreshCw className="mr-1 h-3 w-3" />
                    Sync
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="!text-xs text-red-500 hover:bg-red-500/10"
                    onClick={() => disconnect(c._id)}
                    loading={deletingId === c._id}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Disconnect
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Bank Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-lg rounded-2xl border border-ink/10 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Connect Bank Account</h2>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="rounded-full p-1 text-ink-muted transition hover:bg-ink/10 hover:text-ink dark:hover:bg-white/10"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {!selectedBank ? (
                  <div className="mt-6">
                    <p className="text-sm text-ink-muted">Select your bank</p>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {BANKS.map((bank) => (
                        <button
                          key={bank.id}
                          type="button"
                          onClick={() => setSelectedBank(bank.id)}
                          className="flex items-center gap-3 rounded-xl border border-ink/10 p-3 transition hover:border-accent-dim hover:bg-accent-dim/5 dark:border-white/10 dark:hover:border-accent dark:hover:bg-accent/5"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-dim/10 dark:bg-accent/10">
                            <bank.icon className="h-5 w-5 text-accent-dim dark:text-accent" />
                          </div>
                          <span className="text-sm font-medium">{bank.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-3 rounded-xl bg-accent-dim/5 p-3 dark:bg-accent/5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-dim/10 dark:bg-accent/10">
                        {selectedBankData && <selectedBankData.icon className="h-5 w-5 text-accent-dim dark:text-accent" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{selectedBankData?.name}</p>
                        <button
                          type="button"
                          onClick={() => setSelectedBank(null)}
                          className="text-xs text-accent-dim hover:underline dark:text-accent"
                        >
                          Change bank
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Account Number</label>
                      <div className="relative mt-1">
                        <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                        <input
                          type="text"
                          className="w-full rounded-xl border border-ink/15 bg-transparent py-2.5 pl-10 pr-4 text-sm outline-none focus:border-accent dark:border-white/15"
                          placeholder="Enter your account number"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Account Holder Name</label>
                      <div className="relative mt-1">
                        <Wallet className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                        <input
                          type="text"
                          className="w-full rounded-xl border border-ink/15 bg-transparent py-2.5 pl-10 pr-4 text-sm outline-none focus:border-accent dark:border-white/15"
                          placeholder="Full name as on bank account"
                          value={accountName}
                          onChange={(e) => setAccountName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Phone Number (Optional)</label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                        <input
                          type="tel"
                          className="w-full rounded-xl border border-ink/15 bg-transparent py-2.5 pl-10 pr-4 text-sm outline-none focus:border-accent dark:border-white/15"
                          placeholder="+250 78X XXX XXX"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                      </div>
                      <p className="mt-1 text-xs text-ink-muted">For transaction alerts and security</p>
                    </div>

                    <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3">
                      <p className="text-xs text-yellow-600 dark:text-yellow-400">
                        <strong>Note:</strong> Real bank connections require backend integration. This stores your connection details for future implementation.
                      </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        className="flex-1"
                        onClick={() => setSelectedBank(null)}
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        className="flex-1"
                        onClick={handleConnect}
                        loading={connecting}
                        disabled={!accountNumber || !accountName}
                      >
                        {connecting ? 'Connecting...' : 'Connect Account'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
