import { Category } from '../models/Category.js';

export async function list(req, res) {
  const items = await Category.find({ userId: req.user.id }).sort({ name: 1 });
  return res.json(items);
}

export async function create(req, res) {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ message: 'Name required' });
  try {
    const cat = await Category.create({ userId: req.user.id, name: name.trim(), isDefault: false });
    return res.status(201).json(cat);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: 'Category exists' });
    throw e;
  }
}

export async function update(req, res) {
  const cat = await Category.findOne({ _id: req.params.id, userId: req.user.id });
  if (!cat) return res.status(404).json({ message: 'Not found' });
  if (cat.isDefault) return res.status(400).json({ message: 'Cannot rename default category' });
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ message: 'Name required' });
  cat.name = name.trim();
  await cat.save();
  return res.json(cat);
}

export async function remove(req, res) {
  const cat = await Category.findOne({ _id: req.params.id, userId: req.user.id });
  if (!cat) return res.status(404).json({ message: 'Not found' });
  if (cat.isDefault) return res.status(400).json({ message: 'Cannot delete default category' });
  await cat.deleteOne();
  return res.json({ ok: true });
}
