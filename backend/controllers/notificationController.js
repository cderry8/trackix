import { Notification } from '../models/Notification.js';

export async function list(req, res) {
  const items = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(100);
  return res.json(items);
}

export async function markRead(req, res) {
  await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { read: true }
  );
  return res.json({ ok: true });
}
