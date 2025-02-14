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
}

export interface SubItem {
  label: string;
  href: string;
  icon: ReactNode;
}

