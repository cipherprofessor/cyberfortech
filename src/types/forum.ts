// src/types/forum.ts
export interface ForumStatsData {
    totalTopics: number;
    totalPosts: number;
    activeUsers: number;
    latestMember: string;
  }
  
  export interface ForumStatsProps {
    stats: ForumStatsData;
  }
  
  export interface Category {
    id: number;
    name: string;
    description: string;
    icon?: string;
    subCategories: { id: number; name: string }[];
  }


  // src/types/forum.ts
export interface TopicData {
    id: number;
    title: string;
    content: string;
    category_name: string;
    authorId: string;
    authorName?: string;
    createdAt: string;
    is_pinned: boolean;
    is_locked: boolean;
    replies_count: number;
    views: number;
    categoryId: number;
    subcategory_id?: number;
    subcategory_name?: string;
    updatedAt: string;
  }
  
  export interface TopicsResponse {
    topics: TopicData[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  }
  
  // Add other forum-related interfaces
  export interface Category {
    id: number;
    name: string;
    description: string;
    icon?: string;
    subCategories: { id: number; name: string }[];
  }
  
  export interface ForumStatsData {
    totalTopics: number;
    totalPosts: number;
    activeUsers: number;
    latestMember: string;
  }