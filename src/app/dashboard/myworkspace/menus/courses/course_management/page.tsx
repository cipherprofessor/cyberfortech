'use client';

import { CourseManagement } from "../../../components/ui/CourseManagement/CourseManagement";
import styles from "./page.module.scss";

const SuperAdminCourseManagementPage = () => {
  return (
    <div className={styles.mainContainer}>
    
      <CourseManagement />
    </div>
  );
};

export default SuperAdminCourseManagementPage;