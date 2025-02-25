'use client';

import { PlusCircle, MinusCircle, Info, Link, Clock } from 'lucide-react';
import styles from './CourseDetailsStep.module.scss';

interface CourseDetailsProps {
  contentData: {
    course_demo_url: string;
    course_outline: string;
    learning_objectives: string[];
    prerequisites: string[];
    target_audience: string;
    estimated_completion_time: string;
  };
  setContentData: (data: any) => void;
  isDark?: boolean;
}

export function CourseDetailsStep({
  contentData,
  setContentData,
  isDark = false
}: CourseDetailsProps) {
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

  return (
    <div className={`${styles.container} ${isDark ? styles.dark : ''}`}>
      <div className={styles.header}>
        <h2>Course Details</h2>
        <p>Provide detailed information about your course</p>
      </div>
      
      <div className={styles.formSection}>
        <div className={styles.formGroup}>
          <label htmlFor="course_demo_url">
            <span>Course Demo Video</span>
            <div className={styles.tooltip}>
              <Info size={14} className={styles.infoIcon} />
              <span className={styles.tooltipText}>Provide a URL to a video that gives students a preview of your course</span>
            </div>
          </label>
          <div className={styles.inputWithIcon}>
            <Link size={18} className={styles.inputIcon} />
            <input
              type="url"
              id="course_demo_url"
              value={contentData.course_demo_url}
              onChange={(e) => setContentData({...contentData, course_demo_url: e.target.value})}
              placeholder="https://www.youtube.com/watch?v=example"
              className={styles.input}
            />
          </div>
          <p className={styles.fieldHint}>Add a URL to a preview video that showcases your course content</p>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="course_outline">
            <span>Course Outline</span>
            <div className={styles.tooltip}>
              <Info size={14} className={styles.infoIcon} />
              <span className={styles.tooltipText}>A high-level overview of what the course covers</span>
            </div>
          </label>
          <textarea
            id="course_outline"
            value={contentData.course_outline}
            onChange={(e) => setContentData({...contentData, course_outline: e.target.value})}
            placeholder="Provide a detailed course outline or syllabus..."
            rows={5}
            className={styles.textarea}
          />
        </div>
      </div>
      
      <div className={styles.formSection}>
        <div className={styles.sectionTitle}>
          <h3>Learning Objectives</h3>
          <p>What will students learn from this course?</p>
        </div>
        
        <div className={styles.arrayItems}>
          {contentData.learning_objectives.map((objective, index) => (
            <div key={`objective-${index}`} className={styles.arrayItem}>
              <div className={styles.arrayItemIndex}>{index + 1}</div>
              <input
                type="text"
                value={objective}
                onChange={(e) => updateLearningObjective(index, e.target.value)}
                placeholder={`Learning objective ${index + 1}`}
                className={styles.input}
              />
              <button 
                type="button" 
                onClick={() => removeLearningObjective(index)}
                className={styles.removeButton}
                disabled={contentData.learning_objectives.length === 1}
                aria-label="Remove learning objective"
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
      </div>
      
      <div className={styles.formSection}>
        <div className={styles.sectionTitle}>
          <h3>Prerequisites</h3>
          <p>What should students know before starting?</p>
        </div>
        
        <div className={styles.arrayItems}>
          {contentData.prerequisites.map((prerequisite, index) => (
            <div key={`prerequisite-${index}`} className={styles.arrayItem}>
              <div className={styles.arrayItemIndex}>{index + 1}</div>
              <input
                type="text"
                value={prerequisite}
                onChange={(e) => updatePrerequisite(index, e.target.value)}
                placeholder={`Prerequisite ${index + 1}`}
                className={styles.input}
              />
              <button 
                type="button" 
                onClick={() => removePrerequisite(index)}
                className={styles.removeButton}
                disabled={contentData.prerequisites.length === 1}
                aria-label="Remove prerequisite"
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
      </div>
      
      <div className={styles.formSection}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="target_audience">
              <span>Target Audience</span>
              <div className={styles.tooltip}>
                <Info size={14} className={styles.infoIcon} />
                <span className={styles.tooltipText}>Who is this course designed for?</span>
              </div>
            </label>
            <textarea
              id="target_audience"
              value={contentData.target_audience}
              onChange={(e) => setContentData({...contentData, target_audience: e.target.value})}
              placeholder="Describe who this course is designed for..."
              rows={3}
              className={styles.textarea}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="estimated_completion_time">
              <span>Estimated Completion Time</span>
              <div className={styles.tooltip}>
                <Info size={14} className={styles.infoIcon} />
                <span className={styles.tooltipText}>How long will it take students to complete the course?</span>
              </div>
            </label>
            <div className={styles.inputWithIcon}>
              <Clock size={18} className={styles.inputIcon} />
              <input
                type="text"
                id="estimated_completion_time"
                value={contentData.estimated_completion_time}
                onChange={(e) => setContentData({...contentData, estimated_completion_time: e.target.value})}
                placeholder="e.g., 4-6 weeks, 10 hours, etc."
                className={styles.input}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}