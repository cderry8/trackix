'use client';

import { TransactionForm } from '@/features/transactions/TransactionForm';
import { api } from '@/lib/api';
import type { Transaction } from '@/types';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditTransactionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [tx, setTx] = useState<Transaction | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/transactions/${id}`);
      setTx(data);
    })().catch(() => setTx(null));
  }, [id]);

  if (!tx) {
    return <div className="h-24 skeleton" />;
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-2xl font-semibold">Edit transaction</h1>
      <TransactionForm
        initial={tx}
        onDone={() => router.push('/transactions')}
      />
    </div>
  );
}
