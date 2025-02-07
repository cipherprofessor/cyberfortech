// src/types/forum.ts
export interface Author {
    id: string;
    name: string;
    avatar?: string;
    reputation?: number;
    badge?: string;
  }
  
  
  export interface LastReply {
    author: string;
    timestamp: string;
  }
  
  
// The base Topic interface used by TopicsList
export interface Topic {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  author_image: string | null;
  author_email: string;
  category_id: string;
  category_name: string;
  subcategory_id?: string;
  subcategory_name?: string;
  is_pinned: boolean;
  is_locked: boolean;
  views: number;
  reply_count: number;
  created_at: string;
  updated_at: string;
}


  export interface TopicData {
    id: number;
    title: string;
    content: string;
    category_name: string;
    categoryId: number;
    authorId: string;
    authorName: string;
    createdAt: string;
    updatedAt: string;
    is_pinned: boolean;
    is_locked: boolean;
    replies_count: number;
    views: number;
    subcategory_id?: number;
    subcategory_name?: string;
  }
  
  // API response interface
export interface ApiTopic {
    id: number;
    title: string;
    content?: string;
    author_id: string;
    author_name: string;
    author_avatar?: string;
    author_reputation?: number;
    author_badge?: string;
    category_id: number;
    category_name: string;
    subcategory_id?: number;
    subcategory_name?: string;
    created_at: string;
    updated_at?: string;
    reply_count: number;
    views: number;
    is_pinned: boolean;
    is_locked: boolean;
    last_reply_author?: string;
    last_reply_date?: string;
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
  
  export interface CategoryStats {
    total_topics: number;
    topics_today: number;
    total_posts: number;
    posts_today: number;
    active_posters: number;
    avg_response_time?: number;
    engagement_rate? : number;
    
  }
  
  export interface SubCategory {
    id: number;
    name: string;
    description: string;
    topicCount: number;
  }
  
  export interface Category {
    id: number;
    name: string;
    description: string;
    icon?: string;
    total_topics: number;
    total_posts: number;
    totalTopics?: number;
    totalPosts?: number;
    created_at: string;
    updated_at: string;
    subCategories: SubCategory[];
    rules?: string[];
    moderators?: string[];
  }
  
  export interface ForumStatsData {
    totalTopics: number;
    totalPosts: number;
    activeUsers: number;
    totalUsers: number;
    latestMember: string;
  }

  export type ReactionType = 'like' | 'heart' | 'insightful' | 'funny';

export interface Reaction {
  type: ReactionType;
  count: number;
  hasReacted: boolean;
}

export interface TopicReaction extends Reaction {
  id: number;
  topicId: number;
  userId: string;
  createdAt: string;
}


type CreateTopicRequest = {
  title: string;
  content: string;
  categoryId: string;
  subcategoryId?: string;
  authorId: string;
  author_name: string;    // New
  author_email: string;   // New
  author_image: string;   // New
  icon?: string;         // New optional
};




  