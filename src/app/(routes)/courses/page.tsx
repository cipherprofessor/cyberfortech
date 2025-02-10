// courses/page.tsx
"use client"

import { CourseList } from "@/components/courses/CourseList/CourseList";
import { motion } from "framer-motion";
import { 
  Filter, 
  GraduationCap,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import styles from "./courses.module.scss";

export default function CoursesPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.coursesContainer}>
        <motion.div 
          className={styles.header}
          initial="initial"
          animate="animate"
          variants={fadeIn}
        >
          <div className={styles.headerLeft}>
            <GraduationCap size={55} className={styles.icon} />
            <div className={styles.headerText}>
              <h1>Our Courses</h1>
              <p>Explore our comprehensive range of cybersecurity courses</p>
            </div>
          </div>
          <motion.div 
            className={styles.headerBadge}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles size={16} />
            <span>New courses added regularly</span>
          </motion.div>
        </motion.div>

        <main className={styles.courseSection}>
          <motion.div 
            className={styles.mobileSorting}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <button 
              className={styles.filterToggle}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter size={16} />
              <span>Filters</span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <CourseList />
          </motion.div>
        </main>
      </div>
    </div>
  );
}