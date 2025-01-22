import { api } from '@/lib/axios';
import { Course, CourseSection, Review } from '../types';

export const courseApi = {
  // Get all courses with optional filters
  async getCourses(params?: {
    category?: string;
    level?: string;
    search?: string;
    sort?: 'popular' | 'newest' | 'price-low' | 'price-high';
  }) {
    const { data } = await api.get<Course[]>('/api/courses', { params });
    return data;
  },

  // Get a specific course by ID
  async getCourse(courseId: string) {
    const { data } = await api.get<Course>(`/api/courses/${courseId}`);
    return data;
  },

  // Create a new course (instructor only)
  async createCourse(courseData: Partial<Course>) {
    const { data } = await api.post<Course>('/api/courses', courseData);
    return data;
  },

  // Update course details (instructor only)
  async updateCourse(courseId: string, courseData: Partial<Course>) {
    const { data } = await api.put<Course>(`/api/courses/${courseId}`, courseData);
    return data;
  },

  // Delete a course (instructor only)
  async deleteCourse(courseId: string) {
    await api.delete(`/api/courses/${courseId}`);
  },

  // Get course reviews
  async getCourseReviews(courseId: string) {
    const { data } = await api.get<Review[]>(`/api/courses/${courseId}/reviews`);
    return data;
  },

  // Get course sections and lessons
  async getCourseSections(courseId: string) {
    const { data } = await api.get<CourseSection[]>(`/api/courses/${courseId}/sections`);
    return data;
  },
};