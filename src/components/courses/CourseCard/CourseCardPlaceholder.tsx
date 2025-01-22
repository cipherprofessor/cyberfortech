import styles from './CourseCardPlaceholder.module.scss';

export function CourseCardPlaceholder() {
  return (
    <div className={styles.courseCardPlaceholder}>
      <div className={styles.imagePlaceholder}></div>
      <div className={styles.contentPlaceholder}>
        <div className={styles.titlePlaceholder}></div>
        <div className={styles.descriptionPlaceholder}></div>
        <div className={styles.detailsPlaceholder}></div>
        <div className={styles.footerPlaceholder}></div>
      </div>
    </div>
  );
}