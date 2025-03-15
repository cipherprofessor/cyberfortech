// src/types/blog.ts

/**
 * BlogAuthor interface representing a user who can create blog posts
 */
export interface BlogAuthor {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatarUrl?: string;
  role: string;
}

/**
 * BlogCategoryParent for hierarchical category structure
 */
export interface BlogCategoryParent {
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
  parent?: BlogCategoryParent;
  parentId?: string;
  imageUrl?: string; // New field for category icon
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
  likeCount: number;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  categories: BlogCategory[];
  tags: BlogTag[] ;
  author: BlogAuthor;
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
  user: BlogAuthor;
}

/**
 * Blog list component props
 */
export interface BlogListProps {
  posts: BlogPost[];
  loading: boolean;
  error?: string | null;
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
export interface BlogCreateCategoryInput {
  name: string;
  slug?: string;
  description?: string;
  parentId?: string;
  displayOrder?: number;
}

export interface BlogUpdateCategoryInput extends Partial<BlogCreateCategoryInput> {
  id: string;
}

// Additional types for Redux integration

/**
 * Blog interaction status
 */
export interface BlogInteractionStatus {
  isLiked: boolean;
  isBookmarked: boolean;
  likeCount: number;
}

/**
 * Blog loading state
 */
export interface BlogLoadingState {
  post: boolean;
  authorPosts: boolean;
  trendingPosts: boolean;
  interactions: boolean;
  likeAction: boolean;
  bookmarkAction: boolean;
}

/**
 * Blog state for Redux
 */
export interface BlogState {
  currentPost: BlogPost | null;
  authorPosts: BlogPost[];
  trendingPosts: BlogPost[];
  likeCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  loading: BlogLoadingState;
  error: string | null;
}