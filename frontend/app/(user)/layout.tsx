import { UserLayoutShell } from '@/components/layout/UserLayoutShell';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <UserLayoutShell>{children}</UserLayoutShell>;
}
