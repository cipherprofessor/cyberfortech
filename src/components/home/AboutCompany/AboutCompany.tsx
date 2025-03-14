"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Shield,
  Timer,
  Award,
  Medal,
  Bookmark,
  Clock
} from 'lucide-react';
import { Button } from '@/components/common/Button/Button';
import styles from './AboutCompany.module.scss';

const highlights = [
  {
    icon: CheckCircle2,
    title: "Industry Certified",
    description: "All our courses are certified by leading industry bodies"
  },
  {
    icon: TrendingUp,
    title: "Practical Training",
    description: "Hands-on experience with real-world projects"
  },
  {
    icon: Users,
    title: "Expert Instructors",
    description: "Learn from cybersecurity professionals"
  },
  {
    icon: Shield,
    title: "Job Assistance",
    description: "Career guidance and placement support"
  }
];

export function AboutCompany() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.content}>
          <motion.div 
            className={styles.textContent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.span 
              className={styles.subtitle}
              variants={itemVariants}
            >
              About Our Company
            </motion.span>
            
            <motion.h2
              className={styles.title}
              variants={itemVariants}
            >
              Building The Next Generation of{" "}
              <span className={styles.highlight}>Cybersecurity</span> Experts
            </motion.h2>

            <motion.p
              className={styles.description}
              variants={itemVariants}
            >
              Cyberfort Technologies excels in delivering cutting-edge cybersecurity solutions to safeguard businesses, individuals, and government agencies against advanced threats. Services include threat detection, incident response, penetration testing, vulnerability assessments, compliance management, and security consulting, ensuring robust data protection and operational resilience.
            </motion.p>

            <motion.div 
              className={styles.highlights}
              variants={containerVariants}
            >
              {highlights.map((item, index) => (
                <motion.div 
                  key={index} 
                  className={styles.highlightItem}
                  variants={itemVariants}
                >
                  <div className={styles.iconWrapper}>
                    <item.icon className={styles.icon} />
                  </div>
                  <div className={styles.highlightContent}>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* <motion.div 
              className={styles.actions}
              variants={itemVariants}
            >
              <Button size="lg">
                Learn More About Us
              </Button>
            </motion.div> */}
          </motion.div>

          <motion.div 
            className={styles.imageContent}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className={styles.imageWrapper}>
              <Image
                src="/cybersecurity.webp"
                alt="CyberFort Training"
                width={600}
                height={800}
                className={styles.mainImage}
              />
              
              <motion.div 
                className={styles.infoBox + ' ' + styles.experienceBox}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Clock className={styles.infoIcon} />
                <div className={styles.infoContent}>
                  <span className={styles.number}>10+</span>
                  <span className={styles.text}>Years Experience</span>
                </div>
              </motion.div>

              <motion.div 
                className={styles.infoBox + ' ' + styles.certificationBox}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <Award className={styles.infoIcon} />
                <div className={styles.infoContent}>
                  <span className={styles.number}>ISO 27001</span>
                  <span className={styles.text}>Certified</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}