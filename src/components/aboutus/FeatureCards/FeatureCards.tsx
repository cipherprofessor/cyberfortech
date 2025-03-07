"use client"
import { motion } from 'framer-motion';
import { Code, Award, UserCheck, Clock } from 'lucide-react';
import styles from './FeatureCards.module.scss';

export function FeatureCards() {
  const features = [
    {
      icon: <Code size={24} />,
      title: "Industry-Leading Training",
      description: "Cyberfort Technologies offers industry-leading training programs in critical cybersecurity certifications. These certifications empower professionals to excel in ethical hacking, security awareness, incident response, and compliance management. What sets us apart is our holistic, hands-on approach. "
    },
    {
      icon: <Award size={24} />,
      title: "Practical Learning",
      description: "Our programs blend theoretical knowledge with real-world scenarios, enabling participants to apply what they learn directly to evolving cybersecurity challenges. Through simulated attack environments and cutting-edge tools, we ensure trainees gain practical expertise that goes beyond textbook learning."
    },
    {
      icon: <UserCheck size={24} />,
      title: "Expert Instructors",
      description: "Moreover, our instructors are seasoned cybersecurity experts, bringing years of field experience to the training. This ensures that participants receive guidance rooted in industry best practices and real-time insights."
    },
    {
      icon: <Clock size={24} />,
      title: "Tailored Training",
      description: "Unlike generic programs, we tailor training to meet specific organizational or individual needs, focusing on the skills most relevant to their roles. Our commitment to fostering a deep understanding of cybersecurity principles, combined with our practical, adaptable methodology, makes our certification programs a cut above the rest"
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