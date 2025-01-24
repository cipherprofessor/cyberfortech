// src/components/ui/Mine/SuperadminDashboard/DashboardLayout.tsx
'use client';
import React from "react"; // Removed useState since we don't need it anymore
import { SuperAdminSidebarNew } from "./SuperAdminSidebar";
import { cn } from "@/lib/utils";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-neutral-900">
      <SuperAdminSidebarNew />
      
      <main 
        className={cn(
          "flex-1 min-h-screen",
          "transition-all duration-300 ease-in-out",
          "ml-64", // Fixed margin for always-expanded sidebar
          "p-8"
        )}
      >
        <div className="max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
}