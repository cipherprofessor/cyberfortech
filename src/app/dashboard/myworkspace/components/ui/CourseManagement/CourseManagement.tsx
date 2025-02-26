'use client';
//src/app/dashboard/myworkspace/components/ui/CourseManagement/CourseManagement.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useTheme } from 'next-themes';

import styles from './CourseManagement.module.scss';
import Loading from '@/app/(routes)/blog/[slug]/loading';

import { SuccessAlert, ErrorAlert } from '@/components/ui/Mine/Alert/Alert';

import { DeleteConfirmDialog } from '@/components/ui/DeleteConfirmation/DeleteConfirmation';
import { SearchControls } from './components/SearchControls/SearchControls';
import { EmptyState } from './components/EmptyState/EmptyState';
import { Header } from './components/Header/Header';

import { CourseCreatePage } from './CourseCreatePage/CourseCreatePage';
import { Course } from '@/components/courses/types';
import { CourseCard } from '@/components/courses/ResuableCourseCard/CourseCard';


export function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCreatePage, setShowCreatePage] = useState(false);
  const [createPageMode, setCreatePageMode] = useState<'create' | 'edit'>('create');
  const [alertState, setAlertState] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    show: false,
    type: 'success',
    message: ''
  });

  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    courseId: string | null;
    courseName: string;
  }>({
    show: false,
    courseId: null,
    courseName: ''
  });
  
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlertState({ show: true, type, message });
    setTimeout(() => {
      setAlertState(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/courses/manage');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      showAlert('error', 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = () => {
    setCreatePageMode('create');
    setSelectedCourse(null);
    setShowCreatePage(true);
  };

  

  const handleEditCourse = (course: Course) => {
    setCreatePageMode('edit');
    setSelectedCourse(course);
    setShowCreatePage(true);
  };

  const handleDeleteClick = (courseId: string, courseName: string) => {
    setDeleteConfirm({
      show: true,
      courseId,
      courseName
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.courseId) return;
    
    try {
      const response = await axios.delete(`/api/courses/manage/${deleteConfirm.courseId}`);
      
      if (response.data.success) {
        showAlert('success', 'Course deleted successfully');
        await fetchCourses();
      } else {
        throw new Error(response.data.error || 'Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      showAlert('error', 'Failed to delete course');
    } finally {
      setDeleteConfirm({
        show: false,
        courseId: null,
        courseName: ''
      });
    }
  };

  // Update to handleCourseSubmit in CourseManagement.tsx

// Update to handleCourseSubmit in CourseManagement.tsx

const handleCourseSubmit = async (courseData: Partial<Course>): Promise<{ id: string }> => {
  try {
    if (createPageMode === 'create') {
      // Create the course and get the response with the new course ID
      const response = await axios.post('/api/courses/manage', courseData);
      
      // Extract the new course ID from the response
      const newCourseId = response.data.courseId || ''; 
      
      console.log('New course created with ID:', newCourseId); // Debug log
      
      showAlert('success', 'Course created successfully');
      await fetchCourses();
      
      // Return the id in the format CourseCreatePage expects
      return { id: newCourseId.toString() };
    } else {
      // For edit mode, we already have the course ID
      await axios.put(`/api/courses/manage/${selectedCourse?.id}`, courseData);
      
      showAlert('success', 'Course updated successfully');
      await fetchCourses();
      
      return { id: (selectedCourse?.id || '').toString() };
    }
  } catch (error) {
    console.error('Error saving course:', error);
    showAlert('error', `Failed to ${createPageMode} course`);
    throw error;
  }
};

  const handleCancelCreate = () => {
    setShowCreatePage(false);
  };

  const filteredCourses = courses.filter(course => 
    course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (showCreatePage) {
    return (
      <CourseCreatePage
        mode={createPageMode}
        course={selectedCourse}
        onSubmit={handleCourseSubmit}
        onCancel={handleCancelCreate}
      />
    );
  }

  return (
    <div className={`${styles.container} ${isDark ? styles.dark : ''}`}>
      {alertState.show && (
        alertState.type === 'success' ? (
          <SuccessAlert
            message={alertState.message}
            onClose={() => setAlertState(prev => ({ ...prev, show: false }))}
          />
        ) : (
          <ErrorAlert
            message={alertState.message}
            onClose={() => setAlertState(prev => ({ ...prev, show: false }))}
          />
        )
      )}

      <Header onCreateCourse={handleCreateCourse} />
      <SearchControls searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <motion.div
        className={styles.coursesGrid}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={handleEditCourse}
              onDelete={handleDeleteClick}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </motion.div>

      <DeleteConfirmDialog
        show={deleteConfirm.show}
        courseName={deleteConfirm.courseName}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({
          show: false,
          courseId: null,
          courseName: ''
        })}
      />
    </div>
  );
}