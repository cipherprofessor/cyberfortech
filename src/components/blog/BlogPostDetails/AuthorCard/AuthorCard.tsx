import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Twitter, Facebook, Instagram, Linkedin, Globe, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import clsx from 'clsx';
import styles from './AuthorCard.module.scss';

interface AuthorCardProps {
  author: {
    id: string;
    fullName?: string;
    avatarUrl?: string;
    bio?: string;
    socialLinks?: {
      twitter?: string;
      facebook?: string;
      instagram?: string;
      linkedin?: string;
      website?: string;
    };
    postCount?: number;
  };
}

const AuthorCard: React.FC<AuthorCardProps> = ({ author }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={clsx(styles.authorCard, theme === 'dark' && styles.dark)}
    >
      <div className={styles.authorHeader}>
        <h3 className={styles.sectionTitle}>About the Author</h3>
      </div>
      
      <div className={styles.authorProfile}>
        <div className={styles.avatarWrapper}>
          {author.avatarUrl ? (
            <Image
              src={author.avatarUrl}
              alt={author.fullName || 'Author'}
              width={80}
              height={80}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <User size={32} />
            </div>
          )}
        </div>
        
        <div className={styles.authorInfo}>
          <h4 className={styles.authorName}>{author.fullName || 'Anonymous'}</h4>
          
          {author.postCount !== undefined && (
            <div className={styles.authorStats}>
              <span className={styles.postCount}>{author.postCount} Posts</span>
            </div>
          )}
          
          {author.bio && (
            <p className={styles.authorBio}>{author.bio}</p>
          )}
          
          {author.socialLinks && Object.values(author.socialLinks).some(link => link) && (
            <div className={styles.socialLinks}>
              {author.socialLinks.twitter && (
                <a href={author.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <Twitter size={16} />
                </a>
              )}
              
              {author.socialLinks.facebook && (
                <a href={author.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <Facebook size={16} />
                </a>
              )}
              
              {author.socialLinks.instagram && (
                <a href={author.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <Instagram size={16} />
                </a>
              )}
              
              {author.socialLinks.linkedin && (
                <a href={author.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <Linkedin size={16} />
                </a>
              )}
              
              {author.socialLinks.website && (
                <a href={author.socialLinks.website} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <Globe size={16} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
      
      <Link href={`/blog/author/${author.id}`} className={styles.viewProfileButton}>
        View All Posts
      </Link>
    </motion.div>
  );
};

export default AuthorCard;