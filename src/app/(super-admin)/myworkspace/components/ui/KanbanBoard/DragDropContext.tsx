'use client';

// KanbanBoard/DragDropContext.tsx
import { DragDropContext as BeautifulDND, DropResult } from 'react-beautiful-dnd';
import React from 'react';

interface DragDropContextProps {
  children: React.ReactNode;
  onDragEnd: (result: DropResult) => void;
}

export const DragDropContext = ({ children, onDragEnd }: DragDropContextProps) => {
  return (
    <BeautifulDND
      onDragEnd={onDragEnd}
      enableDefaultSensors={true}
    >
      {children}
    </BeautifulDND>
  );
};