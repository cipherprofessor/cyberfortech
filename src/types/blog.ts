// src/types/blog.ts

/**
 * Author interface representing a user who can create blog posts
 */
export interface Author {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatarUrl?: string;
  role: string;
}

/**
 * Category parent for hierarchical category structure
 */
export interface CategoryParent {
  id: string;
  name: string;
  slug: string;
}

/**
 * Blog category definition
 */
export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
  postCount?: number;
  parent?: CategoryParent;
}

/**
 * Blog tag definition
 */
export interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

/**
 * Blog post definition
 */
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
  tags: BlogTag[] | undefined;
  author: Author;
  comments?: BlogComment[];
}

/**
 * Blog pagination information
 */
export interface BlogPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * Blog pagination response returned from API
 */
export interface BlogPaginationResponse {
  posts: BlogPost[];
  pagination: BlogPagination;
}

/**
 * Blog comment definition
 */
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

/**
 * Blog list component props
 */
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

/**
 * Blog post component props
 */
export interface BlogPostProps {
  post: BlogPost;
  className?: string;
}

/**
 * Blog editor component props
 */
export interface BlogEditorProps {
  post?: BlogPost;
  onSave: (post: Partial<BlogPost>) => Promise<void>;
  onCancel: () => void;
  className?: string;
}

/**
 * Blog filter component props
 */
export interface BlogFilterProps {
  categories: BlogCategory[];
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  tags: BlogTag[];
  selectedTags: string[];
  onTagChange: (tags: string[]) => void;
  className?: string;
}

/**
 * Generic API response wrapper
 */
export interface BlogApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

/**
 * Input types for creating and updating categories
 */
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