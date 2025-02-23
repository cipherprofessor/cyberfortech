// contexts/ToastContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import styles from './CustomToast.module.scss';
import Toast, { ToastProps } from './CustomToast';

interface ToastContextType {
  showToast: (props: Omit<ToastProps, 'onClose'>) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([]);

  const showToast = (props: Omit<ToastProps, 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((currentToasts) => [...currentToasts, { ...props, id, onClose: () => removeToast(id) }]);
  };

  const removeToast = (id: string) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className={styles.toastContainer}>
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// Usage example:
// const { showToast } = useToast();
// showToast({
//   message: 'Comment posted successfully',
//   type: 'success',
//   description: 'Your comment has been added to the discussion.'
// });