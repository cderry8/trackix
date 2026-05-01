import mongoose from 'mongoose';
import { Transaction } from '../models/Transaction.js';
import { User } from '../models/User.js';

function uid(req) {
  return new mongoose.Types.ObjectId(req.user.id);
}

export async function summary(req, res) {
  const user = await User.findById(req.user.id);
  const currency = user.preferredCurrency || 'USD';
  const since = new Date(Date.now() - 30 * 864e5);
  const txs = await Transaction.find({ userId: req.user.id, date: { $gte: since } });

  let income = 0;
  let expense = 0;
  for (const t of txs) {
    const a = t.amount;
    if (t.type === 'income') income += a;
    else expense += a;
  }
  const balance = income - expense;
  const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;

  return res.json({
    currency,
    periodDays: 30,
    totalBalance: round2(balance),
    income: round2(income),
    expenses: round2(expense),
    savingsRate: round2(savingsRate),
  });
}

export async function categoryBreakdown(req, res) {
  const since = new Date(Date.now() - 30 * 864e5);
  const agg = await Transaction.aggregate([
    { $match: { userId: uid(req), type: 'expense', date: { $gte: since } } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
    { $sort: { total: -1 } },
  ]);
  return res.json(agg.map((x) => ({ category: x._id, amount: x.total })));
}

export async function monthlyTrend(req, res) {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);
  const match = { userId: uid(req), date: { $gte: sixMonthsAgo } };
  const agg = await Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: { y: { $year: '$date' }, m: { $month: '$date' }, t: '$type' },
        total: { $sum: '$amount' },
      },
    },
    { $sort: { '_id.y': 1, '_id.m': 1 } },
  ]);
  const map = {};
  for (const row of agg) {
    const key = `${row._id.y}-${String(row._id.m).padStart(2, '0')}`;
    if (!map[key]) map[key] = { month: key, income: 0, expense: 0 };
    if (row._id.t === 'income') map[key].income = row.total;
    else map[key].expense = row.total;
  }
  return res.json(Object.values(map));
}

export async function incomeVsExpense(req, res) {
  return monthlyTrend(req, res);
}

export async function heatmap(req, res) {
  const year = Number(req.query.year) || new Date().getFullYear();
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);
  const agg = await Transaction.aggregate([
    {
      $match: {
        userId: uid(req),
        type: 'expense',
        date: { $gte: start, $lt: end },
      },
    },
    {
      $group: {
        _id: { d: { $dateToString: { format: '%Y-%m-%d', date: '$date' } } },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);
  return res.json(agg.map((x) => ({ date: x._id.d, amount: x.total, count: x.count })));
}

export async function projection(req, res) {
  const user = await User.findById(req.user.id);
  const currency = user.preferredCurrency || 'USD';
  const since = new Date(Date.now() - 90 * 864e5);
  const txs = await Transaction.find({ userId: req.user.id, date: { $gte: since } });
  let income = 0;
  let expense = 0;
  for (const t of txs) {
    if (t.type === 'income') income += t.amount;
    else expense += t.amount;
  }
  const monthlyNet = (income - expense) / 3;
  const points = [];
  let acc = 0;
  for (let i = 1; i <= 6; i++) {
    acc += monthlyNet;
    points.push({ month: i, projectedSavings: round2(acc), currency });
  }
  return res.json({
    monthlyNet: round2(monthlyNet),
    months: 6,
    points,
    disclaimer: 'Mock projection from last 90 days.',
  });
}

function round2(n) {
  return Math.round(n * 100) / 100;
}
