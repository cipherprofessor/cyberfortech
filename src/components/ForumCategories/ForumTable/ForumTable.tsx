"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import DataTable, { Column } from '@/app/dashboard/myworkspace/components/ui/DataTable/DataTable';
import { useAuth } from '@/hooks/useAuth';
import styles from './ForumTable.module.scss';
import { formatDate } from '@/utils/formattingData';
import { MessageSquare } from 'lucide-react';
import Avatar from '@/app/dashboard/myworkspace/components/ui/DataTable/Avatar';

// Define the Topic interface based on API response
interface Topic {
  id: string | number;
  title: string;
  content: string;
  views: number;
  is_pinned: number;
  is_locked: number;
  created_at: string;
  updated_at: string;
  author_id: string;
  author_name: string;
  author_email: string;
  author_image: string;
  category_id: string;
  category_name: string;
  subcategory_id: string | null;
  subcategory_name: string | null;
  reply_count: number;
}

// Define TopicData interface for internal use
interface TopicData {
  id: string | number;
  title: string;
  content: string;
  category_name: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  authorImage: string;
  createdAt: string;
  updatedAt: string;
  is_pinned: number;
  is_locked: number;
  replies_count: number;
  views: number;
  categoryId: string;
  subcategory_id: string | null;
  subcategory_name: string | null;
  status?: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface ApiResponse {
  topics: Topic[];
  pagination: PaginationData;
}

// Custom hook for debounced search
function useDebouncedSearch(initialValue: string = '', delay: number = 300) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialValue);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Update debounced value after delay
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, delay);
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, delay]);
  
  return [searchTerm, debouncedSearchTerm, setSearchTerm] as const;
}

// Create a custom DeleteConfirmationModal for forum topics
const ForumDeleteModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemCount 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  itemCount: number 
}) => {
  if (!isOpen) return null;
  
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>Confirm Deletion</h3>
        <p className={styles.modalMessage}>
          Are you sure you want to delete {itemCount === 1 ? 'this topic' : `these ${itemCount} topics`}? 
          This action cannot be undone.
        </p>
        <div className={styles.modalActions}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.deleteButton} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Create a custom EditModal for forum topics
