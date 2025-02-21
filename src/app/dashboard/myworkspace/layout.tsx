// app/layout.tsx
'use client';

import { ThemeProvider } from 'next-themes';

import styles from './layout.module.scss';
import { SuperAdminSidebar } from './components/Sidebar/Sidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class">
      <div className={styles.layoutContainer}>
        <SuperAdminSidebar />
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}