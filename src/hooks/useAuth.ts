'use client';
// src/hooks/useAuth.ts
import { useUser } from "@clerk/nextjs";
import { ROLES } from '@/constants';
import { isAdmin } from '@/utils';
import type { Role } from '@/types';

export function useAuth() {
  const { user, isLoaded } = useUser();
  
  // Handle both metadata structures
  const role = user?.publicMetadata?.role as Role || 
               (user?.publicMetadata?.example === "data" ? ROLES.STUDENT : undefined);

  // Add console logs
  console.log('Auth Debug:', {
    rawMetadata: user?.publicMetadata,
    processedRole: role,
    isStudent: role === ROLES.STUDENT || user?.publicMetadata?.example === "data"
  });

  return {
    user,
    isLoaded,
    isAuthenticated: !!user,
    isSuperAdmin: role === ROLES.SUPERADMIN,
    isAdmin: isAdmin(role),
    isStudent: role === ROLES.STUDENT || user?.publicMetadata?.data === "example",
    role
  };
}