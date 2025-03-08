// src/types/blog.ts

export interface Author {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    avatarUrl?: string;
    role: string;
  }
  
  export interface BlogCategory {
    id: string;
    name: string;
    slug: string;
    displayOrder: number;
  }
  
  export interface BlogTag {
    id: string;
    name: string;
    slug: string;
  }
  
  export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    featuredImage?: string;
    authorId: string;
    status: 'draft' | 'published' | 'archived';
    viewCount: number;
    isFeatured: boolean;
    metaTitle?: string;
    metaDescription?: string;
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    categories: BlogCategory[];
    tags: BlogTag[];
    author: Author;
  }
  
  export interface BlogPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  }
  
  export interface BlogPaginationResponse {
    posts: BlogPost[];
    pagination: BlogPagination;
  }
  
  export interface BlogListProps {
    posts: BlogPost[];
    loading: boolean;
    error?: string;
    currentPage?: number;
    totalPages?: number;
    categories?: BlogCategory[];
    tags?: BlogTag[];
    onPageChange?: (page: number) => void;
    onSearch?: (query: string) => void;
    onCategoryFilter?: (category: string | null) => void;
    onTagFilter?: (tag: string | null) => void;
    className?: string;
  }
  
  export interface BlogApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
  }