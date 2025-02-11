// src/components/ui/Mine/SuperadminDashboard/CoursesDashboard/CourseManagement/CourseManagement.tsx
'use client';

import { useState, useEffect,useCallback } from 'react';
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
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { useTheme } from 'next-themes';
import styles from './CourseManagement.module.scss';
import { Course } from '@/types/courses';
import { CourseModal } from './CourseModal';
import { toast } from 'react-hot-toast';


export const handleImageUpload = async (file: string) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};


export function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
   

  const handleCreateCourse = async (courseData: Partial<Course>) => {
    try {
      setLoading(true);
      
      // Handle image upload if there's a file XXXXXXXXXX
      if (courseData.image_url) {
        const imageUrl = await handleImageUpload(courseData.image_url);
        courseData.image_url = imageUrl;
      }
      
      await axios.post('/api/courses/manage', courseData);
      await fetchCourses();
      toast.success('Course created successfully!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course');
    } finally {
      setLoading(false);
    }
  };


  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/courses/manage');
      setCourses(response.data);
    } catch (err) {
      setError('Failed to fetch courses');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // const handleCreateCourse = () => {
  //   setModalMode('create');
  //   setSelectedCourse(null);
  //   setIsModalOpen(true);
  // };

  const handleUpdateCourse = async (courseData: Partial<Course>) => {
    if (!selectedCourse?.id) return;

    try {
      setLoading(true);
      
      // Handle image upload if there's a new file
      if (courseData.image_url) {
        const imageUrl = await handleImageUpload(courseData.image_url);
        courseData.image_url = imageUrl;
      }
      
      await axios.put(`/api/courses/manage/${selectedCourse.id}`, courseData);
      await fetchCourses();
      toast.success('Course updated successfully!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update course');
    } finally {
      setLoading(false);
    }
  };



  const handleEditCourse = (course: Course) => {
    setModalMode('edit');
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const result = await toast.promise(
        axios.delete(`/api/courses/manage/${courseId}`),
        {
          loading: 'Deleting course...',
          success: 'Course deleted successfully!',
          error: 'Failed to delete course'
        }
      );
      
      await fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };


  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const openCreateModal = () => {
    setModalMode('create');
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setModalMode('edit');
    setSelectedCourse(course);
    setIsModalOpen(true);
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
      {/* Header Section */}
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
          onClick={openCreateModal}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} />
          <span>Create Course</span>
        </motion.button>
      </motion.div>

      {/* Search and Filter Section */}
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

        <div className={styles.filterControls}>
          <button className={styles.filterButton}>
            <Filter size={20} />
            <span>Filter</span>
          </button>
          <button className={styles.sortButton}>
            <SortAsc size={20} />
            <span>Sort</span>
          </button>
        </div>
      </motion.div>

      {/* Courses Grid */}
      <motion.div 
        className={styles.coursesGrid}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <AnimatePresence>
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              className={styles.courseCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
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
                  <span>{course.duration}</span>
                  <span>{course.total_students} students</span>
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
                    onClick={() => handleDeleteCourse(course.id)}
                    className={styles.deleteButton}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredCourses.length === 0 && (
        <div className={styles.emptyState}>
          <AlertCircle size={48} />
          <h3>No courses found</h3>
          <p>Try adjusting your search or create a new course</p>
        </div>
      )}

      {/* Course Modal will be added here */}

      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        course={selectedCourse}
        onSubmit={modalMode === 'create' ? handleCreateCourse : handleUpdateCourse}
        loading={loading}
      />

    </div>
  );
}