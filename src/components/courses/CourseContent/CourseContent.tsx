'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book, 
  Video, 
  FileText, 
  CheckCircle, 
  Lock,
  ChevronDown,
  PlayCircle,
  Award,
  ListChecks,
  Users,
  TargetIcon,
  MessageCircle,
  Clock
} from 'lucide-react';
import styles from './CourseContent.module.scss';
import { useTheme } from 'next-themes';
import { VideoPlayer } from '@/components/ui/VideoPlayer/VideoPlayer';

interface LessonContent {
  videoUrl: string | null;
  articleContent: string | null;
  quizData: any | null;
  assignmentDetails: any | null;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  contentType: string;
  duration: number;
  isFreePreview: boolean;
  sequenceNumber: number;
  progress?: string;
  content: LessonContent;
}

interface Section {
  id: string;
  title: string;
  description: string;
  sequence_number: number;
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
}

interface CourseContentProps {
  courseId: string;
  courseContentData: CourseContentData;
  className?: string;
}

export const CourseContent: React.FC<CourseContentProps> = ({
  courseId,
  courseContentData,
  className = ''
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'curriculum' | 'objectives' | 'audience' | 'reviews'>('curriculum');
  const [activeLesson, setActiveLesson] = useState<{ lesson: Lesson | null, sectionId: string | null}>({ lesson: null, sectionId: null });
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const openLesson = (lesson: Lesson, sectionId: string) => {
    setActiveLesson({ lesson, sectionId });
    
    // Scroll to the content area
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const closeLesson = () => {
    setActiveLesson({ lesson: null, sectionId: null });
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className={styles.icon} size={18} />;
      case 'article':
        return <FileText className={styles.icon} size={18} />;
      case 'quiz':
        return <Book className={styles.icon} size={18} />;
      case 'assignment':
        return <Award className={styles.icon} size={18} />;
      default:
        return <PlayCircle className={styles.icon} size={18} />;
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
  };

  const getTotalDuration = () => {
    let totalSeconds = 0;
    courseContentData?.sections?.forEach(section => {
      section.lessons?.forEach(lesson => {
        totalSeconds += lesson.duration || 0;
      });
    });
    return formatDuration(totalSeconds);
  };

  const getTotalLessons = () => {
    let count = 0;
    courseContentData?.sections?.forEach(section => {
      count += section.lessons?.length || 0;
    });
    return count;
  };

  // Tab Animations
  const tabVariants = {
    inactive: { opacity: 0.7, y: 5 },
    active: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.3 } }
  };

  const renderLessonContent = () => {
    if (!activeLesson.lesson) return null;
    
    const lesson = activeLesson.lesson;
    
    // Find the section for this lesson
    const section = courseContentData.sections.find(s => s.id === activeLesson.sectionId);
    const sectionTitle = section ? section.title : '';
    
    return (
      <motion.div 
        className={styles.lessonContentWrapper}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <div className={styles.lessonContentHeader}>
          <button className={styles.backButton} onClick={closeLesson}>
            &larr; Back to curriculum
          </button>
          <div className={styles.lessonContentTitle}>
            <h3>{lesson.title}</h3>
            <span className={styles.lessonSectionTitle}>From: {sectionTitle}</span>
          </div>
        </div>
        
        <div className={styles.lessonMainContent}>
          {lesson.contentType === 'video' && lesson.content.videoUrl ? (
            <div className={styles.videoContainer}>
              <VideoPlayer 
                url={lesson.content.videoUrl}
                title={lesson.title}
                className={styles.lessonVideo}
              />
            </div>
          ) : lesson.contentType === 'article' && lesson.content.articleContent ? (
            <div className={styles.articleContainer}>
              <div className={styles.articleContent} 
                dangerouslySetInnerHTML={{ __html: lesson.content.articleContent }} 
              />
            </div>
          ) : (
            <div className={styles.placeholderContent}>
              <PlayCircle size={48} className={styles.placeholderIcon} />
              <p>This {lesson.contentType} content will be available when you enroll in the course.</p>
            </div>
          )}
        </div>
        
        <div className={styles.lessonDetails}>
          <h4>About this lesson</h4>
          <p>{lesson.description}</p>
          <div className={styles.lessonMetadata}>
            <span className={styles.lessonDuration}>
              <Clock size={16} />
              Duration: {formatDuration(lesson.duration)}
            </span>
            {lesson.isFreePreview && (
              <span className={styles.freePreviewBadge}>
                <Award size={16} />
                Free Preview
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`${styles.courseContent} ${isDark ? styles.dark : ''} ${className}`}>
      {/* Tabs */}
      <div className={styles.courseContentTabs}>
        <motion.button
          className={`${styles.tab} ${activeTab === 'curriculum' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('curriculum')}
          variants={tabVariants}
          animate={activeTab === 'curriculum' ? 'active' : 'inactive'}
        >
          <ListChecks size={16} />
          <span>Curriculum</span>
        </motion.button>
        
        <motion.button
          className={`${styles.tab} ${activeTab === 'objectives' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('objectives')}
          variants={tabVariants}
          animate={activeTab === 'objectives' ? 'active' : 'inactive'}
        >
          <TargetIcon size={16} />
          <span>Objectives</span>
        </motion.button>
        
        <motion.button
          className={`${styles.tab} ${activeTab === 'audience' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('audience')}
          variants={tabVariants}
          animate={activeTab === 'audience' ? 'active' : 'inactive'}
        >
          <Users size={16} />
          <span>Target Audience</span>
        </motion.button>
        
        <motion.button
          className={`${styles.tab} ${activeTab === 'reviews' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('reviews')}
          variants={tabVariants}
          animate={activeTab === 'reviews' ? 'active' : 'inactive'}
        >
          <MessageCircle size={16} />
          <span>Reviews</span>
        </motion.button>
      </div>
      
      <div className={styles.contentArea} ref={contentRef}>
        <AnimatePresence mode="wait">
          {/* Course curriculum tab */}
          {activeTab === 'curriculum' && !activeLesson.lesson && (
            <motion.div
              key="curriculum"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={contentVariants}
            >
              <div className={styles.courseStats}>
                <div className={styles.stat}>
                  <ListChecks size={16} className={styles.statIcon} />
                  <span>{courseContentData.sections.length} sections</span>
                </div>
                <div className={styles.stat}>
                  <Book size={16} className={styles.statIcon} />
                  <span>{getTotalLessons()} lessons</span>
                </div>
                <div className={styles.stat}>
                  <Clock size={16} className={styles.statIcon} />
                  <span>{getTotalDuration()} total length</span>
                </div>
              </div>

              <div className={styles.overview}>
                <h3 className={styles.sectionTitle}>Course Overview</h3>
                <p className={styles.courseOutline}>{courseContentData.courseContent.course_outline}</p>
              </div>

              <div className={styles.sections}>
                {courseContentData.sections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={styles.section}
                  >
                    <button
                      className={`${styles.sectionHeader} ${expandedSections.includes(section.id) ? styles.expanded : ''}`}
                      onClick={() => toggleSection(section.id)}
                      aria-expanded={expandedSections.includes(section.id)}
                    > 
                      <div className={styles.sectionInfo}>
                        <div className={styles.sectionTitle}>
                          <span className={styles.sectionNumber}>{index + 1}</span>
                          <h3>{section.title}</h3>
                        </div>
                        <p className={styles.sectionDescription}>{section.description}</p>
                        <div className={styles.sectionMeta}>
                          <span>{section.lessons?.length || 0} lessons</span>
                          <span className={styles.dot}>•</span>
                          <span>{
                            formatDuration(
                              section.lessons?.reduce((total, lesson) => total + (lesson.duration || 0), 0) || 0
                            )
                          }</span>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedSections.includes(section.id) ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className={styles.expandIcon}
                      >
                        <ChevronDown size={20} />
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
                          {section.lessons?.map((lesson, lessonIndex) => (
                            <motion.div
                              key={lesson.id}
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: lessonIndex * 0.05 }}
                              className={styles.lesson}
                              onClick={() => openLesson(lesson, section.id)}
                            >
                              <div className={styles.lessonInfo}>
                                <div className={styles.lessonIcon}>
                                  {getContentIcon(lesson.contentType)}
                                </div>
                                <div className={styles.lessonDetails}>
                                  <span className={styles.lessonTitle}>{lesson.title}</span>
                                  <p className={styles.lessonDescription}>
                                    {lesson.description.length > 80 
                                      ? `${lesson.description.substring(0, 80)}...` 
                                      : lesson.description}
                                  </p>
                                </div>
                              </div>
                              <div className={styles.lessonMeta}>
                                {lesson.progress === 'completed' && (
                                  <CheckCircle className={styles.completedIcon} size={16} />
                                )}
                                {lesson.isFreePreview ? (
                                  <span className={styles.previewBadge}>Preview</span>
                                ) : (
                                  <Lock className={styles.lockIcon} size={16} />
                                )}
                                <span className={styles.duration}>
                                  {formatDuration(lesson.duration)}
                                </span>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
          
          {/* Learning objectives tab */}
          {activeTab === 'objectives' && !activeLesson.lesson && (
            <motion.div
              key="objectives"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={contentVariants}
              className={styles.objectivesTab}
            >
              <h3 className={styles.sectionTitle}>What You'll Learn</h3>
              <ul className={styles.learningObjectives}>
                {courseContentData.courseContent.learning_objectives.map((objective, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={styles.objectiveItem}
                  >
                    <CheckCircle className={styles.objectiveIcon} size={18} />
                    <span>{objective}</span>
                  </motion.li>
                ))}
              </ul>
              
              <h3 className={styles.sectionTitle}>Prerequisites</h3>
              <ul className={styles.prerequisites}>
                {courseContentData.courseContent.prerequisites.map((prerequisite, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={styles.prerequisiteItem}
                  >
                    <div className={styles.bulletPoint} />
                    <span>{prerequisite}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
          
          {/* Target audience tab */}
          {activeTab === 'audience' && !activeLesson.lesson && (
            <motion.div
              key="audience"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={contentVariants}
              className={styles.audienceTab}
            >
              <h3 className={styles.sectionTitle}>Who This Course is For</h3>
              <div className={styles.targetAudience}>
                {courseContentData.courseContent.target_audience.split('\n').map((paragraph, index) => (
                  <motion.p 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={styles.audienceParagraph}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          )}
          
          {/* Reviews tab */}
          {activeTab === 'reviews' && !activeLesson.lesson && (
            <motion.div
              key="reviews"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={contentVariants}
              className={styles.reviewsTab}
            >
              <div className={styles.reviewsPlaceholder}>
                <MessageCircle size={48} className={styles.reviewsIcon} />
                <h3>No Reviews Yet</h3>
                <p>Be the first to review this course after enrollment!</p>
              </div>
            </motion.div>
          )}
          
          {/* Lesson content when a lesson is selected */}
          {activeLesson.lesson && (
            <motion.div
              key="lesson"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={contentVariants}
            >
              {renderLessonContent()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};