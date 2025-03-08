// src/components/common/ServiceDetail/ClientLayout.tsx
"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import ServiceSidebar from './ServiceSidebar/ServiceSidebar';
import styles from '../ServiceDetail/ServiceLayout/ServiceLayout.module.scss';

interface ServiceLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ServiceLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const isServiceDetailPage = pathname.includes('/services/') && pathname !== '/services';
  
  return (
    <div className={styles.layoutContainer}>
      {isServiceDetailPage && (
        <div className={styles.sidebarContainer}>
          <ServiceSidebar />
        </div>
      )}
      <div className={styles.contentContainer}>
        {children}
      </div>
    </div>
  );
};

export default ClientLayout;