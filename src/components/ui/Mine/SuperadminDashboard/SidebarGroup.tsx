import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

type SidebarGroupProps = {
 item: {
   label: string;
   icon: React.ReactNode;
   subItems: { label: string; href: string; }[];
 };
 isOpen: boolean;
};

export function SidebarGroup({ item, isOpen }: SidebarGroupProps) {
 const [expanded, setExpanded] = useState(false);

 return (
   <div className="mb-2">
     <button
       onClick={() => setExpanded(!expanded)}
       className="w-full flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md"
     >
       <div className="flex items-center gap-2">
         {item.icon}
         {isOpen && <span>{item.label}</span>}
       </div>
       {isOpen && (
         <ChevronDown 
           className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
         />
       )}
     </button>
     
     {expanded && isOpen && (
       <motion.div
         initial={{ height: 0 }}
         animate={{ height: "auto" }}
         exit={{ height: 0 }}
         className="ml-4 mt-1 space-y-1"
       >
         {item.subItems.map((subItem, idx) => (
           <Link
             key={idx}
             href={subItem.href}
             className="block p-2 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md"
           >
             {subItem.label}
           </Link>
         ))}
       </motion.div>
     )}
   </div>
 );
}