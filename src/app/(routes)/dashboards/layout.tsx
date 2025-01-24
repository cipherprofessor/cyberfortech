// src/app/(routes)/dashboards/layout.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';

export default function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const { isAuthenticated, isLoaded } = useAuth();
  
  console.log("Layout Auth State:", { isAuthenticated, isLoaded });

  // Wait for auth to load before making decisions
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting from layout");
    redirect('/');
  }

  return (
    <div className="dashboard-layout">
      {children}
    </div>
  );
}