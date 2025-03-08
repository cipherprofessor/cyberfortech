//src/lib/clerk.ts
import { clerkClient, currentUser, getAuth } from '@clerk/nextjs/server';
import { User } from '@clerk/nextjs/server';
import { nanoid } from 'nanoid';
import { isAdmin, isSuperAdmin, hasPermission } from '@/utils/auth';
import { ROLES } from '@/constants/auth';
import type { Role } from '@/types/auth';

export { nanoid };

/**
 * Gets the full name of the user based on available data
 * Priority: firstName + lastName > username > email
 */
export async function getFullName(): Promise<string> {
  const user = await currentUser();
  if (!user) return '';

  const firstName = user.firstName ?? '';
  const lastName = user.lastName ?? '';
  
  // If both first name and last name are available
  if (firstName && lastName) {
    return `${firstName} ${lastName}`.trim();
  }
  
  // If only first name is available
  if (firstName) {
    return firstName;
  }
  
  // If username is available
  if (user.username) {
    return user.username;
  }
  
  // Fallback to email
  if (user.emailAddresses && user.emailAddresses.length > 0) {
    return user.emailAddresses[0].emailAddress;
  }
  
  return '';
}

/**
 * Gets the first name of the user
 */
export async function getFirstName(): Promise<string> {
  const user = await currentUser();
  return user?.firstName ?? '';
}

/**
 * Gets the last name of the user
 */
export async function getLastName(): Promise<string> {
  const user = await currentUser();
  return user?.lastName ?? '';
}

/**
 * Gets the username of the user
 */
export async function getUsername(): Promise<string> {
  const user = await currentUser();
  return user?.username ?? '';
}

/**
 * Gets the primary email address of the user
 */
export async function getEmail(): Promise<string> {
  const user = await currentUser();
  if (!user?.emailAddresses || user.emailAddresses.length === 0) {
    return '';
  }
  
  // Get primary email if set, otherwise return the first email
  const primaryEmail = user.emailAddresses.find(email => email.id === user.primaryEmailAddressId);
  return primaryEmail?.emailAddress ?? user.emailAddresses[0].emailAddress ?? '';
}

/**
 * Gets the profile image URL of the user
 */
export async function getImageUrl(): Promise<string> {
  const user = await currentUser();
  return user?.imageUrl ?? '';
}

/**
 * Helper function to get formatted name components
 * Useful when you need both first and last name separately but formatted
 */
export async function getNameComponents(): Promise<{
  firstName: string;
  lastName: string;
}> {
  const user = await currentUser();
  return {
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? ''
  };
}

/**
 * Synchronous version of getFullName that takes a User object
 * Useful when you already have the user object and don't want to fetch it again
 */
export function getFullNameSync(user: User | null): string {
  if (!user) return '';

  const firstName = user.firstName ?? '';
  const lastName = user.lastName ?? '';
  
  if (firstName && lastName) {
    return `${firstName} ${lastName}`.trim();
  }
  
  if (firstName) {
    return firstName;
  }
  
  if (user.username) {
    return user.username;
  }
  
  if (user.emailAddresses && user.emailAddresses.length > 0) {
    return user.emailAddresses[0].emailAddress;
  }
  
  return '';
}


export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  imageUrl: string;
  role: Role;
  username?: string;
}

/**
 * Gets the current authenticated user with complete data
 */
export async function getCurrentUser(request?: Request): Promise<UserData | null> {
  try {
    // For API routes
    if (request) {
      const { userId } = getAuth(request as any);
      if (!userId) return null;
      
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      return transformUserData(user);
    }
    
    // For server components/pages
    const user = await currentUser();
    if (!user) return null;
    
    return transformUserData(user);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Validates user authentication and required role
 */
export async function validateUserAccess(
  request: Request,
  requiredRoles: Role[] = []
): Promise<{ 
  isAuthorized: boolean; 
  user: UserData | null;
  error?: string;
}> {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return { 
        isAuthorized: false, 
        user: null,
        error: 'Unauthorized Current User'
      };
    }

    // If no specific roles are required, just being authenticated is enough
    if (requiredRoles.length === 0) {
      return { 
        isAuthorized: true, 
        user 
      };
    }

    // Check if user has one of the required roles
    const hasRequiredRole = requiredRoles.some(requiredRole => 
      hasPermission(user.role as Role, requiredRole as Role)
    );
    
    return {
      isAuthorized: hasRequiredRole,
      user,
      error: hasRequiredRole ? undefined : 'Insufficient permissions'
    };
  } catch (error) {
    console.error('Error validating user access:', error);
    return { 
      isAuthorized: false, 
      user: null,
      error: 'Error validating access'
    };
  }
}

/**
 * Check if the current user is an admin
 */
export async function checkIsAdmin(request?: Request): Promise<boolean> {
  const user = await getCurrentUser(request);
  return user ? isAdmin(user.role) : false;
}

/**
 * Check if the current user is a super admin
 */
export async function checkIsSuperAdmin(request?: Request): Promise<boolean> {
  const user = await getCurrentUser(request);
  return user ? isSuperAdmin(user.role) : false;
}

/**
 * Transform Clerk User object into our standardized UserData format
 */
function transformUserData(user: User): UserData {
  const primaryEmail = user.emailAddresses.find(
    email => email.id === user.primaryEmailAddressId
  );

  return {
    id: user.id,
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    fullName: getFullNameSync(user),
    email: primaryEmail?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? '',
    imageUrl: user.imageUrl ?? '',
    role: (user.publicMetadata?.role as Role) || ROLES.STUDENT,
    username: user.username ?? undefined
  };
}


