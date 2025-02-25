// src/utils/courseDataAdapter.ts
import { Instructor } from '@/types/courses';

/**
 * Normalizes instructors data from API response to ensure consistent format
 * @param data Raw API response data for instructors
 * @returns Normalized instructors array
 */
export const normalizeInstructorsData = (data: any): Instructor[] => {
  // Handle case where API returns { instructors: [...] }
  if (data && data.instructors && Array.isArray(data.instructors)) {
    return data.instructors;
  }
  
  // Handle case where API returns an array directly
  if (Array.isArray(data)) {
    return data;
  }
  
  // If data is not in expected format, return empty array
  console.warn('Instructors data is not in expected format:', data);
  return [];
};

/**
 * Extracts instructors from raw API response 
 * @param response Raw fetch/axios response
 * @returns Normalized instructors array
 */
export const extractInstructorsFromResponse = async (response: Response) => {
  try {
    const data = await response.json();
    return normalizeInstructorsData(data);
  } catch (error) {
    console.error('Error extracting instructors data:', error);
    return [];
  }
};

/**
 * Fetches instructors with proper error handling and data normalization
 * @returns Array of instructors
 */
export const fetchInstructors = async (): Promise<Instructor[]> => {
  try {
    const response = await fetch('/api/users/instructors');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch instructors: ${response.status}`);
    }
    
    const data = await response.json();
    return normalizeInstructorsData(data);
  } catch (error) {
    console.error('Error fetching instructors:', error);
    return [];
  }
};