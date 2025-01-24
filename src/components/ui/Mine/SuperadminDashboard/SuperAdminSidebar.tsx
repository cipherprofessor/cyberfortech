// "use client";
// import React, { useState } from "react";
// import {
//   IconDashboard,
//   IconUsers,
//   IconBook,
//   IconMail,
//   IconReportMoney,
//   IconSettings,
//   IconLogout,
//   IconChevronDown,
// } from "@tabler/icons-react";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import Image from "next/image";
// import { cn } from "@/lib/utils";
// import { Logo, LogoIcon } from "../../AcUI/SideBar/SidebarUse";
// import { UrlObject } from "url";

// const menuItems = [
//   {
//     label: "Analytics",
//     icon: <IconDashboard className="h-5 w-5" />,
//     href: "/dashboard/analytics",
//     subItems: [
//       { label: "Overview", href: "/dashboard/analytics" },
//       { label: "User Growth", href: "/dashboard/analytics/users" },
//       { label: "Revenue", href: "/dashboard/analytics/revenue" },
//     ]
//   },
//   {
//     label: "User Management",
//     icon: <IconUsers className="h-5 w-5" />,
//     href: "/dashboard/users",
//     subItems: [
//       { label: "All Users", href: "/dashboard/users/all" },
//       { label: "Admins", href: "/dashboard/users/admins" },
//       { label: "Students", href: "/dashboard/users/students" },
//     ]
//   },
//   {
//     label: "Courses",
//     icon: <IconBook className="h-5 w-5" />,
//     href: "/dashboard/courses",
//     subItems: [
//       { label: "All Courses", href: "/dashboard/courses/all" },
//       { label: "Categories", href: "/dashboard/courses/categories" },
//       { label: "Reviews", href: "/dashboard/courses/reviews" },
//     ]
//   },
//   {
//     label: "Communications",
//     icon: <IconMail className="h-5 w-5" />,
//     href: "/dashboard/communications",
//     subItems: [
//       { label: "Messages", href: "/dashboard/communications/messages" },
//       { label: "Announcements", href: "/dashboard/communications/announcements" },
//     ]
//   },
//   {
//     label: "Finance",
//     icon: <IconReportMoney className="h-5 w-5" />,
//     href: "/dashboard/finance",
//     subItems: [
//       { label: "Overview", href: "/dashboard/finance" },
//       { label: "Transactions", href: "/dashboard/finance/transactions" },
//     ]
//   },
//   {
//     label: "Settings",
//     icon: <IconSettings className="h-5 w-5" />,
//     href: "/dashboard/settings",
//   },
//   {
//     label: "Logout",
//     icon: <IconLogout className="h-5 w-5" />,
//     href: "/logout",
//   }
// ];

// function SidebarItem({ item, open, isActive }: { item: any; open: boolean; isActive: boolean }) {
//   const [expanded, setExpanded] = useState(false);

//   return (
//     <div>
//       <div
//         onClick={() => item.subItems && setExpanded(!expanded)}
//         className={cn(
//           "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer",
//           "hover:bg-gray-200 dark:hover:bg-neutral-700",
//           isActive && "bg-gray-200 dark:bg-neutral-700"
//         )}
//       >
//         {item.icon}
//         {open && (
//           <>
//             <span className="flex-1">{item.label}</span>
//             {item.subItems && (
//               <IconChevronDown 
//                 className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
//               />
//             )}
//           </>
//         )}
//       </div>

//       {open && expanded && item.subItems && (
//         <div className="ml-4 mt-1 space-y-1">
//           {item.subItems.map((subItem: { href: string | UrlObject; label: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, idx: React.Key | null | undefined) => (
//             <Link 
//               key={idx} 
//               href={subItem.href}
//               className="block px-3 py-2 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-700"
//             >
//               {subItem.label}
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export function SuperAdminSidebarNew() {
//   const [open, setOpen] = useState(true);

//   return (
//     <div className={cn(
//       "flex h-screen bg-gray-100 dark:bg-neutral-800",
//       open ? "w-64" : "w-20",
//       "transition-all duration-300"
//     )}>
//       <div className="flex flex-col flex-1 p-4">
//         {open ? <Logo /> : <LogoIcon />}
//         <div className="mt-8 flex flex-col gap-2">
//           {menuItems.map((item, idx) => (
//             <SidebarItem 
//               key={idx} 
//               item={item} 
//               open={open}
//               isActive={false} 
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import React, { JSX, useState } from "react";
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
import { Logo, LogoIcon } from "../../AcUI/SideBar/SidebarUse";
import { UrlObject } from "url";

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
           { label: "Overview", href: "/dashboard/analytics" },
           { label: "User Growth", href: "/dashboard/analytics/users" },
           { label: "Revenue", href: "/dashboard/analytics/revenue" },
         ]
       },
       {
         label: "User Management",
         icon: <IconUsers className="h-5 w-5" />,
         href: "/dashboard/users",
         subItems: [
           { label: "All Users", href: "/dashboard/users/all" },
           { label: "Admins", href: "/dashboard/users/admins" },
           { label: "Students", href: "/dashboard/users/students" },
         ]
       },
       {
         label: "Courses",
         icon: <IconBook className="h-5 w-5" />,
         href: "/dashboard/courses",
         subItems: [
           { label: "All Courses", href: "/dashboard/courses/all" },
           { label: "Categories", href: "/dashboard/courses/categories" },
           { label: "Reviews", href: "/dashboard/courses/reviews" },
         ]
       },
       {
         label: "Communications",
         icon: <IconMail className="h-5 w-5" />,
         href: "/dashboard/communications",
         subItems: [
           { label: "Messages", href: "/dashboard/communications/messages" },
           { label: "Announcements", href: "/dashboard/communications/announcements" },
         ]
       },
       {
         label: "Finance",
         icon: <IconReportMoney className="h-5 w-5" />,
         href: "/dashboard/finance",
         subItems: [
           { label: "Overview", href: "/dashboard/finance" },
           { label: "Transactions", href: "/dashboard/finance/transactions" },
         ]
       },
       {
         label: "Settings",
         icon: <IconSettings className="h-5 w-5" />,
         href: "/dashboard/settings",
       },
       {
         label: "Logout",
         icon: <IconLogout className="h-5 w-5" />,
         href: "/logout",
       }
     ];

function SidebarItem({ item, open, isActive }: { item: MenuItem; open: boolean; isActive: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
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
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
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

export function SuperAdminSidebarNew() {
  const [open, setOpen] = useState(true);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg bg-gray-200 dark:bg-neutral-700"
        >
          {open ? <IconX /> : <IconMenu2 />}
        </motion.button>
      </div>

      <motion.div 
        className={cn(
          "fixed md:relative h-screen bg-gray-100 dark:bg-neutral-800",
          "flex flex-col shadow-lg",
          open ? "w-64" : "w-20",
        )}
        animate={{
          width: open ? "16rem" : "5rem",
          x: open ? 0 : -40,
        }}
        transition={{
          duration: 0.3,
          type: "spring",
          damping: 20
        }}
      >
        <div className="flex flex-col flex-1 p-4">
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {open ? <Logo /> : <LogoIcon />}
          </motion.div>

          <motion.div 
            className="mt-8 flex flex-col gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {menuItems.map((item, idx) => (
              <SidebarItem 
                key={idx} 
                item={item} 
                open={open}
                isActive={false} 
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}



