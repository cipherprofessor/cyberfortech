//src/app/dashboard/myworkspace/components/ui/TeachersList/TeacherModals.tsx
"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X } from 'lucide-react';
import styles from './TeacherModals.module.scss';
import { ModalProps, Teacher } from './types';



export const ViewTeacherModal: React.FC<ModalProps> = ({ isOpen, onClose, teacher }) => {
  if (!teacher) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.modalOverlay} onClick={onClose}>
          <motion.div 
            className={styles.modalContent}
            onClick={e => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <button className={styles.closeButton} onClick={onClose}>
              <X size={18} />
            </button>
            
            <div className={styles.teacherProfile}>
              <div className={styles.profileHeader}>
                <div className={styles.avatarLarge}>
                  <Image
                    src={teacher.avatar}
                    alt={teacher.name}
                    width={100}
                    height={100}
                    className={styles.avatarImg}
                  />
                </div>
                <h3 className={styles.teacherName}>{teacher.name}</h3>
                <div 
                  className={styles.subjectChip}
                  style={{ '--subject-color': teacher.subject.color } as React.CSSProperties}
                >
                  {teacher.subject.name}
                </div>
              </div>
              
              <div className={styles.profileDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Qualification</span>
                  <span className={styles.value}>{teacher.qualification}</span>
                </div>
                {/* Add more details as needed */}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const EditTeacherModal: React.FC<ModalProps & { onSave: (teacher: Teacher) => void }> = ({
  isOpen,
  onClose,
  teacher,
  onSave
}) => {
  if (!teacher) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    onSave(teacher);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.modalOverlay} onClick={onClose}>
          <motion.div 
            className={styles.modalContent}
            onClick={e => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <button className={styles.closeButton} onClick={onClose}>
              <X size={18} />
            </button>
            
            <form onSubmit={handleSubmit} className={styles.editForm}>
              <h3>Edit Teacher Details</h3>
              
              <div className={styles.formGroup}>
                <label>Name</label>
                <input
                  type="text"
                  defaultValue={teacher.name}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Qualification</label>
                <input
                  type="text"
                  defaultValue={teacher.qualification}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Subject</label>
                <input
                  type="text"
                  defaultValue={teacher.subject.name}
                  className={styles.input}
                />
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={onClose} className={styles.cancelButton}>
                  Cancel
                </button>
                <button type="submit" className={styles.saveButton}>
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const DeleteTeacherModal: React.FC<ModalProps & { onConfirm: () => void }> = ({
  isOpen,
  onClose,
  teacher,
  onConfirm
}) => {
  if (!teacher) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.modalOverlay} onClick={onClose}>
          <motion.div 
            className={styles.modalContent}
            onClick={e => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className={styles.deleteConfirmation}>
              <h3>Delete Teacher</h3>
              <p>Are you sure you want to delete {teacher.name}? This action cannot be undone.</p>
              
              <div className={styles.formActions}>
                <button onClick={onClose} className={styles.cancelButton}>
                  Cancel
                </button>
                <button 
                  onClick={onConfirm}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};