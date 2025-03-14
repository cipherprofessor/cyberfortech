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
import { Button, ButtonProps } from './Buttons';


// Base action button type
type ActionButtonBaseProps = Omit<ButtonProps, 'icon'> & {
  children?: React.ReactNode;
};

// Download Button
export const MohsinDownloadButton: React.FC<ActionButtonBaseProps> = ({ children = 'Download', ...props }) => (
  <Button 
    icon={Download} 
    iconPosition="left" 
    color="primary" 
    {...props}
  >
    {children}
  </Button>
);

// Learn More Button
export const MohsinLearnMoreButton: React.FC<ActionButtonBaseProps> = ({ children = 'Learn More', ...props }) => (
  <Button 
    icon={HelpCircle} 
    iconPosition="right" 
    color="secondary" 
    {...props}
  >
    {children}
  </Button>
);

// Start Over Button
export const MohsinStartOverButton: React.FC<ActionButtonBaseProps> = ({ children = 'Start Over', ...props }) => (
  <Button 
    icon={RotateCcw} 
    iconPosition="left" 
    color="warning" 
    {...props}
  >
    {children}
  </Button>
);

// Delete Button
export const MohsinDeleteButton: React.FC<ActionButtonBaseProps> = ({ children = 'Delete', ...props }) => (
  <Button 
    icon={Trash2} 
    iconPosition="right" 
    color="danger" 
    {...props}
  >
    {children}
  </Button>
);

// Open Button
export const MohsinOpenButton: React.FC<ActionButtonBaseProps> = ({ children = 'Open', ...props }) => (
  <Button 
    icon={ExternalLink} 
    iconPosition="right" 
    color="info" 
    {...props}
  >
    {children}
  </Button>
);

// Cancel Button
export const MohsinCancelButton: React.FC<ActionButtonBaseProps> = ({ children = 'Cancel', ...props }) => (
  <Button 
    color="default" 
    {...props}
  >
    {children}
  </Button>
);

// Edit Button
export const MohsinEditButton: React.FC<ActionButtonBaseProps> = ({ children = 'Edit', ...props }) => (
  <Button 
    icon={Edit} 
    iconPosition="left" 
    color="info" 
    {...props}
  >
    {children}
  </Button>
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
  ...props 
}) => (
  <Button 
    icon={ThumbsUp} 
    color="primary" 
    variant={isLiked ? "filled" : "outline"}
    {...props}
  >
    {count !== undefined ? count : children || 'Like'}
  </Button>
);

// Bookmark Button
type BookmarkButtonProps = ActionButtonBaseProps & {
  isBookmarked?: boolean;
};

export const MohsinBookmarkButton: React.FC<BookmarkButtonProps> = ({ 
  children = 'Bookmark', 
  isBookmarked = false,
  ...props 
}) => (
  <Button 
    icon={Bookmark} 
    color="warning" 
    variant={isBookmarked ? "filled" : "outline"}
    {...props}
  >
    {children}
  </Button>
);

// Share Button
export const MohsinShareButton: React.FC<ActionButtonBaseProps> = ({ children = 'Share', ...props }) => (
  <Button 
    icon={Share2} 
    color="secondary" 
    {...props}
  >
    {children}
  </Button>
);