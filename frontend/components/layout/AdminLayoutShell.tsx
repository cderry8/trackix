'use client';

import { RequireAuth } from '@/features/auth/RequireAuth';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth admin>
      <div className="flex min-h-screen">
        <Sidebar admin />
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar admin />
          <main className="flex-1 space-y-6 p-6">{children}</main>
        </div>
      </div>
    </RequireAuth>
  );
}
