'use client';

import { AnalyticsDashboard } from '@/components/ui/Mine/Analytics/AnalyticsDashboard';
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isSuperAdmin } = useAuth();

  if (!isSuperAdmin) {
    redirect('/');
  }

  return (
    <>
      {/* <AnalyticsDashboard /> */}
      {children}
    </>
  );
}