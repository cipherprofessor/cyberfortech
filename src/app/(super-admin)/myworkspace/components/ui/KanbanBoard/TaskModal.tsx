// src/app/(super-admin)/myworkspace/components/ui/KanbanBoard/modals/TaskModal.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

import styles from './Modals.module.scss';
import { X } from 'lucide-react';

import { useTheme } from 'next-themes';
import { Task, TaskPriority, TaskStatus, User } from './types';
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
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'Medium',
    status: task?.status || columnId as Task['status'],
    assignees: task?.assignees || [],
    tags: task?.tags || []
  });
  const { theme = 'light' } = useTheme();


  useEffect(() => {
    if (task && mode === 'edit') {
      setFormData(task);
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        status: columnId as TaskStatus,
        assignees: [],
        tags: []
      });
    }
  }, [task, mode, columnId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submittedData: Partial<Task> = {
      ...formData,
      id: task?.id, // Include id if editing
      status: columnId as Task['status']
    };
    onSubmit(submittedData);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog 
        as="div"
        className={`${styles.modal} ${styles[theme as 'light' | 'dark']}`}
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={styles.backdrop} />
        </Transition.Child>

        <div className={styles.container}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className={styles.panel}>
              <Dialog.Title className={styles.title}>
                {mode === 'create' ? 'Create New Task' : 'Edit Task'}
              </Dialog.Title>

              <form onSubmit={(e) => {
                e.preventDefault();
                onSubmit(formData);
                onClose();
              }}>
                <div className={styles.formGroup}>
                  <label>Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
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

                <div className={styles.actions}>
                  <button type="button" onClick={onClose} className={styles.cancelButton}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.submitButton}>
                    {mode === 'create' ? 'Create Task' : 'Update Task'}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};