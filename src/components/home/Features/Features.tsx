// src/components/home/Features/Features.tsx
import { motion } from 'framer-motion';
import { 
  Book, 
  Users, 
  Award, 
  Monitor, 
  Shield, 
  Headphones 
} from 'lucide-react';
import styles from './Features.module.scss';

const features = [
  {
    icon: Book,
    title: 'Expert-Led Training',
    description: 'Learn from industry professionals with years of real-world experience in cybersecurity.',
    color: '#007bff',
  },
  {
    icon: Monitor,
    title: 'Hands-On Labs',
    description: 'Practice in real-world scenarios with our state-of-the-art virtual lab environment.',
    color: '#28a745',
  },
  {
    icon: Shield,
    title: 'Industry Certification',
    description: 'Prepare for leading certifications with our comprehensive course materials.',
    color: '#dc3545',
  },
  {
    icon: Users,
    title: 'Community Support',
    description: 'Join a community of cybersecurity professionals and like-minded learners.',
    color: '#6f42c1',
  },
  {
    icon: Award,
    title: 'Career Growth',
    description: 'Advance your career with industry-recognized credentials and practical skills.',
    color: '#fd7e14',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Get help whenever you need it with our dedicated support team.',
    color: '#20c997',
  },
];

export function Features() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Why Choose Us</h2>
          <p>Discover what makes our cybersecurity training stand out</p>
        </div>

        <motion.div 
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className={styles.feature}
              variants={itemVariants}
            >
              <div 
                className={styles.iconWrapper}
                style={{ 
                  backgroundColor: `${feature.color}15`,
                  color: feature.color,
                }}
              >
                <feature.icon className={styles.icon} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.number}>10k+</span>
            <span className={styles.label}>Active Students</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.number}>50+</span>
            <span className={styles.label}>Expert Instructors</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.number}>95%</span>
            <span className={styles.label}>Success Rate</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.number}>24/7</span>
            <span className={styles.label}>Support Available</span>
          </div>
        </div>
      </div>
    </section>
  );
}