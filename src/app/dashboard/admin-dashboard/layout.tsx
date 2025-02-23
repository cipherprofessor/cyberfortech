// src/app/dashboard/admin-dashboard/layout.tsx
'use client';

import { ThemeProvider } from 'next-themes';
import styles from './layout.module.scss';
import { AdminSidebar } from './Sidebar/AdminSidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ROLES } from '@/constants/auth';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>
      <ThemeProvider attribute="class">
        <div className={styles.layoutContainer}>
          <AdminSidebar />
          <main className={styles.mainContent}>
            {children}
          </main>
        </div>
      </ThemeProvider>
    </ProtectedRoute>
  );
}
