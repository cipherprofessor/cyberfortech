'use client';
// src/hooks/useAuth.ts
import { useUser } from "@clerk/nextjs";
import { ROLES } from '@/constants';
import { isAdmin } from '@/utils';
import type { Role } from '@/types';

export function useAuth() {
  const { user, isLoaded } = useUser();
  
  // Handle both metadata structures with default STUDENT role
  const role = !user?.publicMetadata ? ROLES.STUDENT :
               user?.publicMetadata?.role as Role || 
               (user?.publicMetadata?.data === "example" ? ROLES.STUDENT : ROLES.STUDENT);

  // // Debug logging
  // console.log('Auth Debug:', {
  //   rawMetadata: user?.publicMetadata,
  //   isEmpty: !user?.publicMetadata,
  //   processedRole: role,
  //   isStudent: role === ROLES.STUDENT || user?.publicMetadata?.data === "example"
  // });

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