const ForumEditModal = ({ 
  isOpen, 
  onClose, 
  topic,
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  topic: TopicData | null;
  onSave: (updatedTopic: TopicData) => void;
}) => {
  if (!isOpen || !topic) return null;
  
  const [title, setTitle] = useState(topic.title);
  const [content, setContent] = useState(topic.content);
  const [isPinned, setIsPinned] = useState(!!topic.is_pinned);
  const [isLocked, setIsLocked] = useState(!!topic.is_locked);
  
  const handleSave = () => {
    const updatedTopic = {
      ...topic,
      title,
      content,
      is_pinned: isPinned ? 1 : 0,
      is_locked: isLocked ? 1 : 0
    };
    onSave(updatedTopic);
  };
  
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Edit Forum Topic</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <span>×</span>
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Topic Title</label>
            <input
              type="text"
              className={styles.formInput}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Content</label>
            <textarea
              className={styles.formTextarea}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
            />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formCheckboxLabel}>
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className={styles.formCheckbox}
                />
                Pinned
              </label>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formCheckboxLabel}>
                <input
                  type="checkbox"
                  checked={isLocked}
                  onChange={(e) => setIsLocked(e.target.checked)}
                  className={styles.formCheckbox}
                />
                Locked
              </label>
            </div>
          </div>
        </div>
        
        <div className={styles.modalActions}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.saveButton} onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export function ForumTable() {
  const router = useRouter();
  const [topics, setTopics] = useState<TopicData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });
  const { isAdmin, isStudent, user } = useAuth();
  
  // Use debounced search to optimize API calls
  const [searchTerm, debouncedSearchTerm, setSearchTerm] = useDebouncedSearch('');
  
  // Add state for the modals
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [topicsToDelete, setTopicsToDelete] = useState<TopicData[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [topicToEdit, setTopicToEdit] = useState<TopicData | null>(null);

  // Define columns for the DataTable
  const columns: Column<TopicData>[] = [
    {
      key: 'title',
      label: 'Topic',
      sortable: true,
      visible: true,
      render: (title: string, topic: TopicData) => (
        <div 
          className={styles.topicCell}
          onClick={() => handleTopicClick(topic.id)}
          style={{ cursor: 'pointer' }}
        >
          <MessageSquare size={16} className={styles.topicIcon} />
          <span className={styles.topicTitle}>{title}</span>
        </div>
      )
    },
    {
      key: 'category_name',
      label: 'Category',
      sortable: true,
      visible: true
    },
    {
      key: 'authorName',
      label: 'Author',
      sortable: true,
      visible: true,
      render: (_, topic: TopicData) => (
        <div className={styles.authorCell}>
          <Avatar
            src={topic.authorImage}
            name={topic.authorName}
            size="sm"
            className={styles.avatar}
          />
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{topic.authorName}</span>
            <span className={styles.authorEmail}>{topic.authorEmail}</span>
          </div>
        </div>
      )
    },
    {
      key: 'replies_count',
      label: 'Replies',
      sortable: true,
      visible: true,
      width: '100px',
      render: (count: number) => (
        <span className={styles.repliesCount}>{count}</span>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      visible: true,
      width: '150px',
      render: (date: string) => formatDate(date)
    },
    {
      key: 'is_pinned' as keyof TopicData,
      label: 'Status',
      sortable: true,
      visible: true,
      width: '120px',
      render: (_, topic: TopicData) => {
        let status: 'inProgress' | 'pending' | 'success' = 'success';
        
        if (topic.is_pinned) {
          status = 'inProgress';
        } else if (topic.is_locked) {
          status = 'pending';
        }
        
        const statusText = {
          inProgress: 'Pinned',
          pending: 'Locked',
          success: 'Active'
        };
        
        return (
          <span className={`${styles.status} ${styles[status]}`}>
            {statusText[status]}
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      visible: true,
      width: '100px'
    }
  ];

  // Transform API response to TopicData
  const transformTopicData = (topic: Topic): TopicData => ({
    id: topic.id,
    title: topic.title,
    content: topic.content,
    category_name: topic.category_name,
    authorId: topic.author_id,
    authorName: topic.author_name,
    authorEmail: topic.author_email || '',
    authorImage: topic.author_image || '',
    createdAt: topic.created_at,
    updatedAt: topic.updated_at,
    is_pinned: topic.is_pinned,
    is_locked: topic.is_locked,
    replies_count: topic.reply_count,
    views: topic.views,
    categoryId: topic.category_id,
    subcategory_id: topic.subcategory_id,
    subcategory_name: topic.subcategory_name
  });

  // Fetch topics function (separated to be reusable)
  const fetchTopics = useCallback(async (page = currentPage, search = debouncedSearchTerm) => {
    try {
      setLoading(true);
      // Add search parameter if provided
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const response = await axios.get<ApiResponse>(
        `/api/forum/topics?page=${page}&limit=10${searchParam}`
      );
      
      // Transform the API response to match TopicData interface
      const transformedTopics = response.data.topics.map(transformTopicData);
      
      setTopics(transformedTopics);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Error fetching topics:', err);
      setError('Failed to load topics');
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm]);

  // Handle search changes (debounced)
  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  // Effect to fetch topics when the debounced search term changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchTopics(1, debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, fetchTopics]);

  // Effect to fetch topics when the page changes
  useEffect(() => {
    fetchTopics(currentPage, debouncedSearchTerm);
  }, [currentPage, fetchTopics]);

  // Handle topic click for navigation
  const handleTopicClick = (topicId: string | number) => {
    router.push(`/forum/topics/${topicId}`);
  };

  // Handle delete click
  const handleDeleteClick = (topicsToDelete: TopicData[]) => {
    setTopicsToDelete(topicsToDelete);
    setDeleteModalOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (topicsToDelete.length === 0) return;
    
    try {
      setLoading(true);
      // Loop through topics and delete each one
      for (const topic of topicsToDelete) {
        await axios.delete(`/api/forum/topics?id=${topic.id}`);
        console.log(`Deleted topic ID: ${topic.id}`);
      }
      
      // Refresh topics list
      await fetchTopics();
      
      // Close modal and reset topics to delete
      setDeleteModalOpen(false);
      setTopicsToDelete([]);
    } catch (err) {
      console.error('Error deleting topics:', err);
      setError('Failed to delete topics');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit click
  const handleEditClick = (topic: TopicData) => {
    setTopicToEdit(topic);
    setEditModalOpen(true);
  };

  // Handle save topic
  const handleSaveTopic = async (updatedTopic: TopicData) => {
    try {
      setLoading(true);
      await axios.put(`/api/forum/topics?id=${updatedTopic.id}`, {
        title: updatedTopic.title,
        content: updatedTopic.content,
        is_pinned: updatedTopic.is_pinned,
        is_locked: updatedTopic.is_locked
      });
      
      // Refresh topics list
      await fetchTopics();
      
      // Close modal and reset topic to edit
      setEditModalOpen(false);
      setTopicToEdit(null);
    } catch (err) {
      console.error('Error updating topic:', err);
      setError('Failed to update topic');
    } finally {
      setLoading(false);
    }
  };

  // Handle selection change
  const handleSelectionChange = (selectedTopics: TopicData[]) => {
    console.log('Selected topics:', selectedTopics);
  };

  // Check user permissions
  if (!isAdmin && !isStudent) {
    return <div className={styles.accessDenied}>Access denied</div>;
  }

  // Create custom props for the DataTable
  const customProps = {
    onSearchChange: handleSearch,
    searchValue: searchTerm,
    currentPage: currentPage,
    totalPages: pagination.pages,
    onPageChange: (page: number) => setCurrentPage(page),
    useCustomDeleteModal: true,
    useCustomEditModal: true
  };

  return (
    <div className={styles.pageContainer}>
      <DataTable
        data={topics}
        columns={columns}
        title="Recent Forum Topics"
        isLoading={loading}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onSelectionChange={handleSelectionChange}
        showSearch={true}
        searchPlaceholder="Search topics..."
        className={styles.forumTable}
        customProps={customProps}
      />
      
      {/* Custom delete confirmation modal */}
      <ForumDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemCount={topicsToDelete.length}
      />
      
      {/* Custom edit modal */}
      <ForumEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        topic={topicToEdit}
        onSave={handleSaveTopic}
      />
    </div>
  );
}

export default ForumTable;