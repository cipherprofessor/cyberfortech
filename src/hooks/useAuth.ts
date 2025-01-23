// src/hooks/useAuth.ts
import { useAuth as useClerkAuth } from "@clerk/nextjs";

export function useAuth() {
  const { userId, sessionClaims } = useClerkAuth();
  const role = sessionClaims?.metadata?.role as string;

  return {
    userId,
    role,
    isAuthenticated: !!userId,
    isSuperAdmin: role === 'superadmin',
    isAdmin: ['superadmin', 'admin'].includes(role),
    isStudent: role === 'student',
  };
}