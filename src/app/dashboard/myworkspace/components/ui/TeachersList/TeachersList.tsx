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
  Settings,
  Linkedin,
  Twitter,
  Globe,
  Star,
  BookOpen,
  Users,
  Code,
  Atom,
  GraduationCap,
  Plus
} from 'lucide-react';
import styles from './TeachersList.module.scss';
import { ViewTeacherModal, EditTeacherModal, DeleteTeacherModal } from './TeacherModals';
import { Teacher, TeachersListProps } from './types';


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

const AVAILABLE_COLUMNS = {
  instructor: { label: 'Instructor', default: true },
  specialization: { label: 'Specialization', default: true },
  bio: { label: 'Bio', default: true },
  contact: { label: 'Contact Number', default: true },
  rating: { label: 'Rating', default: true },
  total_courses: { label: 'Total Courses', default: true },
  total_students: { label: 'Total Students', default: true },
  social_links: { label: 'Social Links', default: true },
  qualification: { label: 'Qualification', default: false },
  address: { label: 'Address', default: false },
  years_of_experience: { label: 'Experience', default: false },
  status: { label: 'Status', default: false },
  created_at: { label: 'Created At', default: false },
  updated_at: { label: 'Updated At', default: false }
};


const TeachersList = ({ data, title = "Instructors List", className = "", onViewAll, itemsPerPage = 5, onPageChange, onSearch, onEdit, onDelete, onCreateClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState(() => 
    Object.entries(AVAILABLE_COLUMNS)
      .filter(([_, config]) => config.default)
      .map(([key]) => key)
  );

   // Persist column selection
   useEffect(() => {
    try {
      localStorage.setItem('teacherListColumns', JSON.stringify(selectedColumns));
    } catch (error) {
      console.error('Error saving columns:', error);
    }
  }, [selectedColumns]);

  const [modalState, setModalState] = useState({
    view: false,
    edit: false,
    delete: false
  });

  const ColumnSelector = () => (
    <div className={styles.columnSelector}>
      <button 
        onClick={() => setShowColumnSelector(!showColumnSelector)}
        className={styles.columnSelectorButton}
      >
        <Settings size={16} />
        Customize Columns
      </button>
      
      {showColumnSelector && (
        <div className={styles.columnDropdown}>
          {Object.entries(AVAILABLE_COLUMNS).map(([key, config]) => (
            <label key={key} className={styles.columnOption}>
              <input
                type="checkbox"
                checked={selectedColumns.includes(key)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedColumns([...selectedColumns, key]);
                  } else {
                    setSelectedColumns(selectedColumns.filter(col => col !== key));
                  }
                }}
              />
              {config.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );


  // Social Links Component
  const SocialLinks = ({ links }) => {
    const parsedLinks = useMemo(() => {
      try {
        return typeof links === 'string' ? JSON.parse(links) : links;
      } catch (error) {
        console.error('Error parsing social links:', error);
        return {};
      }
    }, [links]);

    const socialPlatforms = [
      { key: 'linkedin', Icon: Linkedin, label: 'LinkedIn' },
      { key: 'twitter', Icon: Twitter, label: 'Twitter' },
      { key: 'website', Icon: Globe, label: 'Website' }
    ];

    return (
      <div className={styles.socialLinks}>
        {socialPlatforms.map(({ key, Icon, label }) => (
          parsedLinks?.[key] && (
            <a 
              key={key}
              href={parsedLinks[key]}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              title={label}
            >
              <Icon size={16} />
            </a>
          )
        ))}
      </div>
    );
  };


   // Rating Component
   const Rating = ({ value }) => (
    <div className={styles.rating}>
      <Star size={16} className={styles.starIcon} />
      <span>{value?.toFixed(1) || '0.0'}</span>
    </div>
  );

  // Stats Component
  const Stats = ({ icon: Icon, value, label }) => (
    <div className={styles.stat}>
      <Icon size={16} />
      <span>{value}</span>
      <small>{label}</small>
    </div>
  );



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
  console.log("Dataaaaaa tecaher",paginatedData);

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
          <ColumnSelector />

          <button
       onClick={() => onCreateClick?.()}
         className={styles.actionButton}
       >
           <Plus size={16} />
           Add Teacher
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

          <button onClick={onViewAll} className={styles.viewAll}>
            View All →
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {selectedColumns.map(column => (
                <th key={column}>{AVAILABLE_COLUMNS[column].label}</th>
              ))}
              <th className={styles.actionsHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((teacher, index) => (
              console.log("Teacher",teacher),
              <motion.tr
                key={teacher.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={styles.row}
              >
                {selectedColumns.includes('instructor') && (
                  <td>
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
                  </td>
                )}

                {selectedColumns.includes('specialization') && (
                  <td>{teacher.specialization}</td>
                )}

                {selectedColumns.includes('bio') && (
                  <td className={styles.bioCell}>{teacher.bio}</td>
                )}

                {selectedColumns.includes('contact') && (
                  <td>{teacher.contact_number}</td>
                )}

                {selectedColumns.includes('rating') && (
                  <td>
                    <Rating value={teacher.rating} />
                  </td>
                )}

                {selectedColumns.includes('total_courses') && (
                  <td>
                    <Stats icon={BookOpen} value={teacher.total_courses} label="Courses" />
                  </td>
                )}

                {selectedColumns.includes('total_students') && (
                  <td>
                    <Stats icon={Users} value={teacher.total_students} label="Students" />
                  </td>
                )}

                {selectedColumns.includes('social_links') && (
                  <td>
                    <SocialLinks links={teacher.social_links} />
                  </td>
                )}

                {/* Optional columns based on selection */}
                {selectedColumns.includes('qualification') && (
                  <td>{teacher.qualification}</td>
                )}

                {selectedColumns.includes('address') && (
                  <td>{teacher.address}</td>
                )}

                {selectedColumns.includes('years_of_experience') && (
                  <td>{teacher.years_of_experience} years</td>
                )}

                {selectedColumns.includes('status') && (
                  <td>
                    <span className={`${styles.status} ${styles[teacher.status]}`}>
                      {teacher.status}
                    </span>
                  </td>
                )}

                {selectedColumns.includes('created_at') && (
                  <td>{new Date(teacher.created_at).toLocaleDateString()}</td>
                )}

                {selectedColumns.includes('updated_at') && (
                  <td>{new Date(teacher.updated_at).toLocaleDateString()}</td>
                )}

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
              onEdit?.(updatedTeacher);  // Using new prop name
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