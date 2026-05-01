import { Transaction } from '../models/Transaction.js';
import { Alert } from '../models/Alert.js';
import { Notification } from '../models/Notification.js';
import { Budget } from '../models/Budget.js';

export async function getOne(req, res) {
  const tx = await Transaction.findOne({ _id: req.params.id, userId: req.user.id });
  if (!tx) return res.status(404).json({ message: 'Not found' });
  return res.json(tx);
}

export async function list(req, res) {
  const { from, to, type, category, source } = req.query;
  const q = { userId: req.user.id };
  if (from || to) {
    q.date = {};
    if (from) q.date.$gte = new Date(from);
    if (to) q.date.$lte = new Date(to);
  }
  if (type) q.type = type;
  if (category) q.category = category;
  if (source) q.source = source;
  const items = await Transaction.find(q).sort({ date: -1 });
  return res.json(items);
}

export async function create(req, res) {
  const { amount, type, category, date, note, source, connectionType } = req.body;
  if (amount == null || !type || !category || !date) {
    return res.status(400).json({ message: 'amount, type, category, date required' });
  }
  const tx = await Transaction.create({
    userId: req.user.id,
    amount: Number(amount),
    type,
    category,
    date: new Date(date),
    note: note || '',
    source: source || 'manual',
    connectionType: source === 'connected' ? connectionType : undefined,
  });
  await checkUnusualAndBudget(req.user.id, tx);
  return res.status(201).json(tx);
}

export async function update(req, res) {
  const tx = await Transaction.findOne({ _id: req.params.id, userId: req.user.id });
  if (!tx) return res.status(404).json({ message: 'Not found' });
  const { amount, type, category, date, note, source, connectionType } = req.body;
  if (amount != null) tx.amount = Number(amount);
  if (type) tx.type = type;
  if (category) tx.category = category;
  if (date) tx.date = new Date(date);
  if (note !== undefined) tx.note = note;
  if (source) tx.source = source;
  if (connectionType !== undefined) tx.connectionType = connectionType;
  await tx.save();
  return res.json(tx);
}

export async function remove(req, res) {
  const tx = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!tx) return res.status(404).json({ message: 'Not found' });
  return res.json({ ok: true });
}

async function checkUnusualAndBudget(userId, tx) {
  if (tx.type !== 'expense') return;
  const recent = await Transaction.find({ userId, type: 'expense', date: { $gte: new Date(Date.now() - 30 * 864e5) } });
  const avg = recent.reduce((s, t) => s + t.amount, 0) / Math.max(recent.length, 1);
  if (recent.length > 2 && tx.amount > avg * 2.5) {
    await Alert.create({
      userId,
      message: `Unusual expense: ${tx.amount} in ${tx.category}`,
      type: 'unusual',
      meta: { transactionId: tx._id },
    });
    await Notification.create({
      userId,
      title: 'Unusual transaction',
      body: `Large expense detected in ${tx.category}.`,
      type: 'alert',
    });
  }
  const start = new Date(tx.date);
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  const budget = await Budget.findOne({ userId, category: tx.category, month: start });
  if (budget) {
    const spent = await Transaction.aggregate([
      {
        $match: {
          userId: budget.userId,
          type: 'expense',
          category: budget.category,
          date: { $gte: start, $lt: new Date(start.getFullYear(), start.getMonth() + 1, 1) },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const total = spent[0]?.total || 0;
    if (total > budget.limit) {
      await Alert.create({
        userId,
        message: `Budget exceeded for ${tx.category}`,
        type: 'budget',
      });
      await Notification.create({
        userId,
        title: 'Budget exceeded',
        body: `${tx.category} is over the monthly limit.`,
        type: 'alert',
      });
    }
  }
}
