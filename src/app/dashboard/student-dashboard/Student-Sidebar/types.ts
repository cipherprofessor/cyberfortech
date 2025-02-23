import { ReactNode } from "react";

export interface SidebarItemProps {
    label: string;
    icon: ReactNode;
    href?: string;
    subItems?: {
      label: string;
      href: string;
      icon: React.ReactNode;
      labelClassName?: string; // Add this
    }[];
    isCollapsed?: boolean;
    labelClassName?: string; // Add this
  }