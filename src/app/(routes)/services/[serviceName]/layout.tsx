// src/app/(routes)/services/[serviceName]/layout.tsx

import React from 'react';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import ClientLayout from '@/components/common/ServiceDetail/ClientLayout';

// Define layout structure for server component
export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}
  
// Generate metadata for each service page
export async function generateMetadata(): Promise<Metadata> {
  try {
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || '';
    const serviceName = pathname.split('/').pop() || '';
    
    // Create a formatted title based on the service name
    const formatTitle = (slug: string): string => {
      // Convert kebab case to title case
      return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };
    
    const title = formatTitle(serviceName);
    
    return {
      title: `${title} | Cyberfort Technologies`,
      description: `Learn about our ${title} services and how we can help secure your organization.`,
      openGraph: {
        title: `${title} | Cyberfort Technologies`,
        description: `Learn about our ${title} services and how we can help secure your organization.`,
        type: 'website',
        siteName: 'Cyberfort Technologies',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Service | Cyberfort Technologies',
      description: 'Learn about our services and how we can help secure your organization.',
    };
  }
}