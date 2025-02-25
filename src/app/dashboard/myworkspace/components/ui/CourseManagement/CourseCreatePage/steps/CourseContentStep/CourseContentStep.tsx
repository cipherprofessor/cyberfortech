'use client';

import { useState } from 'react';
import { PlusCircle, MinusCircle, ChevronDown, ChevronUp, Video, FileText, Book } from 'lucide-react';
import styles from './CourseContentStep.module.scss';
import { CheckboxIcon } from '@radix-ui/react-icons';

interface CourseContentStepProps {
  sections: {
    title: string;
    description: string;
    sequence_number: number;
    lessons: {
      title: string;
      description: string;
      content_type: string;
      duration: number;
      is_free_preview: boolean;
      sequence_number: number;
      content: {
        video_url?: string;
        article_content?: string;
        quiz_data?: any;
        assignment_details?: any;
      };
    }[];
  }[];
  setSections: (sections: any) => void;
  isDark?: boolean;
}

export function CourseContentStep({
  sections,
  setSections,
  isDark = false
}: CourseContentStepProps) {
  const [expandedSections, setExpandedSections] = useState<number[]>(
    // Initialize with first section expanded
    sections.length > 0 ? [0] : []
  );

  // Function to toggle section expansion
  const toggleSection = (sectionIndex: number) => {
    setExpandedSections(prev => {
      if (prev.includes(sectionIndex)) {
        return prev.filter(index => index !== sectionIndex);
      } else {
        return [...prev, sectionIndex];
      }
    });
  };

  // Section manipulation functions
  const addSection = () => {
    const newSection = {
      title: '',
      description: '',
      sequence_number: sections.length + 1,
      lessons: [
        {
          title: '',
          description: '',
          content_type: 'video',
          duration: 0,
          is_free_preview: false,
          sequence_number: 1,
          content: {
            video_url: '',
            article_content: '',
            quiz_data: null,
            assignment_details: null
          }
        }
      ]
    };
    
    setSections([...sections, newSection]);
    
    // Expand the newly added section
    setExpandedSections(prev => [...prev, sections.length]);
  };

  const removeSection = (index: number) => {
    if (sections.length > 1) {
      const newSections = [...sections];
      newSections.splice(index, 1);
      
      // Update sequence numbers
      const updatedSections = newSections.map((section, idx) => ({
        ...section,
        sequence_number: idx + 1
      }));
      
      setSections(updatedSections);
      
      // Update expanded sections
      setExpandedSections(prev => {
        const filtered = prev.filter(sectionIndex => sectionIndex !== index);
        return filtered.map(sectionIndex => sectionIndex > index ? sectionIndex - 1 : sectionIndex);
      });
    }
  };

  const updateSection = (index: number, field: string, value: any) => {
    const newSections = [...sections];
    newSections[index] = {
      ...newSections[index],
      [field]: value
    };
    setSections(newSections);
  };

  // Lesson manipulation functions
  const addLesson = (sectionIndex: number) => {
    const newSections = [...sections];
    const section = newSections[sectionIndex];
    
    section.lessons.push({
      title: '',
      description: '',
      content_type: 'video',
      duration: 0,
      is_free_preview: false,
      sequence_number: section.lessons.length + 1,
      content: {
        video_url: '',
        article_content: '',
        quiz_data: null,
        assignment_details: null
      }
    });
    
    setSections(newSections);
  };

  const removeLesson = (sectionIndex: number, lessonIndex: number) => {
    if (sections[sectionIndex].lessons.length > 1) {
      const newSections = [...sections];
      newSections[sectionIndex].lessons.splice(lessonIndex, 1);
      
      // Update sequence numbers
      newSections[sectionIndex].lessons = newSections[sectionIndex].lessons.map((lesson, idx) => ({
        ...lesson,
        sequence_number: idx + 1
      }));
      
      setSections(newSections);
    }
  };

  const updateLesson = (sectionIndex: number, lessonIndex: number, field: string, value: any) => {
    const newSections = [...sections];
    newSections[sectionIndex].lessons[lessonIndex] = {
      ...newSections[sectionIndex].lessons[lessonIndex],
      [field]: value
    };
    setSections(newSections);
  };

  const updateLessonContent = (sectionIndex: number, lessonIndex: number, field: string, value: any) => {
    const newSections = [...sections];
    newSections[sectionIndex].lessons[lessonIndex].content = {
      ...newSections[sectionIndex].lessons[lessonIndex].content,
      [field]: value
    };
    setSections(newSections);
  };

  // Helper function to get the content type icon
  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'video':
        return <Video size={16} />;
      case 'article':
        return <FileText size={16} />;
      case 'quiz':
        return <CheckboxIcon/>;
      case 'assignment':
        return <Book size={16} />;
      default:
        return <Video size={16} />;
    }
  };

  // Format duration as human readable time
  const formatDuration = (seconds: number) => {
    if (!seconds) return '0 min';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes} min`;
    }
  };

  return (
    <div className={`${styles.container} ${isDark ? styles.dark : ''}`}>
      <div className={styles.header}>
        <h2>Course Content Structure</h2>
        <p>Organize your course into sections and lessons</p>
      </div>
      
      <div className={styles.sectionsContainer}>
        {sections.map((section, sectionIndex) => {
          const isExpanded = expandedSections.includes(sectionIndex);
          
          return (
            <div key={`section-${sectionIndex}`} className={styles.section}>
              <div 
                className={styles.sectionHeader}
                onClick={() => toggleSection(sectionIndex)}
              >
                <div className={styles.sectionInfo}>
                  <div className={styles.sectionIndex}>Section {sectionIndex + 1}</div>
                  <div className={styles.sectionTitle}>
                    {section.title || 'Untitled Section'}
                  </div>
                </div>
                <div className={styles.sectionActions}>
                  <div className={styles.lessonCount}>
                    {section.lessons.length} {section.lessons.length === 1 ? 'lesson' : 'lessons'}
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSection(sectionIndex);
                    }}
                    className={styles.removeButton}
                    disabled={sections.length === 1}
                    aria-label="Remove section"
                  >
                    <MinusCircle size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className={styles.expandButton}
                    aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
                  >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>
              
              {isExpanded && (
                <div className={styles.sectionContent}>
                  <div className={styles.sectionForm}>
                    <div className={styles.formGroup}>
                      <label htmlFor={`section-title-${sectionIndex}`}>Section Title</label>
                      <input
                        type="text"
                        id={`section-title-${sectionIndex}`}
                        value={section.title}
                        onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                        placeholder="Enter section title"
                        className={styles.input}
                        required
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor={`section-description-${sectionIndex}`}>Section Description</label>
                      <textarea
                        id={`section-description-${sectionIndex}`}
                        value={section.description}
                        onChange={(e) => updateSection(sectionIndex, 'description', e.target.value)}
                        placeholder="Briefly describe this section"
                        rows={2}
                        className={styles.textarea}
                      />
                    </div>
                    
                    <div className={styles.lessonsContainer}>
                      <h3>Lessons</h3>
                      
                      {section.lessons.map((lesson, lessonIndex) => (
                        <div key={`lesson-${sectionIndex}-${lessonIndex}`} className={styles.lesson}>
                          <div className={styles.lessonHeader}>
                            <div className={styles.lessonIndex}>Lesson {lessonIndex + 1}</div>
                            <button 
                              type="button" 
                              onClick={() => removeLesson(sectionIndex, lessonIndex)}
                              className={styles.removeButton}
                              disabled={section.lessons.length === 1}
                              aria-label="Remove lesson"
                            >
                              <MinusCircle size={16} />
                            </button>
                          </div>
                          
                          <div className={styles.lessonForm}>
                            <div className={styles.formRow}>
                              <div className={styles.formGroup}>
                                <label htmlFor={`lesson-title-${sectionIndex}-${lessonIndex}`}>Title</label>
                                <input
                                  type="text"
                                  id={`lesson-title-${sectionIndex}-${lessonIndex}`}
                                  value={lesson.title}
                                  onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'title', e.target.value)}
                                  placeholder="Enter lesson title"
                                  className={styles.input}
                                  required
                                />
                              </div>
                              
                              <div className={styles.formGroup}>
                                <label htmlFor={`lesson-type-${sectionIndex}-${lessonIndex}`}>Content Type</label>
                                <select
                                  id={`lesson-type-${sectionIndex}-${lessonIndex}`}
                                  value={lesson.content_type}
                                  onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'content_type', e.target.value)}
                                  className={styles.select}
                                >
                                  <option value="video">Video</option>
                                  <option value="article">Article</option>
                                  <option value="quiz">Quiz</option>
                                  <option value="assignment">Assignment</option>
                                </select>
                              </div>
                            </div>
                            
                            <div className={styles.formGroup}>
                              <label htmlFor={`lesson-description-${sectionIndex}-${lessonIndex}`}>Description</label>
                              <textarea
                                id={`lesson-description-${sectionIndex}-${lessonIndex}`}
                                value={lesson.description}
                                onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'description', e.target.value)}
                                placeholder="Briefly describe this lesson"
                                rows={2}
                                className={styles.textarea}
                              />
                            </div>
                            
                            <div className={styles.formRow}>
                              <div className={styles.formGroup}>
                                <label htmlFor={`lesson-duration-${sectionIndex}-${lessonIndex}`}>Duration (seconds)</label>
                                <input
                                  type="number"
                                  id={`lesson-duration-${sectionIndex}-${lessonIndex}`}
                                  value={lesson.duration}
                                  onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'duration', parseInt(e.target.value) || 0)}
                                  min="0"
                                  className={styles.input}
                                />
                              </div>
                              
                              <div className={styles.formGroup}>
                                <div className={styles.checkboxWrapper}>
                                  <input
                                    type="checkbox"
                                    id={`lesson-preview-${sectionIndex}-${lessonIndex}`}
                                    checked={lesson.is_free_preview}
                                    onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'is_free_preview', e.target.checked)}
                                    className={styles.checkbox}
                                  />
                                  <label 
                                    htmlFor={`lesson-preview-${sectionIndex}-${lessonIndex}`}
                                    className={styles.checkboxLabel}
                                  >
                                    Free Preview
                                  </label>
                                </div>
                              </div>
                            </div>
                            
                            {lesson.content_type === 'video' && (
                              <div className={styles.formGroup}>
                                <label htmlFor={`video-url-${sectionIndex}-${lessonIndex}`}>Video URL</label>
                                <input
                                  type="url"
                                  id={`video-url-${sectionIndex}-${lessonIndex}`}
                                  value={lesson.content.video_url || ''}
                                  onChange={(e) => updateLessonContent(sectionIndex, lessonIndex, 'video_url', e.target.value)}
                                  placeholder="Enter video URL"
                                  className={styles.input}
                                />
                              </div>
                            )}
                            
                            {lesson.content_type === 'article' && (
                              <div className={styles.formGroup}>
                                <label htmlFor={`article-content-${sectionIndex}-${lessonIndex}`}>Article Content</label>
                                <textarea
                                  id={`article-content-${sectionIndex}-${lessonIndex}`}
                                  value={lesson.content.article_content || ''}
                                  onChange={(e) => updateLessonContent(sectionIndex, lessonIndex, 'article_content', e.target.value)}
                                  placeholder="Write article content"
                                  rows={4}
                                  className={styles.textarea}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      <button 
                        type="button" 
                        onClick={() => addLesson(sectionIndex)}
                        className={styles.addLessonButton}
                      >
                        <PlusCircle size={18} />
                        <span>Add Lesson</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        <button 
          type="button" 
          onClick={addSection}
          className={styles.addSectionButton}
        >
          <PlusCircle size={20} />
          <span>Add Section</span>
        </button>
      </div>
    </div>
  );
}