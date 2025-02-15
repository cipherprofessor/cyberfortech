// src/app/(super-admin)/myworkspace/components/ui/KanbanBoard/DragDropContext.tsx
import React from 'react';
import { DragDropContext as BeautifulDND, Droppable } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
// import { useTheme } from '@/app/hooks/useTheme';
import styles from './styles/KanbanBoard.module.scss';
import { useTheme } from 'next-themes';

interface DragDropContextProps {
  onDragEnd: (result: any) => void;
  children: React.ReactNode;
}

export const DragDropContext: React.FC<DragDropContextProps> = ({
  onDragEnd,
  children
}) => {
  const { theme } = useTheme();

  const handleDragEnd = (result: any) => {
    // Add smooth animation when dropping
    requestAnimationFrame(() => {
      onDragEnd(result);
    });
  };

  return (
    <BeautifulDND onDragEnd={handleDragEnd}>
    <motion.div
      className={`${styles.kanbanBoard} ${styles[theme as 'light' | 'dark']}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence>
        {children}
      </AnimatePresence>
    </motion.div>
  </BeautifulDND>
  );
};

// Enhanced Droppable component with animations
export const DroppableColumn: React.FC<{
  droppableId: string;
  children: React.ReactNode;
}> = ({ droppableId, children }) => {
  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`${styles.column} ${snapshot.isDraggingOver ? styles.draggingOver : ''}`}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          {children}
          {provided.placeholder}
        </motion.div>
      )}
    </Droppable>
  );
};