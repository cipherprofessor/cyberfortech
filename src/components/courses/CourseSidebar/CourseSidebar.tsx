'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { 
  ShoppingCart, 
  Share2, 
  Heart, 
  PlayCircle, 
  Book, 
  Clock, 
  Users, 
  Award,
  CheckCircle,
  Shield
} from 'lucide-react';
import styles from './CourseSidebar.module.scss';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import UnderConstruction from '@/components/ui/ConstructionPage/ConstructionPage';

// Updated interface for the course content API response
interface CourseContentData {
  courseContent: {
    course_demo_url?: string;
    course_outline?: string;
    learning_objectives?: string[];
    prerequisites?: string[];
    target_audience?: string;
    estimated_completion_time?: string;
    course_title?: string;
    course_description?: string;
    image_url?: string;
    level?: string;
    instructor_name?: string;
  };
  sections?: any[]; // We're not using sections in the sidebar
}

// Updated props interface
export interface CourseSidebarProps {
  course: {
    id: string;
    title: string;
    description: string;
    price: number;
    duration: string;
    level: string;
    category: string;
    instructor_id: string;
    instructor_name: string;
    instructor_profile_image_url: string;
    image_url: string;
    total_students: number;
    total_reviews: number;
    average_rating: number;
  };
  courseContentData?: CourseContentData; // Support for the prop passed from CourseDetailContent
  courseContent?: CourseContentData; // Alternative prop name for backward compatibility
  className?: string;
  onEnroll?: (courseId: string) => Promise<void>;
  onWishlist?: (courseId: string) => Promise<void>;
  onShare?: (courseId: string) => Promise<void>;
  customTheme?: {
    primary: string;
    secondary: string;
  };
}

