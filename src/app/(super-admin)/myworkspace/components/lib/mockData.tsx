import { Users, BookOpen, Activity, Clock, Settings, BarChart, PieChart, Bell, LockIcon, HelpCircle, HelpCircleIcon, HelpingHandIcon, BadgeHelpIcon, Mail, MailIcon, MailboxIcon, MessageCircle, Book, BookIcon, BookUpIcon, BookKeyIcon, UserIcon, User2Icon, UserCircle2Icon, LayoutDashboard } from 'lucide-react';
import { Stat } from './types';

export const stats: Stat[] = [
  {
    title: 'Active Users',
    value: '1,234',
    icon: <Users size={24} />,
    change: '+12%',
    color: 'bg-[hsl(var(--chart-1))]',
  },
  {
    title: 'Total Courses',
    value: '56',
    icon: <BookOpen size={24} />,
    change: '+5%',
    color: 'bg-[hsl(var(--chart-2))]',
  },
  {
    title: 'Active Sessions',
    value: '789',
    icon: <Activity size={24} />,
    change: '-3%',
    color: 'bg-[hsl(var(--chart-3))]',
  },
  {
    title: 'Avg. Time Spent',
    value: '12m',
    icon: <Clock size={24} />,
    change: '+8%',
    color: 'bg-[hsl(var(--chart-4))]',
  },
];