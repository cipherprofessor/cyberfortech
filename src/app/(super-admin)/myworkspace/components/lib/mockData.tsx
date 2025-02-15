import { IconCertificate } from '@tabler/icons-react';
import { DollarSign, Users, GraduationCap, BookOpen, ChartColumnDecreasingIcon, LucideSquareDashed, LucidePanelTopClose } from 'lucide-react';
import styles from './mockData.module.scss';
import { IconType, ListCardCategory } from './types';

export const mockStats = [
  {
    id: 1,
    title: 'Total Revenue',
    value: '$25,378',
    change: 5.35,
    icon: <DollarSign className={styles.revenueIcon} />,
    iconType: "revenue" as IconType
  },
  {
    id: 2,
    title: 'Total Students',
    value: '78,565',
    change: -12.1,
    icon: <Users className={styles.studentsIcon} />,
    iconType: "users" as IconType
  },
  {
    id: 3,
    title: 'Total Instructors',
    value: '6,247',
    change: 10.21,
    icon: <GraduationCap className={styles.instructorsIcon} />,
    iconType: "instructors" as IconType
  },
  {
    id: 4,
    title: 'Total Courses',
    value: '2,467',
    change: -16.1,
    icon: <ChartColumnDecreasingIcon className={styles.courcesIcon}  />,
    iconType: "courses" as IconType
  },
  {
    id: 5,
    title: 'Certifications ',
    value: '2,4670',
    change: 16.1,
    icon: <IconCertificate className={styles.certificationsIcon}  />,
    iconType: "certifications" as IconType
  },
  {
    id: 6,
    title: 'Total Leads',
    value: '2,467',
    change: -16.1,
    icon: <LucidePanelTopClose className={styles.leadsIcon}  />,
    iconType: "leads" as IconType
  }
];


export const courseCategories: ListCardCategory[] = [
  {
    id: '1',
    title: 'UI / UX Design',
    courseCount: 10000,
    price: 199.99,
    icon: 'layout-grid',
    color: '#5B5FFF'
  },
  {
    id: '2',
    title: 'Digital Marketing',
    courseCount: 90,
    price: 599.99,
    icon: 'megaphone',
    color: '#FF5BCD'
  },
  {
    id: '3',
    title: 'Web Development',
    courseCount: 250,
    price: 299.99,
    icon: 'code-2',
    color: '#FF5B8F'
  },
  {
    id: '4',
    title: 'Stocks & Trading',
    courseCount: 100,
    price: 999.99,
    icon: 'bar-chart-2',
    color: '#FF8F5B'
  },
  {
    id: '5',
    title: 'Angular Course',
    courseCount: 300,
    price: 399.99,
    icon: 'circle-dot',
    color: '#845BFF'
  },
  {
    id: '6',
    title: 'Full Stack Course',
    courseCount: 500,
    price: 199.99,
    icon: 'database',
    color: '#5BC9FF'
  }
];