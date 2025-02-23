// src/types/auth.ts

import { ROLES,} from '@/constants/auth';

export type Role = typeof ROLES[keyof typeof ROLES];;


export interface UserRole {
  role: Role;

}