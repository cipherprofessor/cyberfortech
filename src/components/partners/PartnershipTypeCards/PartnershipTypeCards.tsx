"use client"
import { motion } from 'framer-motion';
import { Building2, GraduationCap, ShieldCheck, Globe } from 'lucide-react';
import styles from './PartnershipTypeCards.module.scss';
import { JSX } from 'react';

interface PartnershipTypeProps {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
  benefits: string[];
  color: string;
}

export function PartnershipTypeCards() {
  const partnershipTypes: PartnershipTypeProps[] = [
    {
      id: 1,
      title: 'Technology Partners',
      description: 'Integrate your solutions with our platform to deliver enhanced security capabilities',
      icon: <ShieldCheck size={28} />,
      benefits: [
        'API integration opportunities',
        'Joint product development',
        'Technical support & resources',
        'Co-branded marketing materials'
      ],
      color: '#3b82f6' // Blue
    },
    {
      id: 2,
      title: 'Education Partners',
      description: 'Collaborate on training programs and curriculum development for cybersecurity education',
      icon: <GraduationCap size={28} />,
      benefits: [
        'Curriculum licensing',
        'Training program discounts',
        'Certification pathways',
        'Research collaboration'
      ],
      color: '#10b981' // Green
    },
    {
      id: 3,
      title: 'Corporate Partners',
      description: 'Strategic alliances to address complex cybersecurity challenges in the enterprise',
      icon: <Building2 size={28} />,
      benefits: [
        'Preferential pricing',
        'Dedicated support team',
        'Executive briefings',
        'Early access to new features'
      ],
      color: '#8b5cf6' // Purple
    },
    {
      id: 4,
      title: 'Global Alliance Partners',
      description: 'International partnerships to expand reach and develop region-specific solutions',
      icon: <Globe size={28} />,
      benefits: [
        'Localization support',
        'Regional market insights',
        'International business development',
        'Global event participation'
      ],
      color: '#f59e0b' // Amber
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

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className={styles.partnershipTypesContainer}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {partnershipTypes.map((type) => (
        <motion.div 
          key={type.id} 
          className={styles.partnershipCard}
          variants={cardVariants}
          whileHover={{ y: -10, boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)' }}
          transition={{ type: 'spring', stiffness: 300 }}
          style={{ borderColor: type.color }}
        >
          <div 
            className={styles.cardIcon} 
            style={{ color: type.color, backgroundColor: `${type.color}15` }}
          >
            {type.icon}
          </div>
          <h3 className={styles.cardTitle}>{type.title}</h3>
          <p className={styles.cardDescription}>{type.description}</p>
          
          <h4 className={styles.benefitsTitle}>Key Benefits</h4>
          <ul className={styles.benefitsList}>
            {type.benefits.map((benefit, index) => (
              <li key={index} className={styles.benefitItem}>
                <span 
                  className={styles.benefitBullet}
                  style={{ backgroundColor: type.color }}
                ></span>
                {benefit}
              </li>
            ))}
          </ul>
          
          <button 
            className={styles.learnMoreButton}
            style={{ 
              backgroundColor: type.color,
              borderColor: type.color
            }}
          >
            Learn More
          </button>
        </motion.div>
      ))}
    </motion.div>
  );
}