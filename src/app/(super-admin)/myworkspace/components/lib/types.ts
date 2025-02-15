import { ReactNode } from 'react';

export interface CardProps {
  icon: ReactNode;
  title: string;
  value: string;
  change: string;
  color: string;
}

export interface Stat {
  title: string;
  value: string;
  icon: ReactNode;
  change: string;
  color: string;
  iconType: string;
}

export interface SubItem {
  label: string;
  href: string;
  icon: ReactNode;
}


export type IconType = 'revenue' | 'users' | 'instructors' |'courses' | 'certifications' | 'leads' ;

// types.ts
export interface KPICardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  iconType: IconType;
  className?: string;
}

export interface ListCardProps {
  category: ListCardCategory;
  className?: string;
}

export interface ListCardCategory {
  id: string;
  title: string;
  courseCount: number;
  price: number;
  icon: React.ReactNode;
  color: string;
}

export interface ListCardContainerProps {
  categories: ListCardCategory[];
  className?: string;
  title?: string;
  button?: React.ReactNode;
  onButtonClick?: () => void;
}