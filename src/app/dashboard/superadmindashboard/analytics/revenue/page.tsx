// src/app/dashboard/analytics/revenue/page.tsx
'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RevenueOverview } from '@/components/ui/Mine/SuperadminDashboard/RevenueOverview';

export default function RevenuePage() {
  return (
    <ProtectedRoute allowedRoles={['superadmin']}>
      <RevenueOverview />
    </ProtectedRoute>
  );
}