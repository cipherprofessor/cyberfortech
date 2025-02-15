
"use client";
  import React from 'react';
  import { motion } from 'framer-motion';
  import * as Icons from 'lucide-react';
  import styles from './ListCard.module.scss';
import { ListCardCategory } from '../../lib/types';

  
  interface CourseCardProps {
    category: ListCardCategory;
  }
  
  const ListCourseCard: React.FC<CourseCardProps> = ({ category }) => {
    const { title, courseCount, price, icon, color } = category;
    const IconComponent = Icons[icon as keyof typeof Icons] as React.ElementType;
  
    return (
      <motion.div
        className={styles.card}
        style={{ '--accent-color': color } as React.CSSProperties}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.iconWrapper}>
        {IconComponent && <IconComponent size={24} />}
        </div>
        
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.courseCount}>
            {courseCount.toLocaleString()} + Courses
          </p>
        </div>
        
        <div className={styles.price}>
          ${price.toFixed(2)}
        </div>
      </motion.div>
    );
  };
  
  export default ListCourseCard;