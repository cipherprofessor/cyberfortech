// src/app/dashboard/myworkspace/menus/blog/blog_categories/BlogCategories.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import axios from 'axios';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Pencil,
  Eye,
  BarChart3,
  SortAsc,
  FilePlus,
  ArrowUpDown
} from 'lucide-react';
import DataTable, { Column } from '@/app/dashboard/myworkspace/components/ui/DataTable/DataTable';

import { BlogCategory } from '@/types/blog';
import { useToast } from './hooks/useToast';
import styles from './BlogCategories.module.scss';
import KPICard from '../../../components/ui/KPICard/KPICard';
import { CategoryEditModal } from './components/CategoryEditModal/CategoryEditModal';
import { CategoryDeleteConfirmDialog } from './components/CategoryDeleteConfirmation/CategoryDeleteConfirmation';

// Interface for category with post count
interface CategoryWithCount extends BlogCategory {
  postCount: number;
}

// Interface for category form data
interface CategoryFormData {
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

const BlogCategories: React.FC = () => {
  const { theme } = useTheme();
  const { showToast } = useToast();
  
  // States
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<CategoryWithCount[]>([]);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<CategoryWithCount | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Search and pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);
  
  // Fetch categories function
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/blog/categories');
      
      // Get post counts for each category
      const postCountsResponse = await axios.get('/api/blog/categories/stats');
      const postCounts = postCountsResponse.data;
      
      // Merge categories with post counts
      const categoriesWithCounts = response.data.map((category: BlogCategory) => ({
        ...category,
        postCount: postCounts[category.id] || 0
      }));
      
