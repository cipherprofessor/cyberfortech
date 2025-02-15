// components/KanbanBoard/index.tsx
import React, { useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import styles from './KanbanBoard.module.scss';
import { motion } from 'framer-motion';
import { KanbanBoardProps } from './types';
import { SearchBar } from './SearchBar';
import { KanbanColumn } from './KanbanColumn';

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  onTaskMove,
  onTaskUpdate,
  onAddTask,
  className,
  theme = 'dark'
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const sourceColumn = result.source.droppableId;
    const targetColumn = result.destination.droppableId;
    const taskId = result.draggableId;

    if (sourceColumn !== targetColumn) {
      onTaskMove?.(taskId, sourceColumn, targetColumn);
    }
  };

  return (
    <motion.div 
      className={`${styles.kanbanBoard} ${styles[theme]} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SearchBar 
        value={searchQuery}
        onChange={setSearchQuery}
        theme={theme}
      />
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={styles.columnsContainer}>
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onAddTask={() => onAddTask?.(column.id)}
              onTaskUpdate={onTaskUpdate}
              theme={theme}
            />
          ))}
        </div>
      </DragDropContext>
    </motion.div>
  );
};