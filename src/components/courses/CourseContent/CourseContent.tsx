// components/CourseContent/CourseContent.tsx

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, PlayCircle, Lock } from 'lucide-react';
import { useTheme } from 'next-themes';
import styles from './CourseContent.module.scss';
import type { CourseContentProps, SectionItemProps, LessonItemProps } from '../types';

const LessonItem: React.FC<LessonItemProps> = ({ 
  lesson, 
  index, 
  showDuration, 
  onClick 
}) => {
  const icon = lesson.isLocked ? (
    <Lock className={styles.icon} aria-hidden="true" />
  ) : (
    <PlayCircle className={styles.icon} aria-hidden="true" />
  );

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`${styles.lesson} ${lesson.isLocked ? styles.locked : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Lesson: ${lesson.title}`}
    >
      <div className={styles.lessonInfo}>
        {icon}
        <span className={styles.lessonTitle}>{lesson.title}</span>
      </div>
      {showDuration && <span className={styles.duration}>{lesson.duration}</span>}
    </motion.div>
  );
};

const SectionItem: React.FC<SectionItemProps> = ({
  section,
  index,
  isExpanded,
  onToggle,
  showDuration,
  variant
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`${styles.section} ${styles[variant]}`}
    >
      <button
        className={styles.sectionHeader}
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={`section-${section.id}-content`}
      >
        <div className={styles.sectionInfo}>
          <h3>Section {index + 1}: {section.title}</h3>
          <span className={styles.lessonCount}>
            {section.lessons.length} lessons
          </span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className={styles.icon} aria-hidden="true" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id={`section-${section.id}-content`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.lessonList}
          >
            {section.lessons.map((lesson, lessonIndex) => (
              <LessonItem
                key={lesson.id}
                lesson={lesson}
                index={lessonIndex}
                showDuration={showDuration}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const CourseContent: React.FC<CourseContentProps> = ({
  course,
  className = '',
  onLessonClick,
  onSectionToggle,
  initialExpandedSections = [],
  showDuration = true,
  variant = 'default',
  theme: themeOverride
}) => {
  const { theme: systemTheme } = useTheme();
  const [expandedSections, setExpandedSections] = useState<string[]>(initialExpandedSections);

  const currentTheme = themeOverride || systemTheme || 'light';

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => {
      const newSections = prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId];
      
      onSectionToggle?.(sectionId);
      return newSections;
    });
  }, [onSectionToggle]);

  return (
    <div 
      className={`${styles.courseContent} ${styles[currentTheme]} ${className}`}
      role="region"
      aria-label="Course content"
    >
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
          <SectionItem
            key={section.id}
            section={section}
            index={index}
            isExpanded={expandedSections.includes(section.id)}
            onToggle={() => toggleSection(section.id)}
            showDuration={showDuration}
            variant={variant}
          />
        ))}
      </div>
    </div>
  );
};