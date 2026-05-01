import { Transaction } from '../models/Transaction.js';

const MERCHANTS = ['Coffee Hub', 'Fuel Station', 'Grocery Mart', 'Restaurant Zen', 'Streaming Plus'];
const CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping'];

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function generateSimulatedTransactions(userId, connectionType, count = 5) {
  const docs = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 10);
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    const amount = Math.round((10 + Math.random() * 120) * 100) / 100;
    docs.push({
      userId,
      amount,
      type: Math.random() > 0.85 ? 'income' : 'expense',
      category: randomPick(CATEGORIES),
      date: d,
      note: `${randomPick(MERCHANTS)} • synced`,
      source: 'connected',
      connectionType,
    });
  }
  await Transaction.insertMany(docs);
  return docs.length;
}
