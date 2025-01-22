// src/components/home/ServiceCards/ServiceCards.tsx
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Code2, 
  Cloud, 
  Network, 
  Lock, 
  Search 
} from 'lucide-react';

import styles from './ServiceCards.module.scss';
import { HoverEffect } from '@/components/ui/card-hover-effect';

const services = [
  {
    title: "Network Security",
    description: "Comprehensive network protection strategies and implementation",
    icon: Network,
    link: "/services/network-security"
  },
  {
    title: "Application Security",
    description: "Secure your applications from development to deployment",
    icon: Code2,
    link: "/services/application-security"
  },
  {
    title: "Cloud Security",
    description: "Protect your cloud infrastructure and data",
    icon: Cloud,
    link: "/services/cloud-security"
  },
  {
    title: "Penetration Testing",
    description: "Identify vulnerabilities before attackers do",
    icon: Search,
    link: "/services/penetration-testing"
  },
  {
    title: "Security Compliance",
    description: "Meet industry standards and regulatory requirements",
    icon: ShieldCheck,
    link: "/services/security-compliance"
  },
  {
    title: "Incident Response",
    description: "Quick and effective security incident handling",
    icon: Lock,
    link: "/services/incident-response"
  }
];

export function ServiceCards() {
  return (
    <section className={styles.servicesSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Services We Provide
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Comprehensive cybersecurity solutions to protect your digital assets
          </motion.p>
        </div>

        <div className={styles.cardsContainer}>
          <HoverEffect items={services.map(service => ({
            title: service.title,
            description: service.description,
            icon: <service.icon className={styles.icon} />,
            link: service.link
          }))} />
        </div>
      </div>

      <div className={styles.background}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className={styles.gradientOrb}
        />
      </div>
    </section>
  );
}