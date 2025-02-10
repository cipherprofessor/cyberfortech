"use client"

import { CourseList } from "@/components/courses/CourseList/CourseList";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { 
  Filter, 
  SortDesc, 
  SortAsc, 
  BookOpen, 
  GraduationCap,
  Search,
  Clock,
  TrendingUp,
  DollarSign
} from "lucide-react";
import { useState } from "react";
import styles from "./courses.module.scss";

export default function CoursesPage() {
  const { theme, setTheme } = useTheme();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState("newest");

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  // const sortOptions = [
  //   { value: "newest", label: "Newest First", icon: <Clock size={18} /> },
  //   { value: "popular", label: "Most Popular", icon: <TrendingUp size={18} /> },
  //   { value: "price-low", label: "Price: Low to High", icon: <DollarSign size={18} /> },
  //   { value: "price-high", label: "Price: High to Low", icon: <DollarSign size={18} /> }
  // ];

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.coursesContainer}>
        <motion.div 
          className={styles.header}
          initial="initial"
          animate="animate"
          variants={fadeIn}
        >
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <GraduationCap size={40} className={styles.icon} />
            </div>
            <h1>Our Courses</h1>
            <p>Explore our comprehensive range of cybersecurity courses</p>
          </div>
        </motion.div>

        {/* <div className={styles.controlsSection}>

          <div className={styles.sortingDesktop}>
            {sortOptions.map((option) => (
              <button
                key={option.value}
                className={`${styles.sortButton} ${currentSort === option.value ? styles.active : ''}`}
                onClick={() => setCurrentSort(option.value)}
              >
                {option.icon}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div> */}

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

            {/* <select 
              className={styles.sortSelect}
              value={currentSort}
              onChange={(e) => setCurrentSort(e.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select> */}
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