// src/components/Forum/ReplyForm/ReplyForm.tsx
'use client';

import { useState } from 'react';
import { Loader } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import styles from './ReplyForm.module.scss';

interface ReplyFormProps {
  onSubmit: (content: string) => Promise<void>;
  isSubmitting: boolean;
  placeholder?: string;
}

export function ReplyForm({ 
  onSubmit, 
  isSubmitting, 
  placeholder = 'Write your reply...' 
}: ReplyFormProps) {
  const { isAuthenticated } = useAuth();
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    await onSubmit(content);
    setContent('');
    setIsExpanded(false);
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.authPrompt}>
        Please sign in to reply to this topic.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.replyForm}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className={`${styles.replyInput} ${isExpanded ? styles.expanded : ''}`}
        onFocus={() => setIsExpanded(true)}
        disabled={isSubmitting}
        rows={isExpanded ? 5 : 2}
      />

      {isExpanded && (
        <div className={styles.formActions}>
          <button
            type="button"
            onClick={() => {
              setIsExpanded(false);
              setContent('');
            }}
            className={styles.cancelButton}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={!content.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader className={styles.spinner} size={16} />
                Submitting...
              </>
            ) : (
              'Submit Reply'
            )}
          </button>
        </div>
      )}
    </form>
  );
}