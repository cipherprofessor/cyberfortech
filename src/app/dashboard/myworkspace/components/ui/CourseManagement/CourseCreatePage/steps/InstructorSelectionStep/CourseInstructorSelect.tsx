'use client';

import { useState, useEffect } from 'react';
import { Search, User, X } from 'lucide-react';
import { Instructor } from '@/types/courses';
import { fetchInstructors } from '@/utils/courseDataAdapter';
import styles from './CourseInstructorSelect.module.scss';

interface InstructorSelectionStepProps {
  selectedInstructorId: string | null;
  setSelectedInstructorId: (id: string) => void;
  setFormData: (data: any) => void;
  isDark?: boolean;
  showAlert: (type: 'success' | 'error', message: string) => void;
}

export function InstructorSelectionStep({
  selectedInstructorId,
  setSelectedInstructorId,
  setFormData,
  isDark = false,
  showAlert
}: InstructorSelectionStepProps) {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Load instructors data
  useEffect(() => {
    const loadInstructors = async () => {
      setIsLoading(true);
      try {
        const instructorsData = await fetchInstructors();
        console.log("Fetched instructors:", instructorsData);
        setInstructors(instructorsData);
      } catch (error) {
        console.error('Error loading instructors:', error);
        showAlert('error', 'Failed to load instructors');
      } finally {
        setIsLoading(false);
      }
    };

    loadInstructors();
  }, [showAlert]);

  // Filter instructors based on search query
  const filteredInstructors = instructors.filter(instructor => {
    const nameMatch = instructor.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = instructor.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || emailMatch;
  });

  // Get the selected instructor data
  const selectedInstructor = instructors.find(instructor => instructor.id === selectedInstructorId);

  const handleSelectInstructor = (instructor: Instructor) => {
    console.log("Selecting instructor:", instructor.id);
    setSelectedInstructorId(instructor.id);
    setFormData(prev => ({
      ...prev,
      instructor_id: instructor.id
    }));
  };

  const handleClearSelection = () => {
    setSelectedInstructorId('');
    setFormData(prev => ({
      ...prev,
      instructor_id: ''
    }));
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading instructors...</div>;
  }

  return (
    <div className={`${styles.container} ${isDark ? styles.dark : ''}`}>
      <div className={styles.header}>
        <h2>Select Instructor</h2>
        <p>Choose an instructor who will teach this course</p>
      </div>

      {selectedInstructor && (
        <div className={styles.selectedInstructorCard}>
          <div className={styles.instructorDetails}>
            {selectedInstructor.profile_image_url ? (
              <img 
                src={selectedInstructor.profile_image_url} 
                alt={selectedInstructor.name || 'Instructor'} 
                className={styles.instructorAvatar}
                onError={(e) => {
                  (e.target as HTMLImageElement).onerror = null;
                  (e.target as HTMLImageElement).src = '/default-avatar.png';
                }}
              />
            ) : (
              <div className={styles.defaultAvatar}>
                <User size={24} />
              </div>
            )}
            <div className={styles.instructorInfo}>
              <h3>{selectedInstructor.name || 'Unnamed Instructor'}</h3>
              <p>{selectedInstructor.email || ''}</p>
              {selectedInstructor.specialization && (
                <span className={styles.specialization}>{selectedInstructor.specialization}</span>
              )}
            </div>
          </div>
          <button 
            type="button" 
            className={styles.changeButton}
            onClick={handleClearSelection}
          >
            Change Instructor
          </button>
        </div>
      )}

      {!selectedInstructor && (
        <>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={20} />
            <input
              type="text"
              placeholder="Search instructors by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.clearSearch}
                onClick={() => setSearchQuery('')}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className={styles.instructorsList}>
            {filteredInstructors.length > 0 ? (
              filteredInstructors.map(instructor => (
                <div
                  key={instructor.id}
                  className={styles.instructorCard}
                  onClick={() => handleSelectInstructor(instructor)}
                >
                  {instructor.profile_image_url ? (
                    <img 
                      src={instructor.profile_image_url} 
                      alt={instructor.name || 'Instructor'} 
                      className={styles.instructorAvatar}
                      onError={(e) => {
                        (e.target as HTMLImageElement).onerror = null;
                        (e.target as HTMLImageElement).src = '/default-avatar.png';
                      }}
                    />
                  ) : (
                    <div className={styles.defaultAvatar}>
                      <User size={24} />
                    </div>
                  )}
                  <div className={styles.instructorInfo}>
                    <h3>{instructor.name || 'Unnamed Instructor'}</h3>
                    <p>{instructor.email || ''}</p>
                    {instructor.specialization && (
                      <span className={styles.specialization}>{instructor.specialization}</span>
                    )}
                    {instructor.years_of_experience && (
                      <span className={styles.experience}>
                        {instructor.years_of_experience} years experience
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noResults}>
                {searchQuery ? 'No instructors found matching your search' : 'No instructors available'}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}