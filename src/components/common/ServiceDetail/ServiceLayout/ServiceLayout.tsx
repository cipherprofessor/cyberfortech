// src/components/common/ServiceDetail/ServiceLayout/ServiceLayout.tsx
"use client";

import React from 'react';
import styles from './ServiceLayout.module.scss';

interface ServiceLayoutProps {
  children: React.ReactNode;
}

const ServiceLayout: React.FC<ServiceLayoutProps> = ({ children }) => {
  // Only render the content, not the sidebar
  return (
    <div className={styles.contentWrapper}>
      {children}
    </div>
  );
};

export default ServiceLayout;