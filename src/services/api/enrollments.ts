import { api } from '@/lib/axios';
import { Enrollment } from '../types';

export const enrollmentApi = {
  // Enroll in a course
  async enrollCourse(courseId: string) {
    const { data } = await api.post<Enrollment>('/api/enrollments', { courseId });
    return data;
  },

  // Get user enrollments
  async getUserEnrollments() {
    const { data } = await api.get<Enrollment[]>('/api/enrollments');
    return data;
  },

  // Get specific enrollment
  async getEnrollment(enrollmentId: string) {
    const { data } = await api.get<Enrollment>(`/api/enrollments/${enrollmentId}`);
    return data;
  },

  // Update enrollment progress
  async updateProgress(enrollmentId: string, lessonId: string) {
    const { data } = await api.post<Enrollment>(`/api/enrollments/${enrollmentId}/progress`, {
      lessonId,
    });
    return data;
  },

  // Cancel enrollment
  async cancelEnrollment(enrollmentId: string) {
    await api.post(`/api/enrollments/${enrollmentId}/cancel`);
  },
};
