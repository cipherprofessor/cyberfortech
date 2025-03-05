//src/app/dashboard/myworkspace/components/ui/DataTable/DataTable.tsx
"use client";
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowUpDown, Pencil, Trash2, ChevronDown, ChevronRight, ChevronLeft, Trash } from 'lucide-react';
import styles from './DataTable.module.scss';
import TableSkeleton from './TableSkeleton';
import { DeleteConfirmationModal, EditOrderModal } from './OrderModals';

export type SortDirection = 'asc' | 'desc' | null;
export type DataType = 'text' | 'number' | 'date' | 'status' | 'actions';

interface PaginationState {
    page: number;
    pageSize: number;
  }
  

export interface Column<T> {
  key: keyof T | 'actions';
  label: string;
  type?: DataType;
  sortable?: boolean;
  visible?: boolean;
  width?: string;
  render?: (value: any, item: T) => React.ReactNode;
}

// Add customProps to TableProps interface
export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  showSearch?: boolean;
  isLoading?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selectedItems: T[]) => void;
  onEdit?: (item: T) => void;
  onDelete?: (items: T[]) => void;
  className?: string;
  searchPlaceholder?: string;
  customProps?: {
    onSearchChange?: (value: string) => void;
    searchValue?: string;
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    useCustomDeleteModal?: boolean;
    useCustomEditModal?: boolean;  // Add this flag
  };
}

function DataTable<T extends { id: string | number }>({
  data,
  columns: defaultColumns,
  title = "Recent Orders",
  showSearch = true,
  isLoading = false,
  selectable = true,
  onSelectionChange,
  onEdit,
  onDelete,
  className = "",
  searchPlaceholder = "Search orders...",
  customProps
}: TableProps<T>) {
    const [selectedItems, setSelectedItems] = useState<T[]>([]);
    const [searchTerm, setSearchTerm] = useState(customProps?.searchValue || "");
    const [sortConfig, setSortConfig] = useState<{
      key: keyof T | 'actions';
      direction: SortDirection;
    }>({ key: 'id', direction: null });
    const [pagination, setPagination] = useState<PaginationState>({
      page: 1,
      pageSize: 5
    });
  
    const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedForEdit, setSelectedForEdit] = useState<T | null>(null);
  const [itemsToDelete, setItemsToDelete] = useState<T[]>([]);
  
    const visibleColumns = defaultColumns.filter(col => col.visible !== false);
  

    const handleSort = (key: keyof T | 'actions') => {
        if (!defaultColumns.find(col => col.key === key)?.sortable) return;
      
        setSortConfig(current => {
          // If clicking on a different column, start with ascending sort
          if (current.key !== key) {
            return { key, direction: 'asc' };
          }
      
          // Cycle through: asc -> desc -> asc -> desc...
          return {
            key,
            direction: current.direction === 'asc' ? 'desc' : 'asc'
          };
        });
      };

      const handleSelectAll = (checked: boolean) => {
        const newSelection = checked ? filteredData : [];
        setSelectedItems(newSelection);
        onSelectionChange?.(newSelection);
      };

      const handleSelectItem = (item: T, checked: boolean) => {
        const newSelection = checked
          ? [...selectedItems, item]
          : selectedItems.filter(i => i.id !== item.id);
        setSelectedItems(newSelection);
        onSelectionChange?.(newSelection);
      };
    
      const handleEditClick = (item: T) => {
        if (customProps?.useCustomEditModal) {
          // If using custom edit modal, just call the onEdit handler
          onEdit?.(item);
        } else {
          // Otherwise use the built-in modal
          setSelectedForEdit(item);
          setEditModalOpen(true);
        }
      };
    
      const handleDeleteClick = (items: T[]) => {
        if (customProps?.useCustomDeleteModal) {
          // If using custom delete modal, just call the onDelete handler
          onDelete?.(items);
        } else {
          // Otherwise use the built-in modal
          setItemsToDelete(items);
          setDeleteModalOpen(true);
        }
      };
    
      const handleSaveEdit = (editedItem: T) => {
        onEdit?.(editedItem);
        setEditModalOpen(false);
        setSelectedForEdit(null);
      };
    
      const handleConfirmDelete = () => {
        onDelete?.(itemsToDelete);
        setDeleteModalOpen(false);
        setItemsToDelete([]);
        setSelectedItems([]);
      };

      

      // Replace the filteredData useMemo with this (if using customProps, we'll skip client-side filtering):
