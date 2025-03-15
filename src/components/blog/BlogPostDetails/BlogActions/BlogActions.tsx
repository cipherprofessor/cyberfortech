import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useTheme } from 'next-themes';
import clsx from 'clsx';

import { showToast, toast } from '@/components/ui/mohsin-toast';
import styles from './BlogActions.module.scss';
import { MohsinBookmarkButton, MohsinCancelButton, MohsinDeleteButton, MohsinEditButton, MohsinLikeButton, MohsinShareButton } from '@/components/ui/Mohsin_Buttons';
import { useAuth } from '@/hooks/useAuth';

interface BlogActionsProps {
  postId: string;
  postSlug: string;
  postTitle: string;
  isAuthor?: boolean;
  currentUserRole?: string;
  currentUserId?: string;
}

const BlogActions: React.FC<BlogActionsProps> = ({
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
  const { isAuthenticated, user } = useAuth();
  const authenticatedUserId = user?.id; // Get current user ID from auth

  // Load initial like status
  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!authenticatedUserId) return;
      
      try {
        const response = await fetch(`/api/blog/posts/${postId}/likes/status?userId=${authenticatedUserId}`);
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
      if (!authenticatedUserId) return;
      
      try {
        const response = await fetch(`/api/blog/posts/${postId}/bookmarks/status?userId=${authenticatedUserId}`);
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
  }, [postId, authenticatedUserId]);

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
    if (!isAuthenticated) {
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
        body: JSON.stringify({ userId: authenticatedUserId }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Always use the server's values instead of calculating locally
        setIsLiked(data.isLiked);
        setLikeCount(data.likeCount);
        
        // Show toast only if appropriate
        if (data.isLiked && !isLiked) {
          toast.success({
            title: "Liked",
            description: "You've liked this post"
          });
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

  // Update the handleBookmark function to use server response similar to handleLike
const handleBookmark = async () => {
  if (!isAuthenticated) {
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
      body: JSON.stringify({ userId: authenticatedUserId }),
    });

    if (response.ok) {
      const data = await response.json();
      
      // Use server's values instead of toggling locally
      setIsBookmarked(data.isBookmarked);
      
      // Show toast based on server response
      if (data.isBookmarked) {
        toast.success({
          title: "Bookmarked",
          description: "Post added to your bookmarks"
        });
      } else {
        toast.info({
          title: "Removed",
          description: "Post removed from your bookmarks"
        });
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
          <MohsinLikeButton 
            size="sm"
            count={likeCount} 
            isLiked={isLiked}
            onClick={handleLike}
            disabled={isProcessing}
          />
          
          <MohsinBookmarkButton 
  size="sm"
  isBookmarked={isBookmarked}
  onClick={handleBookmark}
  disabled={isProcessing}
/>
          
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

export default BlogActions;