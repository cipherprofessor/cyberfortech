// src/components/common/Navbar/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from '@heroui/react';
import { 
  Moon, 
  Sun, 
  Monitor, 
  Menu, 
  X,
  Home,
  BookOpen,
  LayoutDashboard,
  MessageSquare,
  InfoIcon,
  PhoneCall,
  GraduationCap,
  Library
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Navbar.module.scss';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import SwitchDarkLightModeIcon from '@/components/ui/HeroUI/Switch/SwitchDarkLightModeIcon';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, isSuperAdmin, isAdmin, isStudent, role } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const renderNavLink = (href: string, label: string, icon: React.ReactNode, isMobile: boolean = false) => {
    const linkClass = isMobile ? styles.mobileNavLink : styles.navLink;
    return (
      <Link 
        href={href} 
        className={`${linkClass} ${isActivePath(href) ? styles.active : ''}`}
      >
        {icon}
        <span>{label}</span>
      </Link>
    );
  };

  const renderRoleBasedLinks = (isMobile: boolean = false) => {
    if (isSuperAdmin || isAdmin) {
      return renderNavLink(
        "/dashboard",
        "Dashboard",
        <LayoutDashboard className={`${isMobile ? "h-5 w-5 mr-3" : "h-4 w-4 mr-2"}`} />,
        isMobile
      );
    }
    if (isStudent) {
      return (
        <>
          {renderNavLink(
            "/dashboard/student-dashboard",
            "Dashboard",
            <LayoutDashboard className={`${isMobile ? "h-5 w-5 mr-3" : "h-4 w-4 mr-2"}`} />,
            isMobile
          )}
          {renderNavLink(
            "/dashboard/my-courses",
            "My Courses",
            <Library className={`${isMobile ? "h-5 w-5 mr-3" : "h-4 w-4 mr-2"}`} />,
            isMobile
          )}
        </>
      );
    }
    return null;
  };

  if (!mounted) return null;

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
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
          {renderNavLink("/", "Home", <Home className="h-4 w-4 mr-2" />)}
          {renderNavLink("/courses", "Courses", <BookOpen className="h-4 w-4 mr-2" />)}
          {renderRoleBasedLinks()}
          {renderNavLink("/forum", "Forum", <MessageSquare className="h-4 w-4 mr-2" />)}
          {renderNavLink("/about", "About", <InfoIcon className="h-4 w-4 mr-2" />)}
          {renderNavLink("/contact", "Contact Us", <PhoneCall className="h-4 w-4 mr-2" />)}
        </div>

        {/* Right Side Actions */}
        <div className={styles.navActions}>
          <SignedOut>
            <div className={styles.authButtons}>
              <SignInButton>
                <Button variant="ghost" size="sm" className={styles.signInButton}>
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button variant="solid" size="sm" className={styles.signUpButton}>
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
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

          <SwitchDarkLightModeIcon 
            className={styles.themeToggle}
            defaultSelected={theme === 'dark'}
            onChange={(isSelected) => {
              setTheme(isSelected ? 'dark' : 'light')
            }}
          />

          {/* Mobile Menu Button - Moved to the end */}
          <button
            className={styles.mobileMenuButton}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.div>
          </button>
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
            {renderNavLink("/", "Home", <Home className="h-5 w-5 mr-3" />, true)}
            {renderNavLink("/courses", "Courses", <BookOpen className="h-5 w-5 mr-3" />, true)}
            {renderRoleBasedLinks(true)}
            {renderNavLink("/forum", "Forum", <MessageSquare className="h-5 w-5 mr-3" />, true)}
            {renderNavLink("/about", "About", <InfoIcon className="h-5 w-5 mr-3" />, true)}
            {renderNavLink("/contact", "Contact Us", <PhoneCall className="h-5 w-5 mr-3" />, true)}

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

              <SignedOut >
                <SignInButton>
                  <Button variant="ghost" className={styles.mobileAuthButtons} size="sm">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button variant="solid" className={styles.mobileAuthButtons} size="sm">
                    Sign Up
                  </Button>
                </SignUpButton>
              </SignedOut>
            

            {/* <div className={styles.mobileAuthButtons}>
              
            </div> */}
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}