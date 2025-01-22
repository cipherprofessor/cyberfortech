import { api } from '@/lib/axios';
import { Review } from '../types';

export const reviewApi = {
  // Create a review
  async createReview(courseId: string, data: { rating: number; content: string }) {
    const response = await api.post<Review>('/api/reviews', {
      courseId,
      ...data,
    });
    return response.data;
  },

  // Update a review
  async updateReview(reviewId: string, data: { rating: number; content: string }) {
    const response = await api.put<Review>(`/api/reviews/${reviewId}`, data);
    return response.data;
  },

  // Delete a review
  async deleteReview(reviewId: string) {
    await api.delete(`/api/reviews/${reviewId}`);
  },

  // Get user reviews
  async getUserReviews() {
    const response = await api.get<Review[]>('/api/reviews/user');
    return response.data;
  },
};


