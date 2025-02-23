// src/app/(routes)/blog/[slug]/loading.tsx
export default function Loading() {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        {/* Featured Image Skeleton */}
        <div className="w-full h-[400px] bg-gray-200 dark:bg-gray-700 rounded-lg mb-8" />
  
        {/* Title Skeleton */}
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4" />
  
        {/* Author Info Skeleton */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          </div>
        </div>
  
        {/* Content Skeleton */}
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
        </div>
      </div>
    );
  }