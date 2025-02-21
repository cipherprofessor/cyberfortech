// app/layout.tsx
'use client';

import { ThemeProvider } from 'next-themes';
import styles from './layout.module.scss';
import { AdminSidebar } from './Sidebar/AdminSidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class">
      <div className={styles.layoutContainer}>
        <AdminSidebar />
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}