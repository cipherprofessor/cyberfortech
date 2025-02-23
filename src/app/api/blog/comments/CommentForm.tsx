// components/Comments/CommentForm.tsx
import React, { useState, useCallback } from 'react';
import { Send, LogIn } from 'lucide-react';
import { useAuth, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CustomAvatar from '@/components/ui/CustomAvatar/CustomAvatar';
import styles from './Comments.module.scss';
import { CommentFormData } from '@/types/comments';

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onSubmit: (data: CommentFormData) => Promise<void>;
  onCancel?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  parentId,
  onSubmit,
  onCancel
}) => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !isSignedIn) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ content, parentId });
      setContent('');
      toast.success('Comment posted successfully', {
        description: parentId ? 'Your reply has been added.' : 'Your comment has been added.'
      });
    } catch (error) {
      toast.error('Failed to post comment', {
        description: 'Please try again later.'
      });
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [content, isSignedIn, onSubmit, parentId]);

  if (!isSignedIn) {
    return (
      <div className={styles.signInPrompt}>
        <p>Please sign in to leave a comment</p>
        <Button
          onClick={() => window.location.href = '/sign-in'}
          variant="outline"
        >
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.commentForm}>
      <div className={styles.formHeader}>
        <CustomAvatar
          src={user?.imageUrl}
          alt={user?.fullName || 'User'}
          fallback={user?.firstName?.[0] || 'U'}
          size="md"
          className={styles.userAvatar}
        />
        <span className={styles.userName}>{user?.fullName}</span>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        required
        disabled={isSubmitting}
        aria-label="Comment content"
      />
      <div className={styles.formActions}>
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting || !content.trim()}
        >
          <Send className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};

export default React.memo(CommentForm);