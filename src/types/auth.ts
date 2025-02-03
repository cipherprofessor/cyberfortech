// src/types/auth.ts

import { ROLES, PERMISSIONS } from '@/constants/auth';

export type Role = typeof ROLES[keyof typeof ROLES];
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export interface UserRole {
  role: Role;
  permissions?: Permission[];
}