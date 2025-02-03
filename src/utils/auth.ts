// src/utils/auth.ts

import { ROLES } from '@/constants/auth';
import type { Role } from '@/types/auth';

export const isAdmin = (role?: string): boolean => {
  return role === ROLES.ADMIN || role === ROLES.SUPERADMIN;
};

export const isSuperAdmin = (role?: string): boolean => {
  return role === ROLES.SUPERADMIN;
};

export const hasPermission = (userRole: Role, requiredRole: Role): boolean => {
  const roleHierarchy = {
    [ROLES.SUPERADMIN]: 3,
    [ROLES.ADMIN]: 2,
    [ROLES.INSTRUCTOR]: 1,
    [ROLES.STUDENT]: 0,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};