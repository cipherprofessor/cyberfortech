import { currentUser } from '@clerk/nextjs/server';
import { User } from '@clerk/nextjs/server';

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