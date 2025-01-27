// FormLoadingSkeleton.tsx
"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SidebarLoadingSkeleton() {
  return (
    <div className="flex h-screen">
      <div className={cn(
        "fixed h-screen bg-gray-100 dark:bg-neutral-800",
        "flex flex-col shadow-lg",
        "border-r border-gray-200 dark:border-neutral-700",
        "w-64"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 flex flex-col gap-9">
              {/* Main menu items */}
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex items-center gap-2 px-3 py-2">
                    {/* Icon skeleton */}
                    <div className="w-5 h-5 rounded-md bg-gray-200 dark:bg-neutral-700 animate-pulse" />
                    
                    {/* Label skeleton */}
                    <div className="flex-1 h-5 rounded-md bg-gray-200 dark:bg-neutral-700 animate-pulse" />
                  </div>
                  
                  {/* Submenu items skeleton */}
                  {idx !== 4 && (
                    <div className="ml-4 space-y-2">
                      {[...Array(3)].map((_, subIdx) => (
                        <div 
                          key={subIdx}
                          className="w-4/5 h-4 rounded-md bg-gray-200 dark:bg-neutral-700 animate-pulse ml-3"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom items */}
          <div className="p-4 border-t border-gray-200 dark:border-neutral-700">
            {[...Array(2)].map((_, idx) => (
              <div key={idx} className="flex items-center gap-2 px-3 py-2 mb-2">
                <div className="w-5 h-5 rounded-md bg-gray-200 dark:bg-neutral-700 animate-pulse" />
                <div className="flex-1 h-5 rounded-md bg-gray-200 dark:bg-neutral-700 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}