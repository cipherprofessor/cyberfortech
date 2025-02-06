// src/db/seeds/types/index.ts
export interface SeedUser {
    id: string;
    email: string;
    username: string | null;
    first_name: string | null;
    last_name: string | null;
    full_name: string | null;
    avatar_url: string | null;
    role: 'student' | 'instructor' | 'admin' | 'superadmin';
    is_active: boolean;
    email_verified: boolean;
    bio: string | null;
    location: string | null;
    website: string | null;
    social_links: string | null;
    last_login_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    is_deleted: boolean;
    clerk_metadata: string | null;
    custom_metadata: string | null;
  }
  
  export interface SeedUserStats {
    user_id: string;
    login_count: number;
    last_active_at: string | null;
    posts_count: number;
    topics_count: number;
    reputation_points: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface SeedInstructor {
    id: string;
    name: string;
    email: string;
    bio: string | null;
    contact_number: string | null;
    address: string | null;
    profile_image_url: string | null;
    specialization: string | null;
    qualification: string | null;
    years_of_experience: number;
    rating: number;
    total_students: number;
    total_courses: number;
    social_links: string | null;
    status: 'active' | 'inactive' | 'suspended';
    created_at: string;
    updated_at: string;
    user_id: string;
  }
  
  export interface SeedForumCategory {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    color: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
    deleted_at: string | null;
  }
  
  export interface SeedForumSubcategory {
    id: string;
    category_id: string;
    name: string;
    description: string | null;
    icon: string | null;
    color: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
    deleted_at: string | null;
  }
  
  export interface SeedForumTopic {
    id: string;
    category_id: string;
    subcategory_id: string | null;
    author_id: string;
    title: string;
    content: string;
    views: number;
    is_pinned: boolean;
    is_locked: boolean;
    created_at: string;
    updated_at: string;
    last_post_at: string;
    is_deleted: boolean;
    deleted_at: string | null;
  }
  
  export interface SeedForumPost {
    id: string;
    topic_id: string;
    parent_id: string | null;
    author_id: string;
    content: string;
    created_at: string;
    updated_at: string;
}
  export interface SeedContact {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    subject: string;
    message: string;
    status: 'new' | 'in_progress' | 'resolved' | 'spam';
    assigned_to: string | null;
    response: string | null;
    response_by: string | null;
    responded_at: string | null;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    tags: string | null;
    metadata: string | null;
    is_deleted: boolean;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
  }