import { Goal } from '../models/Goal.js';
import { buildInsights } from '../services/aiService.js';
import { User } from '../models/User.js';
import { Transaction } from '../models/Transaction.js';
import { Budget } from '../models/Budget.js';
export async function list(req, res) {
  const items = await Goal.find({ userId: req.user.id }).sort({ createdAt: -1 });
  return res.json(items);
}

export async function create(req, res) {
  const { title, targetAmount, currentAmount, deadline } = req.body;
  if (!title || targetAmount == null) return res.status(400).json({ message: 'title and targetAmount required' });
  const g = await Goal.create({
    userId: req.user.id,
    title,
    targetAmount: Number(targetAmount),
    currentAmount: currentAmount != null ? Number(currentAmount) : 0,
    deadline: deadline ? new Date(deadline) : null,
  });
  return res.status(201).json(g);
}

export async function update(req, res) {
  const g = await Goal.findOne({ _id: req.params.id, userId: req.user.id });
  if (!g) return res.status(404).json({ message: 'Not found' });
  const { title, targetAmount, currentAmount, deadline } = req.body;
  if (title !== undefined) g.title = title;
  if (targetAmount != null) g.targetAmount = Number(targetAmount);
  if (currentAmount != null) g.currentAmount = Number(currentAmount);
  if (deadline !== undefined) g.deadline = deadline ? new Date(deadline) : null;
  await g.save();
  return res.json(g);
}

export async function remove(req, res) {
  const g = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!g) return res.status(404).json({ message: 'Not found' });
  return res.json({ ok: true });
}

export async function savingsPlan(req, res) {
  const g = await Goal.findOne({ _id: req.params.id, userId: req.user.id });
  if (!g) return res.status(404).json({ message: 'Not found' });
  const user = await User.findById(req.user.id);
  const currency = user.preferredCurrency || 'USD';
  const since = new Date(Date.now() - 90 * 864e5);
  const txs = await Transaction.find({ userId: req.user.id, date: { $gte: since } });
  const budgets = await Budget.find({ userId: req.user.id });
  const analysis = buildInsights({ transactions: txs.map((t) => t.toObject()), budgets, goals: [g.toObject()], currency });
  const left = Math.max(0, g.targetAmount - g.currentAmount);
  const months = g.deadline
    ? Math.max(1, Math.ceil((new Date(g.deadline) - Date.now()) / (30 * 864e5)))
    : 6;
  const monthly = left / months;
  return res.json({
    goalId: g._id,
    remaining: left,
    suggestedMonthly: round2(monthly),
    months,
    aiNote: analysis.recommendations[0] || null,
  });
}

function round2(n) {
  return Math.round(n * 100) / 100;
}
