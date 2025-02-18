//src/app/dashboard/myworkspace/components/ui/TeachersList/components/TableComponents.tsx
import React from 'react';
import { Star, BookOpen, Users, Mail, Phone, MapPin, Calendar, Award, Briefcase, Activity } from 'lucide-react';
import styles from './TeachersList.module.scss';

interface RatingProps {
  value: number;
}

interface StatsProps {
  icon: React.ElementType;
  value: number;
  label: string;
  color?: string;
}

interface ChipProps {
  label: string;
  icon?: React.ElementType;
  color?: string;
}

export const Rating: React.FC<RatingProps> = ({ value }) => (
  <div className={styles.ratingWrapper}>
    <Star className={styles.starIcon} size={16} />
    <span className={styles.ratingValue}>{value?.toFixed(1) || '0.0'}</span>
  </div>
);

export const Stats: React.FC<StatsProps> = ({ 
  icon: Icon, 
  value, 
  label,
  color 
}) => (
  <div className={styles.statsWrapper} style={{ '--stat-color': color } as React.CSSProperties}>
    <Icon size={16} className={styles.statsIcon} />
    <div className={styles.statsContent}>
      <span className={styles.statsValue}>{value}</span>
      <small className={styles.statsLabel}>{label}</small>
    </div>
  </div>
);

export const Chip: React.FC<ChipProps> = ({ 
  label, 
  icon: Icon, 
  color 
}) => (
  <div 
    className={styles.chip}
    style={{ '--chip-color': color } as React.CSSProperties}
  >
    {Icon && <Icon size={14} className={styles.chipIcon} />}
    <span>{label}</span>
  </div>
);

// Not used, but have to use

 const ColumnIconMap = {
  instructor: { icon: Briefcase, label: 'Instructor' },
  specialization: { icon: Award, label: 'Specialization' },
  bio: { icon: Activity, label: 'Bio' },
  contact_number: { icon: Phone, label: 'Contactsss' },
  email: { icon: Mail, label: 'Email' },
  address: { icon: MapPin, label: 'Address' },
  rating: { icon: Star, label: 'Rating' },
  total_courses: { icon: BookOpen, label: 'Courses' },
  total_students: { icon: Users, label: 'Students' },
  created_at: { icon: Calendar, label: 'Created' },
} as const;

export const getColumnIcon = (columnKey: string): React.ElementType => {
  return ColumnIconMap[columnKey as keyof typeof ColumnIconMap]?.icon || Activity;
};