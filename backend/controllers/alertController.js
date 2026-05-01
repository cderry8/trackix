import { Alert } from '../models/Alert.js';

export async function list(req, res) {
  const items = await Alert.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(200);
  return res.json(items);
}

export async function markRead(req, res) {
  await Alert.findOneAndUpdate({ userId: req.user.id, _id: req.params.id }, { read: true });
  return res.json({ ok: true });
}

export async function markAllRead(req, res) {
  await Alert.updateMany({ userId: req.user.id }, { read: true });
  return res.json({ ok: true });
}
