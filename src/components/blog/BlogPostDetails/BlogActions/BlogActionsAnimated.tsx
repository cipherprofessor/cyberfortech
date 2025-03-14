import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useTheme } from 'next-themes';
import clsx from 'clsx';

import { showToast, toast } from '@/components/ui/mohsin-toast';
import styles from './BlogActionsAnimated.module.scss';
import { MohsinEditButton, MohsinDeleteButton, MohsinLikeButton, MohsinBookmarkButton, MohsinShareButton, MohsinCancelButton } from '@/components/ui/Mohsin_Buttons';

interface BlogActionsProps {
  postId: string;
  postSlug: string;
  postTitle: string;
  isAuthor?: boolean;
  currentUserRole?: string;
  currentUserId?: string;
}

const BlogActionsAnimated: React.FC<BlogActionsProps> = ({
  postId,
  postSlug,
  postTitle,
  isAuthor,
  currentUserRole,
  currentUserId
}) => {
  const router = useRouter();
  const { theme } = useTheme();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const isAdmin = currentUserRole === 'admin' || currentUserRole === 'superadmin';
  const showAdminActions = isAuthor || isAdmin;

  // Load initial like status
  React.useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!currentUserId) return;
      
      try {
        const response = await fetch(`/api/blog/posts/${postId}/likes/status?userId=${currentUserId}`);
        if (response.ok) {
          const data = await response.json();
          setIsLiked(data.isLiked);
        }
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };

    const fetchLikeCount = async () => {
      try {
        const response = await fetch(`/api/blog/posts/${postId}/likes/count`);
        if (response.ok) {
          const data = await response.json();
          setLikeCount(data.count);
        }
      } catch (error) {
        console.error('Error fetching like count:', error);
      }
    };

    const fetchBookmarkStatus = async () => {
      if (!currentUserId) return;
      
      try {
        const response = await fetch(`/api/blog/posts/${postId}/bookmarks/status?userId=${currentUserId}`);
        if (response.ok) {
          const data = await response.json();
          setIsBookmarked(data.isBookmarked);
        }
      } catch (error) {
        console.error('Error fetching bookmark status:', error);
      }
    };

    fetchLikeStatus();
    fetchLikeCount();
    fetchBookmarkStatus();
  }, [postId, currentUserId]);

  const handleEdit = () => {
    router.push(`/blog/${postSlug}/edit`);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setIsProcessing(true);
    
    try {
      const response = await fetch(`/api/blog/${postSlug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success({
          title: "Post Deleted",
          description: "Your post has been successfully deleted."
        });
        router.push('/blog');
        router.refresh();
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Failed to delete post"
      });
    } finally {
      setIsProcessing(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  const handleLike = async () => {
    if (!currentUserId) {
      toast.warning({
        title: "Authentication Required",
        description: "Please sign in to like posts"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const method = isLiked ? 'DELETE' : 'POST';
      const response = await fetch(`/api/blog/posts/${postId}/likes`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUserId }),
      });

      if (response.ok) {
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikeCount(prev => newIsLiked ? prev + 1 : Math.max(0, prev - 1));
        
        if (newIsLiked) {
          showToast("Liked", "You've liked this post", "success");
        }
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update like');
      }
    } catch (error) {
      console.error('Error updating like:', error);
      toast.error({
        title: "Action Failed",
        description: error instanceof Error ? error.message : "Failed to update like"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBookmark = async () => {
    if (!currentUserId) {
      toast.warning({
        title: "Authentication Required",
        description: "Please sign in to bookmark posts"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const method = isBookmarked ? 'DELETE' : 'POST';
      const response = await fetch(`/api/blog/posts/${postId}/bookmarks`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUserId }),
      });

      if (response.ok) {
        setIsBookmarked(!isBookmarked);
        
        if (!isBookmarked) {
          showToast("Bookmarked", "Post added to your bookmarks", "success");
        } else {
          showToast("Removed", "Post removed from your bookmarks", "info");
        }
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update bookmark');
      }
    } catch (error) {
      console.error('Error updating bookmark:', error);
      toast.error({
        title: "Action Failed",
        description: error instanceof Error ? error.message : "Failed to update bookmark"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: postTitle,
          url
        });
        showToast("Shared", "Post shared successfully", "success");
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        showToast("Copied", "Link copied to clipboard", "success");
      } catch (error) {
        console.error('Failed to copy:', error);
        toast.error({
          title: "Copy Failed",
          description: "Could not copy the link to clipboard"
        });
      }
    }
  };

  return (
    <>
      <div className={clsx(styles.actionsContainer, theme === 'dark' && styles.dark)}>
        <div className={styles.actionGroup}>
          {showAdminActions && (
            <>
              <MohsinEditButton 
                size="sm"
                variant="outline"
                onClick={handleEdit}
                disabled={isProcessing}
              />
              
              <MohsinDeleteButton 
                size="sm"
                variant="outline"
                onClick={handleDeleteClick}
                disabled={isProcessing}
              />
            </>
          )}
        </div>
        
        <div className={styles.actionGroup}>
          <motion.div 
            initial={{ scale: 1 }}
            animate={{ scale: isLiked ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <MohsinLikeButton 
              size="sm"
              count={likeCount} 
              isLiked={isLiked}
              onClick={handleLike}
              disabled={isProcessing}
            />
          </motion.div>
          
          <motion.div 
            initial={{ scale: 1 }}
            animate={{ scale: isBookmarked ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <MohsinBookmarkButton 
              size="sm"
              isBookmarked={isBookmarked}
              onClick={handleBookmark}
              disabled={isProcessing}
            >
              {isBookmarked ? 'Saved' : 'Save'}
            </MohsinBookmarkButton>
          </motion.div>
          
          <MohsinShareButton 
            size="sm"
            variant="outline"
            onClick={handleShare}
            disabled={isProcessing}
          />
        </div>
      </div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <DeleteConfirmDialog
            show={showDeleteConfirm}
            postTitle={postTitle}
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
            isProcessing={isProcessing}
          />
        )}
      </AnimatePresence>
    </>
  );
};

interface DeleteConfirmDialogProps {
  show: boolean;
  postTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing: boolean;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  show,
  postTitle,
  onConfirm,
  onCancel,
  isProcessing
}) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      className={clsx(styles.overlay, theme === 'dark' && styles.darkOverlay)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={clsx(styles.dialog, theme === 'dark' && styles.darkDialog)}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        <div className={styles.dialogContent}>
          <AlertTriangle 
            size={32} 
            className={styles.warningIcon}
          />
          <h3>Delete Post</h3>
          <p>
            Are you sure you want to delete <strong>{postTitle}</strong>?
            <br />
            This action cannot be undone.
          </p>
          <div className={styles.dialogActions}>
            <MohsinCancelButton 
              onClick={onCancel}
              disabled={isProcessing}
            />
            <MohsinDeleteButton 
              variant="filled"
              onClick={onConfirm}
              isLoading={isProcessing}
              loadingText="Deleting..."
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BlogActionsAnimated;