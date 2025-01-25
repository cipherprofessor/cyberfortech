"use client";
import React, { useState, useEffect, useRef, JSX } from "react";
import {
  IconDashboard,
  IconUsers,
  IconBook,
  IconMail,
  IconReportMoney,
  IconSettings,
  IconLogout,
  IconChevronDown,
  IconMenu2,
  IconX
} from "@tabler/icons-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Logo, } from "../../AcUI/SideBar/SidebarUse";
import { UrlObject } from "url";
import { usePathname } from "next/navigation";

interface SubItem {
  label: string;
  href: string | UrlObject;
}

interface MenuItem {
  label: string;
  icon: JSX.Element;
  href: string;
  subItems?: SubItem[];
}

const menuItems = [
  {
    label: "Analytics",
    icon: <IconDashboard className="h-5 w-5" />,
    href: "/dashboard/analytics",
    subItems: [
      { label: "Overview", href: "/dashboard/superadmindashboard/analytics/overview" },
      { label: "User Growth", href: "/dashboard/superadmindashboard/analytics/usergrowth" },
      { label: "Revenue", href: "/dashboard/superadmindashboard/analytics/revenue" },
    ]
  },
  {
    label: "UMS",
    icon: <IconUsers className="h-5 w-5" />,
    href: "/dashboard/superadmindashboard/users",
    subItems: [
      { label: "All Users", href: "/dashboard/superadmindashboard/ums/allusers" },
      { label: "Admins", href: "/dashboard/superadmindashboard/ums/manageadmins" },
      { label: "Students", href: "/dashboard/superadmindashboard/ums/managestudents" },
    ]
  },
  {
    label: "Courses",
    icon: <IconBook className="h-5 w-5" />,
    href: "/dashboard/superadmindashboard/courses",
    subItems: [
      { label: "All Courses", href: "/dashboard/superadmindashboard/courses/allcourses" },
      // { label: "Categories", href: "/dashboard/superadmindashboard/courses/categories" },
      { label: "Reviews", href: "/dashboard/superadmindashboard/courses/reviews" },
    ]
  },
  {
    label: "Communications",
    icon: <IconMail className="h-5 w-5" />,
    href: "/dashboard/superadmindashboard/communications",
    subItems: [
      { label: "Messages", href: "/dashboard/superadmindashboard/communications/messages" },
      { label: "Announcements", href: "/dashboard/superadmindashboard/communications/announcements" },
    ]
  },
  {
    label: "Finance",
    icon: <IconReportMoney className="h-5 w-5" />,
    href: "/dashboard/superadmindashboard/finance",
    subItems: [
      { label: "Overview", href: "/dashboard/superadmindashboard/finance" },
      { label: "Transactions", href: "/dashboard/superadmindashboard/finance/transactions" },
    ]
  },
  {
    label: "Settings",
    icon: <IconSettings className="h-5 w-5" />,
    href: "/dashboard/superadmindashboard/settings",
  },
  {
    label: "Logout",
    icon: <IconLogout className="h-5 w-5" />,
    href: "/logout",
  }
];

function SidebarItem({ item, open, isActive }: { item: MenuItem; open: boolean; isActive: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={itemRef}
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        onClick={() => item.subItems && setExpanded(!expanded)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer",
          "hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors duration-200",
          isActive && "bg-gray-200 dark:bg-neutral-700"
        )}
        whileHover={{ x: 4, backgroundColor: "rgb(229, 231, 235)" }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          {item.icon}
        </motion.div>
        
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex flex-1 items-center"
          >
            <span className="flex-1">{item.label}</span>
            {item.subItems && (
              <motion.div
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <IconChevronDown className="h-4 w-4" />
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {open && expanded && item.subItems && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-4 mt-1 space-y-1 overflow-hidden"
          >
            {item.subItems.map((subItem, idx) => (
              <motion.div
                key={idx}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -10, opacity: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link 
                  href={subItem.href}
                  className="block px-3 py-2 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors duration-200"
                >
                  {subItem.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface SuperAdminSidebarNewProps {

  onOpenChange: (open: boolean) => void;

}



export function SuperAdminSidebarNew({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const open = true;

  // useEffect(() => {
  //   const handleMouseEnter = () => setOpen(true);
  //   const handleMouseLeave = () => setOpen(false);

  //   const sidebar = sidebarRef.current;
  //   if (sidebar) {
  //     sidebar.addEventListener('mouseenter', handleMouseEnter);
  //     sidebar.addEventListener('mouseleave', handleMouseLeave);
  //   }

  //   return () => {
  //     if (sidebar) {
  //       sidebar.removeEventListener('mouseenter', handleMouseEnter);
  //       sidebar.removeEventListener('mouseleave', handleMouseLeave);
  //     }
  //   };
  // }, []);

  return (
    <div className="flex h-screen">
      <motion.div 
        ref={sidebarRef}
        className={cn(
          "fixed h-screen bg-gray-100 dark:bg-neutral-800",
          "flex flex-col shadow-lg overflow-hidden",
          "border-r border-gray-200 dark:border-neutral-700",
          "w-64"
        )}
        // animate={{
        //   width: open ? "16rem" : "5rem",
        // }}
        // transition={{
        //   duration: 0.3,
        //   type: "spring",
        //   damping: 20
        // }}
      >
        <div className="flex flex-col h-full">
          {/* <motion.div
            className="p-4"
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {open ? <Logo /> : <></>}
          </motion.div> */}

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-neutral-600">
            <motion.div 
              className="p-4 flex flex-col gap-9"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {menuItems.slice(0, -2).map((item, idx) => (
                <SidebarItem 
                  key={idx} 
                  item={item} 
                  open={open}
                  isActive={false} 
                />
              ))}
            </motion.div>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-neutral-700">
          {menuItems.slice(-2).map((item, idx) => (
            <SidebarItem 
              key={idx} 
              item={item} 
              open={open}
              isActive={pathname === item.href} 
            />
            ))}
          </div>
        </div>
      </motion.div>

      {/* <div 
        ref={mainContentRef}
        className="flex-1 ml-20 overflow-auto"
      >
        
        Mohsin Manzoor bhat
      </div> */}
    </div>
  );
}