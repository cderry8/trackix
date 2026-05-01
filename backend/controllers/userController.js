import { User } from '../models/User.js';

export async function updateProfile(req, res) {
  const { name, preferredCurrency } = req.body;
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (preferredCurrency !== undefined) updates.preferredCurrency = preferredCurrency;
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
  return res.json(user);
}

export async function changePassword(req, res) {
  const bcrypt = (await import('bcryptjs')).default;
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'Invalid payload' });
  }
  const user = await User.findById(req.user.id);
  const ok = await bcrypt.compare(currentPassword, user.password);
  if (!ok) return res.status(400).json({ message: 'Current password incorrect' });
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  return res.json({ ok: true });
}
