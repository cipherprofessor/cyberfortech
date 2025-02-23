import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import styles from './CustomAvatar.module.scss';

export interface CustomAvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export const CustomAvatar: React.FC<CustomAvatarProps> = ({
  src,
  alt = 'Avatar',
  fallback = 'U',
  size = 'md',
  className,
  onClick
}) => {
  const [error, setError] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  const getFallbackInitial = () => {
    if (!alt || alt === 'Avatar') return fallback;
    return alt.charAt(0).toUpperCase();
  };

  const handleError = () => {
    setError(true);
    setLoaded(false);
  };

  const handleLoad = () => {
    setLoaded(true);
  };

  return (
    <div
      className={clsx(
        styles.avatar,
        styles[size],
        {
          [styles.clickable]: !!onClick,
          [styles.loaded]: loaded && !error
        },
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {src && !error ? (
        <Image
          src={src}
          alt={alt}
          width={size === 'xl' ? 96 : size === 'lg' ? 64 : size === 'md' ? 40 : 32}
          height={size === 'xl' ? 96 : size === 'lg' ? 64 : size === 'md' ? 40 : 32}
          className={styles.image}
          onError={handleError}
          onLoad={handleLoad}
        />
      ) : (
        <div className={styles.fallback} aria-label={alt}>
          {getFallbackInitial()}
        </div>
      )}
    </div>
  );
};

export default CustomAvatar;