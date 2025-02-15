// src/app/(super-admin)/myworkspace/components/ui/KanbanBoard/utils/dragUtils.ts
import { DraggableLocation } from 'react-beautiful-dnd';

export const getStyle = (style: any, snapshot: any) => {
  if (!snapshot.isDropAnimating) {
    return style;
  }
  
  const { moveTo, curve, duration } = snapshot.dropAnimation;
  const translate = `translate(${moveTo.x}px, ${moveTo.y}px)`;
  
  return {
    ...style,
    transform: `${translate}`,
    transition: `all ${duration}s ${curve}`,
  };
};

export const getDragStyle = (isDragging: boolean, draggableStyle: any) => ({
  userSelect: 'none',
  background: isDragging ? 'var(--background-dragging)' : 'var(--background-card)',
  boxShadow: isDragging 
    ? '0 8px 16px rgba(0, 0, 0, 0.2)' 
    : '0 2px 4px rgba(0, 0, 0, 0.05)',
  transform: isDragging ? 'rotate(2deg)' : '',
  ...draggableStyle,
});