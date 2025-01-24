// src/app/dashboard/analytics/page.tsx
'use client';
import { OverviewComponent } from '@/components/ui/Mine/SuperadminDashboard/Overview';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserGrowth } from '@/components/ui/Mine/SuperadminDashboard/UserGrowth';
import { AnalyticsDashboard } from '@/components/ui/Mine/Analytics/AnalyticsDashboard';

export default function AnalyticsPage() {
  return (
    <ProtectedRoute allowedRoles={['superadmin']}>
      {/* <OverviewComponent />
      <UserGrowth /> */}
      <AnalyticsDashboard />
      <></>
    </ProtectedRoute>
  );
}