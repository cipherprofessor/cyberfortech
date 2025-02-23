// types/comments.ts
export interface User {
  fullName: string;
  avatarUrl: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: User;
  replies?: Comment[];
}

export interface CommentFormData {
  content: string;
  parentId?: string;
}

export interface CommentFormProps {
  postId: string;
  parentId?: string;
  onSubmit: (data: CommentFormData) => Promise<void>;
  onCancel?: () => void;
}

export interface CommentItemProps {
  comment: Comment;
  onReply: (parentId: string) => void;
  onDelete: (commentId: string) => Promise<void>;
}

export interface CommentsProps {
  postId: string;
  className?: string;
}