'use client';

import { TransactionForm } from '@/features/transactions/TransactionForm';

export default function NewTransactionPage() {
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-2xl font-semibold">New transaction</h1>
      <TransactionForm />
    </div>
  );
}
