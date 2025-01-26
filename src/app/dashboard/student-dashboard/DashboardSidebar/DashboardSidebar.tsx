"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Layout, 
  Book, 
  Calendar, 
  Award, 
  Settings,
  BarChart2,
  MessageSquare,
  CreditCard
} from 'lucide-react';
import styles from './DashboardSidebar.module.scss';

const menuItems = [
  { icon: Layout, label: 'Overview', href: '/dashboard/student-dashboard' },
  { icon: Book, label: 'My Courses', href: '/dashboard/student-dashboard/courses' },
  { icon: Calendar, label: 'Schedule', href: '/dashboard/student-dashboard/routes/schedule' },
  { icon: Award, label: 'Certificates', href: '/dashboard/student-dashboard/routes/certificates' },
  { icon: BarChart2, label: 'Progress', href: '/dashboard/student-dashboard/routes/progress' },
  { icon: MessageSquare, label: 'Discussion', href: '/dashboard/student-dashboard/routes/discussion' },
  { icon: CreditCard, label: 'Billing', href: '/dashboard/student-dashboard/routes/billing' },
  { icon: Settings, label: 'Settings', href: '/dashboard/student-dashboard/routes/settings' },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      {/* <div className={styles.logo}>
        <Link href="/">
          CyberForTech
        </Link>
      </div> */}

      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <item.icon className={styles.icon} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}