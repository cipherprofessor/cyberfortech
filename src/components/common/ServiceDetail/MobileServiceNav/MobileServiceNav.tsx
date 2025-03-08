"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Code2,
  Cloud,
  Network,
  Lock,
  Search,
  ServerCrash,
  Atom,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import styles from './MobileServiceNav.module.scss';
import { hexToRgb } from '../colorUtils';


// Service navigation mapping with paths and icons
const serviceNavItems = [
  {
    name: 'Network Security',
    path: '/services/network-security',
    icon: Network,
    color: '#007bff'
  },
  {
    name: 'Application Security',
    path: '/services/application-security',
    icon: Code2,
    color: '#00bcd4'
  },
  {
    name: 'Cloud Security',
    path: '/services/cloud-security',
    icon: Cloud,
    color: '#6610f2'
  },
  {
    name: 'Penetration Testing',
    path: '/services/penetration-testing',
    icon: Search,
    color: '#dc3545'
  },
  {
    name: 'Security Compliance',
    path: '/services/security-compliance',
    icon: ShieldCheck,
    color: '#28a745'
  },
  {
    name: 'Incident Response',
    path: '/services/incident-response',
    icon: Lock,
    color: '#fd7e14'
  },
  {
    name: 'AWS Cloud Security',
    path: '/services/aws-cloud-security',
    icon: ServerCrash,
    color: '#007bff'
  },
  {
    name: 'Full Stack Development',
    path: '/services/full-stack-development',
    icon: Atom,
    color: '#00bcd4'
  }
];

const MobileServiceNav: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Find current service based on pathname
  const currentService = serviceNavItems.find(item => item.path === pathname);
  
  return (
    <div className={styles.mobileNav}>
      <div className={styles.navHeader}>
        <div className={styles.currentService}>
          {currentService ? (
            <>
              <div 
                className={styles.iconContainer}
                style={{ 
                  '--service-color': currentService.color,
                  '--service-color-rgb': hexToRgb(currentService.color)
                } as React.CSSProperties}
              >
                <currentService.icon size={18} />
              </div>
              <h1 className={styles.serviceName}>{currentService.name}</h1>
            </>
          ) : (
            <h1 className={styles.serviceName}>Our Services</h1>
          )}
        </div>
        
        <button 
          className={styles.menuButton}
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={styles.menuOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className={styles.menuContent}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className={styles.menuHeader}>
                <h2>Our Services</h2>
                <button 
                  onClick={toggleMenu}
                  className={styles.closeButton}
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className={styles.servicesList}>
                {serviceNavItems.map((item) => {
                  const isActive = pathname === item.path;
                  const Icon = item.icon;
                  
                  return (
                    <Link 
                      key={item.path}
                      href={item.path} 
                      className={`${styles.serviceItem} ${isActive ? styles.active : ''}`}
                      style={{ 
                        '--service-color': item.color,
                        '--service-color-rgb': hexToRgb(item.color)
                      } as React.CSSProperties}
                      onClick={toggleMenu}
                    >
                      <div className={styles.serviceItemContent}>
                        <div className={styles.serviceIconContainer}>
                          <Icon size={18} className={styles.serviceIcon} />
                        </div>
                        <span>{item.name}</span>
                      </div>
                      <ChevronRight size={16} className={styles.chevron} />
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileServiceNav;