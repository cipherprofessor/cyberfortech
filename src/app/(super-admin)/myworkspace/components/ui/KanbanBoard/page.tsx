// src/app/(super-admin)/myworkspace/components/ui/KanbanBoard/page.tsx
"use client"
import { useState } from 'react';
import { KanbanBoard } from './index';
import { mockData } from './mockData';
import { Column, KanbanData, Task, TaskStatus } from './types';
import { useTheme } from 'next-themes';




export default function KanbanPage() {
    
  
    
  // Convert mockData to the correct type structure
  const initialData: KanbanData = {
    columns: mockData.columns.map(column => ({
      ...column,
      tasks: column.tasks.map(task => ({
        ...task,
        priority: task.priority as Task['priority'],
        status: task.status as TaskStatus
      }))
    }))
  };

  const [boardData, setBoardData] = useState<KanbanData>(initialData);
  const { theme = 'light' } = useTheme();
  
  const handleTaskMove = (taskId: string, sourceColumnId: string, targetColumnId: string) => {
    setBoardData(prevData => {
      const newColumns = [...prevData.columns];
      
      const sourceColumn = newColumns.find(col => col.id === sourceColumnId);
      const targetColumn = newColumns.find(col => col.id === targetColumnId);
      
      if (!sourceColumn || !targetColumn) return prevData;
      
      const taskToMove = sourceColumn.tasks.find(task => task.id === taskId);
      if (!taskToMove) return prevData;
      
      // Remove from source column
      sourceColumn.tasks = sourceColumn.tasks.filter(task => task.id !== taskId);
      sourceColumn.count--;
      
      // Add to target column
      taskToMove.status = targetColumn.title as TaskStatus;
      targetColumn.tasks.push(taskToMove);
      targetColumn.count++;
      
      return { columns: newColumns };
    });
  };
  
  const handleTaskUpdate = (updatedTask: Task) => {
    setBoardData(prevData => ({
      columns: prevData.columns.map(column => ({
        ...column,
        tasks: column.tasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        )
      }))
    }));
  };

  const handleTaskDelete = (taskId: string) => {
    setBoardData(prevData => ({
      columns: prevData.columns.map(column => ({
        ...column,
        tasks: column.tasks.filter(task => task.id !== taskId),
        count: column.tasks.filter(task => task.id !== taskId).length
      }))
    }));
  };
  
   const handleAddTask = (columnId: string, taskData: Partial<Task>) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      taskNumber: `#TSK-${Date.now()}`,
      title: taskData.title || '',
      description: taskData.description || '',
      priority: taskData.priority || 'Medium',
      status: taskData.status || 'NEW',
      tags: taskData.tags || [],
      assignees: taskData.assignees || [],
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setBoardData(prevData => ({
        columns: prevData.columns.map(column => {
          if (column.id === columnId) {
            return {
              ...column,
              tasks: [...column.tasks, newTask],
              count: column.tasks.length + 1
            };
          }
          return column;
        })
      }));
    };


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
     <KanbanBoard
        columns={boardData.columns}
        onTaskMove={handleTaskMove}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
        onAddTask={handleAddTask}
      />
    </div>
  );
}