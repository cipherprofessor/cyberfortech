"use client"
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Building2, GraduationCap, ShieldCheck, LandmarkIcon, ExternalLink } from 'lucide-react';
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
  const [activeFilter, setActiveFilter] = useState<string>('All');
  
  const partners: PartnerProps[] = [
    {
      id: 1,
      name: 'TechShield Security',
      logo: '/partners/tech_schield.jpg',
      description: 'A leading provider of enterprise-grade security solutions',
      category: 'Technology',
      partnerSince: '2020',
      website: 'https://techshield.example.com'
    },
    {
      id: 2,
      name: 'SecureNet Academy',
      logo: '/partners/securenet.jpg',
      description: 'Premier cybersecurity education and certification provider',
      category: 'Education',
      partnerSince: '2021',
      website: 'https://securenet.example.com'
    },
    {
      id: 3,
      name: 'DataGuard Solutions',
      logo: '/partners/data_security.jpg',
      description: 'Specialized in data protection and privacy compliance',
      category: 'Corporate',
      partnerSince: '2019',
      website: 'https://dataguard.example.com'
    },
    {
      id: 4,
      name: 'CyberDefense Institute',
      logo: '/partners/cyber_defence.jpg',
      description: 'Research and development in advanced threat detection',
      category: 'Education',
      partnerSince: '2022',
      website: 'https://cyberdefense.example.com'
    },
    {
      id: 5,
      name: 'SafetyNet Corporation',
      logo: '/partners/securenet.jpg',
      description: 'Enterprise solutions for network security and monitoring',
      category: 'Corporate',
      partnerSince: '2018',
      website: 'https://safetynet.example.com'
    },
    // {
    //   id: 6,
    //   name: 'Digital Fortress',
    //   logo: '/partners/partner-logo-6.svg',
    //   description: 'Cloud security and infrastructure protection services',
    //   category: 'Technology',
    //   partnerSince: '2021',
    //   website: 'https://digitalfortress.example.com'
    // },
    {
      id: 6,
      name: 'Cyber Intelligence Agency',
      logo: '/partners/cyberintelligenceagency.jpg',
      description: 'Government-backed cybersecurity research and defense',
      category: 'Government',
      partnerSince: '2020',
      website: 'https://cyberintel.example.gov'
    }
  ];

  // Function to filter partners based on active filter
  const getFilteredPartners = () => {
    if (activeFilter === 'All') {
      return partners;
    }
    return partners.filter(partner => partner.category === activeFilter);
  };

  const filteredPartners = getFilteredPartners();

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
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  // Get category icon based on partner category
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'Technology':
        return <ShieldCheck size={18} className={styles.categoryIcon} />;
      case 'Education':
        return <GraduationCap size={18} className={styles.categoryIcon} />;
      case 'Corporate':
        return <Building2 size={18} className={styles.categoryIcon} />;
      case 'Government':
        return <LandmarkIcon size={18} className={styles.categoryIcon} />;
      default:
        return <ShieldCheck size={18} className={styles.categoryIcon} />;
    }
  };

  // Get category color based on partner category
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Technology':
        return '#3b82f6'; // Blue
      case 'Education':
        return '#10b981'; // Green
      case 'Corporate':
        return '#8b5cf6'; // Purple
      case 'Government':
        return '#f59e0b'; // Amber
      default:
        return '#3b82f6'; // Default blue
    }
  };

  return (
    <div className={styles.partnersListContainer}>
      <div className={styles.filterBar}>
        <div className={styles.filterLabel}>Filter by:</div>
        <div className={styles.filterButtons}>
          <button 
            className={`${styles.filterButton} ${activeFilter === 'All' ? styles.active : ''}`}
            onClick={() => setActiveFilter('All')}
          >
            All
          </button>
          <button 
            className={`${styles.filterButton} ${activeFilter === 'Technology' ? styles.active : ''}`}
            onClick={() => setActiveFilter('Technology')}
            style={{ 
              borderColor: activeFilter === 'Technology' ? '#3b82f6' : 'transparent',
              backgroundColor: activeFilter === 'Technology' ? 'rgba(59, 130, 246, 0.1)' : ''  
            }}
          >
            <ShieldCheck size={16} className={styles.filterIcon} />
            Technology
          </button>
          <button 
            className={`${styles.filterButton} ${activeFilter === 'Education' ? styles.active : ''}`}
            onClick={() => setActiveFilter('Education')}
            style={{ 
              borderColor: activeFilter === 'Education' ? '#10b981' : 'transparent',
              backgroundColor: activeFilter === 'Education' ? 'rgba(16, 185, 129, 0.1)' : ''  
            }}
          >
            <GraduationCap size={16} className={styles.filterIcon} />
            Education
          </button>
          <button 
            className={`${styles.filterButton} ${activeFilter === 'Corporate' ? styles.active : ''}`}
            onClick={() => setActiveFilter('Corporate')}
            style={{ 
              borderColor: activeFilter === 'Corporate' ? '#8b5cf6' : 'transparent',
              backgroundColor: activeFilter === 'Corporate' ? 'rgba(139, 92, 246, 0.1)' : ''  
            }}
          >
            <Building2 size={16} className={styles.filterIcon} />
            Corporate
          </button>
          <button 
            className={`${styles.filterButton} ${activeFilter === 'Government' ? styles.active : ''}`}
            onClick={() => setActiveFilter('Government')}
            style={{ 
              borderColor: activeFilter === 'Government' ? '#f59e0b' : 'transparent',
              backgroundColor: activeFilter === 'Government' ? 'rgba(245, 158, 11, 0.1)' : ''  
            }}
          >
            <LandmarkIcon size={16} className={styles.filterIcon} />
            Government
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={activeFilter}
          className={styles.partnersList}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {filteredPartners.length > 0 ? (
            filteredPartners.map((partner) => (
              <motion.div 
                key={partner.id} 
                className={styles.partnerCard}
                variants={itemVariants}
                whileHover={{ 
                  y: -8, 
                  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
                  borderColor: getCategoryColor(partner.category)
                }}
                transition={{ type: "spring", stiffness: 300 }}
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
                    <span 
                      className={styles.partnerCategory}
                      style={{ 
                        backgroundColor: `${getCategoryColor(partner.category)}20`,
                        color: getCategoryColor(partner.category),
                      }}
                    >
                      {getCategoryIcon(partner.category)}
                      {partner.category}
                    </span>
                    <span className={styles.partnerSince}>Partner since {partner.partnerSince}</span>
                  </div>
                  <a 
                    href={partner.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.partnerLink}
                    style={{ color: getCategoryColor(partner.category) }}
                  >
                    Visit Website
                    <ExternalLink size={14} className={styles.linkIcon} />
                  </a>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              className={styles.noResults}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              No partners found in this category.
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}