import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import styles from './OrderModals.module.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DeleteModalProps extends ModalProps {
  onConfirm: () => void;
  itemCount: number;
}

interface EditModalProps extends ModalProps {
  order: any;
  onSave: (order: any) => void;
}

export const DeleteConfirmationModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemCount
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className={styles.modalOverlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className={styles.modalContent}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          <div className={styles.modalHeader}>
            <AlertTriangle className={styles.warningIcon} size={24} />
            <h3>Confirm Deletion</h3>
            <button onClick={onClose} className={styles.closeButton}>
              <X size={20} />
            </button>
          </div>
          
          <div className={styles.modalBody}>
            <p>Are you sure you want to delete {itemCount === 1 ? 'this order' : `these ${itemCount} orders`}?</p>
            <p className={styles.warningText}>This action cannot be undone.</p>
          </div>
          
          <div className={styles.modalFooter}>
            <button 
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className={styles.deleteButton}
            >
              Delete
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const EditOrderModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  order,
  onSave
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className={styles.modalOverlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className={styles.modalContent}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          <div className={styles.modalHeader}>
            <h3>Edit Order</h3>
            <button onClick={onClose} className={styles.closeButton}>
              <X size={20} />
            </button>
          </div>
          
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label htmlFor="product">Product</label>
              <input
                type="text"
                id="product"
                defaultValue={order.product}
                className={styles.input}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                defaultValue={order.quantity}
                className={styles.input}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="status">Status</label>
              <select
                id="status"
                defaultValue={order.status}
                className={styles.select}
              >
                <option value="inProgress">In Progress</option>
                <option value="pending">Pending</option>
                <option value="success">Success</option>
              </select>
            </div>
          </div>
          
          <div className={styles.modalFooter}>
            <button 
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button 
              onClick={() => onSave(order)}
              className={styles.saveButton}
            >
              Save Changes
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};