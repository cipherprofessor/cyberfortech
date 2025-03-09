// src/components/blog/AuthorProfile/index.tsx
import React from 'react';
import { useTheme } from 'next-themes';
import clsx from 'clsx';
import styles from './AuthorProfile.module.scss';

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface AuthorProfileProps {
  name: string;
  role: string;
  bio: string;
  location?: string;
  avatarUrl?: string;
  socialLinks?: SocialLink[];
  className?: string;
}

const AuthorProfile: React.FC<AuthorProfileProps> = ({
  name,
  role,
  bio,
  location,
  avatarUrl = '/api/placeholder/80/80',
  socialLinks = [],
  className,
}) => {
  const { theme } = useTheme();

  return (
    <div className={clsx(
      styles.container,
      theme === 'dark' && styles.dark,
      className
    )}>
      <h3 className={styles.sectionHeading}>ABOUT</h3>
      
      <div className={styles.authorProfile}>
        <div className={styles.authorAvatar}>
          <img 
            src={avatarUrl} 
            alt={name} 
            className={styles.avatarImage} 
          />
        </div>
        <div className={styles.authorInfo}>
          <h4 className={styles.authorName}>{name}</h4>
          <p className={styles.authorRole}>{role}</p>
        </div>
      </div>
      
      <p className={styles.authorBio}>
        {bio}
      </p>
      
      {location && (
        <div className={styles.authorLocation}>
          <span className={styles.locationIcon}>📍</span>
          <span>{location}</span>
        </div>
      )}
      
      {socialLinks.length > 0 && (
        <div className={styles.socialLinks}>
          {socialLinks.map((link, index) => (
            <a 
              key={index} 
              href={link.url} 
              className={styles.socialLink}
              aria-label={`${name}'s ${link.platform} profile`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.icon}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuthorProfile;