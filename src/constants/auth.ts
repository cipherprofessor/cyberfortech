// src/constants/auth.ts
export const ROLES = {
    SUPERADMIN: 'superadmin',
    ADMIN: 'admin',
    STUDENT: 'student',
    INSTRUCTOR: 'instructor'
  } as const;
  
  // Also add a mapping for legacy metadata
  export const METADATA_MAPPING = {
    example: ROLES.STUDENT
  } as const;