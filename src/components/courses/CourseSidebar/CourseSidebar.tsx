// "use client"
import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Play, Clock, BarChart, Award, ChevronDown } from 'lucide-react';
// import { Button } from '@/components/ui/button';
import styles from './CourseSidebar.module.scss';
import { Button } from '@heroui/react';

type CourseSidebarProps = {
  course: {
    price: number;
    duration: string;
    level: string;
    certificate: boolean;
    curriculum: Array<{
      title: string;
      lessons: Array<{ title: string; duration: string; }>;
    }>;
  };
};

export function CourseSidebar({ course }: CourseSidebarProps) {
  const { isSignedIn } = useAuth();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const totalLessons = course.curriculum.reduce(
    (acc, section) => acc + section.lessons.length,
    0
  );

  const handleEnroll = async () => {
    if (!isSignedIn) {
      // Redirect to sign in
      window.location.href = '/sign-in';
      return;
    }
    // Handle enrollment logic
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.price}>
        <span className={styles.amount}>${course.price}</span>
      </div>

      <Button 
        className={styles.enrollButton}
        size="lg"
        onClick={handleEnroll}
      >
        {isSignedIn ? 'Enroll Now' : 'Sign in to Enroll'}
      </Button>

      <div className={styles.courseInfo}>
        <div className={styles.infoItem}>
          <Clock className={styles.icon} />
          <div>
            <span className={styles.label}>Duration</span>
            <span className={styles.value}>{course.duration}</span>
          </div>
        </div>

        <div className={styles.infoItem}>
          <BarChart className={styles.icon} />
          <div>
            <span className={styles.label}>Level</span>
            <span className={styles.value}>{course.level}</span>
          </div>
        </div>

        <div className={styles.infoItem}>
          <Play className={styles.icon} />
          <div>
            <span className={styles.label}>Lessons</span>
            <span className={styles.value}>{totalLessons} lessons</span>
          </div>
        </div>

        {course.certificate && (
          <div className={styles.infoItem}>
            <Award className={styles.icon} />
            <div>
              <span className={styles.label}>Certificate</span>
              <span className={styles.value}>Yes</span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.preview}>
        <button 
          className={styles.previewButton}
          onClick={() => setIsPreviewOpen(!isPreviewOpen)}
        >
          <span>Course Preview</span>
          <ChevronDown className={`${styles.chevron} ${isPreviewOpen ? styles.rotate : ''}`} />
        </button>

        {isPreviewOpen && (
          <div className={styles.previewContent}>
            <video
              className={styles.previewVideo}
              src="/course-preview.mp4"
              controls
              poster="/course-preview-thumbnail.jpg"
            />
          </div>
        )}
      </div>

      <div className={styles.guarantee}>
        <p>30-Day Money-Back Guarantee</p>
        <p>Full Lifetime Access</p>
      </div>
    </div>
  );
}