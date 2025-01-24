// src/components/ui/Mine/SuperadminDashboard/DashboardLayout.tsx
'use client';
import React, { useState } from "react";
import { SuperAdminSidebarNew } from "./SuperAdminSidebar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="flex">
        <SuperAdminSidebarNew onOpenChange={setSidebarOpen} />
      </div>
      
      <motion.main 
        className="flex-1 min-h-screen"
        animate={{
          marginLeft: sidebarOpen ? "16rem" : "5rem"
        }}
        transition={{
          duration: 0.3,
          type: "spring",
          damping: 20
        }}
      >
        <div className="p-8">
          {children}
        </div>
      </motion.main>
    </div>
  );
}