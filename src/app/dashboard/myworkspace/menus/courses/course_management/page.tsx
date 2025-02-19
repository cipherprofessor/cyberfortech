'use client';
import { CourseManagement } from '@/components/ui/Mine/SuperadminDashboard/CoursesDashboard/CourseManagement/CourseManagement';
import styles from "./page.module.scss";

const SuperAdminCourseManagementPage = () => {
  return (
    <div className={styles.mainContainer}>
    
      <CourseManagement />
    </div>
  );
};

export default SuperAdminCourseManagementPage;