// src/components/Forum/TrendingReactions/TrendingReactions.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, ThumbsUp, Heart, Lightbulb, Laugh } from 'lucide-react';
import { RadioGroup, Radio } from '@heroui/react';  // Changed from Tabs to RadioGroup
import styles from './TrendingReactions.module.scss';

interface TrendingData {
  id: number;
  postId: number;
  postTitle: string;
  authorName: string;
  reactionType: 'like' | 'heart' | 'insightful' | 'funny';
  reactionCount: number;
  trendingScore: number;
  timestamp: string;
}

type TimePeriod = 'hour' | 'day' | 'week';

const REACTION_ICONS = {
  like: ThumbsUp,
  heart: Heart,
  insightful: Lightbulb,
  funny: Laugh
} as const;

export function TrendingReactions() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('day');
  const [trendingData, setTrendingData] = useState<TrendingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingData();
    const interval = setInterval(fetchTrendingData, 60000);
    return () => clearInterval(interval);
  }, [selectedPeriod]);

  const fetchTrendingData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/forum/reactions/trending?period=${selectedPeriod}`);
      const data = await response.json();
      setTrendingData(data);
    } catch (error) {
      console.error('Error fetching trending data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>
          <TrendingUp className={styles.icon} />
          Trending Reactions
        </h3>

        <RadioGroup 
          value={selectedPeriod}
          onValueChange={(value) => setSelectedPeriod(value as TimePeriod)}
          className={`${styles.radioGroupItem} radio-group-item`}
        >
          <Radio value="hour">Past Hour</Radio>
          <Radio value="day">Today</Radio>
          <Radio value="week">This Week</Radio>
        </RadioGroup>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.loading}
          >
            <div className={styles.shimmer}></div>
            <div className={styles.shimmer}></div>
            <div className={styles.shimmer}></div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.trendingList}
          >
            {trendingData.length > 0 ? (
              trendingData.map((item, index) => (
                <TrendingItem key={item.id} item={item} index={index} />
              ))
            ) : (
              <div className={styles.noData}>
                No trending reactions for this period
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.realtimeIndicator}>
        <span className={styles.dot}></span>
        Real-time updates enabled
      </div>
    </div>
  );
}

function TrendingItem({ item, index }: { item: TrendingData; index: number }) {
  const ReactionIcon = REACTION_ICONS[item.reactionType];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={styles.trendingItem}
    >
      <div className={styles.itemContent}>
        <span className={styles.rank}>#{index + 1}</span>
        <div className={styles.postInfo}>
          <h4>{item.postTitle}</h4>
          <span className={styles.author}>by {item.authorName}</span>
        </div>
      </div>
      <div className={styles.reactionInfo}>
        <ReactionIcon className={styles.reactionIcon} size={16} />
        <span className={styles.count}>
          {item.reactionCount.toLocaleString()}
        </span>
        <div className={styles.trendingScore}>
          <TrendingUp size={14} />
          {item.trendingScore.toFixed(1)}
        </div>
      </div>
    </motion.div>
  );
}