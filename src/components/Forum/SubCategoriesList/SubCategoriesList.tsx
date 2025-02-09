// src/components/Forum/SubCategoriesList/SubCategoriesList.tsx
import styles from './SubCategoriesList.module.scss';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

interface SubCategoryProps {
  subCategories: {
    id: number;
    name: string;
    description: string;
    topicCount: number;
  }[];
}

export function SubCategoriesList({ subCategories }: SubCategoryProps) {
  return (
    <div className={styles.subCategoriesList}>
      {subCategories.map(sub => (
        <Link 
          key={sub.id} 
          href={`/forum/categories/${sub.id}`}
          className={styles.subCategoryCard}
        >
          <div className={styles.content}>
            <h3>{sub.name}</h3>
            <p>{sub.description}</p>
          </div>
          <div className={styles.stats}>
            <MessageSquare size={16} />
            <span>{sub.topicCount} topics</span>
          </div>
        </Link>
      ))}
    </div>
  );
}