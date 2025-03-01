"use client"
import { motion } from 'framer-motion';
import { Code, Award, UserCheck, Clock } from 'lucide-react';
import styles from './FeatureCards.module.scss';

export function FeatureCards() {
  const features = [
    {
      icon: <Code size={24} />,
      title: "Hands-on Labs",
      description: "Practice in realistic environments with guided labs that simulate real-world scenarios"
    },
    {
      icon: <Award size={24} />,
      title: "Industry Certifications",
      description: "Courses aligned with top industry certifications to boost your career prospects"
    },
    {
      icon: <UserCheck size={24} />,
      title: "Expert Instructors",
      description: "Learn from professionals with years of experience in the cybersecurity industry"
    },
    {
      icon: <Clock size={24} />,
      title: "Flexible Learning",
      description: "Self-paced courses that fit your schedule, with lifetime access to materials"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className={styles.featuresContainer}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      {features.map((feature, index) => (
        <motion.div 
          key={index}
          className={styles.featureCard}
          variants={item}
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className={styles.iconWrapper}>
            {feature.icon}
          </div>
          <div className={styles.content}>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}