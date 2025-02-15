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

// types.ts
export type ListIconType = "design" | "marketing" | "development" | "trading" | "angular" | "fullstack";

export interface ListCardCategory {
  id: string;
  title: string;
  courseCount: number;
  price: number;
  icon: React.ReactNode;
  color: string;
  iconType: ListIconType;
}

export interface ListCardContainerProps {
  categories: ListCardCategory[];
  className?: string;
  title?: string;
  button?: React.ReactNode;
  onButtonClick?: () => void;
}



///List card category


export type CategoryType = 'clothing' | 'electronics' | 'grocery' | 'automobiles' | 'others';

export interface CategoryData {
  id: string;
  name: string;
  sales: number;
  grossPercentage: number;
  changePercentage: number;
  type: CategoryType;
}

export interface TopSellingCategoriesProps {
  data: CategoryData[];
  title?: string;
  className?: string;
  showIcons?: boolean;
  animated?: boolean;
  sortable?: boolean;
}


// Data Table

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Order {
  id: string;
  customer: Customer;
  product: string;
  quantity: number;
  amount: number;
  status: 'inProgress' | 'pending' | 'success' | 'failed';
  dateOrdered: string;
}

export type OrderStatus = Order['status'];

