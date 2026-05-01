import { Connection } from '../models/Connection.js';
import { generateSimulatedTransactions } from '../services/connectionSimulator.js';

export async function list(req, res) {
  const items = await Connection.find({ userId: req.user.id });
  return res.json(items);
}

export async function connect(req, res) {
  const { type, displayName } = req.body;
  if (!['mtn', 'bank'].includes(type)) return res.status(400).json({ message: 'type must be mtn or bank' });
  let conn = await Connection.findOne({ userId: req.user.id, type });
  if (!conn) {
    conn = await Connection.create({
      userId: req.user.id,
      type,
      status: 'connecting',
      displayName: displayName || (type === 'mtn' ? 'MTN Mobile Money' : 'Linked Bank'),
    });
  } else {
    conn.status = 'connecting';
    if (displayName) conn.displayName = displayName;
    await conn.save();
  }
  setTimeout(async () => {
    await Connection.findByIdAndUpdate(conn._id, { status: 'connected', lastSyncedAt: new Date() });
  }, 1200);
  return res.json(conn);
}

export async function disconnect(req, res) {
  await Connection.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { status: 'disconnected', lastSyncedAt: null }
  );
  return res.json({ ok: true });
}

export async function sync(req, res) {
  const conn = await Connection.findOne({ _id: req.params.id, userId: req.user.id });
  if (!conn || conn.status !== 'connected') {
    return res.status(400).json({ message: 'Connection not active' });
  }
  const n = await generateSimulatedTransactions(req.user.id, conn.type, 4 + Math.floor(Math.random() * 4));
  conn.lastSyncedAt = new Date();
  await conn.save();
  return res.json({ imported: n, lastSyncedAt: conn.lastSyncedAt });
}
