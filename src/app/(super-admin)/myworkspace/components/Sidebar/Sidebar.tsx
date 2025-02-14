'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, BookOpen, Settings, BarChart, MessageCircle, HelpCircle, Menu, User, Book, LockIcon, Bell, PieChartIcon, MailIcon, MailsIcon, MailboxIcon, HelpCircleIcon, HelpingHandIcon, BadgeHelpIcon, UsersIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import styles from './Sidebar.module.scss';
import { SidebarItem } from './SidebarItem';
import { SidebarItemProps } from './types';


export function Sidebar() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu
  const sidebarRef = useRef<HTMLDivElement>(null); // Ref for the sidebar

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    console.log('Is Mobile:', mobile); // Debugging
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Close sidebar when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isMobile && isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, isOpen]);

  if (!mounted) {
    return null; // Avoid rendering on the server
  }

  const isDark = theme === 'dark';

  const menuItems: SidebarItemProps[] = [
    {
      label: 'Dashboard',
      icon: <LayoutDashboard size={18} />,
      href: '/myworkspace/dashboard',
      labelClassName: styles.mainLabel 
    },
    {
      label: 'Users',
      icon: <UsersIcon size={18} />,
      labelClassName: styles.mainLabel,
      subItems: [
        { label: 'All Users', href: '/myworkspace/menus/users/all', icon: <User size={16}  />,  labelClassName: styles.subLabel },
        { label: 'Admins', href: '/myworkspace/menus/users/admins', icon: <User size={16} />, labelClassName: styles.subLabel},
        { label: 'Students', href: '/myworkspace/menus/users/students', icon: <User size={16} />, labelClassName: styles.subLabel},
      ],
    },
    {
      label: 'Courses',
      icon: <BookOpen size={18} />,
      labelClassName: styles.mainLabel,
      subItems: [
        { label: 'All Courses', href: '/myworkspace/menus/courses/all', icon: <Book size={16} /> ,labelClassName: styles.subLabel},
        { label: 'Active Courses', href: '/myworkspace/menus/courses/active', icon: <Book size={16} />, labelClassName: styles.subLabel},
        { label: 'Archived Courses', href: '/myworkspace/menus/courses/archived', icon: <Book size={16} />,labelClassName: styles.subLabel},
      ],
    },
    {
      label: 'Settings',
      icon: <Settings size={18} />,
      labelClassName: styles.mainLabel,
      subItems: [
        { label: 'General', href: '/myworkspace/menus/settings/general', icon: <Settings size={16} />,labelClassName: styles.subLabel },
        { label: 'Security', href: '/myworkspace/menus/settings/security', icon: <LockIcon size={16} />, labelClassName: styles.subLabel},
        { label: 'Notifications', href: '/myworkspace/menus/settings/notifications', icon: <Bell size={16} />,labelClassName: styles.subLabel },
      ],
    },
    {
      label: 'Analytics',
      icon: <BarChart size={18} />,
      labelClassName: styles.mainLabel,
      subItems: [
        { label: 'Overview', href: '/myworkspace/menus/analytics/overview', icon: <PieChartIcon size={16} />,labelClassName: styles.subLabel },
        { label: 'Reports', href: '/myworkspace/menus/analytics/reports', icon: <BarChart size={16} />,labelClassName: styles.subLabel },
        { label: 'Insights', href: '/myworkspace/menus/analytics/insights', icon: <BarChart size={16} />,labelClassName: styles.subLabel },
      ],
    },
    {
      label: 'Messages',
      icon: <MessageCircle size={18} />,
      labelClassName: styles.mainLabel,
      subItems: [
        { label: 'Inbox', href: '/myworkspace/menus/messages/inbox', icon: <MailIcon size={16} />,labelClassName: styles.subLabel },
        { label: 'Sent', href: '/myworkspace/menus/messages/sent', icon: <MailsIcon size={16} /> ,labelClassName: styles.subLabel},
        { label: 'Drafts', href: '/myworkspace/menus/messages/drafts', icon: <MailboxIcon size={16} />,labelClassName: styles.subLabel },
      ],
    },
    {
      label: 'Help',
      icon: <HelpCircle size={18} />,
      labelClassName: styles.mainLabel,
      subItems: [
        { label: 'FAQ', href: '/myworkspace/menus/help/faq', icon: <HelpCircleIcon size={16} />,labelClassName: styles.subLabel  },
        { label: 'Support', href: '/myworkspace/menus/help/support', icon: <HelpingHandIcon size={16} />,labelClassName: styles.subLabel   },
        { label: 'Contact', href: '/myworkspace/menus/help/contact', icon: <BadgeHelpIcon size={16} /> ,labelClassName: styles.subLabel  },
      ],
    },
  ];

  return (
    <>
      {/* Hamburger Menu for Mobile */}
      {isMobile && (
        <button
          className={styles.mobileMenuButton}
        //   onClick={() => setIsOpen(!isOpen)} // Toggle mobile menu
          onClick={() => {
            setIsOpen(!isOpen); // Toggle mobile menu
            console.log('Hamburger Button Rendered');
          }}
        >
          <Menu size={24} />
          {/* Debugging: Hamburger Button Rendered */}
        </button>
      )}

      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)} // Close sidebar on overlay click
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        ref={sidebarRef}
        className={`${styles.sidebar} ${isDark ? styles.dark : ''} ${isMobile ? styles.mobile : ''}`}
        initial={{ x: isMobile ? '-100%' : 0 }}
        animate={{ x: isMobile && !isOpen ? '-100%' : 0 }}
        exit={{ x: isMobile ? '-100%' : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.logo}>MyWorkspace</div>
        <nav className={styles.nav}>
          {menuItems.map((item, index) => (
            <SidebarItem
              key={index}
              label={item.label}
              icon={item.icon}
              href={item.href}
              subItems={item.subItems}
              labelClassName={item.labelClassName} 
            />
          ))}
        </nav>
      </motion.div>
    </>
  );
}