'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Course } from '@/types/courses';
import { useTheme } from 'next-themes';
import styles from './CourseCreatePage.module.scss';
import { ErrorAlert, SuccessAlert } from '@/components/ui/Mine/Alert/Alert';

import { fetchCourseContent, saveCourseContent } from './api/courseContentApi';
import { StepIndicator } from './components/StepIndicator/StepIndicator';
import { InstructorSelectionStep } from './steps/InstructorSelectionStep/CourseInstructorSelect';
import { CourseContentStep } from './steps/CourseContentStep/CourseContentStep';
import { CourseDetailsStep } from './steps/CourseDetailsStep/CourseDetailsStep';
import { CourseImageStep } from './steps/CourseImageStep/CourseImageStep';
import { BasicInfoStep } from './steps/BasicInfoStep/BasicInfoStep';


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
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Core form data
  const [formData, setFormData] = useState<Partial<Course>>({
    title: '',
    description: '',
    price: 0,
    duration: '',
    level: 'Beginner',
    category: '',
    image_url: '',
  });
  
  // Image related state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isFileUpload, setIsFileUpload] = useState(false);
  
  // Instructor related state
  const [selectedInstructorId, setSelectedInstructorId] = useState<string | null>(null);
  
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

  // Initialize form data when editing a course
  useEffect(() => {
    if (course && mode === 'edit') {
      setFormData(course);
      setImagePreview(course.image_url || null);
      setSelectedInstructorId(course.instructor_id || null);
      
      // Fetch course content if in edit mode
      if (course.id) {
        loadCourseContent(course.id);
      }
    }
  }, [course, mode]);

  const loadCourseContent = async (courseId: string) => {
    try {
      const { courseContent, sections: courseSections } = await fetchCourseContent(courseId);
      
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
        setSections(courseSections);
      }
    } catch (error) {
      console.error('Error loading course content:', error);
      showAlert('error', 'Failed to load course content');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate current step before proceeding
    if (!validateCurrentStep()) {
      return;
    }
    
    if (currentStep < 5) {
      // Move to next step
      setCurrentStep(currentStep + 1);
      return;
    }
    
    // Final submission
    setLoading(true);
    
    try {
      // First create/update the course
      await onSubmit(formData);
      
      // Then create/update course content if this is the final step
      if (course?.id) {
        await saveCourseContent(course.id, {
          courseContent: contentData,
          sections: sections
        });
      }
      
      showAlert('success', `Course ${mode === 'create' ? 'created' : 'updated'} successfully!`);
      setTimeout(() => {
        onCancel();
      }, 2000);
    } catch (error) {
      console.error('Error saving course:', error);
      showAlert('error', 'Failed to save course');
    } finally {
      setLoading(false);
    }
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1: // Basic Info
        if (!formData.title || !formData.description || !formData.category) {
          showAlert('error', 'Please fill in all required fields');
          return false;
        }
        return true;
        
      case 2: // Instructor
        if (!selectedInstructorId) {
          showAlert('error', 'Please select an instructor');
          return false;
        }
        return true;
        
      case 3: // Course Image
        // Image is optional, so we'll allow proceeding without it
        return true;
        
      case 4: // Course Details
        // These are optional fields, so we'll allow proceeding
        return true;
        
      case 5: // Course Content
        if (sections.some(section => !section.title)) {
          showAlert('error', 'Please provide a title for all sections');
          return false;
        }
        if (sections.some(section => 
          section.lessons.some(lesson => !lesson.title)
        )) {
          showAlert('error', 'Please provide a title for all lessons');
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Render the current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep 
            formData={formData} 
            setFormData={setFormData} 
            isDark={isDark}
          />
        );
      case 2:
        return (
          <InstructorSelectionStep 
            selectedInstructorId={selectedInstructorId}
            setSelectedInstructorId={setSelectedInstructorId}
            setFormData={setFormData}
            isDark={isDark}
            showAlert={showAlert}
          />
        );
      case 3:
        return (
          <CourseImageStep 
            imagePreview={imagePreview}
            isFileUpload={isFileUpload}
            formData={formData}
            setFormData={setFormData}
            setImagePreview={setImagePreview}
            setIsFileUpload={setIsFileUpload}
            isDark={isDark}
            showAlert={showAlert}
          />
        );
      case 4:
        return (
          <CourseDetailsStep 
            contentData={contentData}
            setContentData={setContentData}
            isDark={isDark}
          />
        );
      case 5:
        return (
          <CourseContentStep 
            sections={sections}
            setSections={setSections}
            isDark={isDark}
          />
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
        <StepIndicator 
          steps={[
            { label: 'Basic Info', number: 1 },
            { label: 'Instructor', number: 2 },
            { label: 'Course Image', number: 3 },
            { label: 'Course Details', number: 4 },
            { label: 'Content Structure', number: 5 }
          ]}
          currentStep={currentStep}
          isDark={isDark}
        />

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formContent}>
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
                  {currentStep < 5 ? (
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