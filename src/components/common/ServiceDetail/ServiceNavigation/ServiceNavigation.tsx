"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Code2,
  Cloud,
  Network,
  Lock,
  Search,
  ServerCrash,
  Atom
} from 'lucide-react';
import styles from './ServiceNavigation.module.scss';

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

const ServiceNavigation: React.FC = () => {
  const pathname = usePathname();
  
  return (
    <nav className={styles.serviceNavigation}>
      <div className={styles.container}>
        <motion.div 
          className={styles.navTitle}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Our Services
        </motion.div>
        
        <div className={styles.navItems}>
          {serviceNavItems.map((item, index) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link 
                  href={item.path} 
                  className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                  style={{ 
                    '--nav-item-color': item.color,
                    borderColor: isActive ? item.color : 'transparent'
                  } as React.CSSProperties}
                >
                  <Icon className={styles.navIcon} />
                  <span>{item.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default ServiceNavigation;