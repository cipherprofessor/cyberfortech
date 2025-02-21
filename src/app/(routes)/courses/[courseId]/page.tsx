// src/app/(routes)/courses/[courseId]/page.tsx
import { Suspense } from 'react';
import { CourseDetailClient } from './CourseDetailsPage';

export default async function CourseDetailPage({ 
  params 
}: { 
  params: { courseId: string } 
}) {
  const { courseId } = params;

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CourseDetailClient courseId={courseId} />
    </Suspense>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-48 bg-gray-200 rounded-lg dark:bg-gray-700 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-1/2"></div>
      </div>
    </div>
  );
}