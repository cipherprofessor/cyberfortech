// src/app/(dashboard)/page.tsx
'use client';
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const { isAuthenticated, isSuperAdmin, isAdmin, isStudent, isLoaded } = useAuth();
  
  // if (!isLoaded) {
  //   return <div>Loading...</div>;
  // }

  if (!isAuthenticated) {
    redirect('/');
  }

  // Redirect based on role
  if (isSuperAdmin) {
    redirect('/dashboard/superadmindashboard/analytics');
  } else if (isAdmin) {
    redirect('/dashboard/admin');
  } else if (isStudent) {
    redirect('/dashboard/student');
  }

  redirect('/');
}