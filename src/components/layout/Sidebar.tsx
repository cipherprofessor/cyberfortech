// components/layout/Sidebar.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  BookOpen, 
  Settings, 
  Menu, 
  X,
  BarChart3,
  GraduationCap,
  UserCog,
  FileText,
  MessageSquare,
  Calendar,
  HelpCircle
} from 'lucide-react';
import styles from './Sidebar.module.scss';
import { cn } from '@/lib/utils';
// import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Users', href: '/dashboard/users' },
  { icon: BookOpen, label: 'Courses', href: '/dashboard/courses' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: GraduationCap, label: 'Students', href: '/dashboard/students' },
  { icon: UserCog, label: 'Instructors', href: '/dashboard/instructors' },
  { icon: FileText, label: 'Reports', href: '/dashboard/reports' },
  { icon: MessageSquare, label: 'Forum', href: '/dashboard/forum' },
  { icon: Calendar, label: 'Schedule', href: '/dashboard/schedule' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  { icon: HelpCircle, label: 'Help', href: '/dashboard/help' },
];

export const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();

  const sidebarVariants = {
    expanded: { width: '240px' },
    collapsed: { width: '72px' }
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;

    return (
      <Link href={item.href} className={styles.linkWrapper}>
        <motion.div
          className={cn(
            styles.navItem,
            isActive && styles.active
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Icon className={styles.icon} />
          {isExpanded && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.label}
            >
              {item.label}
            </motion.span>
          )}
        </motion.div>
      </Link>
    );
  };

  const MobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        {/* <Button variant="ghost" size="icon" className={styles.mobileMenuBtn}>
          <Menu />
        </Button> */}
      </SheetTrigger>
      <SheetContent side="left" className={styles.mobileMenu}>
        <div className={styles.mobileNavItems}>
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      <MobileNav />
      <motion.aside
        className={styles.sidebar}
        initial="expanded"
        animate={isExpanded ? 'expanded' : 'collapsed'}
        variants={sidebarVariants}
      >
        <div className={styles.sidebarHeader}>
          <motion.div 
            className={styles.logo}
            whileHover={{ scale: 1.05 }}
          >
            {isExpanded ? 'LOGO' : 'L'}
          </motion.div>
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className={styles.toggleBtn}
          >
            {isExpanded ? <X size={20} /> : <Menu size={20} />}
          </Button> */}
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>
      </motion.aside>
    </>
  );
};