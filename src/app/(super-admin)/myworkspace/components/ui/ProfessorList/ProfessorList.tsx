import React from 'react';
import { motion } from 'framer-motion';

import styles from './ProfessorList.module.scss';
import Avatar from '../DataTable/Avatar';

export interface Professor {
  id: string;
  name: string;
  avatar: string;
  degree: string;
  specialization: string;
  totalClasses: number;
}

interface ProfessorListProps {
  data: Professor[];
  title?: string;
  className?: string;
  onProfessorClick?: (professor: Professor) => void;
}

const ProfessorList: React.FC<ProfessorListProps> = ({
  data,
  title = "Top Professors",
  className = "",
  onProfessorClick
}) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <button className={styles.viewAll}>View All</button>
      </div>

      <div className={styles.professorsList}>
        {data.map((professor, index) => (
          <motion.div
            key={professor.id}
            className={styles.professorItem}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onProfessorClick?.(professor)}
          >
            <div className={styles.professorInfo}>
              <Avatar
                src={professor.avatar}
                name={professor.name}
                size="md"
                className={styles.avatar}
              />
              <div className={styles.details}>
                <h3 className={styles.name}>{professor.name}</h3>
                <span className={styles.degree}>{professor.degree}</span>
              </div>
            </div>

            <div className={styles.classInfo}>
              <span className={styles.classCount}>
                {professor.totalClasses.toLocaleString()} Classes
              </span>
              <span className={styles.specialization}>
                {professor.specialization}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProfessorList;