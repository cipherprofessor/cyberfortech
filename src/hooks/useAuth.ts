// src/hooks/useAuth.ts
'use client';
import { useUser } from "@clerk/nextjs";

export function useAuth() {
  const { user, isLoaded } = useUser();
  const role = user?.publicMetadata?.example as string;

  return {
    user,
    isLoaded,
    isAuthenticated: !!user,
    isSuperAdmin: role === 'superadmin',
    isAdmin: ['admin'].includes(role),
    isStudent: role === 'data',
    role
  };
}