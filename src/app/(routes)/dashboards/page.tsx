// src/app/(routes)/dashboards/page.tsx
'use client';

import { SuperAdminDashboard } from '@/components/ui/Mine/SuperadminDashboard';

import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import StudentDashboard from './student-dashboard/page';
import AdminDashboard from './admin-dashboard/page';

export default function DashboardPage() {
  const { isAuthenticated, isSuperAdmin, isAdmin, isStudent, isLoaded } = useAuth();
  
  console.log("Page Auth State:", { 
    isAuthenticated, 
    isSuperAdmin, 
    isAdmin, 
    isStudent, 
    isLoaded 
  });

  // Wait for auth to load
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting from page");
    redirect('/');
  }

  if (isSuperAdmin) {
    return <SuperAdminDashboard />;
  }

  if (isAdmin) {
    return <AdminDashboard />;
  }

  if (isStudent) {
    return <StudentDashboard />;
  }

  redirect('/');
}