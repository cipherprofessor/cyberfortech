// src/app/dashboard/myworkspace/menus/enquires/training/categories/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import axios from 'axios';
import { 
  PlusCircle, 
  Pencil,
  Trash2,
  Book,
  BarChart3,
  Layers
} from 'lucide-react';
import DataTable, { Column } from '@/app/dashboard/myworkspace/components/ui/DataTable/DataTable';
import KPICard from '@/app/dashboard/myworkspace/components/ui/KPICard/KPICard';
import { showToast } from "@/components/ui/mohsin-toast";

import styles from './CourseCategories.module.scss';

// Define the category type
interface CourseCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  courseCount?: number; // Added field for stats
}

interface CategoryFormData {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  displayOrder: number;
  isActive: boolean;
}

const CourseCategories: React.FC = () => {
  const { theme } = useTheme();
  
  // States
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<CourseCategory[]>([]);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<CourseCategory | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);
  
  // Fetch categories function
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get categories
      const response = await axios.get('/api/training/categories?includeInactive=true');
      
      // Get course counts for each category (this endpoint would need to be created)
      const coursesResponse = await axios.get('/api/training/categories/stats');
      const courseCounts = coursesResponse.data || {};
      
      // Merge categories with course counts
      const categoriesWithCounts = response.data.categories.map((category: CourseCategory) => ({
        ...category,
        courseCount: courseCounts[category.id] || 0
      }));
      
      setCategories(categoriesWithCounts);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
      showToast('Error', 'Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Handle edit action
  const handleEdit = (category: CourseCategory) => {
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
  const handleDelete = (categoriesToDelete: CourseCategory[]) => {
    // Only allow deleting categories with no courses
    const hasCoursesCategories = categoriesToDelete.filter(cat => (cat.courseCount || 0) > 0);
    
    if (hasCoursesCategories.length > 0) {
      if (hasCoursesCategories.length === 1) {
        showToast('Warning', `The category "${hasCoursesCategories[0].name}" has courses and cannot be deleted.`, 'warning');
      } else {
        showToast('Warning', `${hasCoursesCategories.length} categories have courses and cannot be deleted.`, 'warning');
      }
      
      // Filter out categories with courses
      const deleteableCategories = categoriesToDelete.filter(cat => (cat.courseCount || 0) === 0);
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
        await axios.delete(`/api/training/categories/${category.id}`);
      }
      
      // Show toast notification with appropriate message
      const message = selectedCategories.length === 1 
        ? `Category "${selectedCategories[0].name}" deleted successfully` 
        : `${selectedCategories.length} categories deleted successfully`;
      
      showToast('Success', message, 'success');
      
      // Reset state and refresh categories
      setShowDeleteModal(false);
      setSelectedCategories([]);
      await fetchCategories();
    } catch (err: any) {
      console.error('Error deleting categories:', err);
      const errorMessage = err.response?.data?.error || 'Failed to delete categories';
      showToast('Error', errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle save category
  const handleSaveCategory = async (formData: CategoryFormData) => {
    try {
      setLoading(true);
      
      if (isEditing && currentCategory) {
        // Update existing category
        await axios.put(`/api/training/categories/${currentCategory.id}`, formData);
        showToast('Success', `Category "${formData.name}" updated successfully`, 'success');
      } else {
        // Create new category
        await axios.post('/api/training/categories', formData);
        showToast('Success', `Category "${formData.name}" created successfully`, 'success');
      }
      
      // Reset state and refresh categories
      setShowEditModal(false);
      setCurrentCategory(null);
      setIsEditing(false);
      await fetchCategories();
    } catch (err: any) {
      console.error('Error saving category:', err);
      const errorMessage = err.response?.data?.error || 'Failed to save category';
      showToast('Error', errorMessage, 'error');
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
  const handleSelectionChange = (selected: CourseCategory[]) => {
    setSelectedCategories(selected);
  };

  // Define table columns
  const columns: Column<CourseCategory>[] = [
    {
      key: 'name',
      label: 'NAME',
      sortable: true,
      visible: true,
      width: '200px'
    },
    {
      key: 'description',
      label: 'DESCRIPTION',
      sortable: false,
      visible: true,
      render: (description?: string) => (
        <span>
          {description || <span>-</span>}
        </span>
      )
    },
    {
      key: 'displayOrder',
      label: 'ORDER',
      sortable: true,
      visible: true,
      width: '100px'
    },
    {
      key: 'courseCount',
      label: 'COURSES',
      sortable: true,
      visible: true,
      width: '100px'
    },
    {
      key: 'isActive',
      label: 'STATUS',
      sortable: true,
      visible: true,
      width: '100px',
      render: (isActive: boolean) => (
        <span className={isActive ? styles.activeBadge : styles.inactiveBadge}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'ACTIONS',
      sortable: false,
      visible: true,
      width: '100px',
      render: (_, category) => (
        <div className={styles.actions}>
          <button
            onClick={() => handleEdit(category)}
            className={styles.editButton}
            aria-label={`Edit ${category.name}`}
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => handleDelete([category])}
            className={styles.deleteButton}
            aria-label={`Delete ${category.name}`}
            disabled={(category.courseCount || 0) > 0}
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];
  
  // Calculate stats
  const totalCategories = categories.length;
  const activeCategories = categories.filter(cat => cat.isActive).length;
  const totalCourses = categories.reduce((sum, cat) => sum + (cat.courseCount || 0), 0);
  
  // Filter categories based on search query
  const filteredCategories = categories.filter(
    category => {
      const lowerQuery = searchQuery.toLowerCase();
      return (
        category.name.toLowerCase().includes(lowerQuery) || 
        (category.description && category.description.toLowerCase().includes(lowerQuery))
      );
    }
  );
  
  // Create custom props for DataTable
  const customProps = {
    onSearchChange: handleSearch,
    searchValue: searchQuery,
    title: "Course Categories",
    useCustomDeleteModal: true,
    useCustomEditModal: true
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Course Categories</h1>
        <p className={styles.subtitle}>
          Manage your training course categories
        </p>
      </div>
      
      {/* Stats cards */}
      <div className={styles.statsCards}>
        <KPICard 
          title="Total Categories" 
          value={totalCategories.toString()} 
          change={0} 
          icon={<Layers size={20} />} 
        />
        
        <KPICard 
          title="Active Categories" 
          value={activeCategories.toString()} 
          change={0} 
          icon={<Book size={20} />} 
        />
        
        <KPICard 
          title="Total Courses" 
          value={totalCourses.toString()} 
          change={0} 
          icon={<BarChart3 size={20} />} 
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
          title="Course Categories"
          searchPlaceholder="Search categories..."
          className={styles.categoriesTable}
          customProps={customProps}
        />
      </div>
      
      {/* You would need to create these modals */}
      {/* <CategoryEditModal
        show={showEditModal}
        category={currentCategory}
        isEditing={isEditing}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveCategory}
      />
      
      <CategoryDeleteConfirmDialog
        show={showDeleteModal}
        categoryNames={selectedCategories.map(cat => cat.name)}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      /> */}
    </div>
  );
};

export default CourseCategories;