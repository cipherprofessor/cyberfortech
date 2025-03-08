//src/app/(routes)/services/[serviceName]/page.tsx
"use client";

import React from 'react';
import { usePathname } from 'next/navigation';

import dynamic from 'next/dynamic';
import { Loader } from 'lucide-react';
import ServiceNavigation from '@/components/common/ServiceDetail/ServiceNavigation';
import MobileServiceNav from '@/components/common/ServiceDetail/MobileServiceNav/MobileServiceNav';
import ServiceLayout from '@/components/common/ServiceDetail/ServiceLayout/ServiceLayout';


// Define a mapping of service paths to their component names
const serviceComponents: Record<string, React.ComponentType> = {
  '/services/network-security': dynamic(() => import('@/components/common/ServiceDetail/NetworkSecurityPage'), {
    loading: () => <LoadingComponent />
  }),
  '/services/application-security': dynamic(() => import('@/components/common/ServiceDetail/ApplicationSecurityPage'), {
    loading: () => <LoadingComponent />
  }),
  '/services/cloud-security': dynamic(() => import('@/components/common/ServiceDetail/CloudSecurityPage'), {
    loading: () => <LoadingComponent />
  }),
  '/services/penetration-testing': dynamic(() => import('@/components/common/ServiceDetail/PenetrationTestingPage'), {
    loading: () => <LoadingComponent />
  }),
  '/services/security-compliance': dynamic(() => import('@/components/common/ServiceDetail/SecurityCompliancePage'), {
    loading: () => <LoadingComponent />
  }),
  '/services/incident-response': dynamic(() => import('@/components/common/ServiceDetail/IncidentResponsePage'), {
    loading: () => <LoadingComponent />
  }),
  '/services/aws-cloud-security': dynamic(() => import('@/components/common/ServiceDetail/AWSCloudSecurityPage'), {
    loading: () => <LoadingComponent />
  }),
  '/services/full-stack-development': dynamic(() => import('@/components/common/ServiceDetail/FullStackDevelopmentPage'), {
    loading: () => <LoadingComponent />
  }),
};

const LoadingComponent = () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '50vh',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <Loader size={40} className="animate-spin" color="#007bff" />
      <p style={{ color: 'white' }}>Loading service details...</p>
    </div>
  );
  
  const NotFoundComponent = () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '50vh',
      flexDirection: 'column',
      gap: '1rem',
      color: 'white',
      textAlign: 'center',
      padding: '0 1rem'
    }}>
      <h2>Service Not Found</h2>
      <p>The requested service could not be found. Please check the URL or navigate using the service menu.</p>
    </div>
  );
  
  export default function ServicePage() {
    const pathname = usePathname();
    
    // Find the component for the current path
    const ServiceComponent = serviceComponents[pathname];
    
    return (
      <>
        <MobileServiceNav />
        <ServiceLayout>
          {ServiceComponent ? <ServiceComponent /> : <NotFoundComponent />}
        </ServiceLayout>
      </>
    );
  }