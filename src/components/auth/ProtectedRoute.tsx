// src/components/auth/ProtectedRoute.tsx
'use client';
import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles = [] }: ProtectedRouteProps) {
  const { isAuthenticated, isLoaded, role } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    redirect('/');
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    redirect('/unauthorized');
  }

  return <>{children}</>;
}