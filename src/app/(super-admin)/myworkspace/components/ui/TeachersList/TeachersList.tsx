import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search,
  Eye,
  Pencil,
  Trash2,
  Code,
  BookOpen,
  Atom,
  GraduationCap
} from 'lucide-react';
import { ViewTeacherModal, EditTeacherModal, DeleteTeacherModal } from './TeacherModals';
import styles from './TeachersList.module.scss';
import { TeachersListProps, Teacher } from './types';


const getSubjectIcon = (subjectName: string) => {
  const iconProps = { size: 16 };
  const subjectMap = {
    'Full Stack Development': <Code {...iconProps} />,
    'English': <BookOpen {...iconProps} />,
    'Physics': <Atom {...iconProps} />,
    'Mathematics': <GraduationCap {...iconProps} />,
    // Add more mappings as needed
  };

  return subjectMap[subjectName as keyof typeof subjectMap] || <BookOpen {...iconProps} />;
};

const TeachersList: React.FC<TeachersListProps> = ({
  data,
  title = "Teachers List",
  className = "",
  onViewAll,
  itemsPerPage = 5,
  onTeacherUpdate,
  onTeacherDelete
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [modalState, setModalState] = useState<{
    view: boolean;
    edit: boolean;
    delete: boolean;
  }>({
    view: false,
    edit: false,
    delete: false
  });

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

  const handleAction = (teacher: Teacher, action: 'view' | 'edit' | 'delete') => {
    setSelectedTeacher(teacher);
    setModalState(prev => ({ ...prev, [action]: true }));
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        
        <div className={styles.headerControls}>
          <div className={styles.searchWrapper}>
            <Search size={14} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

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

          <button onClick={onViewAll} className={styles.viewAll}>
            View All →
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Teacher</th>
              <th>Qualification</th>
              <th>Subject</th>
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
                <td>
                  <div className={styles.teacherInfo}>
                    <div className={styles.avatar}>
                      <Image
                        src={teacher.avatar}
                        alt={teacher.name}
                        width={36}
                        height={36}
                        className={styles.avatarImg}
                      />
                    </div>
                    <span className={styles.teacherName}>{teacher.name}</span>
                  </div>
                </td>
                <td className={styles.qualification}>{teacher.qualification}</td>
                <td>
                  <div 
                    className={styles.subjectChip}
                    style={{ 
                      '--subject-color': teacher.subject.color 
                    } as React.CSSProperties}
                  >
                    {getSubjectIcon(teacher.subject.name)}
                    <span>{teacher.subject.name}</span>
                  </div>
                </td>
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
                      title="Edit Teacher"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => handleAction(teacher, 'delete')}
                      title="Delete Teacher"
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

      {paginatedData.length === 0 && (
        <div className={styles.noResults}>
          No teachers found
        </div>
      )}

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
          onTeacherUpdate?.(updatedTeacher);
          setModalState(prev => ({ ...prev, edit: false }));
        }}
      />

      <DeleteTeacherModal
        isOpen={modalState.delete}
        onClose={() => setModalState(prev => ({ ...prev, delete: false }))}
        teacher={selectedTeacher}
        onConfirm={() => {
          if (selectedTeacher) {
            onTeacherDelete?.(selectedTeacher.id);
            setModalState(prev => ({ ...prev, delete: false }));
          }
        }}
      />
    </div>
  );
};

export default TeachersList;