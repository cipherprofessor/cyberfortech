// src/components/common/Navbar/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
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
  Library,
  ChartSplineIcon,
  PodcastIcon,
  Rss
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTheme } from 'next-themes';
import { faBlog } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Navbar.module.scss';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import SwitchDarkLightModeIcon from '@/components/ui/HeroUI/Switch/SwitchDarkLightModeIcon';
import { IconLayoutDashboardFilled } from '@tabler/icons-react';
import DarkLightThemeButton from '@/components/darklightthemebutton';
import SignInPage from '@/app/(auth)/sign-in/page';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, isSuperAdmin, isAdmin, isStudent, role } = useAuth();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 370);
    };
    
    handleResize(); // Check on initial load
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


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
      src="/logo/logoown.png"
      alt="CyberFort Logo"
      width={40}
      height={40}
      className={styles.logo}
      priority
    />
    <span className={`${styles.logoText} ${styles.hideMobileText}`}>CyberFort Tech</span>
  </Link>

        {/* Desktop Navigation Links */}
        <div className={styles.desktopNav}>
          {renderNavLink("/", "Home", <Home className="h-4 w-4 mr-2" />)}
          {renderNavLink("/courses", "Courses", <BookOpen className="h-4 w-4 mr-2" />)}
          {isAuthenticated && renderRoleBasedLinks()}
          {/* {renderNavLink("/blogs", "Blogs", <FontAwesomeIcon icon={faBlog} className="h-4 w-4 mr-2" />)} */}
          {renderNavLink("/blog", "Blogs", <Rss className="h-4 w-4 mr-2" />)}
          {renderNavLink("/forum", "Forum", <MessageSquare className="h-4 w-4 mr-2" />)}
          {renderNavLink("/about", "About", <InfoIcon className="h-4 w-4 mr-2" />)}
          {renderNavLink("/contact", "Contact Us", <PhoneCall className="h-4 w-4 mr-2" />)}
          {/* {renderNavLink("/tabs", "My tabs", <PhoneCall className="h-4 w-4 mr-2" />)}
          {renderNavLink("/apache-charts", "Charts", <ChartSplineIcon className="h-4 w-4 mr-2" />)} */}
          {/* {renderNavLink("/workspace", "My Workspace", <IconLayoutDashboardFilled className="h-4 w-4 mr-2" />)} */}
        </div>

        {/* Right Side Actions */}
        <div className={styles.navActions}>
          <SwitchDarkLightModeIcon 
            className={styles.themeToggle}
            defaultSelected={theme === 'dark'}
            onChange={(isSelected) => {
              setTheme(isSelected ? 'dark' : 'light')
            }}
          />
          {/* <DarkLightThemeButton /> */}

           {/* Desktop Auth Buttons */}
  <SignedOut>
    <div className={styles.authButtons}>
      <Link href="/sign-in">
        <Button variant="ghost" size="sm" className={styles.signInButton}>
          Sign In
        </Button>
      </Link>
      <Link href="/sign-up">
        <Button variant="solid" size="sm" className={styles.signUpButton}>
          Sign Up
        </Button>
      </Link>
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
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </motion.div>
  </button>
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
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.div>
          </button>
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
            {/* Mobile Navigation Links */}
            {renderNavLink("/", "Home", <Home className="h-5 w-5 mr-3" />, true)}
            {renderNavLink("/courses", "Courses", <BookOpen className="h-5 w-5 mr-3" />, true)}
            {isAuthenticated && renderRoleBasedLinks(true)}
            {renderNavLink("/blog", "Blogs", <Rss className="h-4 w-4 mr-2" />)}
            {renderNavLink("/forum", "Forum", <MessageSquare className="h-5 w-5 mr-3" />, true)}
            {renderNavLink("/about", "About", <InfoIcon className="h-5 w-5 mr-3" />, true)}
            {renderNavLink("/contact", "Contact Us", <PhoneCall className="h-5 w-5 mr-3" />, true)}
            
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}