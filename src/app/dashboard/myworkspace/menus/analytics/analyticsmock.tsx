import { IconCertificate } from '@tabler/icons-react';
import { 
  DollarSign, 
  Users, 
  GraduationCap, 
  ChartColumnDecreasing,
  PanelTopClose,
  LayoutGrid,
  Megaphone,
  Code2,
  BarChart2,
  CircleDot,
  Database
} from 'lucide-react';
import styles from './mockData.module.scss';


export const AnalyticsOverviewMockStatsKPI = [
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
    icon: <ChartColumnDecreasing className={styles.courcesIcon} />,
    iconType: "courses" as IconType
  },
  {
    id: 5,
    title: 'Certifications',
    value: '2,4670',
    change: 16.1,
    icon: <IconCertificate className={styles.certificationsIcon} />,
    iconType: "certifications" as IconType
  },
  {
    id: 6,
    title: 'Total Leads',
    value: '2,467',
    change: -16.1,
    icon: <PanelTopClose className={styles.leadsIcon} />,
    iconType: "leads" as IconType
  },
  {
    id: 7,
    title: 'Total Revenue',
    value: '$25,378',
    change: 5.35,
    icon: <DollarSign className={styles.revenueIcon} />,
    iconType: "revenue" as IconType
  }
];

export const courseCategories: ListCardCategory[] = [
  {
    id: '1',
    title: 'UI / UX Design',
    courseCount: 10000,
    price: 199.99,
    icon: <LayoutGrid size={18} />,
    color: '#5B5FFF',
    iconType: "design"
  },
  {
    id: '2',
    title: 'Digital Marketing',
    courseCount: 90,
    price: 599.99,
    icon: <Megaphone size={18}/>,
    color: '#FF5BCD',
    iconType: "marketing"
  },
  {
    id: '3',
    title: 'Web Development',
    courseCount: 250,
    price: 299.99,
    icon: <Code2 size={18}/>,
    color: '#FF5B8F',
    iconType: "development"
  },
  {
    id: '4',
    title: 'Stocks & Trading',
    courseCount: 100,
    price: 999.99,
    icon: <BarChart2 size={18}/>,
    color: '#FF8F5B',
    iconType: "trading"
  },
  {
    id: '5',
    title: 'Angular Course',
    courseCount: 300,
    price: 399.99,
    icon: <CircleDot size={18}/>,
    color: '#845BFF',
    iconType: "angular"
  },
  {
    id: '6',
    title: 'Full Stack Course',
    courseCount: 500,
    price: 199.99,
    icon: <Database size={18}/>,
    color: '#5BC9FF',
    iconType: "fullstack"
  }
];


/// Data Table 


import { IconType, ListCardCategory, Order } from '../../components/lib/types';

export const mockOrders: Order[] = [
  {
    id: '1',
    customer: {
      id: '101',
      name: 'Elena Smith',
      email: 'elenasmith387@gmail.com',
      avatar: '/avatars/elena.jpg'
    },
    product: 'All-Purpose Cleaner',
    quantity: 3,
    amount: 9.99,
    status: 'inProgress',
    dateOrdered: '2024-09-03'
  },
  {
    id: '2',
    customer: {
      id: '102',
      name: 'Nelson Gold',
      email: 'noahrussell556@gmail.com',
      avatar: '/avatars/nelson.jpg'
    },
    product: 'Kitchen Knife Set',
    quantity: 4,
    amount: 49.99,
    status: 'pending',
    dateOrdered: '2024-07-26'
  },
  {
    id: '3',
    customer: {
      id: '103',
      name: 'Grace Mitchell',
      email: 'gracemitchell79@gmail.com',
      avatar: '/avatars/grace.jpg'
    },
    product: 'Velvet Throw Blanket',
    quantity: 2,
    amount: 29.99,
    status: 'success',
    dateOrdered: '2024-05-12'
  },
  {
    id: '4',
    customer: {
      id: '104',
      name: 'Spencer Robin',
      email: 'leophillips124@gmail.com',
      avatar: '/avatars/spencer.jpg'
    },
    product: 'Aromatherapy Diffuser',
    quantity: 4,
    amount: 19.99,
    status: 'success',
    dateOrdered: '2024-08-15'
  },
  {
    id: '5',
    customer: {
      id: '105',
      name: 'Chloe Lewis',
      email: 'chloelewis67@gmail.com',
      avatar: '/avatars/chloe.jpg'
    },
    product: 'Insulated Water Bottle',
    quantity: 2,
    amount: 14.99,
    status: 'pending',
    dateOrdered: '2024-10-11'
  }
];