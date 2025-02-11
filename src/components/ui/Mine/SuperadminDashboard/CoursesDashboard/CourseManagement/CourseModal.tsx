// src/components/ui/Mine/SuperadminDashboard/CoursesDashboard/CourseManagement/CourseModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload,
  Save,
  Trash2,
  Loader2,
  Clock,
  DollarSign
} from 'lucide-react';
import styles from './CourseModal.module.scss';
import { Course, CourseModalProps } from '@/types/courses';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import toast from 'react-hot-toast';




const courseSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.number().min(0, 'Price must be positive'),
    duration: z.string().min(1, 'Duration is required'),
    level: z.enum(['beginner', 'intermediate', 'advanced']),
    category: z.string().min(1, 'Category is required'),
    image_url: z.string().optional(),
    imageFile: z.any().optional()
  });
  
  type CourseFormData = z.infer<typeof courseSchema>;
  
  export function CourseModal({ isOpen, onClose, mode, course, onSubmit, loading }: CourseModalProps) {
    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      setValue,
      watch
    } = useForm<CourseFormData>({
      resolver: zodResolver(courseSchema),
      defaultValues: {
        title: '',
        description: '',
        price: 0,
        duration: '',
        level: 'beginner',
        category: '',
        image_url: ''
      }
    });
  
    useEffect(() => {
      if (course && mode === 'edit') {
        reset(course);
      }
    }, [course, mode, reset]);

const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size should be less than 5MB');
      return;
    }

    setValue('imageFile', file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setValue('image_url', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className={styles.modalHeader}>
              <h2>{mode === 'create' ? 'Create New Course' : 'Edit Course'}</h2>
              <button 
                onClick={onClose}
                className={styles.closeButton}
              >
                <X size={20} />
              </button>
            </div>


          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}