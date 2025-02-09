"use client";
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Code2, 
  Cloud, 
  Network, 
  Lock, 
  Search,
  Shield,
  Database,
  FileCode2,
  CloudLightning,
  ShieldAlert,
  CircuitBoard,
  ArrowRight,
  Atom,
  ServerCrash
} from 'lucide-react';
import Link from 'next/link';
import styles from './ServiceCards.module.scss';

const services = [
  {
    title: "Network Security",
    description: "Implement robust network protection strategies with advanced threat detection and prevention systems.",
    icon: Network,
    decorativeIcon: CircuitBoard,
    link: "/services/network-security",
    color: "#007bff"
  },
  {
    title: "Application Security",
    description: "Secure your applications throughout the development lifecycle with our comprehensive security solutions.",
    icon: Code2,
    decorativeIcon: FileCode2,
    link: "/services/application-security",
    color: "#00bcd4"
  },
  {
    title: "Cloud Security",
    description: "Protect your cloud infrastructure with state-of-the-art security measures and continuous monitoring.",
    icon: Cloud,
    decorativeIcon: CloudLightning,
    link: "/services/cloud-security",
    color: "#6610f2"
  },
  {
    title: "Penetration Testing",
    description: "Proactively identify and address vulnerabilities with our expert penetration testing services.",
    icon: Search,
    decorativeIcon: ShieldAlert,
    link: "/services/penetration-testing",
    color: "#dc3545"
  },
  {
    title: "Security Compliance",
    description: "Ensure compliance with industry standards and regulations through our comprehensive auditing services.",
    icon: ShieldCheck,
    decorativeIcon: Shield,
    link: "/services/security-compliance",
    color: "#28a745"
  },
  {
    title: "Incident Response",
    description: "Rapid and effective security incident handling with our expert team available 24/7.",
    icon: Lock,
    decorativeIcon: Database,
    link: "/services/incident-response",
    color: "#fd7e14"
  },
  {
    title: "AWS Cloud Security",
    description: "Secure your AWS cloud environment with our advanced security solutions and best practices.",
    icon: ServerCrash,
    decorativeIcon: ServerCrash,
    link: "/services/network-security",
    color: "#007bff"
  },
  {
    title: "Full Stack Development",
    description: "Build scalable and secure web applications with our expert full stack development services.",
    icon: Atom,
    decorativeIcon: Atom,
    link: "/services/application-security",
    color: "#00bcd4"
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

export function ServiceCards() {
  return (
    <section className={styles.servicesSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.glowCircle} />
            <motion.div
              className={styles.titleContainer}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {/* <span className={styles.subtitle}>Explore Our</span> */}
              <h2 className={styles.title}>
                <span className={styles.highlightText}>Explore Our Security</span> Services
              </h2>
              <div className={styles.underline} />
            </motion.div>
            
            <motion.div
              className={styles.descriptionContainer}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <p className={styles.description}>
                Comprehensive cybersecurity solutions tailored to protect your digital assets
              </p>
              <div className={styles.stats}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>100+</span>
                  <span className={styles.statLabel}>Clients Protected</span>
                </div>
                <div className={styles.divider} />
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>24/7</span>
                  <span className={styles.statLabel}>Security Monitoring</span>
                </div>
                <div className={styles.divider} />
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>99.9%</span>
                  <span className={styles.statLabel}>Success Rate</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className={styles.headerAccents}>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className={styles.accentDot}
                style={{
                  left: `${20 + i * 30}%`,
                  animationDelay: `${i * 0.2}s`
                }}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              />
            ))}
          </div>
        </div>

        <div className={styles.cardsGrid}>
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className={styles.card}
              style={{ '--card-color': service.color } as any}
            >
              <Link href={service.link} className={styles.cardLink}>
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <div 
                      className={styles.iconContainer}
                      style={{ '--icon-color': service.color } as any}
                    >
                      <service.icon className={styles.icon} />
                      <motion.div
                        className={styles.iconBackground}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.div
                        className={styles.decorativeIcon}
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        <service.decorativeIcon />
                      </motion.div>
                    </div>
                    <h3 className={styles.title}>
                      {service.title}
                    </h3>
                  </div>

                  <p className={styles.description}>{service.description}</p>

                  <motion.div 
                    className={styles.learnMore}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span>Learn More</span>
                    <ArrowRight className={styles.arrowIcon} />
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}