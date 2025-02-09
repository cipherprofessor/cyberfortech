// src/components/Forum/Skeletons/TopicSkeleton.tsx
import styles from './TopicSkeleton.module.scss';

export function TopicSkeleton() {
  return (
    <div className={styles.skeleton}>
      {/* Header Skeleton */}
      <div className={styles.header}>
        <div className={styles.titleSkeleton}></div>
        <div className={styles.metaSkeleton}></div>
      </div>

      {/* Author Info Skeleton */}
      <div className={styles.contentWrapper}>
        <div className={styles.authorSidebar}>
          <div className={styles.avatarSkeleton}></div>
          <div className={styles.authorNameSkeleton}></div>
          <div className={styles.authorRoleSkeleton}></div>
        </div>

        {/* Content Skeleton */}
        <div className={styles.mainContent}>
          <div className={styles.contentSkeleton}>
            <div className={styles.line}></div>
            <div className={styles.line}></div>
            <div className={styles.line}></div>
            <div className={styles.line}></div>
          </div>
          <div className={styles.actionsSkeleton}></div>
        </div>
      </div>
    </div>
  );
}