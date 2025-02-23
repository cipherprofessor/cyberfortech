// components/Comments/CommentHeader.tsx
import React from 'react';
import { MessageCircle } from 'lucide-react';
import styles from './Comments.module.scss';

interface CommentHeaderProps {
  commentCount: number;
}

const CommentHeader: React.FC<CommentHeaderProps> = ({ commentCount }) => (
  <div className={styles.header}>
    <h3>
      <MessageCircle className="mr-2 h-5 w-5" />
      Comments ({commentCount})
    </h3>
  </div>
);

export default React.memo(CommentHeader);