      setCategories(categoriesWithCounts);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
      showToast('Error', 'Failed to load categories', 'destructive');
    } finally {
      setLoading(false);
    }
  }, [showToast]);
  
  // Get emoji icon or image URL for a category
  const getCategoryIcon = (category: CategoryWithCount): React.ReactNode => {
    if (!category.imageUrl) {
      return <FilePlus size={16} />;
    }
    
    // Check if the icon is an emoji or URL
    if (/\p{Emoji}/u.test(category.imageUrl) || category.imageUrl.length < 5) {
      // It's an emoji
      return <span className={styles.emojiIcon}>{category.imageUrl}</span>;
    } else {
      // It's an image URL
      return (
        <div className={styles.categoryIconContainer}>
          <img 
            src={category.imageUrl} 
            alt="" 
            className={styles.categoryIcon}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/api/placeholder/24/24';
            }}
          />
        </div>
      );
    }
  };
  
  // Handle edit action
  const handleEdit = (category: CategoryWithCount) => {
    setCurrentCategory(category);
    setIsEditing(true);
    setShowEditModal(true);
  };
  
  // Handle create new category
  const handleCreateNew = () => {
    setCurrentCategory(null);
    setIsEditing(false);
    setShowEditModal(true);
  };
  
  // Handle delete action
  const handleDelete = (categoriesToDelete: CategoryWithCount[]) => {
    // Only allow deleting categories with no posts
    const hasPostsCategories = categoriesToDelete.filter(cat => cat.postCount > 0);
    
    if (hasPostsCategories.length > 0) {
      if (hasPostsCategories.length === 1) {
        showToast('Cannot Delete', `The category "${hasPostsCategories[0].name}" has posts and cannot be deleted.`, 'destructive');
      } else {
        showToast('Cannot Delete', `${hasPostsCategories.length} categories have posts and cannot be deleted.`, 'destructive');
      }
      
      // Filter out categories with posts
      const deleteableCategories = categoriesToDelete.filter(cat => cat.postCount === 0);
      if (deleteableCategories.length === 0) {
        return;
      }
      
      setSelectedCategories(deleteableCategories);
    } else {
      setSelectedCategories(categoriesToDelete);
    }
    
    setShowDeleteModal(true);
  };
  
  // Handle confirm delete
  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      
      // Loop through categories and delete each one
      for (const category of selectedCategories) {
        await axios.delete(`/api/blog/categories/${category.slug}`);
      }
      
      showToast(
        'Success', 
        selectedCategories.length === 1 
          ? `Category "${selectedCategories[0].name}" deleted successfully` 
          : `${selectedCategories.length} categories deleted successfully`
      );
      
      // Reset state and refresh categories
      setShowDeleteModal(false);
      setSelectedCategories([]);
      await fetchCategories();
    } catch (err) {
      console.error('Error deleting categories:', err);
      showToast('Error', 'Failed to delete categories', 'destructive');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle save category
  const handleSaveCategory = async (formData: CategoryFormData) => {
    try {
      setLoading(true);
      
      const apiData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        displayOrder: formData.displayOrder,
        parentId: formData.parentId,
        imageUrl: formData.imageUrl
      };
      
      if (isEditing && currentCategory) {
        // Update existing category
        await axios.put(`/api/blog/categories/${currentCategory.slug}`, apiData);
        showToast('Success', `Category "${formData.name}" updated successfully`);
      } else {
        // Create new category
        await axios.post('/api/blog/categories', apiData);
        showToast('Success', `Category "${formData.name}" created successfully`);
      }
      
      // Reset state and refresh categories
      setShowEditModal(false);
      setCurrentCategory(null);
      setIsEditing(false);
      await fetchCategories();
    } catch (err: any) {
      console.error('Error saving category:', err);
      const errorMessage = err.response?.data?.error || 'Failed to save category';
      showToast('Error', errorMessage, 'destructive');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle cancel delete
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedCategories([]);
  };
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  // Handle selection change
  const handleSelectionChange = (selected: CategoryWithCount[]) => {
    setSelectedCategories(selected);
  };
  
  // Define table columns
  const columns: Column<CategoryWithCount>[] = [
    {
      key: 'name',
      label: 'NAME',
      sortable: true,
      visible: true,
      render: (_, category) => (
        <div className={styles.nameCell}>
          {getCategoryIcon(category)}
          <span className={styles.categoryName}>
            {category.parentId && <span className={styles.childIndicator}>↳</span>}
            {category.name}
          </span>
        </div>
      )
    },
    {
      key: 'slug',
      label: 'SLUG',
      sortable: true,
      visible: true,
      width: '180px'
    },
    {
      key: 'description',
      label: 'DESCRIPTION',
      sortable: false,
      visible: true,
      render: (description: string | undefined) => (
        <span className={styles.descriptionCell}>
          {description || <span className={styles.emptyValue}>-</span>}
        </span>
      )
    },
    {
      key: 'displayOrder',
      label: 'ORDER',
      sortable: true,
      visible: true,
      width: '100px',
      render: (displayOrder: number) => (
        <span className={styles.orderCell}>{displayOrder}</span>
      )
    },
    {
      key: 'postCount',
      label: 'POSTS',
      sortable: true,
      visible: true,
      width: '100px',
      render: (postCount: number) => (
        <span className={styles.postCountBadge}>{postCount}</span>
      )
    },
    {
      key: 'parentId',
      label: 'PARENT',
      sortable: false,
      visible: true,
      width: '180px',
      render: (parentId: string | undefined) => {
        if (!parentId) return <span className={styles.emptyValue}>-</span>;
        
        const parentCategory = categories.find(c => c.id === parentId);
        return (
          <span className={styles.parentName}>
            {parentCategory?.name || 'Unknown'}
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'ACTIONS',
      sortable: false,
      visible: true,
      width: '100px'
    }
  ];
  
  // Calculate stats
  const totalCategories = categories.length;
  const totalPosts = categories.reduce((sum, cat) => sum + cat.postCount, 0);
  const totalSubCategories = categories.filter(cat => cat.parentId).length;
  
  // Filter categories based on search query
  const filteredCategories = categories.filter(
    category => {
      const lowerQuery = searchQuery.toLowerCase();
      return (
        category.name.toLowerCase().includes(lowerQuery) || 
        category.slug.toLowerCase().includes(lowerQuery) ||
        (category.description && category.description.toLowerCase().includes(lowerQuery))
      );
    }
  );
  
  // Create custom props for DataTable
  const customProps = {
    onSearchChange: handleSearch,
    searchValue: searchQuery,
    title: "Recent Orders", // Will be overridden by the title prop in DataTable
    useCustomDeleteModal: true,
    useCustomEditModal: true
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Blog Categories</h1>
        <p className={styles.subtitle}>
          Manage your blog categories to organize content effectively
        </p>
      </div>
      
      {/* Stats cards */}
      <div className={styles.statsCards}>
        <KPICard 
          title="Total Categories" 
          value={totalCategories.toString()} 
          change={0} 
          icon={<Eye size={20} />} 
          // iconType="primary"
        />
        
        <KPICard 
          title="Total Posts" 
          value={totalPosts.toString()} 
          change={0} 
          icon={<BarChart3 size={20} />} 
          // iconType="info"
        />
        
        <KPICard 
          title="Sub-Categories" 
          value={totalSubCategories.toString()} 
          change={0} 
          icon={<SortAsc size={20} />} 
          // iconType="success"
        />
      </div>
      
      {/* Action button */}
      <div className={styles.actions}>
        <button 
          className={styles.addButton}
          onClick={handleCreateNew}
        >
          <PlusCircle size={18} />
          <span>Add Category</span>
        </button>
      </div>
      
      {/* Categories Data Table */}
      <div className={styles.tableContainer}>
        <DataTable
          data={filteredCategories}
          columns={columns}
          isLoading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSelectionChange={handleSelectionChange}
          showSearch={true}
          title="Blog Categories"
          searchPlaceholder="Search categories..."
          className={styles.categoriesTable}
          customProps={customProps}
        />
      </div>
      
      {/* Edit Modal */}
      <CategoryEditModal
        show={showEditModal}
        category={currentCategory}
        isEditing={isEditing}
        parentOptions={categories.filter(cat => !cat.parentId)}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveCategory}
      />
      
      {/* Delete Confirmation Modal */}
      <CategoryDeleteConfirmDialog
        show={showDeleteModal}
        categoryNames={selectedCategories.map(cat => cat.name)}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default BlogCategories;