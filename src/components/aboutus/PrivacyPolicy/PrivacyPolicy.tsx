// components/aboutus/PrivacyPolicy/PrivacyPolicy.tsx
"use client"
import { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
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
  detailItems: {
    title: string;
    description: string;
  }[];
}

export const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState<number>(1);

  const handleSectionClick = (sectionId: number) => {
    setActiveSection(sectionId);
  };

  const privacySections: PrivacySectionProps[] = [
    {
      id: 1,
      title: "Information We Collect",
      icon: <FileText size={22} />,
      theme: sectionThemes[1],
      detailItems: [
        {
          title: "Personal Identifiable Information (PII)",
          description: "Name, email address, phone number, and other contact details provided by you."
        },
        {
          title: "Technical Data",
          description: "IP address, browser type, operating system, and usage statistics for website optimization."
        },
        {
          title: "Behavioural Data",
          description: "User preferences, engagement metrics, and clickstream data for improving user experience."
        },
        {
          title: "Payment Information",
          description: "Encrypted and secured payment data for transactions, if applicable."
        }
      ],
      content: (
        <p>We may collect the following types of information when you visit or interact with CyberFort. Tech:</p>
      )
    },
    {
      id: 2,
      title: "How We Use Your Information",
      icon: <Info size={22} />,
      theme: sectionThemes[2],
      detailItems: [
        {
          title: "Enhance User Experience",
          description: "Improving the functionality and user experience of CyberFort. Tech."
        },
        {
          title: "Communication",
          description: "Sending updates, promotions, or critical notifications."
        },
        {
          title: "Legal Compliance",
          description: "Ensuring compliance with legal obligations or protecting against security threats."
        },
        {
          title: "Personalization",
          description: "Tailoring content and services to suit your preferences."
        }
      ],
      content: (
        <p>Your information is utilized for the following purposes:</p>
      )
    },
    {
      id: 3,
      title: "Data Security Practices",
      icon: <Database size={22} />,
      theme: sectionThemes[3],
      detailItems: [
        {
          title: "End-to-End Encryption",
          description: "All sensitive data is protected using advanced encryption technologies."
        },
        {
          title: "Regular Security Assessments",
          description: "We conduct frequent vulnerability assessments and implement firewalls."
        },
        {
          title: "Access Control",
          description: "Restricted access to data for authorized personnel only."
        },
        {
          title: "Continuous Monitoring",
          description: "24/7 monitoring of our systems for unusual activities and potential threats."
        }
      ],
      content: (
        <p>CyberFort. Tech employs cutting-edge security protocols, including:</p>
      )
    },
    {
      id: 4,
      title: "Your Privacy Rights",
      icon: <UserCheck size={22} />,
      theme: sectionThemes[4],
      detailItems: [
        {
          title: "Access and Rectification",
          description: "You have the right to access and correct your personal information."
        },
        {
          title: "Deletion Request",
          description: "You can request deletion of your data from our systems."
        },
        {
          title: "Opt-Out Options",
          description: "You can opt out of certain data processing practices."
        },
        {
          title: "Complaints",
          description: "You can lodge complaints with a data protection authority, where applicable."
        }
      ],
      content: (
        <p>Under applicable laws, you have the following rights regarding your data:</p>
      )
    },
    {
      id: 5,
      title: "Cookies and Tracking Technologies",
      icon: <Cookie size={22} />,
      theme: sectionThemes[5],
      detailItems: [
        {
          title: "Essential Cookies",
          description: "Required for basic website functionality and security."
        },
        {
          title: "Preference Cookies",
          description: "Store your preferences for a better browsing experience."
        },
        {
          title: "Analytics Cookies",
          description: "Help us understand how users interact with our website."
        },
        {
          title: "Marketing Cookies",
          description: "Used to deliver relevant advertisements and track campaign performance."
        }
      ],
      content: (
        <p>Our website uses cookies to enhance user experience and analyze website traffic. You can manage your cookie preferences through your browser settings.</p>
      )
    },
    {
      id: 6,
      title: "Data Sharing and Disclosure",
      icon: <Share2 size={22} />,
      theme: sectionThemes[6],
      detailItems: [
        {
          title: "Service Providers",
          description: "Third-party vendors who help us operate our business under strict confidentiality agreements."
        },
        {
          title: "Legal Authorities",
          description: "When mandated by law or to safeguard our rights and interests."
        },
        {
          title: "Business Transfers",
          description: "In case of merger, acquisition, or sale of assets, your data may be transferred to the new entity."
        },
        {
          title: "With Your Consent",
          description: "We may share information when you have given us explicit permission to do so."
        }
      ],
      content: (
        <p>We do not sell or rent your information. Your data may be shared in the following circumstances:</p>
      )
    },
    {
      id: 7,
      title: "International Data Transfers",
      icon: <Globe size={22} />,
      theme: sectionThemes[7],
      detailItems: [
        {
          title: "Data Hosting Locations",
          description: "Your data may be transferred to servers in India with appropriate safeguards."
        },
        {
          title: "Legal Safeguards",
          description: "We ensure compliance with international data protection laws and standards."
        },
        {
          title: "Data Protection Agreements",
          description: "We implement appropriate contractual measures for cross-border data transfers."
        },
        {
          title: "Rights Preservation",
          description: "Your privacy rights are preserved regardless of where your data is processed."
        }
      ],
      content: (
        <p>If you are accessing CyberFort. Tech from outside India, please note the following about international data transfers:</p>
      )
    },
    {
      id: 8,
      title: "Retention Policy",
      icon: <Clock size={22} />,
      theme: sectionThemes[8],
      detailItems: [
        {
          title: "Active Account Data",
          description: "Retained as long as your account is active with us."
        },
        {
          title: "Transactional Records",
          description: "Kept for the period necessary for accounting and tax purposes."
        },
        {
          title: "Marketing Data",
          description: "Retained until you withdraw your consent or unsubscribe."
        },
        {
          title: "Legal Requirements",
          description: "Some data may be kept longer to comply with legal obligations."
        }
      ],
      content: (
        <p>Your data will be retained based on the following guidelines:</p>
      )
    },
    {
      id: 9,
      title: "Updates to This Policy",
      icon: <RefreshCw size={22} />,
      theme: sectionThemes[9],
      detailItems: [
        {
          title: "Regular Reviews",
          description: "We periodically review and update this policy to reflect changes in our practices."
        },
        {
          title: "Notification of Changes",
          description: "Material changes will be notified to you via email or site announcement."
        },
        {
          title: "Version History",
          description: "Previous versions of this policy are archived and available upon request."
        },
        {
          title: "Effective Date",
          description: "Each update includes an effective date at the top of the document."
        }
      ],
      content: (
        <p>We may revise this Privacy Policy from time to time. Here's how we manage updates:</p>
      )
    },
    {
      id: 10,
      title: "Contact Us",
      icon: <Phone size={22} />,
      theme: sectionThemes[10],
      detailItems: [
        {
          title: "Email Support",
          description: "hello@cyberfort.tech, hello@cyberfortech.in"
        },
        {
          title: "Phone Support",
          description: "+91-70067-12347, +91-9650-443642"
        },
        {
          title: "Response Time",
          description: "We aim to respond to all privacy inquiries within 48 business hours."
        },
        {
          title: "Data Protection Officer",
          description: "Our DPO can be reached at privacy@cyberfort.tech for specific concerns."
        }
      ],
      content: (
        <p>For questions or concerns regarding this Privacy Policy, reach out to us through the following channels:</p>
      )
    }
  ];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
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

      {/* Mobile View */}
      <div className={styles.mobilePrivacyWrapper}>
        {privacySections.map((section) => (
          <div key={section.id} className={styles.mobileSection}>
            <div 
              className={`${styles.mobileSectionHeader} ${activeSection === section.id ? styles.active : ''}`}
              onClick={() => handleSectionClick(section.id)}
              style={{
                borderColor: activeSection === section.id ? section.theme.color : 'transparent',
                backgroundColor: activeSection === section.id ? section.theme.bgColor : ''
              }}
            >
              <div 
                className={styles.iconContainer}
                style={{ 
                  color: section.theme.color
                }}
              >
                {section.icon}
              </div>
              <span>{section.id}. {section.title}</span>
            </div>
            
            {activeSection === section.id && (
              <motion.div
                className={styles.mobileSectionContent}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                style={{
                  borderColor: section.theme.color,
                }}
              >
                <div className={styles.contentBody}>
                  {section.content}
                  <div className={styles.detailsList}>
                    {section.detailItems.map((item, index) => (
                      <motion.div 
                        key={index} 
                        className={styles.detailItem}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <h4 style={{ color: section.theme.color }}>{item.title}</h4>
                        <p>{item.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className={styles.desktopPrivacyWrapper}>
        <div className={styles.privacyLayout}>
          {/* Tabs Navigation */}
          <div className={styles.tabsContainer}>
            {privacySections.map((section) => (
              <motion.div
                key={section.id}
                className={`${styles.tabItem} ${activeSection === section.id ? styles.active : ''}`}
                onClick={() => handleSectionClick(section.id)}
                style={{
                  borderColor: activeSection === section.id ? section.theme.color : 'transparent',
                  backgroundColor: activeSection === section.id ? section.theme.bgColor : ''
                }}
                whileHover={{
                  backgroundColor: section.theme.bgColor,
                  borderColor: section.theme.color,
                  scale: 1.02
                }}
                transition={{ duration: 0.2 }}
              >
                <div 
                  className={styles.iconContainer}
                  style={{ 
                    color: section.theme.color,
                    backgroundColor: activeSection === section.id ? 'white' : section.theme.bgColor
                  }}
                >
                  {section.icon}
                </div>
                <span>{section.id}. {section.title}</span>
              </motion.div>
            ))}
          </div>

          {/* Content Area */}
          <div className={styles.contentContainer}>
            {privacySections.map((section) => (
              activeSection === section.id && (
                <motion.div
                  key={section.id}
                  className={styles.contentPanel}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  style={{
                    borderColor: section.theme.color,
                  }}
                >
                  <div className={styles.contentHeader} style={{ backgroundColor: section.theme.bgColor }}>
                    <div 
                      className={styles.contentHeaderIcon}
                      style={{ 
                        backgroundColor: 'white',
                        color: section.theme.color
                      }}
                    >
                      {section.icon}
                    </div>
                    <h3>{section.id}. {section.title}</h3>
                  </div>
                  <div className={styles.contentBody}>
                    {section.content}
                    <div className={styles.detailsList}>
                      {section.detailItems.map((item, index) => (
                        <motion.div 
                          key={index} 
                          className={styles.detailItem}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <h4 style={{ color: section.theme.color }}>{item.title}</h4>
                          <p>{item.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};