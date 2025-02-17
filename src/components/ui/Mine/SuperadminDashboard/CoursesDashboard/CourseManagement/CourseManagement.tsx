// src/components/ui/Mine/SuperadminDashboard/CoursesDashboard/CourseManagement/CourseManagement.tsx
// Alpha centauri
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useTheme } from 'next-themes';

import { CourseModal } from './CourseModal';
import { Header } from './components/Header/Header';
import { SearchControls } from './components/SearchControls/SearchControls';
import { CourseCard } from './components/CourseCard/CourseCard';
import { EmptyState } from './components/EmptyState/EmptyState';
import { Loading } from './components/Loading/Loading';
import { DeleteConfirmDialog } from '../DeleteConfirmation/DeleteConfirmation';
import { SuccessAlert, ErrorAlert } from '../../../Alert/Alert';
import { Course } from '@/types/courses';

import styles from './CourseManagement.module.scss';

export function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
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
    setModalMode('create');
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setModalMode('edit');
    setSelectedCourse(course);
    setIsModalOpen(true);
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

  const handleModalSubmit = async (courseData: Partial<Course>) => {
    try {
      if (modalMode === 'create') {
        await axios.post('/api/courses/manage', courseData);
        showAlert('success', 'Course created successfully');
      } else {
        await axios.put(`/api/courses/manage/${selectedCourse?.id}`, courseData);
        showAlert('success', 'Course updated successfully');
      }
      await fetchCourses();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving course:', error);
      showAlert('error', `Failed to ${modalMode} course`);
      throw error;
    }
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onEdit={handleEditCourse}
            onDelete={handleDeleteClick}
          />
        ))}
      </motion.div>

      {filteredCourses.length === 0 && <EmptyState />}

      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        course={selectedCourse}
        onSubmit={handleModalSubmit}
      />

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