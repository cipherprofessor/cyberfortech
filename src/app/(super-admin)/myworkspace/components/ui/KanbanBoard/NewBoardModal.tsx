// src/app/(super-admin)/myworkspace/components/ui/KanbanBoard/NewBoardModal.tsx
"use client";
import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import styles from './styles/Modals.module.scss';
import { useTheme } from 'next-themes';

interface NewBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (board: { name: string; description: string }) => void;
}

export const NewBoardModal: React.FC<NewBoardModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const { theme = 'light' } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

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
                Create New Board
              </Dialog.Title>

              <form onSubmit={(e) => {
                e.preventDefault();
                onSubmit(formData);
                onClose();
              }}>
                <div className={styles.formGroup}>
                  <label>Board Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Enter board name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter board description"
                    rows={4}
                  />
                </div>

                <div className={styles.actions}>
                  <button type="button" onClick={onClose} className={styles.cancelButton}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.submitButton}>
                    Create Board
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