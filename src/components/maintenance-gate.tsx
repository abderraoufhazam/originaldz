'use client';

import { usePathname } from 'next/navigation';
import MaintenanceScreen from './maintenance-screen';

export default function MaintenanceGate({
  maintenance,
  admin,
  children,
}: {
  maintenance: boolean;
  admin: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (!maintenance || admin) return <>{children}</>;
  // Keep /admin and /api reachable so the owner can log in and manage during maintenance.
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) return <>{children}</>;

  return <MaintenanceScreen />;
}
