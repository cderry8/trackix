import { Transaction } from '../models/Transaction.js';
import { Budget } from '../models/Budget.js';
import { Goal } from '../models/Goal.js';
import { Insight } from '../models/Insight.js';
import { User } from '../models/User.js';
import { buildInsights, computeHealthScore } from '../services/aiService.js';

export async function insights(req, res) {
  const user = await User.findById(req.user.id);
  const currency = user.preferredCurrency || 'USD';
  const since = new Date(Date.now() - 30 * 864e5);
  const txs = await Transaction.find({ userId: req.user.id, date: { $gte: since } });
  const budgets = await Budget.find({ userId: req.user.id });
  const goals = await Goal.find({ userId: req.user.id });
  const content = buildInsights({
    transactions: txs.map((t) => t.toObject()),
    budgets: budgets.map((b) => b.toObject()),
    goals: goals.map((g) => g.toObject()),
    currency,
  });
  const healthScore = computeHealthScore({ transactions: txs.map((t) => t.toObject()) });
  const saved = await Insight.create({
    userId: req.user.id,
    content,
    period: 'weekly',
  });
  return res.json({
    ...content,
    healthScore,
    savedAt: saved.createdAt,
    explain: req.body?.explain
      ? `Based on your last 30 days in ${currency}: patterns reflect category concentration and savings rate vs income.`
      : undefined,
  });
}

export async function weeklyReport(req, res) {
  return insights(req, res);
}
