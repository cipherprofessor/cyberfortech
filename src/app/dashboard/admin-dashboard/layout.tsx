// src/app/dashboard/admin/layout.tsx
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    redirect('/');
  }

  return <>{children}</>;
}