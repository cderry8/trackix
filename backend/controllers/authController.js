import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

const DEFAULT_CATEGORIES = ['Salary', 'Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Other'];

export async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, password required' });
  }
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already registered' });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash, role: 'user' });
  for (const cat of DEFAULT_CATEGORIES) {
    await Category.create({ userId: user._id, name: cat, isDefault: true }).catch(() => {});
  }
  const tokens = await issueTokens(user);
  return res.status(201).json({ user, ...tokens });
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  const user = await User.findOne({ email });
  if (!user || user.suspended) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const tokens = await issueTokens(user);
  return res.json({ user: user.toJSON(), ...tokens });
}

export async function refresh(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'refreshToken required' });
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.sub);
    if (!user || user.refreshToken !== refreshToken || user.suspended) {
      return res.status(401).json({ message: 'Invalid refresh' });
    }
    const tokens = await issueTokens(user);
    return res.json({ user: user.toJSON(), ...tokens });
  } catch {
    return res.status(401).json({ message: 'Invalid refresh' });
  }
}

export async function logout(req, res) {
  await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
  return res.json({ ok: true });
}

export async function me(req, res) {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  return res.json(user);
}

async function issueTokens(user) {
  const payload = { sub: user._id.toString(), role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  await User.findByIdAndUpdate(user._id, { refreshToken });
  return { accessToken, refreshToken };
}
