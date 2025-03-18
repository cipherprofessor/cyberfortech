"use client"
import { motion } from 'framer-motion';
import { TrendingUp, Zap, Users, BarChart3, Globe, Award } from 'lucide-react';
import styles from './PartnershipBenefits.module.scss';
import { JSX } from 'react';

interface BenefitProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

export function PartnershipBenefits() {
  const benefits: BenefitProps[] = [
    {
      icon: <TrendingUp size={24} />,
      title: 'Expanded Market Reach',
      description: 'Gain access to new customer segments and markets through our established network and channels.'
    },
    {
      icon: <Zap size={24} />,
      title: 'Enhanced Solutions',
      description: 'Combine our expertise with your offerings to create more comprehensive security solutions.'
    },
    {
      icon: <Users size={24} />,
      title: 'Co-Marketing Opportunities',
      description: 'Participate in joint marketing campaigns, webinars, and events to increase brand visibility.'
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'Revenue Growth',
      description: 'Create new revenue streams through referrals, reselling opportunities, and joint solutions.'
    },
    {
      icon: <Globe size={24} />,
      title: 'Global Exposure',
      description: 'Leverage our international presence to expand your solution\'s footprint across borders.'
    },
    {
      icon: <Award size={24} />,
      title: 'Industry Recognition',
      description: 'Gain credibility and trust through association with CyberFort\'s established reputation.'
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
    <motion.div 
      className={styles.benefitsContainer}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {benefits.map((benefit, index) => (
        <motion.div 
          key={index} 
          className={styles.benefitCard}
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)' }}
        >
          <div className={styles.iconContainer}>
            {benefit.icon}
          </div>
          <div className={styles.contentContainer}>
            <h3 className={styles.benefitTitle}>{benefit.title}</h3>
            <p className={styles.benefitDescription}>{benefit.description}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}