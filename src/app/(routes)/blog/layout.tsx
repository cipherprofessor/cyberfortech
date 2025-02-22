// src/app/(routes)/blog/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Learning Management System',
  description: 'Read our latest blog posts about education, technology, and more.'
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}