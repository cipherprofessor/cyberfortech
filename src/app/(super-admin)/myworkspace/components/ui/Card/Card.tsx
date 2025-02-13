//src/app/(super-admin)/myworkspace/components/ui/Card/Card.tsx
'use client';

import { motion } from 'framer-motion';
import styles from './Card.module.scss';
import { CardProps } from '../../lib/types';



export function Card({ icon, title, value, change, color }: CardProps) {
  return (
    <motion.div
      className={styles.card}
      whileHover={{ y: -5, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`${styles.iconContainer} ${color}`}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.value}>{value}</p>
      <p className={styles.change}>{change}</p>
      <div className={styles.hoverBorder} />
    </motion.div>
  );
}