import React, { useState } from 'react';
import { useTheme } from 'next-themes';

import styles from './MohsinButtonsDemo.module.scss';
import { MohsinDownloadButton, MohsinLearnMoreButton, MohsinStartOverButton, MohsinDeleteButton, MohsinOpenButton, MohsinCancelButton, MohsinEditButton, MohsinLikeButton, MohsinBookmarkButton, MohsinShareButton } from './MohsinActionButtons';
import { MohsinButton } from './MohsinButtons';

const MohsinButtonsDemo: React.FC = () => {
  const { theme } = useTheme();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(42);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className={styles.container}>
      <h1>Mohsin Button Components</h1>
      
      <section className={styles.section}>
        <h2>Standard Buttons</h2>
        <div className={styles.buttonGrid}>
          <div className={styles.buttonGroup}>
            <h3>Download Button</h3>
            <div className={styles.buttons}>
              <MohsinDownloadButton variant="outline" />
              <MohsinDownloadButton variant="filled" />
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <h3>Learn More Button</h3>
            <div className={styles.buttons}>
              <MohsinLearnMoreButton variant="outline" />
              <MohsinLearnMoreButton variant="filled" />
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <h3>Start Over Button</h3>
            <div className={styles.buttons}>
              <MohsinStartOverButton variant="outline" />
              <MohsinStartOverButton variant="filled" />
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <h3>Delete Button</h3>
            <div className={styles.buttons}>
              <MohsinDeleteButton variant="outline" />
              <MohsinDeleteButton variant="filled" />
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <h3>Open Button</h3>
            <div className={styles.buttons}>
              <MohsinOpenButton variant="outline" />
              <MohsinOpenButton variant="filled" />
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <h3>Cancel Button</h3>
            <div className={styles.buttons}>
              <MohsinCancelButton variant="outline" />
              <MohsinCancelButton variant="filled" />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Interactive Action Buttons</h2>
        <div className={styles.buttonGrid}>
          <div className={styles.buttonGroup}>
            <h3>Edit Button</h3>
            <div className={styles.buttons}>
              <MohsinEditButton variant="outline" />
              <MohsinEditButton variant="filled" />
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <h3>Like Button</h3>
            <div className={styles.buttons}>
              <MohsinLikeButton 
                isLiked={isLiked} 
                count={likeCount} 
                onClick={handleLike} 
              />
              <p className={styles.interactionStatus}>
                Status: {isLiked ? 'Liked' : 'Not liked'} | Count: {likeCount}
              </p>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <h3>Bookmark Button</h3>
            <div className={styles.buttons}>
              <MohsinBookmarkButton 
                isBookmarked={isBookmarked} 
                onClick={handleBookmark} 
              />
              <p className={styles.interactionStatus}>
                Status: {isBookmarked ? 'Bookmarked' : 'Not bookmarked'}
              </p>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <h3>Share Button</h3>
            <div className={styles.buttons}>
              <MohsinShareButton variant="outline" />
              <MohsinShareButton variant="filled" />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Button Sizes</h2>
        <div className={styles.sizes}>
          <MohsinButton size="sm" color="primary" variant="filled">Small</MohsinButton>
          <MohsinButton size="md" color="primary" variant="filled">Medium</MohsinButton>
          <MohsinButton size="lg" color="primary" variant="filled">Large</MohsinButton>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Animation Types</h2>
        <div className={styles.animations}>
          <MohsinButton 
            color="primary" 
            variant="filled" 
            animation="bounce"
          >
            Bounce
          </MohsinButton>
          
          <MohsinButton 
            color="secondary" 
            variant="filled" 
            animation="pulse"
          >
            Pulse
          </MohsinButton>
          
          <MohsinButton 
            color="info" 
            variant="filled" 
            animation="rotate"
          >
            Rotate
          </MohsinButton>
          
          <MohsinButton 
            color="warning" 
            variant="filled" 
            animation="scale"
          >
            Scale
          </MohsinButton>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Loading State</h2>
        <div className={styles.loadingDemo}>
          <MohsinButton 
            color="primary" 
            variant="filled" 
            isLoading={isLoading} 
            loadingText="Loading..." 
            onClick={simulateLoading}
          >
            Click to Load
          </MohsinButton>
        </div>
      </section>
    </div>
  );
};

export default MohsinButtonsDemo;