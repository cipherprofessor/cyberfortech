// src/hooks/useAuth.ts
'use client';

import { useUser } from "@clerk/nextjs";
import { ROLES, METADATA_MAPPING } from '@/constants/auth';
import { isAdmin } from '@/utils/auth';
import type { Role } from '@/types/auth';

export function useAuth() {
  const { user, isLoaded } = useUser();
  
  const determineRole = (): Role => {
    if (!user?.publicMetadata) return ROLES.STUDENT;
    
    if ('role' in user.publicMetadata) {
      return (user.publicMetadata.role as Role) || ROLES.STUDENT;
    }
    
    if ('data' in user.publicMetadata) {
      return METADATA_MAPPING[user.publicMetadata.data as keyof typeof METADATA_MAPPING] || ROLES.STUDENT;
    }
    
    return ROLES.STUDENT;
  };

  const role = determineRole();

  return {
    user,
    isLoaded,
    isAuthenticated: !!user,
    isSuperAdmin: role === ROLES.SUPERADMIN,
    isAdmin: isAdmin(role),
    isInstructor: role === ROLES.INSTRUCTOR,
    isStudent: role === ROLES.STUDENT,
    role
  };
}
