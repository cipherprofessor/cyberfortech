import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';
import styles from './PostTaxonomy.module.scss';

interface PostTaxonomyProps {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

const PostTaxonomy: React.FC<PostTaxonomyProps> = ({ categories, tags }) => {
  if (categories.length === 0 && tags.length === 0) {
    return null;
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className={styles.taxonomy}
    >
      {categories.length > 0 && (
        <div className={styles.categories}>
          <h3 className={styles.taxonomyTitle}>Categories</h3>
          <div className={styles.categoryList}>
            {categories.map(category => (
              <Link
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className={styles.categoryLink}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div className={styles.tags}>
          <h3 className={styles.taxonomyTitle}>Tags</h3>
          <div className={styles.tagList}>
            {tags.map(tag => (
              <Link
                key={tag.id}
                href={`/blog/tag/${tag.slug}`}
                className={styles.tagLink}
              >
                <Tag size={14} />
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PostTaxonomy;