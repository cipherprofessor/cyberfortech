// src/components/courses/CourseContent/CourseContent.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book, 
  Video, 
  FileText, 
  CheckCircle, 
  Lock,
  ChevronDown,
  PlayCircle,
  Award
} from 'lucide-react';
import axios from 'axios';
import styles from './CourseContent.module.scss';

interface Lesson {
  id: string;
  title: string;
  description: string;
  contentType: 'video' | 'article' | 'quiz' | 'assignment';
  duration: number;
  isFreePreview: boolean;
  progress: 'not_started' | 'in_progress' | 'completed';
}

interface Section {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface CourseContentData {
  courseContent: {
    course_demo_url: string;
    course_outline: string;
    learning_objectives: string[];
    prerequisites: string[];
    target_audience: string;
    estimated_completion_time: string;
    course_title: string;
    course_description: string;
    image_url: string;
    level: string;
    instructor_name: string;
  };
  sections: Section[];
  lessonContent: Lesson[];
}

interface CourseContentProps {
  courseId: string;
  className?: string;
}

export const CourseContent: React.FC<CourseContentProps> = ({
  courseId,
  className = ''
}) => {
  const [data, setData] = useState<CourseContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  useEffect(() => {
    const fetchCourseContent = async () => {
      if (!courseId) {
        setError('Course ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`/api/courses/${courseId}/content`, {
          headers: {
            'x-user-id': 'your-user-id' // Add user ID if needed
          }
        });
        setData(response.data);
      } catch (err) {
        setError('Failed to load course content');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseContent();
  }, [courseId]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className={styles.icon} />;
      case 'article':
        return <FileText className={styles.icon} />;
      case 'quiz':
        return <Book className={styles.icon} />;
      case 'assignment':
        return <Award className={styles.icon} />;
      default:
        return <PlayCircle className={styles.icon} />;
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={styles.loadingSpinner}
        />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.errorContainer}>
        <p>{error || 'Failed to load content'}</p>
      </div>
    );
  }

  console.log("responseee",data);

  return (
    <div className={`${styles.courseContent} ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.overview}
      >
        <h2>Course Content</h2>
        {data?.courseContent?.course_demo_url && (
          <div className={styles.demoVideo}>
            <video
              src={data.courseContent.course_demo_url}
              controls
              poster="/demo-thumbnail.jpg"
            />
          </div>
        )}
      </motion.div>

      <div className={styles.sections}>
        {data?.sections?.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
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
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: lessonIndex * 0.05 }}
                      className={styles.lesson}
                    >
                      <div className={styles.lessonInfo}>
                        {getContentIcon(lesson.contentType)}
                        <span className={styles.lessonTitle}>
                          {lesson.title}
                        </span>
                        {lesson.progress === 'completed' && (
                          <CheckCircle className={styles.completedIcon} />
                        )}
                        {!lesson.isFreePreview && (
                          <Lock className={styles.lockIcon} />
                        )}
                      </div>
                      <span className={styles.duration}>
                        {Math.floor(lesson.duration / 60)}min
                      </span>
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
};