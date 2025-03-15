import React from 'react';
import { 
  Download,
  HelpCircle,
  RotateCcw,
  Trash2,
  ExternalLink,
  X,
  Edit,
  ThumbsUp,
  Bookmark,
  Share2
} from 'lucide-react';
import { MohsinButton, ButtonProps } from './MohsinButtons';

// Base action button type
type ActionButtonBaseProps = Omit<ButtonProps, 'icon'> & {
  children?: React.ReactNode;
};

// Download Button
export const MohsinDownloadButton: React.FC<ActionButtonBaseProps> = ({ children = 'Download', ...props }) => (
  <MohsinButton 
    icon={Download} 
    iconPosition="left" 
    color="primary" 
    animation="pulse"
    {...props}
  >
    {children}
  </MohsinButton>
);

// Learn More Button
export const MohsinLearnMoreButton: React.FC<ActionButtonBaseProps> = ({ children = 'Learn More', ...props }) => (
  <MohsinButton 
    icon={HelpCircle} 
    iconPosition="right" 
    color="secondary"
    animation="scale" 
    {...props}
  >
    {children}
  </MohsinButton>
);

// Start Over Button
export const MohsinStartOverButton: React.FC<ActionButtonBaseProps> = ({ children = 'Start Over', ...props }) => (
  <MohsinButton 
    icon={RotateCcw} 
    iconPosition="left" 
    color="warning"
    animation="rotate" 
    {...props}
  >
    {children}
  </MohsinButton>
);

// Delete Button
export const MohsinDeleteButton: React.FC<ActionButtonBaseProps> = ({ children = 'Delete', ...props }) => (
  <MohsinButton 
    icon={Trash2} 
    iconPosition="right" 
    color="danger"
    animation="scale" 
    {...props}
  >
    {children}
  </MohsinButton>
);

// Open Button
export const MohsinOpenButton: React.FC<ActionButtonBaseProps> = ({ children = 'Open', ...props }) => (
  <MohsinButton 
    icon={ExternalLink} 
    iconPosition="right" 
    color="info"
    animation="pulse" 
    {...props}
  >
    {children}
  </MohsinButton>
);

// Cancel Button
export const MohsinCancelButton: React.FC<ActionButtonBaseProps> = ({ children = 'Cancel', ...props }) => (
  <MohsinButton 
    color="default"
    animation="pulse" 
    {...props}
  >
    {children}
  </MohsinButton>
);

// Edit Button
export const MohsinEditButton: React.FC<ActionButtonBaseProps> = ({ children = 'Edit', ...props }) => (
  <MohsinButton 
    icon={Edit} 
    iconPosition="left" 
    color="info"
    animation="bounce" 
    {...props}
  >
    {children}
  </MohsinButton>
);

// Like Button
type LikeButtonProps = ActionButtonBaseProps & {
  count?: number;
  isLiked?: boolean;
};

export const MohsinLikeButton: React.FC<LikeButtonProps> = ({ 
  children, 
  count, 
  isLiked = false,
  animation = 'scale',
  ...props 
}) => (
  <MohsinButton 
    icon={ThumbsUp} 
    color="primary" 
    variant={isLiked ? "filled" : "outline"}
    animation={animation}
    {...props}
  >
    {count !== undefined ? count : children || 'Like'}
  </MohsinButton>
);

// Bookmark Button
type BookmarkButtonProps = ActionButtonBaseProps & {
  isBookmarked?: boolean;
};

// In your MohsinActionButtons.tsx

export const MohsinBookmarkButton: React.FC<BookmarkButtonProps> = ({ 
  children, 
  isBookmarked = false,
  animation = 'bounce',
  ...props 
}) => (
  <MohsinButton 
    icon={Bookmark} 
    color="warning" 
    variant={isBookmarked ? "filled" : "outline"}
    animation={animation}
    {...props}
  >
    {/* Show "Saved" when bookmarked, otherwise use provided children or default to "Save" */}
    {isBookmarked ? 'Saved' : (children || 'Save')}
  </MohsinButton>
);

// Share Button
export const MohsinShareButton: React.FC<ActionButtonBaseProps> = ({ 
  children = 'Share',
  animation = 'pulse',
  ...props 
}) => (
  <MohsinButton 
    icon={Share2} 
    color="secondary" 
    animation={animation}
    {...props}
  >
    {children}
  </MohsinButton>
);