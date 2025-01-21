import { useState } from 'react';
import { UserButton } from '@clerk/nextjs';
import { Bell, Menu } from 'lucide-react';
// import { 
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
import styles from './DashboardHeader.module.scss';

export function DashboardHeader() {
  const [notificationCount] = useState(3); // Replace with real notification count

  return (
    <header className={styles.header}>
      <button className={styles.menuButton}>
        <Menu className={styles.menuIcon} />
      </button>

      <div className={styles.actions}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={styles.notificationButton}>
              <Bell className={styles.icon} />
              {notificationCount > 0 && (
                <span className={styles.badge}>{notificationCount}</span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={styles.notificationMenu}>
            <DropdownMenuItem>
              New course recommendation
            </DropdownMenuItem>
            <DropdownMenuItem>
              Assignment deadline approaching
            </DropdownMenuItem>
            <DropdownMenuItem>
              New course material available
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
