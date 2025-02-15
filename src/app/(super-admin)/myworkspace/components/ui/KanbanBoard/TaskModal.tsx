// src/app/(super-admin)/myworkspace/components/ui/KanbanBoard/TaskModal.tsx
"use client"
import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';

import styles from './TaskModal.module.scss';
import { X } from 'lucide-react';
import { Task, TaskStatus, User } from './types';
import Avatar from '../DataTable/Avatar';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  mode: 'create' | 'edit';
  onSubmit: (task: Partial<Task>) => void;
  availableUsers: User[];
  columnId: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  mode,
  onSubmit,
  availableUsers,
  columnId
}) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'NEW',
    assignees: [],
    tags: []
  });

  useEffect(() => {
    if (task && mode === 'edit') {
      setFormData({
        ...task,
        status: task.status || 'NEW'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'NEW',
        assignees: [],
        tags: []
      });
    }
  }, [task, mode]);

  ////// Khud theek kiya hai yeh wala code

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submittedData: Partial<Task> = {
      ...formData,
      status: mode === 'create' ? (columnId as TaskStatus) : formData.status
    };
    onSubmit(submittedData);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className={styles.modal}
    >
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.container}>
        <Dialog.Panel className={styles.panel}>
          <div className={styles.modalHeader}>
            <Dialog.Title className={styles.title}>
              {mode === 'create' ? 'Create New Task' : 'Edit Task'}
            </Dialog.Title>
            <button onClick={onClose} className={styles.closeButton}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Enter task title"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                placeholder="Enter task description"
                rows={4}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Assignees</label>
              <div className={styles.assigneesList}>
                {availableUsers.map(user => (
                  <div key={user.id} className={styles.assigneeItem}>
                    <Avatar
                      src={user.avatar}
                      name={user.name}
                      size="sm"
                    />
                    <span>{user.name}</span>
                    <input
                      type="checkbox"
                      checked={formData.assignees?.some(a => a.id === user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            assignees: [...(formData.assignees || []), user]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            assignees: formData.assignees?.filter(a => a.id !== user.id) || []
                          });
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" onClick={onClose} className={styles.cancelButton}>
                Cancel
              </button>
              <button type="submit" className={styles.submitButton}>
                {mode === 'create' ? 'Create Task' : 'Update Task'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default TaskModal;