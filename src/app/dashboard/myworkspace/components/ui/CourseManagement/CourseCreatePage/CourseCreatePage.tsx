'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, PlusCircle, MinusCircle } from 'lucide-react';
import axios from 'axios';

import { Course, Instructor } from '@/types/courses';
import { useTheme } from 'next-themes';
import styles from './CourseCreatePage.module.scss';
import { ErrorAlert, SuccessAlert } from '@/components/ui/Mine/Alert/Alert';
import { CourseImageUpload } from '../components/CourseImageUpload/CourseImageUpload';
import { CourseInstructorSelect } from '../components/CourseInstructorSelect/CourseInstructorSelect';
import { CourseBasicInfo } from '../CourseBasicInfo/CourseBasicInfo';


interface CourseCreatePageProps {
  mode: 'create' | 'edit';
  course?: Course | null;
  onSubmit: (courseData: Partial<Course>) => Promise<void>;
  onCancel: () => void;
}

export function CourseCreatePage({
  mode,
  course,
  onSubmit,
  onCancel
}: CourseCreatePageProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isFileUpload, setIsFileUpload] = useState(false);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedInstructorId, setSelectedInstructorId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Course>>({
    title: '',
    description: '',
    price: 0,
    duration: '',
    level: 'Beginner',
    category: '',
    image_url: '',
  });

  // Course content data
  const [contentData, setContentData] = useState({
    course_demo_url: '',
    course_outline: '',
    learning_objectives: [''],
    prerequisites: [''],
    target_audience: '',
    estimated_completion_time: '',
  });

  // Course sections data
  const [sections, setSections] = useState([
    {
      title: '',
      description: '',
      sequence_number: 1,
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
    }
  ]);

  const showAlert = (type: 'success' | 'error', message: string) => {
    if (type === 'success') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      setErrorMessage(message);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  useEffect(() => {
    if (course && mode === 'edit') {
      setFormData(course);
      setImagePreview(course.image_url || null);
      setSelectedInstructorId(course.instructor_id || null);
      
      // Fetch course content if in edit mode
      if (course.id) {
        fetchCourseContent(course.id);
      }
    } else {
      setFormData({
        title: '',
        description: '',
        price: 0,
        duration: '',
        level: 'Beginner',
        category: '',
        image_url: '',
      });
      setImagePreview(null);
      setSelectedInstructorId(null);
    }
  }, [course, mode]);

  const fetchCourseContent = async (courseId: string) => {
    try {
      const response = await axios.get(`/api/courses/${courseId}/content`);
      const { courseContent, sections: courseSections } = response.data;
      
      if (courseContent) {
        setContentData({
          course_demo_url: courseContent.course_demo_url || '',
          course_outline: courseContent.course_outline || '',
          learning_objectives: courseContent.learning_objectives?.length ? 
            courseContent.learning_objectives : [''],
          prerequisites: courseContent.prerequisites?.length ? 
            courseContent.prerequisites : [''],
          target_audience: courseContent.target_audience || '',
          estimated_completion_time: courseContent.estimated_completion_time || '',
        });
      }
      
      if (courseSections && courseSections.length > 0) {
        const formattedSections = courseSections.map((section: any) => ({
          title: section.title || '',
          description: section.description || '',
          sequence_number: section.sequence_number || 1,
          lessons: section.lessons?.length ? section.lessons.map((lesson: any) => ({
            title: lesson.title || '',
            description: lesson.description || '',
            content_type: lesson.contentType || 'video',
            duration: lesson.duration || 0,
            is_free_preview: lesson.isFreePreview || false,
            sequence_number: lesson.sequenceNumber || 1,
            content: {
              video_url: '',
              article_content: '',
              quiz_data: null,
              assignment_details: null
            }
          })) : [
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
        }));
        
        setSections(formattedSections);
      }
    } catch (error) {
      console.error('Error fetching course content:', error);
      showAlert('error', 'Failed to fetch course content');
    }
  };

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await axios.get('/api/users/instructors');
        
        // Check if response.data has an instructors property
        if (response.data && response.data.instructors) {
          setInstructors(response.data.instructors);
        } else {
          // Fallback if the structure is different
          setInstructors(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        console.error('Error fetching instructors:', error);
        showAlert('error', 'Failed to fetch instructors');
      }
    };
  
    fetchInstructors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep < 3) {
      // Move to next step if validation passes
      if (currentStep === 1) {
        if (!formData.title || !formData.description || !formData.category) {
          showAlert('error', 'Please fill in all required fields');
          return;
        }
        if (!formData.instructor_id) {
          showAlert('error', 'Please select an instructor');
          return;
        }
      }
      
      setCurrentStep(currentStep + 1);
      return;
    }
    
    // Final submission
    setLoading(true);
    
    try {
      // First create/update the course
      const courseResponse = await onSubmit(formData);
      
      // Then create/update course content if this is the final step
      if (currentStep === 3 && course?.id) {
        await saveCourseContent(course.id);
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onCancel();
      }, 2000);
    } catch (error) {
      setErrorMessage('Failed to save course');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const saveCourseContent = async (courseId: string) => {
    try {
      // Save course content
      await axios.post(`/api/courses/${courseId}/content`, {
        courseContent: contentData,
        sections: sections
      });
      
      return true;
    } catch (error) {
      console.error('Error saving course content:', error);
      throw error;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showAlert('error', 'Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showAlert('error', 'Image size should be less than 5MB');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      setFormData(prev => ({ ...prev, image_url: data.url }));
      setImagePreview(URL.createObjectURL(file));
    } catch (error) {
      showAlert('error', 'Failed to upload image');
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
    setImagePreview(null);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Learning objectives handling
  const addLearningObjective = () => {
    setContentData({
      ...contentData,
      learning_objectives: [...contentData.learning_objectives, '']
    });
  };

  const removeLearningObjective = (index: number) => {
    if (contentData.learning_objectives.length > 1) {
      const newObjectives = [...contentData.learning_objectives];
      newObjectives.splice(index, 1);
      setContentData({
        ...contentData,
        learning_objectives: newObjectives
      });
    }
  };

  const updateLearningObjective = (index: number, value: string) => {
    const newObjectives = [...contentData.learning_objectives];
    newObjectives[index] = value;
    setContentData({
      ...contentData,
      learning_objectives: newObjectives
    });
  };

  // Prerequisites handling
  const addPrerequisite = () => {
    setContentData({
      ...contentData,
      prerequisites: [...contentData.prerequisites, '']
    });
  };

  const removePrerequisite = (index: number) => {
    if (contentData.prerequisites.length > 1) {
      const newPrerequisites = [...contentData.prerequisites];
      newPrerequisites.splice(index, 1);
      setContentData({
        ...contentData,
        prerequisites: newPrerequisites
      });
    }
  };

  const updatePrerequisite = (index: number, value: string) => {
    const newPrerequisites = [...contentData.prerequisites];
    newPrerequisites[index] = value;
    setContentData({
      ...contentData,
      prerequisites: newPrerequisites
    });
  };

  // Sections and lessons handling
  const addSection = () => {
    setSections([
      ...sections,
      {
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
      }
    ]);
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Basic Information</h2>
              <div className={styles.sectionContent}>
                <CourseBasicInfo 
                  formData={formData} 
                  setFormData={setFormData} 
                />
              </div>
            </div>
            
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Instructor</h2>
              <div className={styles.sectionContent}>
                <CourseInstructorSelect 
                  instructors={instructors}
                  selectedInstructor={selectedInstructorId}
                  setSelectedInstructor={(id: string) => {
                    setSelectedInstructorId(id);
                    setFormData(prev => ({
                      ...prev,
                      instructor_id: id
                    }));
                  }}
                  setFormData={setFormData}
                  courseInstructorId={course?.instructor_id}
                  isDark={isDark}
                />
              </div>
            </div>
            
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Course Image</h2>
              <div className={styles.sectionContent}>
                <CourseImageUpload 
                  imagePreview={imagePreview}
                  isFileUpload={isFileUpload}
                  formData={formData}
                  setFormData={setFormData}
                  setImagePreview={setImagePreview}
                  showAlert={showAlert}
                  handleImageUpload={handleImageUpload}
                  removeImage={removeImage}
                  setIsFileUpload={setIsFileUpload}
                  isDark={isDark}
                />
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Course Details</h2>
            <div className={styles.sectionContent}>
              <div className={styles.formGroup}>
                <label htmlFor="course_demo_url">Course Demo URL</label>
                <input
                  type="url"
                  id="course_demo_url"
                  value={contentData.course_demo_url}
                  onChange={(e) => setContentData({...contentData, course_demo_url: e.target.value})}
                  placeholder="Enter URL for course demo video"
                  className={styles.input}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="course_outline">Course Outline</label>
                <textarea
                  id="course_outline"
                  value={contentData.course_outline}
                  onChange={(e) => setContentData({...contentData, course_outline: e.target.value})}
                  placeholder="Provide a detailed course outline"
                  rows={4}
                  className={styles.textarea}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Learning Objectives</label>
                {contentData.learning_objectives.map((objective, index) => (
                  <div key={`objective-${index}`} className={styles.arrayInputContainer}>
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => updateLearningObjective(index, e.target.value)}
                      placeholder={`Learning objective ${index + 1}`}
                      className={styles.arrayInput}
                    />
                    <button 
                      type="button" 
                      onClick={() => removeLearningObjective(index)}
                      className={styles.removeButton}
                      disabled={contentData.learning_objectives.length === 1}
                    >
                      <MinusCircle size={18} />
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={addLearningObjective}
                  className={styles.addButton}
                >
                  <PlusCircle size={18} />
                  <span>Add Learning Objective</span>
                </button>
              </div>
              
              <div className={styles.formGroup}>
                <label>Prerequisites</label>
                {contentData.prerequisites.map((prerequisite, index) => (
                  <div key={`prerequisite-${index}`} className={styles.arrayInputContainer}>
                    <input
                      type="text"
                      value={prerequisite}
                      onChange={(e) => updatePrerequisite(index, e.target.value)}
                      placeholder={`Prerequisite ${index + 1}`}
                      className={styles.arrayInput}
                    />
                    <button 
                      type="button" 
                      onClick={() => removePrerequisite(index)}
                      className={styles.removeButton}
                      disabled={contentData.prerequisites.length === 1}
                    >
                      <MinusCircle size={18} />
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={addPrerequisite}
                  className={styles.addButton}
                >
                  <PlusCircle size={18} />
                  <span>Add Prerequisite</span>
                </button>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="target_audience">Target Audience</label>
                <textarea
                  id="target_audience"
                  value={contentData.target_audience}
                  onChange={(e) => setContentData({...contentData, target_audience: e.target.value})}
                  placeholder="Describe the target audience for this course"
                  rows={3}
                  className={styles.textarea}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="estimated_completion_time">Estimated Completion Time</label>
                <input
                  type="text"
                  id="estimated_completion_time"
                  value={contentData.estimated_completion_time}
                  onChange={(e) => setContentData({...contentData, estimated_completion_time: e.target.value})}
                  placeholder="e.g., 4-6 weeks"
                  className={styles.input}
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Course Content Structure</h2>
            <div className={styles.sectionContent}>
              <p className={styles.contentDescription}>
                Define your course structure with sections and lessons.
              </p>
              
              {sections.map((section, sectionIndex) => (
                <div key={`section-${sectionIndex}`} className={styles.sectionContainer}>
                  <div className={styles.sectionHeader}>
                    <h3>Section {sectionIndex + 1}</h3>
                    <button 
                      type="button" 
                      onClick={() => removeSection(sectionIndex)}
                      className={styles.removeButton}
                      disabled={sections.length === 1}
                    >
                      <MinusCircle size={18} />
                    </button>
                  </div>
                  
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
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor={`section-description-${sectionIndex}`}>Description</label>
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
                      <h4>Lessons</h4>
                      
                      {section.lessons.map((lesson, lessonIndex) => (
                        <div key={`lesson-${sectionIndex}-${lessonIndex}`} className={styles.lessonContainer}>
                          <div className={styles.lessonHeader}>
                            <h5>Lesson {lessonIndex + 1}</h5>
                            <button 
                              type="button" 
                              onClick={() => removeLesson(sectionIndex, lessonIndex)}
                              className={styles.removeButton}
                              disabled={section.lessons.length === 1}
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
                                  onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'duration', parseInt(e.target.value))}
                                  min="0"
                                  className={styles.input}
                                />
                              </div>
                              
                              <div className={styles.formGroup}>
                                <label className={styles.checkboxLabel}>
                                  <input
                                    type="checkbox"
                                    checked={lesson.is_free_preview}
                                    onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'is_free_preview', e.target.checked)}
                                    className={styles.checkbox}
                                  />
                                  <span>Free Preview</span>
                                </label>
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
                        className={styles.addButton}
                      >
                        <PlusCircle size={18} />
                        <span>Add Lesson</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
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
      default:
        return null;
    }
  };

  return (
    <div className={`${styles.container} ${isDark ? styles.dark : ''}`}>
      {showSuccess && (
        <SuccessAlert
          message={`Course ${mode === 'create' ? 'created' : 'updated'} successfully!`}
          onClose={() => setShowSuccess(false)}
        />
      )}
      {showError && (
        <ErrorAlert
          message={errorMessage}
          onClose={() => setShowError(false)}
        />
      )}

      <div className={styles.header}>
        <button 
          onClick={onCancel}
          className={styles.backButton}
          aria-label="Go back"
          type="button"
        >
          <ArrowLeft size={20} />
          <span>Back to Courses</span>
        </button>
        <h1>{mode === 'create' ? 'Create New Course' : 'Edit Course'}</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.stepsContainer}>
          <div className={`${styles.step} ${currentStep >= 1 ? styles.active : ''}`}>
            <span className={styles.stepNumber}>1</span>
            <span className={styles.stepText}>Basic Info</span>
          </div>
          <div className={styles.stepConnector}></div>
          <div className={`${styles.step} ${currentStep >= 2 ? styles.active : ''}`}>
            <span className={styles.stepNumber}>2</span>
            <span className={styles.stepText}>Course Details</span>
          </div>
          <div className={styles.stepConnector}></div>
          <div className={`${styles.step} ${currentStep >= 3 ? styles.active : ''}`}>
            <span className={styles.stepNumber}>3</span>
            <span className={styles.stepText}>Content Structure</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formSections}>
            {renderStepContent()}
          </div>

          <div className={styles.actions}>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className={styles.prevButton}
              >
                Previous
              </button>
            )}
            
            <button
              type="button"
              onClick={onCancel}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className={styles.spinner} />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  {currentStep < 3 ? (
                    <span>Continue</span>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>{mode === 'create' ? 'Create Course' : 'Save Changes'}</span>
                    </>
                  )}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}