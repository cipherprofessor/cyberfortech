// src/components/ui/Mine/SuperadminDashboard/CoursesDashboard/CourseManagement/CourseManagement.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book, 
  Plus, 
  Search, 
  Edit2,
  Trash2, 
  Filter,
  SortAsc,
  MoreVertical,
  AlertTriangle,
  Clock,
  Users,
  Star
} from 'lucide-react';
import axios from 'axios';
import { useTheme } from 'next-themes';
import { CourseModal } from './CourseModal';

import styles from './CourseManagement.module.scss';
import { Course } from '@/types/courses';
import { SuccessAlert, ErrorAlert } from '../../../Alert/Alert';
import { DeleteConfirmDialog } from '../DeleteConfirmation/DeleteConfirmation';

export function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    show: boolean;
    courseId?: string;
    courseName?: string;
  }>({ show: false });
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
        // Show success message
        showAlert('success', 'Course deleted successfully');
        // Update the courses list
        await fetchCourses();
      } else {
        throw new Error(response.data.error || 'Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      showAlert('error', 'Failed to delete course');
    } finally {
      // Close the confirmation dialog
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
      throw error; // Re-throw to be handled by the modal
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Book className={styles.loadingIcon} />
        </motion.div>
        <p>Loading courses...</p>
      </div>
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

      <motion.div 
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.titleSection}>
          <Book className={styles.titleIcon} />
          <div>
            <h1>Course Management</h1>
            <p>Manage and organize all courses in the system</p>
          </div>
        </div>

        <motion.button
          className={styles.createButton}
          onClick={handleCreateCourse}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} />
          <span>Create Course</span>
        </motion.button>
      </motion.div>

      <motion.div 
        className={styles.controls}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className={styles.searchBar}>
          <Search size={20} />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      <motion.div
        className={styles.coursesGrid}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredCourses.map((course) => (
          <motion.div
            key={course.id}
            className={styles.courseCard}
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className={styles.courseImage}>
              <img 
                src={course.image_url || '/default-course.jpg'} 
                alt={course.title}
                className={styles.image}
              />
              <div className={styles.courseLevel}>{course.level}</div>
            </div>

            <div className={styles.courseInfo}>
              <h3>{course.title}</h3>
              <p>{course.description}</p>

              <div className={styles.courseStats}>
                <div className={styles.stat}>
                  <Clock size={16} />
                  <span>{course.duration}</span>
                </div>
                <div className={styles.stat}>
                  <Users size={16} />
                  <span>{course.total_students || 0} students</span>
                </div>
                <div className={styles.stat}>
                  <Star size={16} />
                  <span>{course.average_rating?.toFixed(1) || '0.0'}</span>
                </div>
              </div>

              <div className={styles.courseActions}>
                <button
                  onClick={() => handleEditCourse(course)}
                  className={styles.editButton}
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(course.id, course.title)}
                  className={styles.deleteButton}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredCourses.length === 0 && (
        <div className={styles.emptyState}>
          <AlertTriangle size={48} />
          <h3>No courses found</h3>
          <p>Try adjusting your search or create a new course</p>
        </div>
      )}

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