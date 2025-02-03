// src/components/common/Navbar/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from '@heroui/react';
import { Moon, Sun, Monitor, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Navbar.module.scss';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import SwitchDarkLightModeIcon from '@/components/ui/HeroUI/Switch/SwitchDarkLightModeIcon';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, isSuperAdmin, isAdmin, isStudent, role } = useAuth();
  const pathname = usePathname();

  // For debugging
  useEffect(() => {
    console.log('Auth Status:', { isAuthenticated, isSuperAdmin, isAdmin, isStudent, role });
  }, [isAuthenticated, isSuperAdmin, isAdmin, isStudent, role]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActivePath = (path: string) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

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

  const renderRoleBasedLinks = () => {
    if (isSuperAdmin || isAdmin) {
      return (
        <Link 
          href="/dashboard" 
          className={`${styles.navLink} ${isActivePath('/dashboard') ? styles.active : ''}`}
        >
          Dashboard
        </Link>
      );
    }
    if (isStudent) {
      return (
        <>
          <Link 
            href="/dashboard/student-dashboard" 
            className={`${styles.navLink} ${isActivePath('/dashboard/student-dashboard') ? styles.active : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            href="/dashboard/my-courses" 
            className={`${styles.navLink} ${isActivePath('/dashboard/my-courses') ? styles.active : ''}`}
          >
            My Courses
          </Link>
        </>
      );
    }
    return null;
  };

  const renderMobileRoleBasedLinks = () => {
    if (isSuperAdmin || isAdmin) {
      return (
        <Link 
          href="/dashboard" 
          className={`${styles.mobileNavLink} ${isActivePath('/dashboard') ? styles.active : ''}`}
        >
          Dashboard
        </Link>
      );
    }
    if (isStudent) {
      return (
        <>
          <Link 
            href="/dashboard/student-dashboard" 
            className={`${styles.mobileNavLink} ${isActivePath('/dashboard/student-dashboard') ? styles.active : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            href="/dashboard/my-courses" 
            className={`${styles.mobileNavLink} ${isActivePath('/dashboard/my-courses') ? styles.active : ''}`}
          >
            My Courses
          </Link>
        </>
      );
    }
    return null;
  };

  if (!mounted) return null;

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Logo and Brand */}
        <Link href="/" className={styles.logoContainer}>
          <Image
            src="/logo/cyberlogo2.png"
            alt="CyberForTech Logo"
            width={40}
            height={40}
            className={styles.logo}
            priority
          />
          <span className={styles.logoText}>CyberForTech</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className={styles.desktopNav}>
          <Link 
            href="/" 
            className={`${styles.navLink} ${isActivePath('/') ? styles.active : ''}`}
          >
            Home
          </Link>
          <Link 
            href="/courses" 
            className={`${styles.navLink} ${isActivePath('/courses') ? styles.active : ''}`}
          >
            Courses
          </Link>

          {renderRoleBasedLinks()}

          <Link 
            href="/forum" 
            className={`${styles.navLink} ${isActivePath('/forum') ? styles.active : ''}`}
          >
            Forum
          </Link>
          <Link 
            href="/about" 
            className={`${styles.navLink} ${isActivePath('/about') ? styles.active : ''}`}
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className={`${styles.navLink} ${isActivePath('/contact') ? styles.active : ''}`}
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuButton}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.div>
        </button>

        {/* Right Side Actions */}
        <div className={styles.navActions}>
          <SwitchDarkLightModeIcon 
            className={styles.themeToggle}
            defaultSelected={theme === 'dark'}
            onChange={(isSelected) => {
              setTheme(isSelected ? 'dark' : 'light')
            }}
          />

          <SignedOut>
            <SignInButton>
              <Button variant="ghost" className={styles.signInButton}>
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button variant="solid" className={styles.signUpButton}>
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: styles.userButton
                }
              }}
            />
          </SignedIn>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={styles.mobileNav}
          >
            <Link 
              href="/" 
              className={`${styles.mobileNavLink} ${isActivePath('/') ? styles.active : ''}`}
            >
              Home
            </Link>
            <Link 
              href="/courses" 
              className={`${styles.mobileNavLink} ${isActivePath('/courses') ? styles.active : ''}`}
            >
              Courses
            </Link>

            {renderMobileRoleBasedLinks()}

            <Link 
              href="/forum" 
              className={`${styles.mobileNavLink} ${isActivePath('/forum') ? styles.active : ''}`}
            >
              Forum
            </Link>
            <Link 
              href="/about" 
              className={`${styles.mobileNavLink} ${isActivePath('/about') ? styles.active : ''}`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`${styles.mobileNavLink} ${isActivePath('/contact') ? styles.active : ''}`}
            >
              Contact Us
            </Link>

            <div className={styles.mobileThemeToggle}>
              <Button 
                variant="ghost" 
                size="md" 
                onPress={cycleTheme}
                className="w-full justify-start px-4 py-2"
              >
                {theme === 'light' ? (
                  <><Sun className="h-5 w-5 mr-2" /> Light Mode</>
                ) : theme === 'dark' ? (
                  <><Moon className="h-5 w-5 mr-2" /> Dark Mode</>
                ) : (
                  <><Monitor className="h-5 w-5 mr-2" /> System Mode</>
                )}
              </Button>
            </div>

            <div className={styles.mobileAuthButtons}>
              <SignedOut>
                <SignInButton>
                  <Button variant="ghost" className="w-full mb-2">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button variant="solid" className="w-full">
                    Sign Up
                  </Button>
                </SignUpButton>
              </SignedOut>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}