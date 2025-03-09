// src/app/dashboard/myworkspace/menus/blog/blog_categories/types.ts
import { BlogCategory } from '@/types/blog';

export interface CategoryWithCount extends BlogCategory {
  postCount: number;
}

export interface CategoryFormData {
  id?: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  parentId?: string | null;
  imageUrl?: string | null;
  imageUrlType: 'emoji' | 'url';
  emojiIcon?: string;
}