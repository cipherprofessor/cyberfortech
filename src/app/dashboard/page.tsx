// import { DashboardStats } from '@/components/dashboard/DashboardStats';
// import { CourseProgress } from '@/components/dashboard/CourseProgress';
// import { UpcomingSchedule } from '@/components/dashboard/UpcomingSchedule';
// import { RecentActivity } from '@/components/dashboard/RecentActivity';
// import { DashboardChart } from '@/components/dashboard/DashboardChart';
import { CourseProgress } from './CourseProgress/CourseProgress';
import styles from './dashboard-overview.module.scss';
import { DashboardChart } from './DashboardChart/DashboardChart';
import { DashboardStats } from './DashboardStats/DashboardStats';
import { RecentActivity } from './RecentActivity/RecentActivity';
import { UpcomingSchedule } from './UpcomingSchedule/UpcomingSchedule';

export default async function DashboardPage() {
  // In a real app, fetch this data from your API
  const stats = {
    coursesEnrolled: 5,
    coursesCompleted: 3,
    averageScore: 85,
    totalHours: 47,
  };

  const courseProgress = [
    {
      id: 1,
      title: "Advanced Penetration Testing",
      progress: 75,
      nextLesson: "Network Exploitation Techniques",
      totalLessons: 24,
      completedLessons: 18,
    },
    {
      id: 2,
      title: "Web Application Security",
      progress: 45,
      nextLesson: "Cross-Site Scripting Prevention",
      totalLessons: 20,
      completedLessons: 9,
    },
  ];

  const upcomingSchedule = [
    {
      id: 1,
      title: "Live Workshop: Network Security",
      date: "2024-01-25T14:00:00Z",
      duration: "2 hours",
      type: "workshop" as "workshop",
    },
    {
      id: 2,
      title: "Assignment Due: Security Assessment",
      date: "2024-01-27T23:59:59Z",
      type: "assignment" as "assignment",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "completion" as "completion",
      title: "Completed Module: Introduction to Cybersecurity",
      timestamp: "2024-01-20T15:30:00Z",
    },
    {
      id: 2,
      type: "quiz" as "quiz",
      title: "Scored 90% on Network Security Quiz",
      timestamp: "2024-01-19T10:15:00Z",
    },
  ];

  return (
    <div className={styles.dashboardOverview}>
      <h1 className={styles.title}>Dashboard Overview</h1>
      
      <DashboardStats stats={stats} />
      
      <div className={styles.grid}>
        <div className={styles.mainSection}>
          <CourseProgress courses={courseProgress} />
          <DashboardChart />
        </div>
        
        <div className={styles.sideSection}>
          <UpcomingSchedule events={upcomingSchedule} />
          <RecentActivity activities={recentActivity} />
        </div>
      </div>
    </div>
  );
}
