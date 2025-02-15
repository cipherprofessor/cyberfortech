// src/app/(super-admin)/myworkspace/components/ui/KanbanBoard/KanbanColumn.tsx
"use client";
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { KanbanTask } from './KanbanTask';

import styles from './KanbanColumn.module.scss';
import { Plus } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Column, Task } from './types';

interface KanbanColumnProps {
  column: Column;
  onAddTask: () => void;
  onTaskUpdate: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  onAddTask,
  onTaskUpdate,
  onEdit,
  onDelete,
}) => {
  const { theme = 'light' } = useTheme();

  return (
    <div className={`${styles.column} ${styles[theme as 'light' | 'dark']}`}>
      <div className={styles.header} style={{ backgroundColor: column.color }}>
        <h2>{column.title}</h2>
        <span className={styles.count}>{column.count}</span>
      </div>
      
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={styles.taskList}
          >
            {column.tasks.map((task, index) => (
              <KanbanTask
                key={task.id}
                task={task}
                index={index}
                onEdit={() => onEdit(task)}
                onDelete={() => onDelete(task)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      
      <div className={styles.footer}>
        <button className={styles.addButton} onClick={onAddTask}>
          <Plus size={16} />
          Add Task
        </button>
      </div>
    </div>
  );
};