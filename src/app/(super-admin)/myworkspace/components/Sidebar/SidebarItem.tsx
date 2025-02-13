'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

import styles from './Sidebar.module.scss';
import { SidebarItemProps } from '../lib/types';

export function SidebarItem({ label, icon, href, subItems }: SidebarItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSubItems = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent redirection
    if (subItems) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={styles.sidebarItem}>
      <Link
        href={href || '#'}
        className={styles.mainItem}
        onClick={toggleSubItems}
      >
        <div className={styles.icon}>{icon}</div>
        <span>{label}</span>
        {subItems && (
          <div className={styles.chevron}>
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        )}
      </Link>

      {subItems && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className={styles.subItems}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {subItems.map((subItem, index) => (
                <Link
                  key={index}
                  href={subItem.href}
                  className={styles.subItem}
                >
                  <div className={styles.icon}>{subItem.icon}</div>
                  <span>{subItem.label}</span>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}