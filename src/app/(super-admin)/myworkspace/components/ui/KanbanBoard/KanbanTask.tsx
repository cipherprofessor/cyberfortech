// src/app/(super-admin)/myworkspace/components/ui/KanbanBoard/KanbanTask.tsx
"use client";
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import styles from './KanbanTask.module.scss';
import { MoreVertical, Heart, MessageCircle } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Task } from './types';

interface KanbanTaskProps {
  task: Task;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

export const KanbanTask: React.FC<KanbanTaskProps> = ({
  task,
  index,
  onEdit,
  onDelete
}) => {
  const { theme = 'light' } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${styles.task} ${styles[theme as 'light' | 'dark']} ${snapshot.isDragging ? styles.dragging : ''}`}
        >
          <div className={styles.header}>
            <span className={styles.taskNumber}>{task.taskNumber}</span>
            <div className={styles.menuContainer}>
              <button 
                className={styles.menuButton}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <MoreVertical size={16} />
              </button>
              {isMenuOpen && (
                <div className={styles.menu}>
                  <button onClick={onEdit}>Edit</button>
                  <button onClick={onDelete}>Delete</button>
                </div>
              )}
            </div>
          </div>
          
          <h3 className={styles.title}>{task.title}</h3>
          <p className={styles.description}>{task.description}</p>
          
          <div className={styles.tags}>
            {task.tags.map((tag) => (
              <span
                key={tag.id}
                className={styles.tag}
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
              </span>
            ))}
          </div>
          
          <div className={styles.footer}>
            <div className={styles.assignees}>
              {task.assignees.map((user) => (
                <img
                  key={user.id}
                  src={user.avatar}
                  alt={user.name}
                  className={styles.avatar}
                />
              ))}
            </div>
            
            <div className={styles.metrics}>
              <span className={styles.metric}>
                <Heart size={14} />
                {task.likes}
              </span>
              <span className={styles.metric}>
                <MessageCircle size={14} />
                {task.comments}
              </span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};