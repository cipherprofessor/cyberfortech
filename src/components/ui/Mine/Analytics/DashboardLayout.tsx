"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { SuperAdminSidebarNew } from "../SuperadminDashboard/SuperAdminSidebar";
import { cn } from "@/lib/utils";


export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-neutral-900">
      <SuperAdminSidebarNew onOpenChange={setSidebarOpen} />
      
      <main 
        ref={mainContentRef}
        className={cn(
          "flex-1 transition-all duration-300",
          "p-8 overflow-auto",
          sidebarOpen ? "ml-64" : "ml-20"
        )}
      >
        {children}
      </main>
    </div>
  );
}
