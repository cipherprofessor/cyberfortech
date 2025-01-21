// import { CourseContent } from '@/components/courses/CourseContent';
// import { CourseHeader } from '@/components/courses/CourseHeader';
// import { CourseSidebar } from '@/components/courses/CourseSidebar';
import { CourseContent } from '@/components/courses/CourseContent/CourseContent';
import { CourseHeader } from '@/components/courses/CourseHeader/CourseHeader';
import { CourseSidebar } from '@/components/courses/CourseSidebar/CourseSidebar';
import styles from './course-detail.module.scss';

export default async function CourseDetailPage({
  params,
}: {
  params: { courseId: string };
}) {
  // In a real app, fetch course data from API
  const course = {
    id: params.courseId,
    title: "Advanced Penetration Testing",
    description: "Master the art of ethical hacking and penetration testing with hands-on labs and real-world scenarios. Learn to identify and exploit vulnerabilities in networks, web applications, and systems.",
    instructor: {
      name: "John Doe",
      title: "Senior Security Engineer",
      avatar: "/instructor-avatar.jpg",
      bio: "15+ years of experience in cybersecurity",
    },
    price: 299.99,
    duration: "12 weeks",
    level: "Advanced",
    rating: 4.8,
    studentsEnrolled: 1234,
    lastUpdated: "2024-01-15",
    language: "English",
    certificate: true,
    topics: [
      "Network Penetration Testing",
      "Web Application Security",
      "Wireless Network Security",
      "Mobile Application Testing",
      "Cloud Security Testing",
    ],
    curriculum: [
      {
        title: "Introduction to Penetration Testing",
        lessons: [
          { title: "Understanding Penetration Testing", duration: "45:00" },
          { title: "Setting Up Your Lab Environment", duration: "1:15:00" },
          { title: "Basic Tools and Techniques", duration: "1:30:00" },
        ],
      },
      {
        title: "Network Penetration Testing",
        lessons: [
          { title: "Network Scanning and Enumeration", duration: "2:00:00" },
          { title: "Vulnerability Assessment", duration: "1:45:00" },
          { title: "Exploitation Techniques", duration: "2:30:00" },
        ],
      },
      // More sections...
    ],
  };

  return (
    <div className={styles.courseContainer}>
      <CourseHeader course={course} />
      
      <div className={styles.courseContent}>
        <main className={styles.mainContent}>
          <CourseContent course={course} />
        </main>
        
        <aside className={styles.sidebar}>
          <CourseSidebar course={course} />
        </aside>
      </div>
    </div>
  );
}