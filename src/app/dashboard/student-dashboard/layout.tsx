// import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
// import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import styles from './dashboard.module.scss';
import { DashboardHeader } from './DashboardHeader/DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar/DashboardSidebar';

export default function DashboardLayoutStudent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.dashboardLayout}>
      <DashboardSidebar />
      
      <div className={styles.mainContent}>
        <DashboardHeader />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
