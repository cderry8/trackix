'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { useState } from 'react';
import { motion } from 'framer-motion';

type InsightRes = {
  insights: string[];
  warnings: string[];
  recommendations: string[];
  weeklySummary: string;
  healthScore: number;
  explain?: string;
};

export default function AiPage() {
  const [data, setData] = useState<InsightRes | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async (explain: boolean) => {
    setLoading(true);
    try {
      const { data: d } = await api.post('/ai/insights', { explain });
      setData(d);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">AI insights</h1>
          <p className="text-sm text-ink-muted">Rule-based intelligence tuned for fintech clarity</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" disabled={loading} onClick={() => run(false)}>
            Weekly report
          </Button>
          <Button type="button" variant="ghost" disabled={loading} onClick={() => run(true)}>
            Explain spending
          </Button>
        </div>
      </div>

      {loading ? <div className="h-40 skeleton" /> : null}

      {data ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Card tilt={false}>
              <div className="text-xs uppercase tracking-wide text-ink-muted">Health score</div>
              <div className="mt-2 font-mono text-4xl">{data.healthScore}</div>
              <p className="mt-3 text-sm text-ink-muted">{data.weeklySummary}</p>
            </Card>
          </motion.div>
          <Card tilt={false} className="lg:col-span-2">
            <h2 className="text-sm font-medium">Signals</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted">
              {data.insights.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
            {data.warnings.length ? (
              <h3 className="mt-4 text-sm font-medium text-red-500">Warnings</h3>
            ) : null}
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
              {data.warnings.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
            <h3 className="mt-4 text-sm font-medium">Recommendations</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-ink-muted">
              {data.recommendations.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
            {data.explain ? <p className="mt-4 text-sm text-ink-muted">{data.explain}</p> : null}
          </Card>
        </div>
      ) : null}
    </div>
  );
}
