// src/app/(super-admin)/myworkspace/components/ui/KanbanBoard/KanbanTask.tsx
"use client"
import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';

import styles from './KanbanTask.module.scss';
import { MoreVertical, Heart, MessageCircle, Edit, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from './types';
import Avatar from '../DataTable/Avatar';


interface KanbanTaskProps {
  task: Task;
  index: number;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  theme: 'light' | 'dark';
}

export const KanbanTask: React.FC<KanbanTaskProps> = ({
  task,
  index,
  onEdit,
  onDelete,
  theme
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(task);
      setIsMenuOpen(false);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(task.id);
      setIsMenuOpen(false);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'High':
        return '#FF4D4F';
      case 'Medium':
        return '#FAAD14';
      case 'Low':
        return '#52C41A';
      default:
        return '#BFBFBF';
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${styles.task} ${styles[theme]} ${snapshot.isDragging ? styles.dragging : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
          whileHover={{ scale: 1.02 }}
          style={{
            ...provided.draggableProps.style,
            transform: snapshot.isDragging 
              ? `${provided.draggableProps.style?.transform} rotate(1deg)` 
              : provided.draggableProps.style?.transform
          }}
        >
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <span className={styles.taskNumber}>{task.taskNumber}</span>
              <span 
                className={styles.priorityBadge}
                style={{ backgroundColor: getPriorityColor(task.priority) }}
              >
                {task.priority}
              </span>
            </div>
            
            <div className={styles.menuContainer}>
              <button 
                className={styles.menuButton}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Task menu"
              >
                <MoreVertical size={16} />
              </button>
              
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    className={styles.menu}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                  >
                    <button 
                      className={styles.menuItem}
                      onClick={handleEdit}
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                    </button>
                    <button 
                      className={`${styles.menuItem} ${styles.deleteItem}`}
                      onClick={handleDelete}
                    >
                      <Trash size={14} />
                      <span>Delete</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <h3 className={styles.title}>{task.title}</h3>
          <p className={styles.description}>{task.description}</p>
          
          <div className={styles.tags}>
            {task.tags.map((tag) => (
              <motion.span
                key={tag.id}
                className={styles.tag}
                style={{ backgroundColor: tag.color }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {tag.name}
              </motion.span>
            ))}
          </div>
          
          <div className={styles.footer}>
            <div className={styles.assignees}>
              {task.assignees.map((user, i) => (
                <div 
                  key={user.id} 
                  className={styles.avatarWrapper}
                  style={{ zIndex: task.assignees.length - i }}
                >
                  <Avatar
                    src={user.avatar}
                    name={user.name}
                    size="sm"
                    className={styles.avatar}
                  />
                </div>
              ))}
            </div>
            
            <div className={styles.metrics}>
              <motion.button 
                className={`${styles.metric} ${isLiked ? styles.liked : ''}`}
                onClick={handleLike}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart size={14} />
                <span>{isLiked ? task.likes + 1 : task.likes}</span>
              </motion.button>
              <motion.button 
                className={styles.metric}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle size={14} />
                <span>{task.comments}</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </Draggable>
  );
};