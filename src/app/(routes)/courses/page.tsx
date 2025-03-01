"use client"

import { CourseList } from "@/components/courses/CourseList/CourseList";
import { motion } from "framer-motion";
import { 
  Filter, 
  GraduationCap,
  Sparkles,
  ChevronDown
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import styles from "./courses.module.scss";

export default function CoursesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  
  // Check if it's mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Track scroll for header effects
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.getBoundingClientRect().height;
        setIsScrolled(window.scrollY > headerHeight / 2);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className={`${styles.pageWrapper} ${isDark ? styles.dark : ''}`}>
      <div className={styles.coursesContainer}>
        <motion.div 
          ref={headerRef}
          className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}
          initial="hidden"
          animate="show"
          variants={staggerContainer}
        >
          <motion.div 
            className={styles.headerLeft}
            variants={staggerItem}
          >
            <GraduationCap size={55} className={styles.icon} />
            <div className={styles.headerText}>
              <h1>Our Courses</h1>
              <p>Explore our comprehensive range of cybersecurity courses</p>
            </div>
          </motion.div>
          
          <motion.div 
            className={styles.headerBadge}
            variants={staggerItem}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles size={16} />
            <span>New courses added regularly</span>
          </motion.div>
        </motion.div>

        <main className={styles.courseSection}>
          {isMobile && (
            <motion.div 
              className={styles.mobileSorting}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <button 
                className={`${styles.filterToggle} ${isFilterOpen ? styles.active : ''}`}
                onClick={toggleFilters}
                aria-expanded={isFilterOpen}
                aria-label="Toggle filters"
              >
                <Filter size={16} />
                <span>{isFilterOpen ? 'Hide Filters' : 'Show Filters'}</span>
                <ChevronDown 
                  size={14} 
                  className={`${styles.chevron} ${isFilterOpen ? styles.rotated : ''}`} 
                />
              </button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={styles.courseListWrapper}
          >
            <CourseList 
              isFilterOpen={isFilterOpen} 
              onFilterToggle={setIsFilterOpen} 
            />
          </motion.div>
        </main>
      </div>
    </div>
  );
}