// src/app/(routes)/blog/new/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create New Blog Post',
  description: 'Create a new blog post for your learning management system.'
};

export default function NewBlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}