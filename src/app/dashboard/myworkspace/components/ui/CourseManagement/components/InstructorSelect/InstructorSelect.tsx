"use client";
import { useState, useEffect, useRef } from 'react';
import { Info, Search, ChevronDown, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import styles from './InstructorSelect.module.scss';
import { Instructor } from '@/types/courses';

interface InstructorSelectProps {
  instructors: Instructor[] | null | undefined;
  selectedInstructor: string | null;
  setSelectedInstructor: (instructorId: string) => void;
  setFormData: (data: any) => void;
  courseInstructorId?: string;
}

export const CourseInstructorSelect = ({
  instructors,
  selectedInstructor,
  setSelectedInstructor,
  setFormData,
  courseInstructorId
}: InstructorSelectProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Ensure instructors is an array before using array methods
  const instructorsArray = Array.isArray(instructors) ? instructors : [];

  const selectedInstructorData = instructorsArray.find(
    instructor => instructor.id === selectedInstructor
  );

  const filteredInstructors = instructorsArray.filter(instructor =>
    instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (courseInstructorId && !selectedInstructor) {
      setSelectedInstructor(courseInstructorId);
    }
  }, [courseInstructorId, selectedInstructor, setSelectedInstructor]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (instructor: Instructor) => {
    setSelectedInstructor(instructor.id);
    setFormData(prev => ({
      ...prev,
      instructor_id: instructor.id
    }));
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedInstructor('');
    setFormData(prev => ({
      ...prev,
      instructor_id: ''
    }));
  };

  console.log("Instructors data:", instructors);
  console.log("Selected instructor:", selectedInstructor);

  return (
    <div className={`${styles.formGroup} ${isDark ? styles.dark : ''}`}>
      <label htmlFor="instructor">
        <span>Course Instructor</span>
        <div className={styles.tooltip}>
          <Info size={14} className={styles.infoIcon} />
          <span className={styles.tooltipText}>Select the instructor who will teach this course</span>
        </div>
      </label>
      
      <div className={styles.selectContainer} ref={dropdownRef}>
        <div 
          className={`${styles.selectTrigger} ${isOpen ? styles.open : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedInstructorData ? (
            <div className={styles.selectedInstructor}>
              <img 
                src={selectedInstructorData.profile_image_url || '/default-avatar.png'} 
                alt={selectedInstructorData.name}
                className={styles.instructorAvatar}
              />
              <div className={styles.instructorInfo}>
                <span className={styles.instructorName}>{selectedInstructorData.name}</span>
                <span className={styles.instructorEmail}>{selectedInstructorData.email}</span>
              </div>
              <button 
                className={styles.clearButton}
                onClick={handleClear}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <span className={styles.placeholder}>Select an instructor</span>
          )}
          <ChevronDown 
            size={20} 
            className={`${styles.chevron} ${isOpen ? styles.open : ''}`}
          />
        </div>

        {isOpen && (
          <div className={styles.dropdown}>
            <div className={styles.searchContainer}>
              <Search size={16} className={styles.searchIcon} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search instructors..."
                className={styles.searchInput}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div className={styles.optionsList}>
              {filteredInstructors.length > 0 ? (
                filteredInstructors.map((instructor) => (
                  <div
                    key={instructor.id}
                    className={`${styles.option} ${
                      selectedInstructor === instructor.id ? styles.selected : ''
                    }`}
                    onClick={() => handleSelect(instructor)}
                  >
                    <img
                      src={instructor.profile_image_url || '/default-avatar.png'}
                      alt={instructor.name}
                      className={styles.instructorAvatar}
                    />
                    <div className={styles.instructorInfo}>
                      <span className={styles.instructorName}>{instructor.name}</span>
                      <span className={styles.instructorEmail}>{instructor.email}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.noResults}>
                  No instructors found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};