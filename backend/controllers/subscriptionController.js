import { Subscription } from '../models/Subscription.js';

export async function list(req, res) {
  const items = await Subscription.find({ userId: req.user.id }).sort({ nextBillingDate: 1 });
  return res.json(items);
}

export async function create(req, res) {
  const { name, provider, category, amount, currency, frequency, nextBillingDate, description, website, icon, color } = req.body;
  
  if (!name || !provider || !amount || !nextBillingDate) {
    return res.status(400).json({ message: 'Name, provider, amount, and next billing date are required' });
  }

  const subscription = await Subscription.create({
    userId: req.user.id,
    name,
    provider,
    category: category || 'entertainment',
    amount: Number(amount),
    currency: currency || 'USD',
    frequency: frequency || 'monthly',
    nextBillingDate: new Date(nextBillingDate),
    description: description || '',
    website: website || '',
    icon: icon || '',
    color: color || '#60a5fa',
  });

  return res.status(201).json(subscription);
}

export async function update(req, res) {
  const { id } = req.params;
  const subscription = await Subscription.findOne({ _id: id, userId: req.user.id });
  
  if (!subscription) {
    return res.status(404).json({ message: 'Subscription not found' });
  }

  const allowedUpdates = ['name', 'provider', 'category', 'amount', 'currency', 'frequency', 'nextBillingDate', 'description', 'website', 'icon', 'color', 'status'];
  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      subscription[field] = field === 'amount' ? Number(req.body[field]) : req.body[field];
    }
  });

  await subscription.save();
  return res.json(subscription);
}

export async function remove(req, res) {
  const { id } = req.params;
  const subscription = await Subscription.findOneAndDelete({ _id: id, userId: req.user.id });
  
  if (!subscription) {
    return res.status(404).json({ message: 'Subscription not found' });
  }

  return res.json({ message: 'Subscription deleted' });
}

export async function cancel(req, res) {
  const { id } = req.params;
  const subscription = await Subscription.findOne({ _id: id, userId: req.user.id });
  
  if (!subscription) {
    return res.status(404).json({ message: 'Subscription not found' });
  }

  subscription.status = 'cancelled';
  await subscription.save();
  return res.json(subscription);
}

export async function getSummary(req, res) {
  const subscriptions = await Subscription.find({ userId: req.user.id, status: 'active' });
  
  const monthlyTotal = subscriptions.reduce((sum, sub) => {
    let multiplier = 1;
    switch (sub.frequency) {
      case 'weekly': multiplier = 4.33; break;
      case 'quarterly': multiplier = 1 / 3; break;
      case 'yearly': multiplier = 1 / 12; break;
      default: multiplier = 1;
    }
    return sum + (sub.amount * multiplier);
  }, 0);

  const yearlyTotal = monthlyTotal * 12;
  const subscriptionCount = subscriptions.length;
  const upcomingRenewals = subscriptions.filter(sub => {
    const daysUntil = Math.ceil((new Date(sub.nextBillingDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 7 && daysUntil >= 0;
  }).length;

  return res.json({
    monthlyTotal: Math.round(monthlyTotal * 100) / 100,
    yearlyTotal: Math.round(yearlyTotal * 100) / 100,
    subscriptionCount,
    upcomingRenewals,
  });
}
