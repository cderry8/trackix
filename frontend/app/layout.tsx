import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { SceneBackground } from '@/components/visual/SceneBackground';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Trackix — Know where every dollar goes',
  description:
    'AI-powered expense tracking, budgets, goals, and simulated bank connections—in a premium fintech dashboard. Sign up free.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans">
        <Providers>
          <SceneBackground />
          <div className="relative min-h-screen">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
