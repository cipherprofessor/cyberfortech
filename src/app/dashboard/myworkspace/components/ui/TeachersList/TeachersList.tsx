//src/app/dashboard/myworkspace/components/ui/TeachersList/TeachersList.tsx
"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search,
  Eye,
  Pencil,
  Trash2,
  Plus
} from 'lucide-react';
import { ViewTeacherModal, EditTeacherModal, DeleteTeacherModal } from './TeacherModals';
// At the top of TeachersList.tsx

import styles from './TeachersList.module.scss';
import { Teacher, TeachersListProps } from './types';
import { AVAILABLE_COLUMNS } from './constants';
import { Chip, getColumnIcon, Rating, Stats } from './TableComponents';
import ColumnSelector from './ColumnSelector';

const TeachersList: React.FC<TeachersListProps> = ({
  data,
  title = "Instructors List",
  className = "",
  onViewAll,
  itemsPerPage = 5,
  onPageChange,
  onSearch,
  onEdit,
  onDelete,
  onCreateClick
}) => {
  // State Management
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('teacherListColumns');
      if (saved) return JSON.parse(saved);
    } catch (error) {
      console.error('Error loading saved columns:', error);
    }
    return Object.entries(AVAILABLE_COLUMNS)
      .filter(([_, config]) => config.default)
      .map(([key]) => key);
  });

  const [modalState, setModalState] = useState({
    view: false,
    edit: false,
    delete: false
  });

  // Effects
  useEffect(() => {
    try {
      localStorage.setItem('teacherListColumns', JSON.stringify(selectedColumns));
    } catch (error) {
      console.error('Error saving columns:', error);
    }
  }, [selectedColumns]);

  // Handlers
  const handleColumnToggle = (column: string) => {
    setSelectedColumns(prev => 
      prev.includes(column) 
        ? prev.filter(col => col !== column)
        : [...prev, column]
    );
  };

  const handleAction = (teacher: Teacher, action: 'view' | 'edit' | 'delete') => {
    setSelectedTeacher(teacher);
    setModalState(prev => ({ ...prev, [action]: true }));
  };

  // Data Processing
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    const searchLower = searchTerm.toLowerCase();
    return data.filter(teacher => 
      teacher.name.toLowerCase().includes(searchLower) ||
      teacher.qualification.toLowerCase().includes(searchLower) ||
      teacher.subject.name.toLowerCase().includes(searchLower)
    );
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Render Cell Content
  // Inside TeachersList.tsx

const renderCellContent = (teacher: Teacher, column: string): React.ReactNode => {
  switch (column) {
    case 'instructor':
      return (
        <div className={styles.instructorInfo}>
          <div className={styles.avatar}>
            <Image
              src={teacher.avatar}
              alt={teacher.name}
              width={36}
              height={36}
              className={styles.avatarImg}
            />
          </div>
          <div className={styles.instructorDetails}>
            <span className={styles.instructorName}>{teacher.name}</span>
            <span className={styles.instructorEmail}>{teacher.email}</span>
          </div>
        </div>
      );

    case 'specialization':
      return (
        <Chip 
          label={teacher.subject.name}
          icon={getColumnIcon('specialization')}
          color={teacher.subject.color}
        />
      );

    case 'rating':
      return <Rating value={teacher.rating} />;

    case 'total_courses':
      return (
        <Stats 
          icon={getColumnIcon('total_courses')}
          value={teacher.total_courses}
          label="Courses"
          color="#3b82f6"
        />
      );

    case 'total_students':
      return (
        <Stats 
          icon={getColumnIcon('total_students')}
          value={teacher.total_students}
          label="Students"
          color="#10b981"
        />
      );

    case 'social_links':
      if (typeof teacher.social_links === 'string') {
        try {
          const links = JSON.parse(teacher.social_links);
          return <div className={styles.socialLinks}>{/* Your social links rendering */}</div>;
        } catch {
          return null;
        }
      }
      return <div className={styles.socialLinks}>{/* Your social links rendering */}</div>;

    case 'status':
      return (
        <Chip 
          label={teacher.status}
          icon={getColumnIcon('status')}
          color={
            teacher.status === 'active' ? '#10b981' :
            teacher.status === 'inactive' ? '#6b7280' :
            '#ef4444'
          }
        />
      );

    case 'created_at':
    case 'updated_at':
      return new Date(teacher[column]).toLocaleDateString();

    default:
      // Safe type assertion since we know the column exists in Teacher
      const value = teacher[column as keyof Teacher];
      return value?.toString() || '';
  }
};

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Header Section */}
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        
        <div className={styles.headerControls}>
          <div className={styles.searchWrapper}>
            <Search size={14} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search instructors..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                onSearch?.(e.target.value);
              }}
              className={styles.searchInput}
            />
          </div>

          <ColumnSelector
            selectedColumns={selectedColumns}
            onColumnToggle={handleColumnToggle}
            showSelector={showColumnSelector}
            onToggleSelector={() => setShowColumnSelector(!showColumnSelector)}
          />

          <button
            onClick={() => onCreateClick?.()}
            className={styles.viewAll}
          >
            <Plus size={16} />
            Add Instructor
          </button>

          

          <div className={styles.pagination}>
            <button
              className={styles.paginationButton}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>
            <span className={styles.pageInfo}>
              {currentPage} / {totalPages}
            </span>
            <button
              className={styles.paginationButton}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          
        </div>
      </div>

      {/* Table Section */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {selectedColumns.map(column => (
                <th key={column}>
                  <div className={styles.columnHeader}>
                    {React.createElement(getColumnIcon(column), { size: 16 })}
                    {AVAILABLE_COLUMNS[column].label}
                  </div>
                </th>
              ))}
              <th className={styles.actionsHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((teacher, index) => (
              <motion.tr
                key={teacher.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={styles.row}
              >
                {selectedColumns.map(column => (
                  <td key={column}>
                    {renderCellContent(teacher, column)}
                  </td>
                ))}
                <td>
                  <div className={styles.actions}>
                    <button 
                      className={`${styles.actionButton} ${styles.viewButton}`}
                      onClick={() => handleAction(teacher, 'view')}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className={`${styles.actionButton} ${styles.editButton}`}
                      onClick={() => handleAction(teacher, 'edit')}
                      title="Edit Instructor"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => handleAction(teacher, 'delete')}
                      title="Delete Instructor"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {paginatedData.length === 0 && (
        <div className={styles.noResults}>
          No instructors found
        </div>
      )}

      {/* Modals */}
      <ViewTeacherModal
        isOpen={modalState.view}
        onClose={() => setModalState(prev => ({ ...prev, view: false }))}
        teacher={selectedTeacher}
      />

      <EditTeacherModal
        isOpen={modalState.edit}
        onClose={() => setModalState(prev => ({ ...prev, edit: false }))}
        teacher={selectedTeacher}
        onSave={(updatedTeacher) => {
          onEdit?.(updatedTeacher);
          setModalState(prev => ({ ...prev, edit: false }));
        }}
      />

      <DeleteTeacherModal
        isOpen={modalState.delete}
        onClose={() => setModalState(prev => ({ ...prev, delete: false }))}
        teacher={selectedTeacher}
        onConfirm={() => {
          if (selectedTeacher) {
            onDelete?.(selectedTeacher);
            setModalState(prev => ({ ...prev, delete: false }));
          }
        }}
      />
    </div>
  );
};

export default TeachersList;