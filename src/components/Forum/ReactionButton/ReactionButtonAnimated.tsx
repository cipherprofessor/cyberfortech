// src/components/Forum/ReactionButton/ReactionButtonAnimated.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, Heart, Lightbulb, Laugh, Loader } from 'lucide-react';
import styles from './ReactionButtonAnimated.module.scss';

interface ReactionButtonAnimatedProps {
  postId: number;
  initialReactions: {
    type: ReactionType;
    count: number;
    hasReacted: boolean;
  }[];
  onReact: (type: ReactionType) => Promise<void>;
}

const reactionVariants = {
  initial: { scale: 0, opacity: 0, y: 20 },
  animate: (i: number) => ({
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      type: 'spring',
      stiffness: 200,
      damping: 15
    }
  }),
  exit: { 
    scale: 0, 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.2 }
  }
};

const popAnimation = {
  scale: [1, 1.2, 1],
  transition: { duration: 0.3 }
};

export function ReactionButtonAnimated({
  postId,
  initialReactions,
  onReact
}: ReactionButtonAnimatedProps) {
  const [reactions, setReactions] = useState(initialReactions);
  const [showEmojis, setShowEmojis] = useState(false);
  const [recentlyReacted, setRecentlyReacted] = useState<string | null>(null);

  const handleReaction = async (type: ReactionType) => {
    try {
      setRecentlyReacted(type);
      await onReact(type);
      
      // Animate the reaction count
      setReactions(prev => 
        prev.map(reaction => 
          reaction.type === type 
            ? { 
                ...reaction, 
                count: reaction.hasReacted ? reaction.count - 1 : reaction.count + 1,
                hasReacted: !reaction.hasReacted 
              }
            : reaction
        )
      );

      // Reset the animation after a delay
      setTimeout(() => setRecentlyReacted(null), 1000);
    } catch (error) {
      console.error('Error applying reaction:', error);
    } finally {
      setShowEmojis(false);
    }
  };

  return (
    <div className={styles.container}>
      <motion.button
        className={styles.mainButton}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowEmojis(!showEmojis)}
      >
        <ThumbsUp size={16} />
        <span>React</span>
      </motion.button>

      <AnimatePresence>
        {showEmojis && (
          <motion.div 
            className={styles.emojiPicker}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {REACTIONS.map((reaction, i) => (
              <motion.button
                key={reaction.type}
                className={`${styles.emojiButton} ${
                  reactions.find(r => r.type === reaction.type)?.hasReacted 
                    ? styles.active 
                    : ''
                }`}
                variants={reactionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                custom={i}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleReaction(reaction.type)}
              >
                <reaction.icon size={20} />
                <span className={styles.tooltip}>{reaction.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.reactionSummary}>
        <AnimatePresence>
          {reactions
            .filter(r => r.count > 0)
            .map(reaction => (
              <motion.div
                key={reaction.type}
                className={`${styles.reactionBadge} ${
                  recentlyReacted === reaction.type ? styles.highlighted : ''
                }`}
                initial={{ scale: 0 }}
                animate={recentlyReacted === reaction.type ? popAnimation : { scale: 1 }}
                exit={{ scale: 0 }}
                layout
              >
                {REACTIONS.find(r => r.type === reaction.type)?.icon({ size: 14 })}
                <span className={styles.count}>{reaction.count}</span>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

const REACTIONS = [
  { type: 'like', label: 'Like', icon: ThumbsUp },
  { type: 'heart', label: 'Love', icon: Heart },
  { type: 'insightful', label: 'Insightful', icon: Lightbulb },
  { type: 'funny', label: 'Funny', icon: Laugh }
] as const;

type ReactionType = typeof REACTIONS[number]['type'];