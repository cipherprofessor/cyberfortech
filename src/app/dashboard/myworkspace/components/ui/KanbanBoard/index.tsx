'use client';

// src/app/(super-admin)/myworkspace/components/ui/KanbanBoard/index.tsx
import React, { useState, useEffect } from 'react';
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
import { KanbanColumn } from './KanbanColumn';
import { Task, KanbanBoardProps } from './types';
import styles from './KanbanBoard.module.scss';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  onTaskMove,
  onTaskUpdate,
  onTaskDelete,
  onAddTask,
}) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Move the task
    onTaskMove(draggableId, source.droppableId, destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={`${styles.kanbanBoard} ${styles[theme || 'light']}`}>
        <div className={styles.columnsContainer}>
          {columns.map((column) => (
            <Droppable
              key={column.id}
              droppableId={column.id}
              type="task"
              isDropDisabled={false}
            >
              {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`${styles.column} ${snapshot.isDraggingOver ? styles.draggingOver : ''}`}
                >
                  <div className={styles.columnHeader}>
                    <h2>{column.title}</h2>
                    <span className={styles.count}>{column.count}</span>
                  </div>

                  <div className={styles.taskList}>
                    {column.tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                        isDragDisabled={false}
                      >
                        {(dragProvided: DraggableProvided, dragSnapshot: DraggableStateSnapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            className={`${styles.task} ${dragSnapshot.isDragging ? styles.dragging : ''}`}
                          >
                            <div className={styles.taskContent}>
                              <div className={styles.taskHeader}>
                                <span className={styles.taskNumber}>{task.taskNumber}</span>
                                {/* Task menu */}
                              </div>
                              <h3 className={styles.taskTitle}>{task.title}</h3>
                              <p className={styles.taskDescription}>{task.description}</p>
                              {/* Tags and other task content */}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>

                  <button
                    className={styles.addTaskButton}
                    onClick={() => onAddTask(column.id, { status: column.title as Task['status'] })}
                  >
                    + Add Task
                  </button>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;