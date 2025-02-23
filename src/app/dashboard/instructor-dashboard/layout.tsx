// src/app/dashboard/instructor-dashboard/layout.tsx
'use client';

import { ThemeProvider } from 'next-themes';
import styles from './layout.module.scss';
import { StudentSidebar } from './Student-Sidebar/Student-Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ROLES } from '@/constants/auth';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={[ROLES.INSTRUCTOR]}>
      <ThemeProvider attribute="class">
        <div className={styles.layoutContainer}>
          <StudentSidebar />
          <main className={styles.mainContent}>
            {children}
          </main>
        </div>
      </ThemeProvider>
    </ProtectedRoute>
  );
}