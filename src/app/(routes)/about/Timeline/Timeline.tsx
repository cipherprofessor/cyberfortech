"use client"
import { motion } from 'framer-motion';
import styles from './Timeline.module.scss';

type TimelineEvent = {
  year: string;
  title: string;
  description: string;
};

type TimelineProps = {
  events: TimelineEvent[];
};

export function Timeline({ events }: TimelineProps) {
  return (
    <div className={styles.timeline}>
      {events.map((event, index) => (
        <motion.div
          key={event.year}
          className={styles.timelineItem}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
        >
          <div className={styles.timelineContent}>
            <div className={styles.year}>{event.year}</div>
            <h3 className={styles.title}>{event.title}</h3>
            <p className={styles.description}>{event.description}</p>
          </div>
          <div className={styles.timelineDot} />
          {index < events.length - 1 && <div className={styles.timelineLine} />}
        </motion.div>
      ))}
    </div>
  );
}