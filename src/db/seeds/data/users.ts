// src/db/seeds/data/users.ts
import { SeedUser } from '../types';

function generateUserId(role: string, index: number): string {
  return `usr_${role}_${String(index).padStart(2, '0')}`;
}

const currentDate = new Date().toISOString();

// Helper function to create a complete user object
function createUser(
  id: string,
  email: string,
  username: string,
  firstName: string,
  lastName: string,
  role: 'student' | 'instructor' | 'admin' | 'superadmin',
  bio: string | null = null
): SeedUser {
  const fullName = `${firstName} ${lastName}`;
  return {
    id,
    email,
    username,
    first_name: firstName,
    last_name: lastName,
    full_name: fullName,
    avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}`,
    role,
    is_active: true,
    email_verified: true,
    bio: bio || `${role.charAt(0).toUpperCase() + role.slice(1)} at our platform`,
    location: null,
    website: null,
    social_links: null,
    last_login_at: currentDate,
    created_at: currentDate,
    updated_at: currentDate,
    deleted_at: null,
    is_deleted: false,
    clerk_metadata: null,
    custom_metadata: null
  };
}

export const users: SeedUser[] = [
  // Admin users
  createUser(
    generateUserId('admin', 1),
    'admin@example.com',
    'admin',
    'Admin',
    'User',
    'superadmin',
    'System administrator with full access'
  ),
  createUser(
    generateUserId('admin', 2),
    'moderator@example.com',
    'moderator',
    'Moderator',
    'User',
    'admin',
    'Content moderator and community manager'
  ),
  
  // Instructors
  ...Array.from({ length: 10 }, (_, i) => 
    createUser(
      generateUserId('inst', i + 1),
      `instructor${i + 1}@example.com`,
      `instructor${i + 1}`,
      'Instructor',
      `${i + 1}`,
      'instructor',
      `Experienced instructor specializing in various technical subjects`
    )
  ),
  
  // Students
  ...Array.from({ length: 20 }, (_, i) => 
    createUser(
      generateUserId('std', i + 1),
      `student${i + 1}@example.com`,
      `student${i + 1}`,
      'Student',
      `${i + 1}`,
      'student',
      'Learning and growing with our platform'
    )
  )
];

// Generate matching stats and settings
export const userStats = users.map(user => ({
  user_id: user.id,
  login_count: Math.floor(Math.random() * 100),
  last_active_at: currentDate,
  posts_count: Math.floor(Math.random() * 50),
  topics_count: Math.floor(Math.random() * 20),
  reputation_points: Math.floor(Math.random() * 1000),
  created_at: user.created_at,
  updated_at: user.updated_at
}));

export const userSettings = users.map(user => ({
  user_id: user.id,
  notification_preferences: JSON.stringify({
    email: true,
    push: true,
    web: true
  }),
  privacy_settings: JSON.stringify({
    profile_visible: true,
    show_online_status: true
  }),
  theme_preferences: JSON.stringify({
    theme: 'light',
    font_size: 'medium'
  }),
  created_at: user.created_at,
  updated_at: user.updated_at
}));