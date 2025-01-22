import { Calendar, Video, FileText } from 'lucide-react';
import styles from './UpcomingSchedule.module.scss';

type Event = {
  id: number;
  title: string;
  date: string;
  duration?: string;
  type: 'workshop' | 'assignment' | 'lecture';
};

type UpcomingScheduleProps = {
  events: Event[];
};

export function UpcomingSchedule({ events }: UpcomingScheduleProps) {
  const getEventIcon = (type: Event['type']) => {
    switch (type) {
      case 'workshop':
        return Video;
      case 'assignment':
        return FileText;
      default:
        return Calendar;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  return (
    <div className={styles.scheduleContainer}>
      <div className={styles.header}>
        <h2>Upcoming Schedule</h2>
        <button className={styles.calendarButton}>
          View Calendar
        </button>
      </div>

      <div className={styles.events}>
        {events.map((event) => {
          const Icon = getEventIcon(event.type);
          return (
            <div key={event.id} className={styles.eventCard}>
              <div className={styles.iconContainer}>
                <Icon className={styles.icon} />
              </div>

              <div className={styles.eventInfo}>
                <h3 className={styles.eventTitle}>{event.title}</h3>
                <div className={styles.eventDetails}>
                  <time>{formatDate(event.date)}</time>
                  {event.duration && (
                    <span className={styles.duration}>{event.duration}</span>
                  )}
                </div>
              </div>

              <button className={styles.actionButton}>
                {event.type === 'workshop' ? 'Join' : 'View'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
