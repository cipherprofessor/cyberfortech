import { CourseList } from "@/components/courses/CourseList/CourseList";
import styles from "./courses.module.scss";

export default function CoursesPage() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.coursesContainer}>
        <div className={styles.header}>
          <h1>Our Courses</h1>
          <p>Explore our comprehensive range of cybersecurity courses</p>
        </div>


          <main className={styles.courseSection}>
            <div className={styles.mobileSorting}>
              <button className={styles.filterToggle}>
                Filters
              </button>
              <select className={styles.sortSelect}>
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            <CourseList />
          </main>
        </div>
      </div>
    // </div>
  );
}