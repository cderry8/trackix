import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Transaction } from '../models/Transaction.js';
import { AdminLog } from '../models/AdminLog.js';
import { Category } from '../models/Category.js';
import { Budget } from '../models/Budget.js';
import { Goal } from '../models/Goal.js';
import { Connection } from '../models/Connection.js';
import { Alert } from '../models/Alert.js';
import { Notification } from '../models/Notification.js';
import { Insight } from '../models/Insight.js';

export async function stats(req, res) {
  const [users, txs] = await Promise.all([User.countDocuments(), Transaction.countDocuments()]);
  const activeUsers = await User.countDocuments({ suspended: false });
  return res.json({ totalUsers: users, activeUsers, totalTransactions: txs });
}

export async function users(req, res) {
  const items = await User.find().select('-password -refreshToken').sort({ createdAt: -1 });
  return res.json(items);
}

export async function suspendUser(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  if (user.role === 'admin') return res.status(400).json({ message: 'Cannot suspend admin' });
  user.suspended = true;
  user.refreshToken = null;
  await user.save();
  await AdminLog.create({
    action: 'suspend_user',
    adminId: req.user.id,
    targetUserId: user._id,
    details: user.email,
  });
  return res.json(user);
}

export async function unsuspendUser(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  user.suspended = false;
  await user.save();
  await AdminLog.create({
    action: 'unsuspend_user',
    adminId: req.user.id,
    targetUserId: user._id,
    details: user.email,
  });
  return res.json(user);
}

export async function deleteUser(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  if (user.role === 'admin') return res.status(400).json({ message: 'Cannot delete admin' });
  const uid = user._id;
  await Promise.all([
    Transaction.deleteMany({ userId: uid }),
    Category.deleteMany({ userId: uid }),
    Budget.deleteMany({ userId: uid }),
    Goal.deleteMany({ userId: uid }),
    Connection.deleteMany({ userId: uid }),
    Alert.deleteMany({ userId: uid }),
    Notification.deleteMany({ userId: uid }),
    Insight.deleteMany({ userId: uid }),
  ]);
  await User.deleteOne({ _id: uid });
  await AdminLog.create({
    action: 'delete_user',
    adminId: req.user.id,
    targetUserId: uid,
    details: user.email,
  });
  return res.json({ ok: true });
}

export async function activity(req, res) {
  const recentUsers = await User.find().sort({ updatedAt: -1 }).limit(10).select('name email updatedAt role');
  const recentTx = await Transaction.find().sort({ createdAt: -1 }).limit(20).populate('userId', 'email name');
  return res.json({ recentUsers, recentTransactions: recentTx });
}

export async function logs(req, res) {
  const items = await AdminLog.find().sort({ createdAt: -1 }).limit(200);
  return res.json(items);
}

export async function ensureAdminAccount() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;
  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
    }
    return;
  }
  const hash = await bcrypt.hash(password, 10);
  await User.create({ name: 'Platform Admin', email, password: hash, role: 'admin' });
}
