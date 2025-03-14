import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar, Clock, Eye, BookOpen, User } from 'lucide-react';
import styles from './PostMeta.module.scss';

interface PostMetaProps {
  author: {
    id: string;
    fullName?: string;
    avatarUrl?: string;
  };
  publishedAt: Date;
  readingTime: number;
  viewCount: number;
}

const PostMeta: React.FC<PostMetaProps> = ({
  author,
  publishedAt,
  readingTime,
  viewCount
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className={styles.metadata}
    >
      <div className={styles.authorInfo}>
        <Link href={`/blog/author/${author.id}`} className={styles.authorLink}>
          {author.avatarUrl ? (
            <Image
              src={author.avatarUrl}
              alt={author.fullName || 'Author'}
              width={40}
              height={40}
              className={styles.authorAvatar}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <User size={16} />
            </div>
          )}
          <div className={styles.authorMeta}>
            <span className={styles.authorName}>
              By {author.fullName || 'Anonymous'}
            </span>
            <div className={styles.postMeta}>
              <span className={styles.metaItem}>
                <Calendar size={14} />
                {format(new Date(publishedAt), 'MMMM d, yyyy')}
              </span>
              <span className={styles.metaItem}>
                <Clock size={14} />
                {format(new Date(publishedAt), 'HH:mm')}
              </span>
              <span className={styles.metaItem}>
                <BookOpen size={14} />
                {readingTime} min read
              </span>
              <span className={styles.metaItem}>
                <Eye size={14} />
                {viewCount} views
              </span>
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default PostMeta;