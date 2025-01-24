import Link from 'next/link';
import { PlayCircle } from 'lucide-react';
// import { Progress } from '../../../components/';
import styles from './CourseProgress.module.scss';
import { Progress } from '@heroui/react';

type Course = {
  id: number;
  title: string;
  progress: number;
  nextLesson: string;
  totalLessons: number;
  completedLessons: number;
};

type CourseProgressProps = {
  courses: Course[];
};

export function CourseProgress({ courses }: CourseProgressProps) {
  return (
    <div className={styles.courseProgress}>
      <div className={styles.header}>
        <h2>Course Progress</h2>
        <Link href="/dashboard/courses" className={styles.viewAll}>
          View All Courses
        </Link>
      </div>

      <div className={styles.courses}>
        {courses.map((course) => (
          <div key={course.id} className={styles.courseCard}>
            <div className={styles.courseInfo}>
              <h3 className={styles.courseTitle}>{course.title}</h3>
              <div className={styles.progressStats}>
                <Progress value={course.progress} className={styles.progressBar} />
                <span className={styles.progressText}>{course.progress}% Complete</span>
              </div>
              <div className={styles.lessonCount}>
                {course.completedLessons} of {course.totalLessons} lessons completed
              </div>
            </div>

            <div className={styles.nextLesson}>
              <h4>Next Lesson</h4>
              <Link 
                href={`/dashboard/courses/${course.id}/lessons`}
                className={styles.lessonLink}
              >
                <PlayCircle className={styles.icon} />
                <span>{course.nextLesson}</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}