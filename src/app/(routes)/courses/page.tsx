// import { CourseList } from "@/components/courses/CourseList";
// import { CourseFilter } from "@/components/courses/CourseFilter";
import { CourseFilter } from "@/components/courses/CourseFilter/CourseFilter";
import { CourseList } from "@/components/courses/CourseList/CourseList";
import styles from "./courses.module.scss";

export default function CoursesPage() {
  return (
    <div className={styles.coursesContainer}>
      <div className={styles.header}>
        <h1>Our Courses</h1>
        <p>Explore our comprehensive range of cybersecurity courses</p>
      </div>
      
      <div className={styles.content}>
        <aside className={styles.filterSection}>
          <CourseFilter />
        </aside>
        
        <main className={styles.courseSection}>
          <CourseList />
        </main>
      </div>
    </div>
  );
}
