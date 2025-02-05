// src/components/Forum/ReactionAnalytics/ReactionAnalytics.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { ThumbsUp, Heart, Lightbulb, Laugh } from 'lucide-react';
import styles from './ReactionAnalytics.module.scss';

interface ReactionData {
  timestamp: string;
  like: number;
  heart: number;
  insightful: number;
  funny: number;
}

interface ReactionAnalyticsProps {
  postId: number;
  period?: 'hourly' | 'daily' | 'weekly';
}

const REACTION_ICONS = {
  like: <ThumbsUp size={16} />,
  heart: <Heart size={16} />,
  insightful: <Lightbulb size={16} />,
  funny: <Laugh size={16} />
};

const REACTION_COLORS = {
  like: '#4f46e5',
  heart: '#ec4899',
  insightful: '#f59e0b',
  funny: '#10b981'
};

export function ReactionAnalytics({ postId, period = 'daily' }: ReactionAnalyticsProps) {
  const [data, setData] = useState<ReactionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(period);
  const [totalReactions, setTotalReactions] = useState({
    like: 0,
    heart: 0,
    insightful: 0,
    funny: 0
  });

  useEffect(() => {
    fetchAnalytics();
  }, [postId, selectedPeriod]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/forum/posts/${postId}/analytics?period=${selectedPeriod}`
      );
      const analyticsData = await response.json();
      setData(analyticsData.timeData);
      setTotalReactions(analyticsData.totals);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.label}>{new Date(label).toLocaleDateString()}</p>
          {payload.map((entry: any) => (
            <div 
              key={entry.name} 
              className={styles.tooltipItem}
              style={{ color: entry.color }}
            >
              {REACTION_ICONS[entry.name as keyof typeof REACTION_ICONS]}
              <span>{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.analyticsContainer}>
      {/* Period Selection */}
      <div className={styles.header}>
        <h3>Reaction Analytics</h3>
        <div className={styles.periodSelector}>
          <button
            className={selectedPeriod === 'hourly' ? styles.active : ''}
            onClick={() => setSelectedPeriod('hourly')}
          >
            Hourly
          </button>
          <button
            className={selectedPeriod === 'daily' ? styles.active : ''}
            onClick={() => setSelectedPeriod('daily')}
          >
            Daily
          </button>
          <button
            className={selectedPeriod === 'weekly' ? styles.active : ''}
            onClick={() => setSelectedPeriod('weekly')}
          >
            Weekly
          </button>
        </div>
      </div>

      {/* Total Reactions */}
      <div className={styles.totalReactions}>
        {Object.entries(totalReactions).map(([type, count]) => (
          <div 
            key={type} 
            className={styles.reactionTotal}
            style={{ borderColor: REACTION_COLORS[type as keyof typeof REACTION_COLORS] }}
          >
            {REACTION_ICONS[type as keyof typeof REACTION_ICONS]}
            <span className={styles.count}>{count}</span>
            <span className={styles.label}>
              {type.charAt(0).toUpperCase() + type.slice(1)}s
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className={styles.chartContainer}>
        {loading ? (
          <div className={styles.loading}>Loading analytics...</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                iconType="circle"
                formatter={(value) => (
                  <span className={styles.legendItem}>
                    {REACTION_ICONS[value as keyof typeof REACTION_ICONS]}
                    <span>{value}</span>
                  </span>
                )}
              />
              {Object.keys(REACTION_ICONS).map(type => (
                <Line
                  key={type}
                  type="monotone"
                  dataKey={type}
                  stroke={REACTION_COLORS[type as keyof typeof REACTION_COLORS]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}