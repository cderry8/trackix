import { Budget } from '../models/Budget.js';
import { Transaction } from '../models/Transaction.js';

function monthStart(d) {
  const x = new Date(d);
  x.setDate(1);
  x.setHours(0, 0, 0, 0);
  return x;
}

export async function list(req, res) {
  const items = await Budget.find({ userId: req.user.id }).sort({ month: -1 });
  return res.json(items);
}

export async function create(req, res) {
  const { category, limit, month } = req.body;
  if (!category || limit == null || !month) {
    return res.status(400).json({ message: 'category, limit, month required' });
  }
  const m = monthStart(month);
  try {
    const b = await Budget.create({
      userId: req.user.id,
      category: String(category).trim(),
      limit: Number(limit),
      month: m,
    });
    return res.status(201).json(b);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: 'Budget exists for category/month' });
    throw e;
  }
}

export async function update(req, res) {
  const b = await Budget.findOne({ _id: req.params.id, userId: req.user.id });
  if (!b) return res.status(404).json({ message: 'Not found' });
  if (req.body.limit != null) b.limit = Number(req.body.limit);
  if (req.body.category) b.category = String(req.body.category).trim();
  if (req.body.month) b.month = monthStart(req.body.month);
  await b.save();
  return res.json(b);
}

export async function remove(req, res) {
  const b = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!b) return res.status(404).json({ message: 'Not found' });
  return res.json({ ok: true });
}

export async function usage(req, res) {
  const budgets = await Budget.find({ userId: req.user.id });
  const result = [];
  for (const b of budgets) {
    const start = monthStart(b.month);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
    const agg = await Transaction.aggregate([
      {
        $match: {
          userId: b.userId,
          type: 'expense',
          category: b.category,
          date: { $gte: start, $lt: end },
        },
      },
      { $group: { _id: null, spent: { $sum: '$amount' } } },
    ]);
    const spent = agg[0]?.spent || 0;
    result.push({
      budget: b,
      spent,
      remaining: b.limit - spent,
      percent: b.limit > 0 ? Math.min(100, (spent / b.limit) * 100) : 0,
    });
  }
  return res.json(result);
}
