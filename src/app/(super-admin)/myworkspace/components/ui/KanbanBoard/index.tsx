// src/app/(super-admin)/myworkspace/components/ui/KanbanBoard/index.tsx
"use client";
import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { KanbanColumn } from './KanbanColumn';

import styles from './KanbanBoard.module.scss';
import { useTheme } from 'next-themes';
import { Column, Task } from './types';

export interface KanbanBoardProps {
  columns: Column[];
  onTaskMove: (taskId: string, sourceColumn: string, targetColumn: string) => void;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onAddTask: (columnId: string, task: Partial<Task>) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  onTaskMove,
  onTaskUpdate,
  onTaskDelete,
  onAddTask,
}) => {
  const { theme = 'light' } = useTheme();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const sourceColumn = result.source.droppableId;
    const targetColumn = result.destination.droppableId;
    const taskId = result.draggableId;

    if (sourceColumn !== targetColumn) {
      onTaskMove(taskId, sourceColumn, targetColumn);
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    // Add your edit modal logic here
  };

  const handleDelete = (task: Task) => {
    onTaskDelete(task.id);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={`${styles.kanbanBoard} ${styles[theme as 'light' | 'dark']}`}>
        <div className={styles.columnsContainer}>
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onAddTask={() => onAddTask(column.id, { status: column.title as Task['status'] })}
              onTaskUpdate={onTaskUpdate}
              onEdit={handleEditTask}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};