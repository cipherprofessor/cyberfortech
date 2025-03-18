"use client"
import { useState, useEffect, JSX } from 'react';

import { motion } from 'framer-motion';
import { Building2, GraduationCap, ShieldCheck, Globe } from 'lucide-react';
import styles from './PartnerContactForm.module.scss';
import { ContactForm } from '@/app/(routes)/contact/ContactForm/ContactForm';

interface PartnershipTypeOptionProps {
  id: string;
  title: string;
  icon: JSX.Element;
  color: string;
}

export function PartnerContactForm() {
  const [selectedPartnerType, setSelectedPartnerType] = useState<string | null>(null);

  // Function to be passed to the ContactForm to modify the submission data
  const enhanceFormData = (formData: any) => {
    return {
      ...formData,
      sourcePage: 'partners',
      metadata: JSON.stringify({
        partnerType: selectedPartnerType || 'not_specified',
        partnerPageSubmission: true,
        submittedAt: new Date().toISOString()
      })
    };
  };

  const handleSelectPartnerType = (id: string) => {
    setSelectedPartnerType(id);
    // Log selection for debugging
    console.log(`Selected partnership type: ${id}`);
  };

  const partnershipTypes: PartnershipTypeOptionProps[] = [
    {
      id: 'technology',
      title: 'Technology Partner',
      icon: <ShieldCheck size={24} />,
      color: '#3b82f6' // Blue
    },
    {
      id: 'education',
      title: 'Education Partner',
      icon: <GraduationCap size={24} />,
      color: '#10b981' // Green
    },
    {
      id: 'corporate',
      title: 'Corporate Partner',
      icon: <Building2 size={24} />,
      color: '#8b5cf6' // Purple
    },
    {
      id: 'global',
      title: 'Global Alliance Partner',
      icon: <Globe size={24} />,
      color: '#f59e0b' // Amber
    }
  ];

//   const handleSelectPartnerType = (id: string) => {
//     setSelectedPartnerType(id);
//   };

  return (
    <div className={styles.partnerContactContainer}>
      <div className={styles.formWrapper}>
        <div className={styles.partnershipTypeSelector}>
          <h3 className={styles.selectorTitle}>Partnership Type</h3>
          <p className={styles.selectorDescription}>Choose the type of partnership you're interested in:</p>
          
          <div className={styles.partnerTypeOptions}>
            {partnershipTypes.map((type) => (
              <motion.div
                key={type.id}
                className={`${styles.partnerTypeOption} ${selectedPartnerType === type.id ? styles.selected : ''}`}
                style={{ 
                  borderColor: selectedPartnerType === type.id ? type.color : 'transparent',
                  backgroundColor: selectedPartnerType === type.id ? `${type.color}10` : ''
                }}
                onClick={() => handleSelectPartnerType(type.id)}
                whileHover={{ 
                  scale: 1.02, 
                  backgroundColor: `${type.color}10`,
                  borderColor: type.color
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div 
                  className={styles.optionIcon}
                  style={{ 
                    color: type.color,
                    backgroundColor: `${type.color}15`
                  }}
                >
                  {type.icon}
                </div>
                <span className={styles.optionTitle}>{type.title}</span>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className={styles.contactFormWrapper}>
          <ContactForm enhanceFormData={enhanceFormData} />
        </div>
      </div>
      
      <div className={styles.formSidebar}>
        <div className={styles.sidebarContent}>
          <h3 className={styles.sidebarTitle}>Next Steps After Submission</h3>
          
          <ol className={styles.stepsList}>
            <li className={styles.step}>
              <span className={styles.stepNumber}>1</span>
              <div className={styles.stepContent}>
                <h4 className={styles.stepTitle}>Confirmation</h4>
                <p className={styles.stepDescription}>You'll receive an email confirmation of your submission within 24 hours.</p>
              </div>
            </li>
            
            <li className={styles.step}>
              <span className={styles.stepNumber}>2</span>
              <div className={styles.stepContent}>
                <h4 className={styles.stepTitle}>Initial Call</h4>
                <p className={styles.stepDescription}>Our partnership team will reach out to schedule an initial consultation.</p>
              </div>
            </li>
            
            <li className={styles.step}>
              <span className={styles.stepNumber}>3</span>
              <div className={styles.stepContent}>
                <h4 className={styles.stepTitle}>Partnership Proposal</h4>
                <p className={styles.stepDescription}>We'll prepare a customized partnership proposal based on your needs.</p>
              </div>
            </li>
            
            <li className={styles.step}>
              <span className={styles.stepNumber}>4</span>
              <div className={styles.stepContent}>
                <h4 className={styles.stepTitle}>Onboarding</h4>
                <p className={styles.stepDescription}>Once terms are agreed upon, we'll begin the onboarding process.</p>
              </div>
            </li>
          </ol>
          
          <div className={styles.contactInfo}>
            <h4 className={styles.contactTitle}>Direct Contact</h4>
            <p className={styles.contactText}>For immediate assistance or questions about partnerships:</p>
            <p className={styles.contactEmail}>partnerships@cyberfort.tech</p>
            <p className={styles.contactPhone}>+91-70067-12347</p>
          </div>
        </div>
      </div>
    </div>
  );
}