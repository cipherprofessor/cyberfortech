import React from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { 
  DollarSign,
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Package,
  Activity,
  LucideIcon
} from 'lucide-react';
import styles from './KPICard.module.scss';

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  className?: string;
}

const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  change, 
  icon,
  className = ''
}) => {
  const { theme } = useTheme();
  const isPositive = change > 0;

  const cardClass = `${styles.card} ${theme === 'dark' ? styles.dark : ''} ${className}`;
  const changeClass = `${styles.change} ${isPositive ? styles.positive : styles.negative}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cardClass}
    >
      <div className={styles.iconWrapper}>
        {icon}
      </div>

      <h3 className={styles.title}>{title}</h3>
      <p className={styles.value}>{value}</p>
      
      <div className={styles.footer}>
        <span className={styles.label}>
          {isPositive ? 'Increased' : 'Decreased'} By
        </span>
        <span className={changeClass}>
          {isPositive ? '+' : ''}{Math.abs(change)}%
        </span>
      </div>
    </motion.div>
  );
};

export default KPICard;