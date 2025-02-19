// app/layout.tsx
'use client';

import { ThemeProvider } from 'next-themes';
import { Sidebar } from './components/Sidebar/Sidebar';
import styles from './layout.module.scss';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class">
      <div className={styles.layoutContainer}>
        <Sidebar />
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}