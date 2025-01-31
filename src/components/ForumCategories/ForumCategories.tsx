// src/components/forum/ForumCategories/ForumCategories.tsx
import Link from 'next/link';
import { ChevronRight, MessageSquare, Users } from 'lucide-react';
import styles from './ForumCategories.module.scss';

type SubCategory = {
  id: number;
  name: string;
};

type Category = {
  id: number;
  name: string;
  description: string;
  totalTopics?: number;
  totalPosts?: number;
  icon?: string;
  subCategories: SubCategory[];
};

type ForumCategoriesProps = {
  categories: Category[];
};

export function ForumCategories({ categories }: ForumCategoriesProps) {
  return (
    <div className={styles.categoriesContainer}>
      <div className={styles.header}>
        <h2>Categories</h2>
      </div>

      <div className={styles.categories}>
        {categories.map((category) => (
          <div key={category.id} className={styles.category}>
            <div className={styles.mainContent}>
              {category.icon && <div className={styles.icon}>{category.icon}</div>}
              
              <div className={styles.info}>
                <Link 
                  href={`/forum/categories/${category.id}`}
                  className={styles.categoryName}
                >
                  {category.name}
                  <ChevronRight className={styles.chevron} />
                </Link>
                <p className={styles.description}>{category.description}</p>
                
                {category.subCategories?.length > 0 && (
                  <div className={styles.subCategories}>
                    {category.subCategories.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/forum/categories/${category.id}/${sub.id}`}
                        className={styles.subCategory}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              <div className={styles.stats}>
                <div className={styles.statItem}>
                  <MessageSquare className={styles.statIcon} />
                  <div className={styles.statInfo}>
                    <span className={styles.statValue}>
                      {(category.totalTopics || 0).toLocaleString()}
                    </span>
                    <span className={styles.statLabel}>Topics</span>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <Users className={styles.statIcon} />
                  <div className={styles.statInfo}>
                    <span className={styles.statValue}>
                      {(category.totalPosts || 0).toLocaleString()}
                    </span>
                    <span className={styles.statLabel}>Posts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}