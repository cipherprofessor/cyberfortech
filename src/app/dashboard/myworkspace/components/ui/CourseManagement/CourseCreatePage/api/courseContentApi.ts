// src/app/dashboard/myworkspace/components/ui/CourseManagement/CourseCreatePage/api/courseContentApi.ts
import axios from 'axios';

/**
 * Fetches course content for a specific course
 * @param courseId The ID of the course
 * @returns Course content data
 */
export const fetchCourseContent = async (courseId: string) => {
  try {
    console.log('Fetching course content for course ID:', courseId);
    const response = await axios.get(`/api/courses/${courseId}/content`);
    
    const { courseContent, sections } = response.data;
    
    // Transform sections data if needed
    const formattedSections = sections.map((section: any) => ({
      title: section.title || '',
      description: section.description || '',
      sequence_number: section.sequence_number || 1,
      lessons: section.lessons?.map((lesson: any) => ({
        title: lesson.title || '',
        description: lesson.description || '',
        content_type: lesson.contentType || 'video',
        duration: lesson.duration || 0,
        is_free_preview: !!lesson.isFreePreview,
        sequence_number: lesson.sequenceNumber || 1,
        content: {
          video_url: '',
          article_content: '',
          quiz_data: null,
          assignment_details: null
        }
      })) || []
    }));
    
    return {
      courseContent,
      sections: formattedSections
    };
  } catch (error) {
    console.error('Error fetching course content:', error);
    throw error;
  }
};

/**
 * Interface for course content data
 */
export interface CourseContentData {
  courseContent: {
    course_demo_url: string;
    course_outline: string;
    learning_objectives: string[];
    prerequisites: string[];
    target_audience: string;
    estimated_completion_time: string;
  };
  sections: {
    title: string;
    description: string;
    sequence_number: number;
    lessons: {
      title: string;
      description: string;
      content_type: string;
      duration: number;
      is_free_preview: boolean;
      sequence_number: number;
      content: {
        video_url?: string;
        article_content?: string;
        quiz_data?: any;
        assignment_details?: any;
      };
    }[];
  }[];
}

/**
 * Saves course content for a specific course
 * @param courseId The ID of the course
 * @param data Course content data to save
 * @returns Success response
 */
export const saveCourseContent = async (courseId: string, data: CourseContentData) => {
  try {
    console.log('Saving course content for course ID:', courseId);
    console.log('Content data sample:', JSON.stringify(data).substring(0, 200) + '...');
    
    const response = await axios.post(`/api/courses/${courseId}/content`, data);
    return response.data;
  } catch (error) {
    console.error('Error saving course content:', error);
    throw error;
  }
};