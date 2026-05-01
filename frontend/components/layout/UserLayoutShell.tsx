'use client';

import { RequireAuth } from '@/features/auth/RequireAuth';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function UserLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar />
          <main className="flex-1 space-y-6 p-6">{children}</main>
        </div>
      </div>
    </RequireAuth>
  );
}
