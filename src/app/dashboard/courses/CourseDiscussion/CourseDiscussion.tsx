// src/components/dashboard/course/CourseDiscussion/CourseDiscussion.tsx
import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { MessageSquare, ThumbsUp, MoreVertical } from 'lucide-react';
// import { Avatar } from '@/components/ui/avatar';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
import styles from './CourseDiscussion.module.scss';
import { Avatar, DropdownMenu } from '@heroui/react';

type Comment = {
  id: number;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies: Reply[];
};

type Reply = {
  id: number;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
};

type CourseDiscussionProps = {
  courseId: string;
};

export function CourseDiscussion({ courseId }: CourseDiscussionProps) {
  const { userId } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      userId: 'user1',
      userName: 'John Doe',
      userAvatar: '/avatars/john.jpg',
      content: 'Great explanation of penetration testing concepts!',
      timestamp: '2024-01-20T10:30:00Z',
      likes: 5,
      isLiked: false,
      replies: [
        {
          id: 1,
          userId: 'user2',
          userName: 'Jane Smith',
          userAvatar: '/avatars/jane.jpg',
          content: 'I agree! The practical examples were very helpful.',
          timestamp: '2024-01-20T11:15:00Z',
        },
      ],
    },
  ]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now(),
      userId: userId || 'anonymous',
      userName: 'Current User',
      userAvatar: '/avatars/default.jpg',
      content: newComment,
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      replies: [],
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleSubmitReply = (commentId: number) => {
    if (!replyContent.trim()) return;

    const reply: Reply = {
      id: Date.now(),
      userId: userId || 'anonymous',
      userName: 'Current User',
      userAvatar: '/avatars/default.jpg',
      content: replyContent,
      timestamp: new Date().toISOString(),
    };

    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, reply],
        };
      }
      return comment;
    }));

    setReplyContent('');
    setReplyingTo(null);
  };

  const handleLikeComment = (commentId: number) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          isLiked: !comment.isLiked,
        };
      }
      return comment;
    }));
  };

  const handleDeleteComment = (commentId: number) => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={styles.discussionContainer}>
      <form onSubmit={handleSubmitComment} className={styles.commentForm}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add to the discussion..."
          className={styles.commentInput}
          rows={3}
        />
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={!newComment.trim()}
        >
          Post Comment
        </button>
      </form>

      <div className={styles.comments}>
        {comments.map((comment) => (
          <div key={comment.id} className={styles.comment}>
            <Avatar
              src={comment.userAvatar}
              alt={comment.userName}
              className={styles.avatar}
            />
            
            <div className={styles.commentContent}>
              <div className={styles.commentHeader}>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{comment.userName}</span>
                  <time className={styles.timestamp}>
                    {formatTimestamp(comment.timestamp)}
                  </time>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className={styles.moreButton}>
                      <MoreVertical className={styles.moreIcon} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Report</DropdownMenuItem>
                    {comment.userId === userId && (
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className={styles.commentText}>{comment.content}</p>

              <div className={styles.commentActions}>
                <button
                  className={`${styles.actionButton} ${
                    comment.isLiked ? styles.liked : ''
                  }`}
                  onClick={() => handleLikeComment(comment.id)}
                >
                  <ThumbsUp className={styles.actionIcon} />
                  <span>{comment.likes}</span>
                </button>

                <button
                  className={styles.actionButton}
                  onClick={() => setReplyingTo(comment.id)}
                >
                  <MessageSquare className={styles.actionIcon} />
                  <span>Reply</span>
                </button>
              </div>

              {comment.replies.length > 0 && (
                <div className={styles.replies}>
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className={styles.reply}>
                      <Avatar
                        src={reply.userAvatar}
                        alt={reply.userName}
                        className={styles.avatar}
                      />
                      <div className={styles.replyContent}>
                        <div className={styles.userInfo}>
                          <span className={styles.userName}>{reply.userName}</span>
                          <time className={styles.timestamp}>
                            {formatTimestamp(reply.timestamp)}
                          </time>
                        </div>
                        <p className={styles.replyText}>{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {replyingTo === comment.id && (
                <div className={styles.replyForm}>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className={styles.replyInput}
                    rows={2}
                  />
                  <div className={styles.replyButtons}>
                    <button
                      className={styles.cancelButton}
                      onClick={() => setReplyingTo(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className={styles.submitButton}
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={!replyContent.trim()}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}