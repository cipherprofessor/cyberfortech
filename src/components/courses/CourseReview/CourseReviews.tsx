// src/components/courses/CourseReviews/CourseReviews.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ThumbsUp, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { useTheme } from 'next-themes';
import styles from './CourseReviews.module.scss';
import { Button } from '@heroui/button';


interface Review {
  id: string;
  user_name: string;
  user_avatar: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  helpful_count: number;
}

interface CourseReviewsProps {
  courseId: string;
}

export function CourseReviews({ courseId }: CourseReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const { user, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/courses/${courseId}/reviews`);
      const allReviews = response.data;
      
      if (user) {
        const userReview = allReviews.find((review: Review) => 
          review.user_id === user.id
        );
        setUserReview(userReview || null);
        setReviews(allReviews.filter((review: Review) => 
          review.user_id !== user.id
        ));
      } else {
        setReviews(allReviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    try {
      const response = await axios.post(`/api/courses/${courseId}/reviews`, {
        rating: newRating,
        comment: newComment
      });
      
      setUserReview(response.data);
      setShowReviewForm(false);
      setNewComment('');
      setNewRating(5);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const markHelpful = async (reviewId: string) => {
    if (!isAuthenticated) return;

    try {
      await axios.post(`/api/courses/reviews/${reviewId}/helpful`);
      fetchReviews(); // Refresh reviews to update helpful count
    } catch (error) {
      console.error('Error marking review as helpful:', error);
    }
  };

  return (
    <div className={`${styles.reviewsContainer} ${isDark ? styles.dark : ''}`}>
      <h2 className={styles.title}>Student Reviews</h2>

      {isAuthenticated && !userReview && (
        <div className={styles.reviewPrompt}>
          <Button 
            onClick={() => setShowReviewForm(true)}
            className={styles.writeReviewButton}
          >
            <MessageCircle className={styles.icon} size={20} />
            Write a Review
          </Button>
        </div>
      )}

      <AnimatePresence>
        {showReviewForm && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={styles.reviewForm}
            onSubmit={handleSubmitReview}
          >
            <div className={styles.ratingInput}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <Star
                  key={rating}
                  className={`${styles.star} ${rating <= newRating ? styles.filled : ''}`}
                  onClick={() => setNewRating(rating)}
                />
              ))}
            </div>
            
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your experience with this course..."
              className={styles.commentInput}
              required
            />
            
            <div className={styles.formActions}>
              <Button type="submit">Submit Review</Button>
              <Button 
                type="button" 
                variant="flat"
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {userReview && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.userReview}
        >
          <h3>Your Review</h3>
          <ReviewCard 
            review={userReview} 
            onMarkHelpful={markHelpful}
            isOwnReview={true}
          />
        </motion.div>
      )}

      <div className={styles.reviewsList}>
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ReviewCard 
              review={review} 
              onMarkHelpful={markHelpful}
              isOwnReview={false}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ReviewCard({ 
  review, 
  onMarkHelpful, 
  isOwnReview 
}: { 
  review: Review; 
  onMarkHelpful: (id: string) => void;
  isOwnReview: boolean;
}) {
  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewHeader}>
        <img 
          src={review.user_avatar || "/api/placeholder/40/40"} 
          alt={review.user_name} 
          className={styles.avatar}
        />
        <div className={styles.reviewInfo}>
          <span className={styles.userName}>{review.user_name}</span>
          <div className={styles.rating}>
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                className={`${styles.star} ${i < review.rating ? styles.filled : ''}`}
                size={16}
              />
            ))}
          </div>
        </div>
        <span className={styles.date}>
          {new Date(review.created_at).toLocaleDateString()}
        </span>
      </div>

      <p className={styles.comment}>{review.comment}</p>

      {!isOwnReview && (
        <button 
          className={styles.helpfulButton}
          onClick={() => onMarkHelpful(review.id)}
        >
          <ThumbsUp size={16} />
          Helpful ({review.helpful_count})
        </button>
      )}
    </div>
  );
}