const filteredData = useMemo(() => {
  // If customProps.onSearchChange is provided, we're doing server-side filtering
  if (customProps?.onSearchChange) return data;
  
  // Otherwise do client-side filtering
  if (!searchTerm) return data;
  
  const searchLower = searchTerm.toLowerCase();
  return data.filter(item =>
    Object.entries(item).some(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(v => 
          String(v).toLowerCase().includes(searchLower)
        );
      }
      return String(value).toLowerCase().includes(searchLower);
    })
  );
}, [data, searchTerm, customProps]);

     // Update the sortedData useMemo in DataTable.tsx
     const sortedData = useMemo(() => {
        if (!sortConfig.direction || sortConfig.key === 'actions') return filteredData;
      
        return [...filteredData].sort((a, b) => {
          const aValue = a[sortConfig.key as keyof T];
          const bValue = b[sortConfig.key as keyof T];
      
          // Handle null/undefined values
          if (aValue == null && bValue == null) return 0;
          if (aValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
          if (bValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
      
          const modifier = sortConfig.direction === 'asc' ? 1 : -1;
      
          // Handle objects (like customer details)
          if (typeof aValue === 'object' && typeof bValue === 'object') {
            // Handle customer objects
            if ('name' in aValue && 'name' in bValue) {
              const aName = String(aValue.name).toLowerCase();
              const bName = String(bValue.name).toLowerCase();
              return aName.localeCompare(bName) * modifier;
            }
            return 0;
          }
      
          // Handle numbers
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return (aValue - bValue) * modifier;
          }
      
          // Handle dates
          if (aValue instanceof Date && bValue instanceof Date) {
            return (aValue.getTime() - bValue.getTime()) * modifier;
          }
      
          // Convert to strings for comparison
          const aString = String(aValue).toLowerCase();
          const bString = String(bValue).toLowerCase();
          
          return aString.localeCompare(bString) * modifier;
        });
      }, [filteredData, sortConfig]);
      


      const paginatedData = useMemo(() => {
        const start = (pagination.page - 1) * pagination.pageSize;
        const end = start + pagination.pageSize;
        return sortedData.slice(start, end);
      }, [sortedData, pagination]);
    
      const totalPages = Math.ceil(sortedData.length / pagination.pageSize);
    
      const handlePageChange = (newPage: number) => {
        setPagination(prev => ({ ...prev, page: newPage }));
      };


      if (isLoading) {
        return <TableSkeleton rows={5} columns={visibleColumns.length} />;
      }
      
      return (
        <div className={`${styles.container} ${className}`}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <h2 className={styles.title}>{title}</h2>
              {selectedItems.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={styles.bulkDeleteButton}
                  onClick={() => handleDeleteClick(selectedItems)}
                >
                  <Trash size={16} />
                  Delete Selected ({selectedItems.length})
                </motion.button>
              )}
            </div>
            
            <div className={styles.headerRight}>
              {showSearch && (
                <div className={styles.searchWrapper}>
                  <Search className={styles.searchIcon} />
                  <input
  type="text"
  placeholder={searchPlaceholder}
  value={customProps?.searchValue !== undefined ? customProps.searchValue : searchTerm}
  onChange={(e) => {
    const value = e.target.value;
    if (customProps?.onSearchChange) {
      customProps.onSearchChange(value);
      // Don't update local searchTerm when using custom search
    } else {
      setSearchTerm(value);
    }
  }}
  className={styles.searchInput}
/>
                </div>
              )}
    
    <div className={styles.pagination}>
  <button
    className={styles.paginationButton}
    onClick={() => {
      if (customProps?.onPageChange) {
        customProps.onPageChange((customProps.currentPage || pagination.page) - 1);
      } else {
        handlePageChange(pagination.page - 1);
      }
    }}
    disabled={customProps?.currentPage ? customProps.currentPage === 1 : pagination.page === 1}
  >
    <ChevronLeft size={16} />
  </button>
  <span className={styles.paginationInfo}>
    Page {customProps?.currentPage || pagination.page} of {customProps?.totalPages || totalPages}
  </span>
  <button
    className={styles.paginationButton}
    onClick={() => {
      if (customProps?.onPageChange) {
        customProps.onPageChange((customProps.currentPage || pagination.page) + 1);
      } else {
        handlePageChange(pagination.page + 1);
      }
    }}
    disabled={customProps?.currentPage && customProps.totalPages 
      ? customProps.currentPage === customProps.totalPages 
      : pagination.page === totalPages}
  >
    <ChevronRight size={16} />
  </button>
</div>

            </div>
          </div>
    
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.headerRow}>
                  {selectable && (
                    <th className={styles.checkboxCell}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={paginatedData.length > 0 && selectedItems.length === paginatedData.length}
                        onChange={(e) => {
                          const newSelection = e.target.checked ? paginatedData : [];
                          setSelectedItems(newSelection);
                          onSelectionChange?.(newSelection);
                        }}
                      />
                    </th>
                  )}
                  {defaultColumns.filter(col => col.visible !== false).map(column => (
                    <th
                      key={String(column.key)}
                      onClick={() => column.sortable && handleSort(column.key)}
                      className={`${styles.headerCell} ${column.sortable ? styles.sortable : ''}`}
                      style={{ width: column.width }}
                    >
                      <div className={styles.headerContent}>
                        {column.label}
                        {column.sortable && (
                          <ArrowUpDown
                            size={14}
                            className={`${styles.sortIcon} ${
                              sortConfig.key === column.key ? 
                                sortConfig.direction === 'asc' ? styles.ascending :
                                sortConfig.direction === 'desc' ? styles.descending : ''
                              : ''
                            }`}
                          />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map(item => (
                  <motion.tr
                    key={item.id}
                    className={styles.tableRow}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {selectable && (
                      <td className={styles.checkboxCell}>
                        <input
                          type="checkbox"
                          className={styles.checkbox}
                          checked={selectedItems.some(i => i.id === item.id)}
                          onChange={(e) => handleSelectItem(item, e.target.checked)}
                        />
                      </td>
                    )}
                    {defaultColumns.filter(col => col.visible !== false).map(column => (
                      <td 
                        key={String(column.key)} 
                        className={`${styles.tableCell} ${
                          column.key === 'actions' ? styles.actionsCell : ''
                        }`}
                      >
                        {column.key === 'actions' ? (
                          <div className={styles.actions}>
                            {onEdit && (
                              <button
                                onClick={() => handleEditClick(item)}
                                className={`${styles.actionButton} ${styles.editButton}`}
                              >
                                <Pencil size={16} />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={() => handleDeleteClick([item])}
                                className={`${styles.actionButton} ${styles.deleteButton}`}
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        ) : column.render ? (
                          column.render(item[column.key], item)
                        ) : (
                          String(item[column.key])
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
    
          {/* Modals */}
          {!customProps?.useCustomEditModal && selectedForEdit && (
  <EditOrderModal
    isOpen={editModalOpen}
    onClose={() => {
      setEditModalOpen(false);
      setSelectedForEdit(null);
    }}
    order={selectedForEdit}
    onSave={handleSaveEdit}
  />
)}
    
          {/* Only show the built-in delete modal if one isn't provided by the parent */}
{!customProps?.useCustomDeleteModal && (
  <DeleteConfirmationModal
    isOpen={deleteModalOpen}
    onClose={() => {
      setDeleteModalOpen(false);
      setItemsToDelete([]);
    }}
    onConfirm={handleConfirmDelete}
    itemCount={itemsToDelete.length}
  />
)}

        </div>
      );
    }
    
    export default DataTable;