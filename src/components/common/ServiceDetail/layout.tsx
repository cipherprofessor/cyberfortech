import React from 'react';
import { Metadata } from 'next';
import { headers } from 'next/headers';

// Define layout structure
export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}

// Generate metadata for each service page
export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
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
}