"use client"
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './PartnersList.module.scss';

interface PartnerProps {
  id: number;
  name: string;
  logo: string;
  description: string;
  category: 'Technology' | 'Education' | 'Corporate' | 'Government';
  partnerSince: string;
  website: string;
}

export function PartnersList() {
  const partners: PartnerProps[] = [
    {
      id: 1,
      name: 'TechShield Security',
      logo: '/partners/partner-logo-1.svg',
      description: 'A leading provider of enterprise-grade security solutions',
      category: 'Technology',
      partnerSince: '2020',
      website: 'https://techshield.example.com'
    },
    {
      id: 2,
      name: 'SecureNet Academy',
      logo: '/partners/partner-logo-2.svg',
      description: 'Premier cybersecurity education and certification provider',
      category: 'Education',
      partnerSince: '2021',
      website: 'https://securenet.example.com'
    },
    {
      id: 3,
      name: 'DataGuard Solutions',
      logo: '/partners/partner-logo-3.svg',
      description: 'Specialized in data protection and privacy compliance',
      category: 'Corporate',
      partnerSince: '2019',
      website: 'https://dataguard.example.com'
    },
    {
      id: 4,
      name: 'CyberDefense Institute',
      logo: '/partners/partner-logo-4.svg',
      description: 'Research and development in advanced threat detection',
      category: 'Education',
      partnerSince: '2022',
      website: 'https://cyberdefense.example.com'
    },
    {
      id: 5,
      name: 'SafetyNet Corporation',
      logo: '/partners/partner-logo-5.svg',
      description: 'Enterprise solutions for network security and monitoring',
      category: 'Corporate',
      partnerSince: '2018',
      website: 'https://safetynet.example.com'
    },
    {
      id: 6,
      name: 'Digital Fortress',
      logo: '/partners/partner-logo-6.svg',
      description: 'Cloud security and infrastructure protection services',
      category: 'Technology',
      partnerSince: '2021',
      website: 'https://digitalfortress.example.com'
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className={styles.partnersListContainer}>
      <div className={styles.filterBar}>
        <div className={styles.filterLabel}>Filter by:</div>
        <div className={styles.filterButtons}>
          <button className={`${styles.filterButton} ${styles.active}`}>All</button>
          <button className={styles.filterButton}>Technology</button>
          <button className={styles.filterButton}>Education</button>
          <button className={styles.filterButton}>Corporate</button>
          <button className={styles.filterButton}>Government</button>
        </div>
      </div>

      <motion.div 
        className={styles.partnersList}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {partners.map((partner) => (
          <motion.div 
            key={partner.id} 
            className={styles.partnerCard}
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)' }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.partnerLogo}>
              <div className={styles.imageWrapper}>
                <Image 
                  src={partner.logo || '/partners/placeholder-logo.svg'} 
                  alt={partner.name} 
                  width={160} 
                  height={80} 
                />
              </div>
            </div>
            <div className={styles.partnerInfo}>
              <h3>{partner.name}</h3>
              <p className={styles.partnerDescription}>{partner.description}</p>
              <div className={styles.partnerMeta}>
                <span className={styles.partnerCategory}>{partner.category}</span>
                <span className={styles.partnerSince}>Partner since {partner.partnerSince}</span>
              </div>
              <a 
                href={partner.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.partnerLink}
              >
                Visit Website
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}