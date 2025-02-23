// src/components/auth/ProtectedRoute.tsx
'use client';

import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { hasPermission } from "@/utils/auth";
import type { Role } from "@/types/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Role[];
}

export function ProtectedRoute({ children, allowedRoles = [] }: ProtectedRouteProps) {
  const { isAuthenticated, isLoaded, role } = useAuth();

  useEffect(() => {
    if (isLoaded && !isAuthenticated) {
      redirect('/login');
    }

    if (isLoaded && isAuthenticated && allowedRoles.length > 0) {
      const hasAccess = allowedRoles.some(requiredRole => 
        hasPermission(role as Role, requiredRole)
      );
      
      if (!hasAccess) {
        redirect('/');
      }
    }
  }, [isLoaded, isAuthenticated, role, allowedRoles]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}