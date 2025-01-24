// src/components/dashboard/SuperAdminSidebar/SuperAdminSidebar.tsx
"use client";

import { useState } from "react";
// import { Sidebar, SidebarBody, SidebarLink } from "./sidebar";
import {
  IconDashboard,
  IconUsers,
  IconBook,
  IconMail,
  IconReportMoney,
  IconSettings,
  IconLogout,
  IconChartBar,
  IconCategory,
  IconStar,
  IconTicket,
  IconBrandBlogger,
  IconFileText,
  IconKey,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { SidebarGroup } from "./SidebarGroup";
import { Sidebar, SidebarBody } from "../../AcUI/SideBar/sidebar";
import { Logo } from "./Logo";
import { LogoIcon } from "../../AcUI/SideBar/SideBarDemo";

const menuItems = [
  {
    label: "Analytics",
    icon: <IconChartBar />,
    subItems: [
      { label: "Overview", href: "/dashboard/superadmin/analytics" },
      { label: "User Growth", href: "/dashboard/superadmin/analytics/users" },
      { label: "Course Stats", href: "/dashboard/superadmin/analytics/courses" },
      { label: "Revenue", href: "/dashboard/superadmin/analytics/revenue" },
    ]
  },
  {
    label: "User Management",
    icon: <IconUsers />,
    subItems: [
      { label: "All Users", href: "/dashboard/superadmin/users" },
      { label: "Admins", href: "/dashboard/superadmin/users/admins" },
      { label: "Students", href: "/dashboard/superadmin/users/students" },
      { label: "Activity Logs", href: "/dashboard/superadmin/users/logs" },
    ]
  },
  {
    label: "Course Management",
    icon: <IconBook />,
    subItems: [
      { label: "All Courses", href: "/dashboard/superadmin/courses" },
      { label: "Categories", href: "/dashboard/superadmin/courses/categories" },
      { label: "Resources", href: "/dashboard/superadmin/courses/resources" },
      { label: "Reviews", href: "/dashboard/superadmin/courses/reviews" },
    ]
  },
  {
    label: "Communications",
    icon: <IconMail />,
    subItems: [
      { label: "Contact Forms", href: "/dashboard/superadmin/communications/contact" },
      { label: "Support Tickets", href: "/dashboard/superadmin/communications/tickets" },
      { label: "Newsletters", href: "/dashboard/superadmin/communications/newsletters" },
      { label: "Announcements", href: "/dashboard/superadmin/communications/announcements" },
    ]
  },
  {
    label: "Financial",
    icon: <IconReportMoney />,
    subItems: [
      { label: "Revenue", href: "/dashboard/superadmin/financial/revenue" },
      { label: "Transactions", href: "/dashboard/superadmin/financial/transactions" },
      { label: "Refunds", href: "/dashboard/superadmin/financial/refunds" },
      { label: "Settings", href: "/dashboard/superadmin/financial/settings" },
    ]
  },
  {
    label: "Content",
    icon: <IconBrandBlogger />,
    subItems: [
      { label: "Blog Posts", href: "/dashboard/superadmin/content/blog" },
      { label: "FAQs", href: "/dashboard/superadmin/content/faqs" },
      { label: "Testimonials", href: "/dashboard/superadmin/content/testimonials" },
      { label: "Homepage", href: "/dashboard/superadmin/content/homepage" },
    ]
  },
  {
    label: "Settings",
    icon: <IconSettings />,
    subItems: [
      { label: "Site Config", href: "/dashboard/superadmin/settings/site" },
      { label: "Email Templates", href: "/dashboard/superadmin/settings/email" },
      { label: "Security", href: "/dashboard/superadmin/settings/security" },
      { label: "API Keys", href: "/dashboard/superadmin/settings/api" },
    ]
  },
];

export function SuperAdminSidebar() {
  const [open, setOpen] = useState(true);

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody>
        <div className="flex flex-col flex-1 overflow-y-auto">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8">
            {menuItems.map((item, idx) => (
              <SidebarGroup key={idx} item={item} isOpen={open} />
            ))}
          </div>
        </div>
      </SidebarBody>
    </Sidebar>
  );
}