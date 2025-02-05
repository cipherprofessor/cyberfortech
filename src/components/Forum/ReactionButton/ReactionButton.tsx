// src/components/Forum/ReactionButton/ReactionButton.tsx
'use client';

import { useState } from 'react';
import { 
  ThumbsUp, 
  Heart, 
  Lightbulb, 
  Laugh,
  Loader 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import styles from './ReactionButton.module.scss';

type ReactionType = 'like' | 'helpful' | 'insightful' | 'funny';

interface Reaction {
  type: ReactionType;
  count: number;
  hasReacted: boolean;
}

interface ReactionButtonProps {
  postId: number;
  initialReactions: Reaction[];
  onReact: (type: ReactionType) => Promise<void>;
}

const REACTION_ICONS = {
  like: ThumbsUp,
  helpful: Heart,
  insightful: Lightbulb,
  funny: Laugh
};

const REACTION_LABELS = {
  like: 'Like',
  helpful: 'Helpful',
  insightful: 'Insightful',
  funny: 'Funny'
};

export function ReactionButton({ 
  postId, 
  initialReactions, 
  onReact 
}: ReactionButtonProps) {
  const { isAuthenticated } = useAuth();
  const [reactions, setReactions] = useState<Reaction[]>(initialReactions);
  const [isReacting, setIsReacting] = useState<ReactionType | null>(null);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const handleReaction = async (type: ReactionType) => {
    if (!isAuthenticated) return;

    setIsReacting(type);
    try {
      await onReact(type);
      
      setReactions(prev => prev.map(reaction => {
        if (reaction.type === type) {
          return {
            ...reaction,
            count: reaction.hasReacted ? reaction.count - 1 : reaction.count + 1,
            hasReacted: !reaction.hasReacted
          };
        }
        return reaction;
      }));
    } catch (error) {
      console.error('Error reacting to post:', error);
    } finally {
      setIsReacting(null);
      setShowReactionPicker(false);
    }
  };

  return (
    <div className={styles.reactionContainer}>
      {/* Main reaction button */}
      <button
        className={styles.mainReactionButton}
        onClick={() => isAuthenticated && setShowReactionPicker(!showReactionPicker)}
        disabled={!isAuthenticated}
      >
        <ThumbsUp size={16} />
        <span>React</span>
      </button>

      {/* Reaction picker */}
      {showReactionPicker && (
        <div className={styles.reactionPicker}>
          {reactions.map(({ type, count, hasReacted }) => {
            const Icon = REACTION_ICONS[type];
            return (
              <button
                key={type}
                className={`${styles.reactionOption} ${hasReacted ? styles.active : ''}`}
                onClick={() => handleReaction(type)}
                disabled={isReacting === type}
              >
                {isReacting === type ? (
                  <Loader className={styles.spinner} size={16} />
                ) : (
                  <>
                    <Icon size={16} />
                    <span>{REACTION_LABELS[type]}</span>
                    {count > 0 && <span className={styles.count}>{count}</span>}
                  </>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Reaction summary */}
      <div className={styles.reactionSummary}>
        {reactions
          .filter(r => r.count > 0)
          .map(({ type, count }) => {
            const Icon = REACTION_ICONS[type];
            return (
              <div key={type} className={styles.reactionCount}>
                <Icon size={14} />
                <span>{count}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
}