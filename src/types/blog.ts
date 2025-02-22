// src/types/blog.ts

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

  export interface BlogPaginationResponse {
    posts: BlogPost[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasMore: boolean;
    };
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
  
  export interface Author {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    avatarUrl?: string;
    role: string;
  }
  
  export interface BlogComment {
    id: string;
    postId: string;
    userId: string;
    content: string;
    parentId?: string;
    isApproved: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: Author;
  }
  
  export interface BlogListProps {
    posts: BlogPost[];
    loading?: boolean;
    error?: string;
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    className?: string;
  }
  
  export interface BlogPostProps {
    post: BlogPost;
    className?: string;
  }
  
  export interface BlogEditorProps {
    post?: BlogPost;
    onSave: (post: Partial<BlogPost>) => Promise<void>;
    onCancel: () => void;
    className?: string;
  }
  
  export interface BlogFilterProps {
    categories: BlogCategory[];
    selectedCategories: string[];
    onCategoryChange: (categories: string[]) => void;
    tags: BlogTag[];
    selectedTags: string[];
    onTagChange: (tags: string[]) => void;
    className?: string;
  }


  // src/types/blog.ts (add these interfaces)

export interface CategoryParent {
    id: string;
    name: string;
    slug: string;
  }
  
  export interface BlogCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    displayOrder: number;
    postCount?: number;
    parent?: CategoryParent;
  }
  
  export interface CreateCategoryInput {
    name: string;
    slug?: string;
    description?: string;
    parentId?: string;
    displayOrder?: number;
  }
  
  export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
    id: string;
  }