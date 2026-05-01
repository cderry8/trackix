'use client';

import { Card } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type Stats = { totalUsers: number; activeUsers: number; totalTransactions: number };

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/admin/stats');
      setStats(data);
    })().catch(() => {});
  }, []);

  const chartData = stats
    ? [
        { name: 'Users', value: stats.totalUsers },
        { name: 'Active', value: stats.activeUsers },
        { name: 'Transactions (k)', value: Math.round(stats.totalTransactions / 1000) },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Platform analytics</h1>
        <p className="text-sm text-ink-muted">Macro signals across the tenant graph</p>
      </div>
      <Card>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="rgb(96, 165, 250)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
