'use client';

// src/app/(super-admin)/myworkspace/components/ui/KanbanBoard/KanbanColumn.tsx
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { KanbanTask } from './KanbanTask';
import { KanbanColumnProps, Task } from './types';
import styles from './KanbanColumn.module.scss';
import { Plus } from 'lucide-react';
import { useTheme } from 'next-themes';

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  onAddTask,
  onEdit,
  onDelete,
  onTaskUpdate,
}) => {
  const { theme } = useTheme();

  return (
    <div className={`${styles.column} ${styles[theme || 'light']}`}>
      <div className={styles.columnHeader}>
        <div className={styles.titleBar}>
          <h2>{column.title}</h2>
          <span className={styles.count}>{column.count}</span>
        </div>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`${styles.taskList} ${
              snapshot.isDraggingOver ? styles.draggingOver : ''
            }`}
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

      <div className={styles.columnFooter}>
        <button
          type="button"
          className={styles.addButton}
          onClick={() => onAddTask({ status: column.title as Task['status'] })}
        >
          <Plus size={16} />
          <span>Add Task</span>
        </button>
      </div>
    </div>
  );
};