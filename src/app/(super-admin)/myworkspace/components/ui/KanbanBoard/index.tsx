'use client';

// KanbanBoard/index.tsx
import React, { useState, useEffect } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { KanbanColumn } from './KanbanColumn';
import { DragDropContext } from './DragDropContext';
import { KanbanBoardProps } from './types';
import styles from './KanbanBoard.module.scss';
import { useTheme } from 'next-themes';

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  onTaskMove,
  onTaskUpdate,
  onTaskDelete,
  onAddTask,
}) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleDragEnd = (result: DropResult) => {
    setIsDraggingOver(false);
    
    if (!result.destination) return;
    
    const sourceColumn = result.source.droppableId;
    const targetColumn = result.destination.droppableId;
    const taskId = result.draggableId;

    if (sourceColumn !== targetColumn && onTaskMove) {
      onTaskMove(taskId, sourceColumn, targetColumn);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={`${styles.kanbanBoard} ${styles[resolvedTheme || 'light']}`}>
        <div className={styles.columnsContainer}>
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onAddTask={(task) => onAddTask?.(column.id, task)}
              onTaskUpdate={onTaskUpdate}
              onEdit={(task) => onTaskUpdate?.(task)}
              onDelete={(task) => onTaskDelete?.(task.id)}
              isDraggingOver={isDraggingOver}
            />
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};