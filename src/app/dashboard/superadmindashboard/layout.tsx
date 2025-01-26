'use client';

import { AnalyticsDashboard } from '@/components/ui/Mine/Analytics/AnalyticsDashboard';
import { SuperAdminSidebarNew } from '@/components/ui/Mine/SuperadminDashboard/SuperAdminSidebar';
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isSuperAdmin } = useAuth();

  if (!isSuperAdmin) {
    redirect('/');
  }

  return (
    <>
      {/* <div className="flex flex-col h-screen">
        <div className="flex-shrink-0">
          <div className="w-64 bg-white border-r border-gray-200">
            <SuperAdminSidebarNew />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div> */}
      
      <SuperAdminSidebarNew />
        
    
      {/* <AnalyticsDashboard /> */}
      <div className='ml-64'>
      {children}
      </div>
    </>
  );
}