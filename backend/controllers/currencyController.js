import { convertAmount, getRates } from '../services/currencyService.js';
import { User } from '../models/User.js';

export async function rates(req, res) {
  return res.json(getRates());
}

export async function convert(req, res) {
  const { amount, from, to } = req.query;
  if (amount == null || !from || !to) {
    return res.status(400).json({ message: 'amount, from, to required' });
  }
  const out = convertAmount(Number(amount), from, to);
  return res.json({ amount: Number(amount), from, to, result: out });
}

export async function preferred(req, res) {
  const user = await User.findById(req.user.id);
  return res.json({ currency: user.preferredCurrency });
}
