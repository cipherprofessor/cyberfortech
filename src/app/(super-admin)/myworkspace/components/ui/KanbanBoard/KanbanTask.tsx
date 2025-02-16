'use client';

// KanbanTask.tsx
import React, { useState, memo } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styles from './KanbanTask.module.scss';
import { MoreVertical, Heart, MessageSquare } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Task } from './types';
import Avatar from '../DataTable/Avatar';

interface KanbanTaskProps {
  task: Task;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

export const KanbanTask = memo(function KanbanTask({
  task,
  index,
  onEdit,
  onDelete,
}: KanbanTaskProps) {
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${styles.task} ${styles[theme || 'light']} ${
            snapshot.isDragging ? styles.dragging : ''
          }`}
        >
          {/* Task content */}
          <div className={styles.header}>
            <div className={styles.taskIdentifier}>
              <span className={styles.taskNumber}>{task.taskNumber}</span>
              <button
                type="button"
                className={styles.menuButton}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <MoreVertical size={16} />
              </button>
              {isMenuOpen && (
                <div className={styles.menu}>
                  <button
                    type="button"
                    onClick={() => {
                      onEdit();
                      setIsMenuOpen(false);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => {
                      onDelete();
                      setIsMenuOpen(false);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          <h3 className={styles.title}>{task.title}</h3>
          <p className={styles.description}>{task.description}</p>

          {/* Tags */}
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

          {/* Footer */}
          <div className={styles.footer}>
            <div className={styles.assignees}>
              {task.assignees.map((user, idx) => (
                <div
                  key={user.id}
                  className={styles.avatarWrapper}
                  style={{ zIndex: task.assignees.length - idx }}
                >
                  <Avatar src={user.avatar} name={user.name} size="sm" />
                </div>
              ))}
            </div>

            <div className={styles.metrics}>
              <div className={styles.metric}>
                <Heart size={14} />
                <span>{task.likes}</span>
              </div>
              <div className={styles.metric}>
                <MessageSquare size={14} />
                <span>{task.comments}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
});