export function CourseSidebar({
  course,
  courseContentData,
  courseContent: propsCourseContent,
  className,
  onEnroll,
  onWishlist,
  onShare,
  customTheme
}: CourseSidebarProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localCourseContent, setLocalCourseContent] = useState<CourseContentData | null>(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  
  // Use the provided courseContentData/courseContent prop or fetch it if not provided
  const effectiveCourseContent = courseContentData || propsCourseContent || localCourseContent;
  
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Fetch course content from API only if not provided via props
  useEffect(() => {
    const fetchCourseContent = async () => {
      if (!course?.id || courseContentData || propsCourseContent) return;
      
      setContentLoading(true);
      
      try {
        const response = await axios.get(`/api/courses/${course.id}/content`);
        setLocalCourseContent(response.data);
      } catch (err) {
        console.error('Failed to fetch course content:', err);
      } finally {
        setContentLoading(false);
      }
    };
    
    fetchCourseContent();
  }, [course?.id, courseContentData, propsCourseContent]);

  // Combine classes
  const sidebarClasses = [
    styles.sidebar,
    className,
    isDark ? styles.dark : '',
  ].filter(Boolean).join(' ');

  const handleEnroll = async () => {
    if (!onEnroll) {
      // router.push('/login');
      <UnderConstruction  />
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onEnroll(course.id);
      <UnderConstruction  />
      // router.push(`/dashboard/courses/${course.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enroll in course');
    } finally {
      setLoading(false);
    }
  };

  const handleWishlist = async () => {
    if (onWishlist) {
      try {
        await onWishlist(course.id);
      } catch (err) {
        console.error('Failed to add to wishlist:', err);
      }
    }
  };

  const handleShare = async () => {
    if (onShare) {
      try {
        await onShare(course.id);
      } catch (err) {
        console.error('Failed to share course:', err);
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const toggleVideoPlayer = () => {
    setShowVideo(!showVideo);
  };
  
  // Function to convert any YouTube URL to an embeddable format
  const safeVideoUrl = (url: string): string => {
    try {
      // If it's already an embed URL, return it
      if (url.includes('youtube.com/embed/')) {
        return url;
      }
      
      // Convert youtube.com/watch?v= URLs
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = new URL(url).searchParams.get('v');
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }
      
      // Convert youtu.be/ URLs
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }
      
      // If it's not a recognized YouTube URL format, return the original
      return url;
    } catch (error) {
      console.error('Error formatting video URL:', error);
      return url;
    }
  };

  // If content is still loading, show a loading state
  if (contentLoading) {
    return (
      <div className={sidebarClasses}>
        <div className={styles.loading}>Loading course details...</div>
      </div>
    );
  }
  
  // State for video loading error
  const [videoError, setVideoError] = useState(false);

  return (
    <motion.div 
      className={sidebarClasses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      data-theme={theme}
      style={
        customTheme ? {
          '--primary-color': customTheme.primary,
          '--primary-hover': customTheme.secondary,
        } as React.CSSProperties : {}
      }
    >
      <div className={styles.preview}>
        {showVideo && effectiveCourseContent?.courseContent?.course_demo_url ? (
          <div className={styles.videoPlayer}>
            {/* Using VideoPlayer component instead of iframe */}
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              {/* If you have a custom VideoPlayer component, use it here */}
              {/* For example: <VideoPlayer url={effectiveCourseContent.courseContent.course_demo_url} title="Course Preview" onClose={toggleVideoPlayer} /> */}
              
              {/* If you don't have a custom VideoPlayer, we'll create a simplified version */}
              {!videoError ? (
                <iframe 
                  src={safeVideoUrl(effectiveCourseContent.courseContent.course_demo_url)}
                  title="Course Preview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  onError={() => setVideoError(true)}
                />
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#000',
                  color: '#fff',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <p>Sorry, the video cannot be played.</p>
                  <button
                    onClick={() => window.open(effectiveCourseContent.courseContent.course_demo_url, '_blank')}
                    style={{
                      backgroundColor: '#4f46e5',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      marginTop: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    Open Video in New Tab
                  </button>
                </div>
              )}
              <button 
                onClick={toggleVideoPlayer}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10
                }}
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <>
            <img 
              src={effectiveCourseContent?.courseContent?.image_url || course.image_url || "/api/placeholder/350/200"}
              alt={`Preview for ${course.title || effectiveCourseContent?.courseContent?.course_title}`}
              className={styles.previewImage}
              loading="lazy"
            />
            {effectiveCourseContent?.courseContent?.course_demo_url && (
              <motion.div
                className={styles.playButton}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleVideoPlayer}
              >
                <PlayCircle className={styles.playIcon} size={48} aria-label="Play preview" />
                <span className={styles.playText}>Watch Preview</span>
              </motion.div>
            )}
          </>
        )}
      </div>

      <div className={styles.scrollableContent}>
        <div className={styles.pricing} aria-label="Course pricing">
          <span className={styles.price}>{formatPrice(course.price)}</span>
        </div>

        <div className={styles.actions}>
          <Button
            onClick={handleEnroll}
            className={styles.enrollButton}
            disabled={loading}
            aria-busy={loading}
          >
            <ShoppingCart className={styles.icon} size={20} aria-hidden="true" />
            {loading ? 'Enrolling...' : 'ENROLL NOW'}
          </Button>

          <AnimatePresence>
            {error && (
              <motion.p
                className={styles.error}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                role="alert"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <div className={styles.secondaryActions}>
            <Button 
              variant="outline" 
              className={styles.actionButton}
              onClick={handleWishlist}
              aria-label="Add to wishlist"
            >
              <Heart className={styles.icon} size={20} aria-hidden="true" />
              Wishlist
            </Button>
            <Button 
              variant="outline" 
              className={styles.actionButton}
              onClick={handleShare}
              aria-label="Share course"
            >
              <Share2 className={styles.icon} size={20} aria-hidden="true" />
              Share
            </Button>
          </div>
        </div>

        <div className={styles.info} role="list">
          <div className={styles.infoItem} role="listitem">
            <Users className={styles.infoIcon} size={18} />
            <span className={styles.label}>Students</span>
            <span className={styles.value}>{course.total_students?.toLocaleString() || 0}</span>
          </div>
          <div className={styles.infoItem} role="listitem">
            <Clock className={styles.infoIcon} size={18} />
            <span className={styles.label}>Duration</span>
            <span className={styles.value}>
              {effectiveCourseContent?.courseContent?.estimated_completion_time || course.duration}
            </span>
          </div>
          <div className={styles.infoItem} role="listitem">
            <Award className={styles.infoIcon} size={18} />
            <span className={styles.label}>Level</span>
            <span className={styles.value}>
              {effectiveCourseContent?.courseContent?.level || course.level}
            </span>
          </div>
          <div className={styles.infoItem} role="listitem">
            <Book className={styles.infoIcon} size={18} />
            <span className={styles.label}>Lessons</span>
            <span className={styles.value}>
              {effectiveCourseContent?.sections?.reduce((total, section) => total + section.lessons.length, 0) || 'N/A'}
            </span>
          </div>
        </div>

        {effectiveCourseContent?.courseContent?.prerequisites && effectiveCourseContent.courseContent.prerequisites.length > 0 && (
          <div className={styles.prerequisites}>
            <h4 className={styles.prerequisitesTitle}>Prerequisites</h4>
            <ul className={styles.prerequisitesList}>
              {effectiveCourseContent.courseContent.prerequisites.map((prereq, index) => (
                <li key={index} className={styles.prerequisiteItem}>{prereq}</li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.guarantee}>
          <p><CheckCircle size={16} /> 30-Day Money-Back Guarantee</p>
          <p><Shield size={16} /> Full Lifetime Access</p>
        </div>
      </div>
    </motion.div>
  );
}