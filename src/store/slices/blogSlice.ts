import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { BlogPost } from '@/types/blog'; // Import your existing BlogPost type

// Define interfaces for our state
interface BlogState {
  currentPost: BlogPost | null;
  authorPosts: BlogPost[];
  trendingPosts: BlogPost[];
  likeCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  loading: {
    post: boolean;
    authorPosts: boolean;
    trendingPosts: boolean;
    interactions: boolean;
    likeAction: boolean;
    bookmarkAction: boolean;
  };
  error: string | null;
}

const initialState: BlogState = {
  currentPost: null,
  authorPosts: [],
  trendingPosts: [],
  likeCount: 0,
  isLiked: false,
  isBookmarked: false,
  loading: {
    post: false,
    authorPosts: false,
    trendingPosts: false,
    interactions: false,
    likeAction: false,
    bookmarkAction: false,
  },
  error: null
};

// Async thunks for API calls
export const fetchPostBySlug = createAsyncThunk<BlogPost, string>(
  'blog/fetchPostBySlug',
  async (slug: string) => {
    const response = await fetch(`/api/blog/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch post');
    return await response.json();
  }
);

export const fetchAuthorPosts = createAsyncThunk<
  { posts: BlogPost[] },
  { authorId: string; postId: string; limit?: number }
>(
  'blog/fetchAuthorPosts',
  async ({ authorId, postId, limit = 3 }) => {
    const response = await fetch(`/api/blog/author/${authorId}/posts?limit=${limit}&exclude=${postId}`);
    if (!response.ok) throw new Error('Failed to fetch author posts');
    return await response.json();
  }
);

export const fetchTrendingPosts = createAsyncThunk<
  { posts: BlogPost[] },
  { limit?: number; excludeId: string }
>(
  'blog/fetchTrendingPosts',
  async ({ limit = 5, excludeId }) => {
    const response = await fetch(`/api/blog/trending?limit=${limit}&exclude=${excludeId}`);
    if (!response.ok) throw new Error('Failed to fetch trending posts');
    return await response.json();
  }
);

export const fetchPostInteractions = createAsyncThunk<
  { likeCount: number; isLiked: boolean; isBookmarked: boolean },
  { postId: string; userId?: string }
>(
  'blog/fetchPostInteractions',
  async ({ postId, userId }) => {
    if (!userId) return { likeCount: 0, isLiked: false, isBookmarked: false };
    
    // Use the combined endpoint to get all interactions in a single request
    const response = await fetch(`/api/blog/posts/${postId}/interactions?userId=${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch interactions');
    }
    
    return await response.json();
  }
);

export const toggleLike = createAsyncThunk<
  { isLiked: boolean },
  { postId: string; userId: string; isLiked: boolean }
>(
  'blog/toggleLike',
  async ({ postId, userId, isLiked }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/blog/posts/${postId}/likes`, {
        method: isLiked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to update like status');
      }
      
      return { isLiked: !isLiked };
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const toggleBookmark = createAsyncThunk<
  { isBookmarked: boolean },
  { postId: string; userId: string; isBookmarked: boolean }
>(
  'blog/toggleBookmark',
  async ({ postId, userId, isBookmarked }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/blog/posts/${postId}/bookmarks`, {
        method: isBookmarked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to update bookmark status');
      }
      
      return { isBookmarked: !isBookmarked };
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

// Create the slice
const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    resetBlogState: (state) => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle hydration between server and client
      .addCase(HYDRATE, (state, action: any) => {
        return {
          ...state,
          ...action.payload.blog,
        };
      })
      // Fetch post
      .addCase(fetchPostBySlug.pending, (state) => {
        state.loading.post = true;
        state.error = null;
      })
      .addCase(fetchPostBySlug.fulfilled, (state, action) => {
        state.loading.post = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostBySlug.rejected, (state, action) => {
        state.loading.post = false;
        state.error = action.error.message || 'Failed to fetch post';
      })
      // Fetch author posts
      .addCase(fetchAuthorPosts.pending, (state) => {
        state.loading.authorPosts = true;
      })
      .addCase(fetchAuthorPosts.fulfilled, (state, action) => {
        state.loading.authorPosts = false;
        state.authorPosts = action.payload.posts;
      })
      .addCase(fetchAuthorPosts.rejected, (state, action) => {
        state.loading.authorPosts = false;
        state.error = action.error.message || 'Failed to fetch author posts';
      })
      // Fetch trending posts
      .addCase(fetchTrendingPosts.pending, (state) => {
        state.loading.trendingPosts = true;
      })
      .addCase(fetchTrendingPosts.fulfilled, (state, action) => {
        state.loading.trendingPosts = false;
        state.trendingPosts = action.payload.posts;
      })
      .addCase(fetchTrendingPosts.rejected, (state, action) => {
        state.loading.trendingPosts = false;
        state.error = action.error.message || 'Failed to fetch trending posts';
      })
      // Fetch post interactions
      .addCase(fetchPostInteractions.pending, (state) => {
        state.loading.interactions = true;
      })
      .addCase(fetchPostInteractions.fulfilled, (state, action) => {
        state.loading.interactions = false;
        state.likeCount = action.payload.likeCount;
        state.isLiked = action.payload.isLiked;
        state.isBookmarked = action.payload.isBookmarked;
      })
      .addCase(fetchPostInteractions.rejected, (state) => {
        state.loading.interactions = false;
      })
      // Toggle like
      .addCase(toggleLike.pending, (state) => {
        state.loading.likeAction = true;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        state.loading.likeAction = false;
        state.isLiked = action.payload.isLiked;
        state.likeCount = state.isLiked ? state.likeCount + 1 : Math.max(0, state.likeCount - 1);
      })
      .addCase(toggleLike.rejected, (state) => {
        state.loading.likeAction = false;
      })
      // Toggle bookmark
      .addCase(toggleBookmark.pending, (state) => {
        state.loading.bookmarkAction = true;
      })
      .addCase(toggleBookmark.fulfilled, (state, action) => {
        state.loading.bookmarkAction = false;
        state.isBookmarked = action.payload.isBookmarked;
      })
      .addCase(toggleBookmark.rejected, (state) => {
        state.loading.bookmarkAction = false;
      });
  }
});

export const { resetBlogState } = blogSlice.actions;
export default blogSlice.reducer;