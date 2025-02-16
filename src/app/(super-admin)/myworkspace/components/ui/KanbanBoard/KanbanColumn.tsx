'use client';

// KanbanColumn.tsx
import React, { memo, useEffect, useState } from 'react';


import styles from './KanbanColumn.module.scss';
import { Plus } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Column, KanbanBoardProps, Task } from './types';
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult, 
  DroppableProvided, 
  DraggableProvided,
  DroppableStateSnapshot,
  DraggableStateSnapshot
} from 'react-beautiful-dnd';
import { KanbanTask } from './KanbanTask';

interface KanbanColumnProps {
  column: Column;
  onAddTask: (task: Partial<Task>) => void;
  onTaskUpdate: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  isDraggingOver: boolean;
}

// KanbanColumn.tsx
export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  onAddTask,
  onEdit,
  onDelete,
  isDraggingOver,
}) => {
  const { resolvedTheme } = useTheme();

  return (
    <div 
      className={`${styles.column} ${styles[resolvedTheme || 'light']}`}
      data-dragging={isDraggingOver}
    >
      <div className={styles.columnHeader}>
        <div className={styles.titleBar}>
          <h2>{column.title}</h2>
          <span className={styles.count}>{column.count}</span>
        </div>
      </div>
      
      <Droppable 
        droppableId={column.id}
        type="TASK"
        mode="standard"
        isCombineEnabled={false}
        isDropDisabled={false}
        ignoreContainerClipping={false}
        renderClone={null}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`${styles.taskList} ${snapshot.isDraggingOver ? styles.draggingOver : ''}`}
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
          onClick={() => onAddTask?.({ status: column.title as Task['status'] })}
        >
          <Plus size={16} />
          <span>Add Task</span>
        </button>
      </div>
    </div>
  );
};
