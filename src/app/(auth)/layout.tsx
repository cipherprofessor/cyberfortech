// src/app/(auth)/layout.tsx
import React from 'react';
import '../clerk-auth.scss';
import './feature-card-override.scss';


export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>
    </div>
  );
}   