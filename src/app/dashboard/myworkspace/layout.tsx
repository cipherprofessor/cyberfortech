// src/app/dashboard/myworkspace/layout.tsx
'use client';

import { ThemeProvider } from 'next-themes';
import styles from './layout.module.scss';
import { SuperAdminSidebar } from './components/Sidebar/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ROLES } from '@/constants/auth';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN]}>
      <ThemeProvider attribute="class">
        <div className={styles.layoutContainer}>
          <SuperAdminSidebar />
          <main className={styles.mainContent}>
            {children}
          </main>
        </div>
      </ThemeProvider>
    </ProtectedRoute>
  );
}
