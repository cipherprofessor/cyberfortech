import { SuperAdminSidebar } from "./SuperAdminSidebar";

export function SuperAdminDashboard() {
    return (
      <div className="flex h-screen">
        <SuperAdminSidebar />
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-neutral-900">
          <DashboardHeader />
          <div className="p-6">
            <DashboardWidgets />
          </div>
        </main>
      </div>
    );
   }
   