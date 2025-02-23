export interface Comment {
    id: string;
    postId: string;
    userId: string;
    content: string;
    parentId?: string;
    isApproved: boolean;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    deletedAt?: string;
    user: {
      id: string;
      fullName: string;
      avatarUrl?: string;
    };
    replies?: Comment[];
  }
  
  export interface CommentFormData {
    content: string;
    parentId?: string;
  }
  
  export interface CommentsProps {
    postId: string;
    className?: string;
    onCommentAdded?: (comment: Comment) => void;
    onCommentDeleted?: (commentId: string) => void;
  }
  
  // Response types for API
  export interface CreateCommentResponse {
    id: string;
    postId: string;
    userId: string;
    content: string;
    parentId?: string;
    isApproved: boolean;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      fullName: string;
      avatarUrl?: string;
    };
  }
  
  export interface DeleteCommentResponse {
    success: boolean;
  }
  
  export interface ErrorResponse {
    error: string;
  }