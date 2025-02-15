import { IconCertificate } from '@tabler/icons-react';
import { DollarSign, Users, GraduationCap, BookOpen, ChartColumnDecreasingIcon, LucideSquareDashed, LucidePanelTopClose } from 'lucide-react';
import styles from './mockData.module.scss';

export const mockStats = [
  {
    id: 1,
    title: 'Total Revenue',
    value: '$25,378',
    change: 5.35,
    icon: <DollarSign className={styles.revenueIcon} />
  },
  {
    id: 2,
    title: 'Total Students',
    value: '78,565',
    change: 12.1,
    icon: <Users className="text-pink-500" />
  },
  {
    id: 3,
    title: 'Total Instructors',
    value: '6,247',
    change: -10.21,
    icon: <GraduationCap className="text-red-500" />
  },
  {
    id: 4,
    title: 'Total Courses',
    value: '2,467',
    change: 16.1,
    icon: <ChartColumnDecreasingIcon className="text-green-500" />
  },
  {
    id: 5,
    title: 'Certifications ',
    value: '2,4670',
    change: 16.1,
    icon: <IconCertificate className="text-purple-500" />
  },
  {
    id: 6,
    title: 'Total Leads',
    value: '2,467',
    change: -16.1,
    icon: <LucidePanelTopClose className="text-yellow-500" />
  }
];