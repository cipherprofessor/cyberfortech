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
  Atom,
  ArrowLeft
} from 'lucide-react';
import styles from './ServiceSidebar.module.scss';
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

const sidebarVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  }
};

const ServiceSidebar: React.FC = () => {
  const pathname = usePathname();
  
  return (
    <motion.div 
      className={styles.sidebar}
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
    >
      <div className={styles.sidebarHeader}>
        <Link href="/services" className={styles.backLink}>
          <ArrowLeft size={16} />
          <span>All Services</span>
        </Link>
        
        <h2 className={styles.sidebarTitle}>Our Services</h2>
      </div>
      
      <div className={styles.serviceList}>
        {serviceNavItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          
          return (
            <motion.div
              key={item.path}
              variants={itemVariants}
            >
              <Link 
                href={item.path} 
                className={`${styles.serviceItem} ${isActive ? styles.active : ''}`}
                style={{ 
                  '--service-color': item.color,
                  '--service-color-rgb': hexToRgb(item.color)
                } as React.CSSProperties}
              >
                <div className={styles.iconWrapper}>
                  <Icon size={18} className={styles.serviceIcon} />
                  {isActive && <div className={styles.activeIndicator} />}
                </div>
                <span className={styles.serviceName}>{item.name}</span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ServiceSidebar;