// src/constants/auth.ts

export const ROLES = {
    SUPERADMIN: 'superadmin',
    ADMIN: 'admin',
    STUDENT: 'student',
    INSTRUCTOR: 'instructor'
  } as const;
  
  export const PERMISSIONS = {
    DELETE_TOPIC: 'delete_topic',
    CREATE_CATEGORY: 'create_category',
    MANAGE_USERS: 'manage_users'
  } as const;