"use client";
import { motion } from 'framer-motion';
import { MessageSquare, Clock, Users, Activity, Mail, BarChart2 } from 'lucide-react';

import styles from './MessagesInsightCards.module.scss';
import KPICard from '@/app/dashboard/myworkspace/components/ui/KPICard/KPICard';

interface MessagesStatsProps {
  stats: {
    total: number;
    new: number;
    inProgress: number;
    resolved: number;
    responseTime: number;
    partnersSource: number;
    contactSource: number;
    other: number;
  };
}

export default function MessagesInsightCards({ stats }: MessagesStatsProps) {
  // Calculate percentage changes (normally this would use historical data)
  // For demo purposes, we're using fixed values
  const newChange = 12; // 12% increase in new messages
  const progressChange = 8; // 8% increase in messages in progress
  const resolvedChange = 15; // 15% increase in resolved messages
  const responseTimeChange = -5; // 5% decrease in response time (improvement)
  const partnersChange = 20; // 20% increase in partner page messages
  const contactChange = 5; // 5% increase in contact page messages
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className={styles.cardsContainer}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <KPICard
          title="New Messages"
          value={stats.new.toString()}
          change={newChange}
          icon={<MessageSquare size={24} />}
        //   iconType=""
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <KPICard
          title="In Progress"
          value={stats.inProgress.toString()}
          change={progressChange}
          icon={<Activity size={24} />}
        //   iconType="warning"
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <KPICard
          title="Resolved"
          value={stats.resolved.toString()}
          change={resolvedChange}
          icon={<Users size={24} />}
        //   iconType="success"
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <KPICard
          title="Avg. Response Time"
          value={`${stats.responseTime} hrs`}
          change={responseTimeChange}
          icon={<Clock size={24} />}
        //   iconType="info"
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <KPICard
          title="From Partners Page"
          value={stats.partnersSource.toString()}
          change={partnersChange}
          icon={<BarChart2 size={24} />}
        //   iconType="secondary"
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <KPICard
          title="From Contact Page"
          value={stats.contactSource.toString()}
          change={contactChange}
          icon={<Mail size={24} />}
        //   iconType="tertiary"
        />
      </motion.div>
    </motion.div>
  );
}