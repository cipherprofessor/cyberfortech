"use client";
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
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
  Shield,
  ArrowRight
} from 'lucide-react';
import styles from './ServicesSlider.module.scss';

const services = [
  {
    icon: ShieldCheck,
    title: "Network Security",
    description: "Protect your network infrastructure",
    color: "#3b82f6"
  },
  {
    icon: Code2,
    title: "Secure Development",
    description: "Build secure applications",
    color: "#8b5cf6"
  },
  {
    icon: Cloud,
    title: "Cloud Security",
    description: "Secure cloud infrastructure",
    color: "#06b6d4"
  },
  {
    icon: Search,
    title: "Penetration Testing",
    description: "Identify vulnerabilities",
    color: "#ef4444"
  },
  {
    icon: Database,
    title: "Database Security",
    description: "Protect sensitive data",
    color: "#10b981"
  },
  {
    icon: Lock,
    title: "Access Control",
    description: "Manage authentication",
    color: "#f59e0b"
  },
  {
    icon: AlertTriangle,
    title: "Incident Response",
    description: "Handle security incidents",
    color: "#ec4899"
  },
  {
    icon: FileCode,
    title: "Security Auditing",
    description: "Comprehensive assessments",
    color: "#6366f1"
  },
  {
    icon: Server,
    title: "Infrastructure Security",
    description: "Secure your systems",
    color: "#14b8a6"
  },
  {
    icon: Shield,
    title: "Compliance",
    description: "Meet security standards",
    color: "#8b5cf6"
  }
];

const duplicatedServices = [...services, ...services];

export function ServicesSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 0.6]);

  return (
    <section className={styles.sliderSection} ref={containerRef}>
      <div className={styles.glow} />
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          style={{ y, opacity }}
        >
          <motion.span 
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Our Expertise
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Comprehensive Security Solutions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Protecting your digital assets with cutting-edge cybersecurity services
          </motion.p>
        </motion.div>

        <div className={styles.sliderContainer}>
          <div className={styles.slider}>
            <motion.div 
              className={styles.track}
              animate={{
                x: ["0%", "-50%"]
              }}
              transition={{
                x: {
                  duration: 40,
                  repeat: Infinity,
                  ease: "linear"
                }
              }}
            >
              {duplicatedServices.map((service, index) => (
                <motion.div 
                  key={index} 
                  className={styles.serviceCard}
                  style={{ "--card-color": service.color } as any}
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className={styles.cardContent}>
                    <div className={styles.iconWrapper}>
                      <service.icon className={styles.icon} />
                      <motion.div 
                        className={styles.iconBg}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      />
                    </div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <motion.div 
                      className={styles.learnMore}
                      whileHover={{ x: 5 }}
                    >
                      Learn More <ArrowRight size={16} />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className={styles.overlay}>
            <div className={styles.gradientLeft} />
            <div className={styles.gradientRight} />
          </div>
        </div>

        <motion.div 
          className={styles.cta}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.button 
            className={styles.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore All Services
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}