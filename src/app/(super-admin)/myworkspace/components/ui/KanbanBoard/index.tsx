'use client';

// KanbanBoard/index.tsx
import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult, DragStart } from 'react-beautiful-dnd';
import { KanbanColumn } from './KanbanColumn';
import { Task, KanbanBoardProps } from './types';

import styles from './KanbanBoard.module.scss';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { TaskModal } from './TaskModal';

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  onTaskMove,
  onTaskUpdate,
  onTaskDelete,
  onAddTask,
}) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleDragStart = (start: DragStart) => {
    setIsDragging(true);
    setDraggedTaskId(start.draggableId);
  };

  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false);
    setDraggedTaskId(null);

    if (!result.destination) return;

    const sourceColumn = result.source.droppableId;
    const targetColumn = result.destination.droppableId;
    const taskId = result.draggableId;

    if (sourceColumn !== targetColumn) {
      try {
        onTaskMove(taskId, sourceColumn, targetColumn);
        toast.success('Task moved successfully');
      } catch (error) {
        toast.error('Failed to move task');
      }
    }
  };

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      try {
        onTaskDelete(taskToDelete.id);
        toast.success('Task deleted successfully');
      } catch (error) {
        toast.error('Failed to delete task');
      }
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleEditClick = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleEditSave = (updatedTask: Partial<Task>) => {
    try {
      if ('id' in updatedTask && updatedTask.id) {
        onTaskUpdate({
          ...selectedTask!,  // Use existing task as base
          ...updatedTask,    // Overlay with updates
          id: updatedTask.id // Ensure id is present
        } as Task);
        toast.success('Task updated successfully');
      }
      setIsEditModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  return (
    <>
      <DragDropContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div 
          className={`${styles.kanbanBoard} ${styles[resolvedTheme || 'light']}`}
          data-is-dragging={isDragging}
        >
          <div className={styles.columnsContainer}>
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                onAddTask={(task) => onAddTask(column.id, task)}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onTaskUpdate={onTaskUpdate}
                isDraggingOver={isDragging && draggedTaskId !== null}
              />
            ))}
          </div>
        </div>
      </DragDropContext>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        taskName={taskToDelete?.title || ''}
      />

<TaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={selectedTask}
        mode="edit"
        onSubmit={handleEditSave} // Now accepts Partial<Task>
        availableUsers={[]}
        columnId={selectedTask?.status || ''}
      />
    </>
  );
};