// components/aboutus/PrivacyPolicy/PrivacyPolicy.tsx
"use client"
import { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Info, 
  Database, 
  UserCheck, 
  Cookie, 
  Share2, 
  Globe, 
  Clock, 
  RefreshCw, 
  Phone 
} from 'lucide-react';
import styles from './PrivacyPolicy.module.scss';

// Define theme colors for each section
const sectionThemes = {
  1: { color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)' }, // Blue
  2: { color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.1)' }, // Purple
  3: { color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' }, // Green
  4: { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' }, // Amber
  5: { color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' },  // Red
  6: { color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.1)' }, // Pink
  7: { color: '#06b6d4', bgColor: 'rgba(6, 182, 212, 0.1)' },  // Cyan
  8: { color: '#6366f1', bgColor: 'rgba(99, 102, 241, 0.1)' }, // Indigo
  9: { color: '#f97316', bgColor: 'rgba(249, 115, 22, 0.1)' }, // Orange
  10: { color: '#14b8a6', bgColor: 'rgba(20, 184, 166, 0.1)' } // Teal
};

interface PrivacySectionProps {
  id: number;
  title: string;
  content: ReactNode;
  icon: ReactNode;
  theme: {
    color: string;
    bgColor: string;
  };
}

export const PrivacyPolicy = () => {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const toggleSection = (sectionId: number) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const privacySections: PrivacySectionProps[] = [
    {
      id: 1,
      title: "Information We Collect",
      icon: <FileText size={22} />,
      theme: sectionThemes[1],
      content: (
        <>
          <p>We may collect the following types of information when you visit or interact with CyberFort. Tech:</p>
          <ul>
            <li><strong>Personal Identifiable Information (PII):</strong> Name, email address, phone number, and other contact details provided by you.</li>
            <li><strong>Technical Data:</strong> IP address, browser type, operating system, and usage statistics for website optimization.</li>
            <li><strong>Behavioural Data:</strong> User preferences, engagement metrics, and clickstream data for improving user experience.</li>
            <li><strong>Payment Information:</strong> Encrypted and secured payment data for transactions, if applicable.</li>
          </ul>
        </>
      )
    },
    {
      id: 2,
      title: "How We Use Your Information",
      icon: <Info size={22} />,
      theme: sectionThemes[2],
      content: (
        <>
          <p>Your information is utilized for:</p>
          <ul>
            <li>Enhancing the functionality and user experience of CyberFort. Tech.</li>
            <li>Communicating updates, promotions, or critical notifications.</li>
            <li>Ensuring compliance with legal obligations or protecting against security threats.</li>
            <li>Personalizing services and tailoring content to suit your preferences.</li>
          </ul>
        </>
      )
    },
    {
      id: 3,
      title: "Data Security Practices",
      icon: <Database size={22} />,
      theme: sectionThemes[3],
      content: (
        <>
          <p>CyberFort. Tech employs cutting-edge security protocols, including:</p>
          <ul>
            <li>End-to-end encryption for all sensitive data.</li>
            <li>Firewalls and regular vulnerability assessments.</li>
            <li>Restricted access to data for authorized personnel only.</li>
          </ul>
        </>
      )
    },
    {
      id: 4,
      title: "Your Privacy Rights",
      icon: <UserCheck size={22} />,
      theme: sectionThemes[4],
      content: (
        <>
          <p>Under applicable laws, you have the right to:</p>
          <ul>
            <li>Access and rectify your personal information.</li>
            <li>Request deletion of your data.</li>
            <li>Opt out of certain data processing practices.</li>
            <li>Lodge complaints with a data protection authority, where applicable.</li>
          </ul>
        </>
      )
    },
    {
      id: 5,
      title: "Cookies and Tracking Technologies",
      icon: <Cookie size={22} />,
      theme: sectionThemes[5],
      content: (
        <p>Our website uses cookies to enhance user experience and analyse website traffic. You can manage your cookie preferences through your browser settings.</p>
      )
    },
    {
      id: 6,
      title: "Data Sharing and Disclosure",
      icon: <Share2 size={22} />,
      theme: sectionThemes[6],
      content: (
        <>
          <p>We do not sell or rent your information. Data may be shared with:</p>
          <ul>
            <li><strong>Service Providers:</strong> For operational purposes, under strict confidentiality agreements.</li>
            <li><strong>Legal Authorities:</strong> When mandated by law or to safeguard our rights.</li>
          </ul>
        </>
      )
    },
    {
      id: 7,
      title: "International Data Transfers",
      icon: <Globe size={22} />,
      theme: sectionThemes[7],
      content: (
        <p>If you are accessing CyberFort. Tech from outside, please note that your data may be transferred to servers in India, adhering to legal safeguards.</p>
      )
    },
    {
      id: 8,
      title: "Retention Policy",
      icon: <Clock size={22} />,
      theme: sectionThemes[8],
      content: (
        <p>Your data will be retained for as long as necessary to fulfil the purposes outlined in this policy unless a longer retention period is required by law.</p>
      )
    },
    {
      id: 9,
      title: "Updates to This Policy",
      icon: <RefreshCw size={22} />,
      theme: sectionThemes[9],
      content: (
        <p>We may revise this Privacy Policy from time to time. Please check this page periodically for updates.</p>
      )
    },
    {
      id: 10,
      title: "Contact Us",
      icon: <Phone size={22} />,
      theme: sectionThemes[10],
      content: (
        <>
          <p>For questions or concerns regarding this Privacy Policy, reach out to us at:</p>
          <p><strong>Email:</strong> hello@cyberfort.tech, hello@cyberfortech.in</p>
          <p><strong>Phone:</strong> +91-70067-12347, +91-9650-443642</p>
        </>
      )
    }
  ];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className={styles.privacyContainer}>
      <motion.div
        className={styles.privacyHeader}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className={styles.headerIcon}>
          <Shield size={32} />
        </div>
        <h2>Privacy Policy</h2>
        <p className={styles.lastUpdated}>Last Updated: 16-03-2025</p>
        <p>CyberFort. Tech ("we," "our," or "us") is committed to safeguarding your privacy and ensuring the security of your personal data. This Privacy Policy outlines how we collect, use, store, and protect information in compliance with the latest global privacy standards.</p>
      </motion.div>

      <motion.div 
        className={styles.policySectionsGrid}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05
            }
          }
        }}
      >
        {privacySections.map((section) => (
          <motion.div 
            key={section.id}
            className={`${styles.policySection} ${expandedSection === section.id ? styles.expanded : ''}`}
            variants={fadeIn}
            style={{
              borderColor: expandedSection === section.id ? section.theme.color : 'transparent'
            }}
            whileHover={{ 
              boxShadow: `0 6px 16px rgba(0, 0, 0, 0.12)`, 
              borderColor: section.theme.color
            }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div 
              className={styles.sectionHeader}
              onClick={() => toggleSection(section.id)}
              style={{
                background: expandedSection === section.id ? section.theme.bgColor : ''
              }}
            >
              <div className={styles.headerLeft}>
                <div 
                  className={styles.iconContainer} 
                  style={{ 
                    backgroundColor: section.theme.bgColor,
                    color: section.theme.color
                  }}
                >
                  {section.icon}
                </div>
                <h3>{section.id}. {section.title}</h3>
              </div>
              <motion.div 
                animate={{ rotate: expandedSection === section.id ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ color: expandedSection === section.id ? section.theme.color : '' }}
              >
                <ChevronDown size={20} />
              </motion.div>
            </div>
            {expandedSection === section.id && (
              <motion.div 
                className={styles.sectionContent}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {section.content}
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};