import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDb } from './config/db.js';
import { errorHandler } from './middleware/error.js';
import { ensureAdminAccount } from './controllers/adminController.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import txRoutes from './routes/transactions.js';
import catRoutes from './routes/categories.js';
import budgetRoutes from './routes/budgets.js';
import goalRoutes from './routes/goals.js';
import aiRoutes from './routes/ai.js';
import alertRoutes from './routes/alerts.js';
import notifRoutes from './routes/notifications.js';
import currencyRoutes from './routes/currency.js';
import connRoutes from './routes/connections.js';
import dashRoutes from './routes/dashboard.js';
import adminRoutes from './routes/admin.js';

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', txRoutes);
app.use('/api/categories', catRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/notifications', notifRoutes);
app.use('/api/currency', currencyRoutes);
app.use('/api/connections', connRoutes);
app.use('/api/dashboard', dashRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

const port = process.env.PORT || 5000;

async function main() {
  await connectDb();
  await ensureAdminAccount();
  app.listen(port, () => {
    console.log(`Trackix API http://localhost:${port}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
