// // src/components/Blog/BlogList.tsx
// "use client";

// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useTheme } from 'next-themes';
// import { BlogListProps } from '@/types/blog';
// import Link from 'next/link';
// import { format } from 'date-fns';
// import { Calendar, User, Eye, Star, ChevronDown, ChevronUp, Tag, Clock } from 'lucide-react';
// import clsx from 'clsx';
// import styles from './BlogList.module.scss';
// import BlogSkeleton from './BlogSkeleton';

// const BlogList: React.FC<BlogListProps> = ({
//   posts,
//   loading,
//   error,
//   currentPage = 1,
//   totalPages = 1,
//   onPageChange,
//   className
// }) => {
//   const { theme } = useTheme();
//   const [mounted, setMounted] = useState(false);
//   const [expandedPost, setExpandedPost] = useState<string | null>(null);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const handleCardClick = (id: string) => {
//     setExpandedPost(expandedPost === id ? null : id);
//   };

//   const truncateText = (text: string, maxLength: number) => {
//     if (!text) return '';
//     if (text.length <= maxLength) return text;
//     return text.substring(0, maxLength) + '...';
//   };

//   if (!mounted) {
//     return null;
//   }

//   if (loading) {
//     return <BlogSkeleton className={className} />;
//   }

//   if (error) {
//     return (
//       <div className={clsx(styles.error, className)} role="alert">
//         {error}
//       </div>
//     );
//   }

//   if (!posts.length) {
//     return (
//       <div className={clsx(styles.empty, className)}>
//         <h3>No blog posts found</h3>
//         <p>Get started by creating your first blog post!</p>
//         <Link href="/blog/new" className={styles.createButton}>
//           Create New Post
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className={clsx(styles.container, theme === 'dark' && styles.dark, className)}>
//       <div className={styles.header}>
//         <div className={styles.headerLeft}>
//           <h1 className={styles.mainTitle}>Blog Posts</h1>
//           <p className={styles.subTitle}>Share your knowledge with the world</p>
//         </div>
//         <Link href="/blog/new" className={styles.createButton}>
//           Create New Post
//         </Link>
//       </div>

//       <div className={styles.postList}>
//         <AnimatePresence mode="wait">
//           {posts.map((post) => (
//             <motion.div
//               key={post.id}
//               layout
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3 }}
//               className={clsx(styles.postCard, expandedPost === post.id && styles.expanded)}
//             >
//               <motion.div 
//                 layout="position" 
//                 className={styles.postHeader}
//                 onClick={() => handleCardClick(post.id)}
//               >
//                 <div className={styles.titleSection}>
//                   <motion.h2 layout="position" className={styles.title}>
//                     <Link href={`/blog/${post.slug}`}>{post.title}</Link>
//                   </motion.h2>
//                   {!expandedPost && post.excerpt && (
//                     <motion.p 
//                       layout="position"
//                       className={styles.previewExcerpt}
//                     >
//                       {truncateText(post.excerpt, 150)}
//                     </motion.p>
//                   )}
//                   <motion.div layout="position" className={styles.chips}>
//                     {post.isFeatured && (
//                       <span className={clsx(styles.chip, styles.featured)}>
//                         <Star size={14} />
//                         Featured
//                       </span>
//                     )}
//                     <span className={styles.chip}>
//                       <Calendar size={14} />
//                       {format(new Date(post.publishedAt || post.createdAt), 'MMM dd, yyyy')}
//                     </span>
//                     <span className={styles.chip}>
//                       <Clock size={14} />
//                       {format(new Date(post.publishedAt || post.createdAt), 'HH:mm')}
//                     </span>
//                     <span className={styles.chip}>
//                       <User size={14} />
//                       {post.author.fullName}
//                     </span>
//                     <span className={styles.chip}>
//                       <Eye size={14} />
//                       {post.viewCount} views
//                     </span>
//                   </motion.div>
//                 </div>
//                 <button 
//                   className={styles.expandButton}
//                   onClick={() => handleCardClick(post.id)}
//                   aria-expanded={expandedPost === post.id}
//                   aria-label={expandedPost === post.id ? "Collapse post" : "Expand post"}
//                 >
//                   {expandedPost === post.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//                 </button>
//               </motion.div>

//               <AnimatePresence mode="wait">
//                 {expandedPost === post.id && (
//                   <motion.div
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: 'auto' }}
//                     exit={{ opacity: 0, height: 0 }}
//                     transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
//                     className={styles.expandedContent}
//                   >
//                     {post.excerpt && (
//                       <p className={styles.excerpt}>{post.excerpt}</p>
//                     )}

//                     <div className={styles.tagsContainer}>
//                       {post.categories.length > 0 && (
//                         <div className={styles.tagGroup}>
//                           <span className={styles.tagLabel}>Categories</span>
//                           <div className={styles.tags}>
//                             {post.categories.map(category => (
//                               <Link
//                                 key={category.id}
//                                 href={`/blog/category/${category.slug}`}
//                                 className={clsx(styles.tag, styles.categoryTag)}
//                                 onClick={(e) => e.stopPropagation()}
//                               >
//                                 {category.name}
//                               </Link>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       {post.tags.length > 0 && (
//                         <div className={styles.tagGroup}>
//                           <span className={styles.tagLabel}>Tags</span>
//                           <div className={styles.tags}>
//                             {post.tags.map(tag => (
//                               <Link
//                                 key={tag.id}
//                                 href={`/blog/tag/${tag.slug}`}
//                                 className={styles.tag}
//                                 onClick={(e) => e.stopPropagation()}
//                               >
//                                 <Tag size={12} />
//                                 <span>{tag.name}</span>
//                               </Link>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     <div className={styles.cardActions}>
//                       <Link
//                         href={`/blog/${post.slug}`}
//                         className={styles.readMoreButton}
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         Read Full Post
//                       </Link>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </div>

//       {totalPages > 1 && (
//         <div className={styles.pagination}>
//           <button
//             onClick={() => onPageChange?.(currentPage - 1)}
//             disabled={currentPage === 1}
//             className={styles.pageButton}
//           >
//             Previous
//           </button>
          
//           {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//             <button
//               key={page}
//               onClick={() => onPageChange?.(page)}
//               className={clsx(
//                 styles.pageButton,
//                 page === currentPage && styles.active
//               )}
//             >
//               {page}
//             </button>
//           ))}

//           <button
//             onClick={() => onPageChange?.(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className={styles.pageButton}
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BlogList;