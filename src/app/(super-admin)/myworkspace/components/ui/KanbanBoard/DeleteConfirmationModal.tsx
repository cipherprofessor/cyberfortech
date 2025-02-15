
import { Dialog, Transition } from "@headlessui/react";

import { useTheme } from "next-themes";
import { Fragment } from "react";
import styles from "./DeleteConfirmationModal.module.scss";

// src/app/(super-admin)/myworkspace/components/ui/KanbanBoard/modals/DeleteConfirmationModal.tsx
export const DeleteConfirmationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
  }> = ({ isOpen, onClose, onConfirm, itemName }) => {
    const { theme = 'light' } = useTheme();
  
    return (
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog 
          as="div"
          className={`${styles.modal} ${styles[theme]}`}
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
              <Dialog.Panel className={`${styles.panel} ${styles.deletePanel}`}>
                <Dialog.Title className={styles.title}>
                  Delete {itemName}
                </Dialog.Title>
  
                <p className={styles.deleteMessage}>
                  Are you sure you want to delete this {itemName.toLowerCase()}? This action cannot be undone.
                </p>
  
                <div className={styles.actions}>
                  <button type="button" onClick={onClose} className={styles.cancelButton}>
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }} 
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    );
  };