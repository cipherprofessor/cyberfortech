"use client"
import { Users, BookOpen, Trophy, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './StatsSection.module.scss';

const stats = [
  {
    icon: Users,
    number: '10,000+',
    label: 'Students',
    description: 'Active learners worldwide',
  },
  {
    icon: BookOpen,
    number: '50+',
    label: 'Courses',
    description: 'Expert-led programs',
  },
  {
    icon: Trophy,
    number: '95%',
    label: 'Success Rate',
    description: 'Course completion rate',
  },
  {
    icon: Globe,
    number: '50+',
    label: 'Countries',
    description: 'Global community',
  },
];

export function StatsSection() {
  return (
    <section className={styles.statsSection}>
      <div className={styles.container}>
        <h2>Our Impact in Numbers</h2>
        
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className={styles.statCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={styles.iconContainer}>
                <stat.icon className={styles.icon} />
              </div>
              <div className={styles.number}>{stat.number}</div>
              <h3 className={styles.label}>{stat.label}</h3>
              <p className={styles.description}>{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
