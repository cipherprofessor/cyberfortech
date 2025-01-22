import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseApi } from '@/services/api/courses';
import { Course } from '../types';

export const useCourses = (params?: Parameters<typeof courseApi.getCourses>[0]) => {
  return useQuery({
    queryKey: ['courses', params],
    queryFn: () => courseApi.getCourses(params),
  });
};

export const useCourse = (courseId: string) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => courseApi.getCourse(courseId),
    enabled: !!courseId,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: courseApi.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

export const useUpdateCourse = (courseId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Course>) => courseApi.updateCourse(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
    },
  });
};