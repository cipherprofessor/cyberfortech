// src/app/(auth)/layout.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <header className="p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-accent hover:opacity-80 transition-opacity">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo/logoown.png"
              alt="CyberFort Tech"
              width={32}
              height={32}
              className="rounded-md"
            />
            <span className="font-semibold text-lg">CyberFort Tech</span>
          </Link>
        </div>
      </header> */}
      
      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>
      
      {/* <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} CyberFort Tech. All rights reserved.</p>
      </footer> */}
    </div>
  );
}   