import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { SceneBackground } from '@/components/visual/SceneBackground';
import { Analytics } from '@vercel/analytics/next';
import { PageProgress } from '@/components/ui/PageProgress';
import { Suspense } from 'react';


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Trackix — Know where every dollar goes',
  description:
    'AI-powered expense tracking, budgets, goals, and simulated bank connections—in a premium fintech dashboard. Sign up free.',
     icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans">
        <Providers>
          <Suspense fallback={null}>
            <PageProgress />
          </Suspense>
          <SceneBackground />
          <div className="relative min-h-screen">{children}</div>
        </Providers>
          <Analytics />
      </body>
    </html>
  );
}
