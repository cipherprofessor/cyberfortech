// src/app/(dashboard)/layout.tsx
'use client';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/ui/Mine/SuperadminDashboard/DashboardLayout';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      
        {children}
       
    </ProtectedRoute>
  );
}