// Avatar.tsx
import React, { useState, useEffect } from 'react';
import styles from './Avatar.module.scss';

interface AvatarProps {
  src: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getRandomColor = (name: string): string => {
  const colors = [
    '#F87171', // red
    '#FB923C', // orange
    '#FBBF24', // amber
    '#34D399', // emerald
    '#60A5FA', // blue
    '#818CF8', // indigo
    '#A78BFA', // violet
    '#F472B6', // pink
  ];
  
  const index = name.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0) % colors.length;
  
  return colors[index];
};

const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const initials = getInitials(name);
  const backgroundColor = getRandomColor(name);

  useEffect(() => {
    if (!src) {
      setImageError(true);
      setIsLoading(false);
      return;
    }

    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImageError(false);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setImageError(true);
      setIsLoading(false);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  const sizeClasses = {
    sm: styles.small,
    md: styles.medium,
    lg: styles.large
  };

  if (imageError || !src) {
    return (
      <div 
        className={`${styles.avatar} ${sizeClasses[size]} ${className}`}
        style={{ backgroundColor }}
      >
        <span className={styles.initials}>{initials}</span>
      </div>
    );
  }

  return (
    <div className={`${styles.avatar} ${sizeClasses[size]} ${className}`}>
      {isLoading ? (
        <div className={styles.placeholder} style={{ backgroundColor }} />
      ) : (
        <img
          src={src}
          alt={name}
          onError={() => setImageError(true)}
          className={styles.image}
        />
      )}
    </div>
  );
};

export default Avatar;