// src/components/common/Navbar/Navbar.tsx
'use client'

import Link from 'next/link';
import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from '@heroui/react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.scss';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, isSuperAdmin, isAdmin, isStudent } = useAuth();

  // Ensure component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Cycle through themes
  const cycleTheme = () => {
    switch (theme) {
      case 'light':
        setTheme('dark');
        break;
      case 'dark':
        setTheme('system');
        break;
      default:
        setTheme('light');
        break;
    }
  };

  if (!mounted) return null;

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          CyberForTech
        </Link>

        <div className={styles.navLinks}>
        <Link href="/" className={styles.navLink}>
            Home
          </Link>
          <Link href="/courses" className={styles.navLink}>
            Courses
          </Link>

          {isAdmin && (
        <>
           <Link href="/dashboard">Dashboard</Link>
          <Link href="/dashboard/admin/courses">Manage Courses</Link>
          <Link href="/dashboard/admin/resources">Resources</Link>
        </>
          )}

          {/* Super admin links */}
        {isSuperAdmin && (
        <Link href="/dashboard">Dashboard</Link>
       )}

      {/* Student links */}
      {isStudent && (
        <>
        <Link href="/dashboard" className={styles.navLink}>
            Dashboard
          </Link>
          <Link href="/dashboard/my-courses">My Courses</Link>
        </>
      )}
          <Link href="/forum" className={styles.navLink}>
            Forum
          </Link>
          <Link href="/about" className={styles.navLink}>
            About
          </Link>
          <Link href="/contact" className={styles.navLink}>
            Contact Us
          </Link>
        </div>

        <div className={styles.navActions}>
          {/* Theme Toggle Button */}
          <Button 
            variant="ghost" 
            size="md" 
            onPress={cycleTheme}
            className="mr-3 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {theme === 'light' ? (
              <Sun className="h-5 w-5" />
            ) : theme === 'dark' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Monitor className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <SignedOut>
            <SignInButton>
              <Button variant="ghost" className="mr-2">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button variant="solid" className="mr-2">
                Sign Up
              </Button>
              </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}