// components/KanbanBoard/SearchBar.tsx
"use client"
import React from 'react';
import { Search, Plus } from 'lucide-react';
import styles from './SearchBar.module.scss';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  theme: 'light' | 'dark';
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, theme }) => {
  return (
    <div className={`${styles.searchContainer} ${styles[theme]}`}>
      <div className={styles.searchBar}>
        <Search size={18} />
        <input
          type="text"
          placeholder="Search Tasks"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      
      <div className={styles.workspaceInfo}>
        <div className={styles.avatarGroup}>
          <img src="/avatars/user1.jpg" alt="User 1" className={styles.avatar} />
          <img src="/avatars/user2.jpg" alt="User 2" className={styles.avatar} />
          <img src="/avatars/user3.jpg" alt="User 3" className={styles.avatar} />
          <div className={styles.moreCount}>+5</div>
        </div>
        
        <button className="btn-primary">
          <Plus size={16} />
          New Board
        </button>
      </div>
    </div>
  );
};