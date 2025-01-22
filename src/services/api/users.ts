// src/services/api/users.ts
import { api } from '@/lib/axios';
import { User } from '../types';

export const userApi = {
  // Get user profile
  async getProfile() {
    const { data } = await api.get<User>('/api/users/profile');
    return data;
  },

  // Update user profile
  async updateProfile(userData: Partial<User>) {
    const { data } = await api.put<User>('/api/users/profile', userData);
    return data;
  },

  // Update user avatar
  async updateAvatar(formData: FormData) {
    const { data } = await api.put<User>('/api/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};