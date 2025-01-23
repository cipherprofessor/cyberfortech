import { useUser } from "@clerk/nextjs";

export function useAuth() {
  const { user, isLoaded } = useUser();
  const role = user?.publicMetadata?.role as string;

  return {
    user,
    isLoaded,
    isAuthenticated: !!user,
    isSuperAdmin: role === 'superadmin',
    isAdmin: ['superadmin', 'admin'].includes(role),
    isStudent: role === 'student',
    role
  };
}