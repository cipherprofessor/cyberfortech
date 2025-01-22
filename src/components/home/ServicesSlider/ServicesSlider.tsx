// src/components/home/ServicesSlider/ServicesSlider.tsx
import { motion } from 'framer-motion';
import { 
  ShieldCheck,
  Server,
  Code2,
  Cloud,
  Database,
  Lock,
  Search,
  AlertTriangle,
  FileCode,
  Shield
} from 'lucide-react';
import styles from './ServicesSlider.module.scss';

const services = [
  {
    icon: ShieldCheck,
    title: "Network Security",
    description: "Protect your network infrastructure"
  },
  {
    icon: Code2,
    title: "Secure Development",
    description: "Build secure applications"
  },
  {
    icon: Cloud,
    title: "Cloud Security",
    description: "Secure cloud infrastructure"
  },
  {
    icon: Search,
    title: "Penetration Testing",
    description: "Identify vulnerabilities"
  },
  {
    icon: Database,
    title: "Database Security",
    description: "Protect sensitive data"
  },
  {
    icon: Lock,
    title: "Access Control",
    description: "Manage authentication"
  },
  {
    icon: AlertTriangle,
    title: "Incident Response",
    description: "Handle security incidents"
  },
  {
    icon: FileCode,
    title: "Security Auditing",
    description: "Comprehensive assessments"
  },
  {
    icon: Server,
    title: "Infrastructure Security",
    description: "Secure your systems"
  },
  {
    icon: Shield,
    title: "Compliance",
    description: "Meet security standards"
  }
];

// Duplicate the services array for infinite scroll effect
const duplicatedServices = [...services, ...services];

export function ServicesSlider() {
  return (
    <section className={styles.sliderSection}>
      <div className={styles.header}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Our Services & Solutions
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Comprehensive cybersecurity services for your organization
        </motion.p>
      </div>

      <div className={styles.sliderContainer}>
        <div className={styles.slider}>
          <motion.div 
            className={styles.track}
            animate={{
              x: ["0%", "-50%"]
            }}
            transition={{
              x: {
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }
            }}
          >
            {duplicatedServices.map((service, index) => (
              <div key={index} className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  <service.icon className={styles.icon} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className={styles.overlay}>
          <div className={styles.gradientLeft} />
          <div className={styles.gradientRight} />
        </div>
      </div>

      <div className={styles.cta}>
        <motion.button 
          className={styles.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View All Services
        </motion.button>
      </div>
    </section>
  );
}