import React from 'react';
import { motion } from 'framer-motion';
import { Home, ShoppingBag, BookOpen, Users, User, Headphones } from 'lucide-react';
import styles from './LandingPagesStats.module.scss';

export interface LandingPageStat {
  id: string;
  path: string;
  visits: number;
  icon: 'home' | 'products' | 'blog' | 'team' | 'profile' | 'support';
  color: string;
}

interface LandingPagesStatsProps {
  data: LandingPageStat[];
  title?: string;
  className?: string;
  showIcons?: boolean;
  animated?: boolean;
}

const icons = {
  home: Home,
  products: ShoppingBag,
  blog: BookOpen,
  team: Users,
  profile: User,
  support: Headphones,
};

const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.visits}
    >
      {value.toLocaleString()} 
      <span className={styles.visitsLabel}>Visits</span>
    </motion.span>
  );
};

const LandingPagesStats: React.FC<LandingPagesStatsProps> = ({
  data,
  title = "Top Landing Pages",
  className = "",
  showIcons = true,
  animated = true,
}) => {
  const maxVisits = Math.max(...data.map(item => item.visits));

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <button className={styles.viewAll}>View All</button>
      </div>

      <div className={styles.statsList}>
        {data.map((item, index) => {
          const Icon = icons[item.icon];
          const percentage = (item.visits / maxVisits) * 100;

          return (
            <motion.div
              key={item.id}
              className={styles.statItem}
              initial={animated ? { opacity: 0, x: -20 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={styles.statContent}>
                <div className={styles.pathInfo}>
                  {showIcons && (
                    <div className={styles.iconWrapper} style={{ backgroundColor: `${item.color}15` }}>
                      <Icon size={18} className={styles.icon} style={{ color: item.color }} />
                    </div>
                  )}
                  <span className={styles.path}>{item.path}</span>
                </div>
                <AnimatedNumber value={item.visits} />
              </div>

              <div className={styles.progressBarWrapper}>
                <div className={styles.progressBarBg}>
                  <motion.div
                    className={styles.progressBar}
                    style={{
                      background: `linear-gradient(90deg, ${item.color}30 0%, ${item.color} 100%)`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                    <div className={styles.progressAnimation} style={{ background: item.color }} />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LandingPagesStats;