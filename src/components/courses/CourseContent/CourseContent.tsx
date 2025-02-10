// src/components/courses/CourseContent/CourseContent.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, PlayCircle, Lock } from 'lucide-react';
import { useTheme } from 'next-themes';
import styles from './CourseContent.module.scss';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  order_index: number;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface CourseContentProps {
  course: {
    sections: Section[];
  };
}

export function CourseContent({ course }: CourseContentProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <div className={`${styles.courseContent} ${isDark ? styles.dark : ''}`}>
      <h2 className={styles.title}>Course Content</h2>
      
      <div className={styles.stats}>
        <span>{course.sections.length} sections</span>
        <span>•</span>
        <span>
          {course.sections.reduce((total, section) => 
            total + section.lessons.length, 0
          )} lessons
        </span>
      </div>

      <div className={styles.sections}>
        {course.sections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={styles.section}
          >
            <button
              className={styles.sectionHeader}
              onClick={() => toggleSection(section.id)}
            >
              <div className={styles.sectionInfo}>
                <h3>Section {index + 1}: {section.title}</h3>
                <span className={styles.lessonCount}>
                  {section.lessons.length} lessons
                </span>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.includes(section.id) ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className={styles.icon} />
              </motion.div>
            </button>

            <AnimatePresence>
              {expandedSections.includes(section.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={styles.lessonList}
                >
                  {section.lessons.map((lesson, lessonIndex) => (
                    <motion.div
                      key={lesson.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: lessonIndex * 0.05 }}
                      className={styles.lesson}
                    >
                      <div className={styles.lessonInfo}>
                        {lessonIndex < 2 ? (
                          <PlayCircle className={styles.playIcon} />
                        ) : (
                          <Lock className={styles.lockIcon} />
                        )}
                        <span className={styles.lessonTitle}>{lesson.title}</span>
                      </div>
                      <span className={styles.duration}>{lesson.duration}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}