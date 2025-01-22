// import { VideoPlayer } from '@/components/dashboard/course/VideoPlayer';
// import { CourseCurriculum } from '@/components/dashboard/course/CourseCurriculum';
// import { CourseResources } from '@/components/dashboard/course/CourseResources';
// import { CourseDiscussion } from '@/components/dashboard/course/CourseDiscussion';
// import { CourseProgress } from '@/components/dashboard/course/CourseProgress';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Shadcn/tabs';
import { CourseProgress } from '../../CourseProgress/CourseProgress';
import { CourseCurriculum } from '../CourseCurriculum/CourseCurriculum';
import { CourseDiscussion } from '../CourseDiscussion/CourseDiscussion';
import { CourseResources } from '../CourseResources/CourseResources';
import { VideoPlayer } from '../VideoPlayer/VideoPlayer';
import styles from './course-details.module.scss';
// import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/Shadcn/tabs';

// In a real app, fetch this data from your API
const courseData = {
  id: 1,
  title: 'Advanced Penetration Testing',
  description: 'Learn advanced penetration testing techniques and methodologies.',
  currentModule: {
    id: 1,
    title: 'Network Penetration Testing',
    videoUrl: 'https://example.com/video.mp4',
    duration: '45:00',
    completed: false,
  },
  progress: 50,
  nextLesson: 'Basic Tools and Techniques',
  totalLessons: 10,
  completedLessons: 5,
  curriculum: [
    {
      id: 1,
      title: 'Introduction to Penetration Testing',
      modules: [
        {
          id: 1,
          title: 'Understanding Penetration Testing',
          duration: '45:00',
          type: 'video' as 'video',
          completed: true,
        },
        {
          id: 2,
          title: 'Setting Up Your Lab Environment',
          duration: '1:15:00',
          type: 'video' as 'video',
          completed: true,
        },
        {
          id: 3,
          title: 'Basic Tools and Techniques',
          duration: '1:30:00',
          type: 'video' as 'video',
          completed: false,
        },
        {
          id: 4,
          title: 'Module Assessment',
          type: 'quiz' as 'quiz',
          completed: false,
        },
      ],
    },
    // Add more sections...
  ],
  resources: [
    {
      id: 1,
      title: 'Lab Setup Guide',
      type: 'pdf',
      size: '2.4 MB',
      url: '/resources/lab-setup.pdf',
    },
    {
      id: 2,
      title: 'Tools Cheat Sheet',
      type: 'doc',
      size: '1.1 MB',
      url: '/resources/tools-cheatsheet.doc',
    },
    {
      id: 3,
      title: 'Virtual Machine Image',
      type: 'iso',
      size: '4.2 GB',
      url: '/resources/vm-image.iso',
    },
  ],
};

export default function CourseDetailsPage({ 
  params 
}: { 
  params: { courseId: string } 
}) {
  return (
    <div className={styles.courseContainer}>
      <header className={styles.header}>
        <h1>{courseData.title}</h1>
        <CourseProgress courses={[courseData]} />
      </header>

      <div className={styles.content}>
        <div className={styles.mainContent}>
          <VideoPlayer video={courseData.currentModule} />

          <Tabs defaultValue="curriculum" className={styles.tabs}>
            <TabsList>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
            </TabsList>

            <TabsContent value="curriculum">
              <CourseCurriculum curriculum={courseData.curriculum} />
            </TabsContent>

            <TabsContent value="resources">
              <CourseResources resources={courseData.resources} />
            </TabsContent>

            <TabsContent value="discussion">
              <CourseDiscussion courseId={params.courseId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}