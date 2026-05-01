import { AdminLayoutShell } from '@/components/layout/AdminLayoutShell';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
